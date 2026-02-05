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
  runTransaction,
  serverTimestamp,
  increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Comment } from '../data/toolRequests';

export function useIdeaDetail(requestId: string, userEmail: string) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [hasUpvoted, setHasUpvoted] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);

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
    if (!userEmail) return;

    const requestRef = doc(db, 'toolRequests', requestId);
    const upvoteRef = doc(db, 'toolRequests', requestId, 'upvotes', userEmail);

    if (hasUpvoted) {
      await deleteDoc(upvoteRef);
      await runTransaction(db, async (transaction) => {
        transaction.update(requestRef, { upvoteCount: increment(-1) });
      });
    } else {
      await setDoc(upvoteRef, {
        userName,
        createdAt: serverTimestamp(),
      });
      await runTransaction(db, async (transaction) => {
        transaction.update(requestRef, { upvoteCount: increment(1) });
      });
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

    await runTransaction(db, async (transaction) => {
      transaction.update(requestRef, { commentCount: increment(1) });
    });
  };

  return { comments, hasUpvoted, loadingComments, toggleUpvote, addComment };
}
