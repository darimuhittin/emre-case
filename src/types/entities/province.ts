import { District } from "./district";

export interface Province {
  id: string;
  name: string;
  slug: string;
  districts: District[];
  createdAt: string;
  updatedAt: string;
}
