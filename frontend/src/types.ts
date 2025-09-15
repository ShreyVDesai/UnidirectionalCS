export type UserType = 'A' | 'B';

export interface User {
  _id: string;
  username: string;
  email: string;
  type: UserType;
}

export interface Request {
  _id: string;
  from: User;
  acceptedBy?: User;
  acceptedAt?: string;
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
