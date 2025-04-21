import { Province } from "../entities/province";

export interface ILocationsState {
  provinces: Province[];
  isLoading: boolean;
  error: string | null;
}
