export interface IUser {
  _id: string;
  username: string;
  profilePic: string;
  isSuccess: boolean;
  isLoading: boolean;
  isError: boolean;
}

export interface IMessage {
  _id: string;
  chat: Partial<IChat>;
  content: string;
  sender: Partial<IUser>;
  isOptimisticUpdate: boolean;
  createdAt: string;
  updatedAt: string;
  readBy: IUser[];
}

export interface IChat {
  _id: string;
  chatName: string;
  isGroupChat: boolean;
  latestMessage: IMessage;
  groupAdmin: IUser;
  users: IUser[];
  createdAt: string;
  updatedAt: string;
}

export interface IInputConfig {
  id: number;
  name: string;
  type: string;
  placeholder?: string;
  errorMessage: string;
  label: string;
  inputPattern?: string;
  required: boolean;
}

export interface IAuthUser {
  username: string;
  password: string;
  confirmPassword?: string;
}

export interface IAuthData {
  token: string;
  user: IUser;
}

export interface ISendMessage {
  chatId: string;
  content: string;
}

export interface IMessageData extends Partial<IMessage> {
  type?: string;
}
