import { Listing, IListingFilters } from "../entities/listing";

export interface IListingState {
  listings: Listing[];
  totalListings: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  selectedListing: Listing | null;
  selectedListingLoading: boolean;
  isLoading: boolean;
  error: string | null;
  filters: IListingFilters;
  createListingLoading: boolean;
  createListingError: string | null;
  updateListingLoading: boolean;
  updateListingError: string | null;
  deleteListingLoading: boolean;
  deleteListingError: string | null;
  fetchMyListingsLoading: boolean;
  fetchMyListingsError: string | null;
  myListings: Listing[];
}
