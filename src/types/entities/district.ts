import { Province } from "./province";
import { Listing } from "./listing";

export interface District {
  id: string;
  name: string;
  slug: string;
  province: Province;
  listings: Listing[];
  createdAt: string;
  updatedAt: string;
}
