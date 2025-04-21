import { Listing } from "./listing";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  listings: Listing[];
  createdAt: string;
  updatedAt: string;
}
