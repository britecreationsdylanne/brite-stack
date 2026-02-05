import { useState, useEffect } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { ToolRequest } from '../data/toolRequests';

export function useToolRequests() {
  const [toolRequests, setToolRequests] = useState<ToolRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      // Simple query without ordering to avoid index requirements
      const colRef = collection(db, 'toolRequests');

      const unsubscribe = onSnapshot(
        colRef,
        (snapshot) => {
          console.log('Firestore returned', snapshot.docs.length, 'documents');
          const requests: ToolRequest[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            console.log('Doc:', doc.id, 'status:', data.status, 'toolName:', data.toolName);
            return {
              id: doc.id,
              ...data,
              upvoteCount: data.upvoteCount ?? 0,
              commentCount: data.commentCount ?? 0,
              status: data.status || 'new', // Default to 'new' if missing
            };
          }) as ToolRequest[];
          // Sort by createdAt client-side (handles null/missing values)
          requests.sort((a, b) => {
            const aTime = a.createdAt?.toMillis() ?? 0;
            const bTime = b.createdAt?.toMillis() ?? 0;
            return bTime - aTime;
          });
          setToolRequests(requests);
          setLoading(false);
        },
        (err) => {
          console.error('Error fetching tool requests:', err);
          setError('Failed to load ideas. Please try again later.');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Firestore initialization error:', err);
      setError('Ideas feature is not available yet.');
      setLoading(false);
    }
  }, []);

  const addToolRequest = async (data: {
    toolName: string;
    description: string;
    requesterName: string;
    requesterEmail: string;
  }) => {
    try {
      await addDoc(collection(db, 'toolRequests'), {
        ...data,
        status: 'new',
        createdAt: serverTimestamp(),
        upvoteCount: 0,
        commentCount: 0,
      });
    } catch (err) {
      console.error('Failed to add tool request to Firestore:', err);
      throw err; // Re-throw so the form knows it failed
    }
  };

  return { toolRequests, loading, error, addToolRequest, count: toolRequests.length };
}
