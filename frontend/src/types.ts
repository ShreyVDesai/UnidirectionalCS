export interface User {
  _id: string;
  email: string;
  username: string;
  type: 'A' | 'B';
  createdAt: string;
}

export interface Request {
  _id: string;
  from: User | string;
  acceptedBy?: User | string | null;
  acceptedAt?: string | null;
  responded: boolean;
  createdAt: string;
}

export interface Message {
  _id: string;
  requestId: string;
  from: User | string;
  to: User | string;
  content: string;
  createdAt: string;
}
