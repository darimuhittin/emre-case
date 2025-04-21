import { Category } from "../entities/category";

export interface CategoriesState {
  categories: Category[];
  isLoading: boolean;
  error: string | null;
}
