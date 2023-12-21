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
