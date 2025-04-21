import { Province } from "./province";
import { District } from "./district";
import { Category } from "./category";
import { User } from "./user";

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  user: User;
  userId: string;
  category: Category;
  district: District;
  createdAt: string;
  updatedAt: string;
  slug: string;
  province?: Province;
}

export interface IListingFilters {
  category?: string;
  province?: string;
  district?: string;
  price?: number;
  page?: number;
  search?: string;
}
