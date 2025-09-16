export interface User {
  _id: string;
  email: string;
  type: 'A' | 'B';
  username?: string;
}

export interface Request {
  _id: string;
  from: User | string;
  acceptedBy?: User | string;
  acceptedAt?: string;
  responded?: boolean;
}

export interface Message {
  _id: string;
  from: User | string;
  content: string;
  createdAt: string;
}
