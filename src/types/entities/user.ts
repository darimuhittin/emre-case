import { Listing } from "./listing";

export interface User {
  id: string;
  email: string;
  password: string;
  name?: string;
  isEmailVerified: boolean;
  verificationToken?: string;
  refreshToken?: string;
  listings: Listing[];
  createdAt: string;
  updatedAt: string;
}
