"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import {
  Tag,
  AlignLeft,
  DollarSign,
  MapPinned,
  Image as ImageIcon,
  Plus,
} from "lucide-react";
import { RootState } from "../../app/redux/store";
import { Listing, ListingFormData } from "../../app/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  createListingRequest,
  updateListingRequest,
} from "@/app/redux/slices/listingsSlice";
import { fetchProvincesRequest } from "@/app/redux/sagas/locationsSaga";
import { fetchCategoriesRequest } from "@/app/redux/sagas/categoriesSaga";
import { Skeleton } from "../ui/skeleton";
import Image from "next/image";
// Action creator helper types to match saga expectations
const createListing = (data: ListingFormData) =>
  createListingRequest(data as ListingFormData);
const updateListing = (id: string, data: ListingFormData) =>
  updateListingRequest({ id, data } as UpdateListing);

type UpdateListing = {
  id: string;
  data: ListingFormData;
};
interface ListingFormProps {
  listing?: Listing;
  isEditing?: boolean;
}

// Define schema with Zod
const listingSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  districtId: z.string().min(1, "District is required"),
  price: z.coerce.number().min(0, "Price must be a positive number"),
  images: z.any().default([]),
});

type ListingFormValues = z.infer<typeof listingSchema>;

const ListingForm: React.FC<ListingFormProps> = ({
  listing,
  isEditing = false,
}) => {
  const dispatch = useDispatch();

  const { isLoading } = useSelector((state: RootState) => state.listings);

  const { provinces } = useSelector((state: RootState) => state.locations);

  const { categories } = useSelector((state: RootState) => state.categories);

  const { isLoading: isAuthLoading } = useSelector(
    (state: RootState) => state.auth
  );
  useEffect(() => {
    if (!isAuthLoading) {
      dispatch(fetchProvincesRequest());
      dispatch(fetchCategoriesRequest());
    }
  }, [dispatch, isAuthLoading]);

  // State for managing image previews
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    listing && listing.images ? listing.images : []
  );

  // Initialize form with validation
  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title || "Example Title",
      description: listing?.description || "Example Description",
      categoryId:
        listing?.category?.id ||
        categories?.[Math.floor(Math.random() * categories.length)]?.id ||
        "",
      districtId:
        listing?.district?.id ||
        provinces?.[Math.floor(Math.random() * provinces.length)]?.districts?.[
          Math.floor(
            Math.random() *
              provinces[Math.floor(Math.random() * provinces.length)].districts
                .length
          )
        ]?.id ||
        "",
      price: listing?.price || Math.floor(Math.random() * 1000),
      images: [],
    },
  });

  // Watch districtId to enable/disable district selection
  const _selectedCategory = form.watch("categoryId");
  const _selectedDistrict = form.watch("districtId");

  // Handle form submission
  const onSubmit = (values: ListingFormValues) => {
    // Create a properly typed FormData object
    const formData: ListingFormData = {
      title: values.title,
      description: values.description,
      price: values.price,
      categoryId: values.categoryId,
      districtId: values.districtId,
      images: values.images ? Array.from(values.images) : [],
    };

    if (isEditing && listing) {
      dispatch(updateListing(listing.id, formData));
      // router.push(`/listings/${listing.id}`);
    } else {
      dispatch(createListing(formData));

      // router.push("/my-listings");
    }
  };

  // Handle image file input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      form.setValue("images", e.target.files);

      // Create image previews
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            setImagePreviews((prev) => [...prev, e.target?.result as string]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Remove an image from the preview and form values
  const removeImage = (index: number) => {
    // Create a copy of the array
    const newPreviews = [...imagePreviews];

    // Remove the item at the specified index
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);

    // Update the form value if this is manipulating the current file list
    const currentImages = form.getValues("images");
    if (currentImages && index < Array.from(currentImages as FileList).length) {
      const dataTransfer = new DataTransfer();

      Array.from(currentImages as FileList)
        .filter((_, i) => i !== index)
        .forEach((file) => dataTransfer.items.add(file));

      form.setValue("images", dataTransfer.files);
    }
  };

  if (isAuthLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto  rounded-xl shadow-md border p-8 transition-all bg-secondary-100">
      <div className="space-y-6">
        <div className="pb-4 border-b">
          <h2 className="text-2xl font-bold text-primary">
            {isEditing ? "Edit Listing" : "Create New Listing"}
          </h2>
          <p className="text-muted-foreground">
            Fill in the details to {isEditing ? "update your" : "post a new"}{" "}
            listing
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <Tag className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                </div>

                <div className="pl-12 space-y-4">
                  {/* Title */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Title *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter a descriptive title"
                            {...field}
                            className="transition-all focus:shadow-sm"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Description *
                        </FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            placeholder="Provide details about your item"
                            rows={5}
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Category & Price Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Category & Price</h3>
                </div>

                <div className="pl-12 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Category *
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                          >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Price */}
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          Price (₺) *
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="1"
                            placeholder="Enter the price"
                            className="transition-all focus:shadow-sm"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Location Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <MapPinned className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Location</h3>
                </div>

                <div className="pl-12">
                  <FormField
                    control={form.control}
                    name="districtId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">
                          District *
                        </FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                          >
                            <option value="">Select a district</option>
                            {provinces.flatMap((province) =>
                              province.districts.map((district) => (
                                <option
                                  key={`${province.name}-${district.name}`}
                                  value={district.id}
                                >
                                  {district.name} ({province.name})
                                </option>
                              ))
                            )}
                          </select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Images Section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Images</h3>
                </div>

                <div className="pl-12 space-y-4">
                  <div className="border-2 border-dashed border-input rounded-lg bg-background/50 p-6 text-center transition-colors hover:bg-background">
                    <input
                      id="images"
                      name="images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <label htmlFor="images" className="cursor-pointer block">
                      <div className="mx-auto w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                        <ImageIcon className="h-8 w-8 text-primary/60" />
                      </div>
                      <span className="text-primary font-medium">
                        Click to upload
                      </span>{" "}
                      <span className="text-muted-foreground">
                        or drag and drop
                      </span>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, GIF up to 5MB
                      </p>
                    </label>
                  </div>

                  {/* Image previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-sm font-medium mb-3">
                        Image Previews
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {imagePreviews.map((src, index) => (
                          <div
                            key={index}
                            className="relative group rounded-md overflow-hidden shadow-sm border"
                          >
                            <Image
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover"
                              width={100}
                              height={100}
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 border-t">
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="px-8 py-2 h-12 transition-all"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin mr-2">⚬</div>{" "}
                      {isEditing ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{isEditing ? "Update Listing" : "Create Listing"}</>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default ListingForm;
