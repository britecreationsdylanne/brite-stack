import { Timestamp } from 'firebase/firestore';

export interface ToolRequest {
  id: string;
  toolName: string;
  description: string;
  requesterName: string;
  requesterEmail: string;
  status: 'new' | 'in-progress' | 'completed';
  createdAt: Timestamp | null;
  upvoteCount: number;
  commentCount: number;
}

export interface Comment {
  id: string;
  text: string;
  authorName: string;
  authorEmail: string;
  createdAt: Timestamp | null;
}
