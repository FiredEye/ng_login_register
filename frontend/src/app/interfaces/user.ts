export interface User {
  id: string;
  userName: string;
  email: string;
  password: string;
  address: string;
  imageUrl: string;
  age: number;
  gender: string;
  isAdmin: boolean;
  loggedInCount: number;
}

export interface LoginResponse {
  email: string;
  token: string;
  userName: string;
  isAdmin: boolean;
  address: string;
  gender: string;
  age: number;
  loggedInCount: number;
  imageurl: string;
}
