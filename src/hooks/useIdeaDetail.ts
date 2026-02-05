import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  setDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Comment, ToolRequest } from '../data/toolRequests';

export function useIdeaDetail(requestId: string, userEmail: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [loadingComments, setLoadingComments] = useState(true);

  // Listen to the request document for real-time upvote/comment counts
  useEffect(() => {
    const requestRef = doc(db, 'toolRequests', requestId);
    const unsubscribe = onSnapshot(requestRef, (snapshot) => {
      const data = snapshot.data();
      if (data) {
        setUpvoteCount(data.upvoteCount ?? 0);
      }
    });
    return () => unsubscribe();
  }, [requestId]);

  // Listen to comments subcollection
  useEffect(() => {
    const q = query(
      collection(db, 'toolRequests', requestId, 'comments'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Comment[] = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      })) as Comment[];
      setComments(items);
      setLoadingComments(false);
    });

    return () => unsubscribe();
  }, [requestId]);

  // Listen to upvote status for current user
  useEffect(() => {
    if (!userEmail) return;

    const upvoteRef = doc(db, 'toolRequests', requestId, 'upvotes', userEmail);
    const unsubscribe = onSnapshot(upvoteRef, (snapshot) => {
      setHasUpvoted(snapshot.exists());
    });

    return () => unsubscribe();
  }, [requestId, userEmail]);

  const toggleUpvote = async (userName: string) => {
    if (!userEmail) {
      console.log('No userEmail, cannot upvote');
      return;
    }

    const requestRef = doc(db, 'toolRequests', requestId);
    const upvoteRef = doc(db, 'toolRequests', requestId, 'upvotes', userEmail);

    console.log('Toggle upvote:', { requestId, userEmail, hasUpvoted, userName });

    try {
      if (hasUpvoted) {
        console.log('Removing upvote...');
        await deleteDoc(upvoteRef);
        await setDoc(requestRef, { upvoteCount: increment(-1) }, { merge: true });
        console.log('Upvote removed');
      } else {
        console.log('Adding upvote...');
        await setDoc(upvoteRef, {
          userName,
          createdAt: serverTimestamp(),
        });
        console.log('Upvote doc created, now incrementing count...');
        await setDoc(requestRef, { upvoteCount: increment(1) }, { merge: true });
        console.log('Upvote count incremented');
      }
    } catch (err) {
      console.error('Upvote error:', err);
    }
  };

  const addComment = async (text: string, authorName: string, authorEmail: string) => {
    const requestRef = doc(db, 'toolRequests', requestId);

    await addDoc(collection(db, 'toolRequests', requestId, 'comments'), {
      text,
      authorName,
      authorEmail,
      createdAt: serverTimestamp(),
    });

    await updateDoc(requestRef, { commentCount: increment(1) });
  };

  const updateStatus = async (newStatus: ToolRequest['status']) => {
    const requestRef = doc(db, 'toolRequests', requestId);
    await updateDoc(requestRef, { status: newStatus });
  };

  return { comments, hasUpvoted, upvoteCount, loadingComments, toggleUpvote, addComment, updateStatus };
}
