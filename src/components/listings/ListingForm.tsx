"use client";

import { useSelector } from "react-redux";
import {
  Tag,
  DollarSign,
  MapPinned,
  Text,
  Boxes,
  Image as ImageIcon,
} from "lucide-react";
import { RootState } from "@/redux/store";
import { Listing } from "@/types/entities/listing";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import ListingFormSkeleton from "./ListingFormSkeleton";
import { getImageUrl } from "@/lib/utils";

import Image from "next/image";
import FormSectionTitle from "@/components/shared/FormSectionTitle/FormSectionTitle";
import useListingForm from "@/hooks/useListingForm";

type IProps = {
  listing?: Listing;
};

export default function ListingForm({ listing }: IProps) {
  const { form, onSubmit, handleImageChange, removeImage, imagePreviews } =
    useListingForm(listing);

  const { categories } = useSelector((state: RootState) => state.categories);
  const { provinces } = useSelector((state: RootState) => state.locations);
  const { isLoading, error } = useSelector(
    (state: RootState) => state.listings
  );

  if (!categories || !provinces) {
    return <ListingFormSkeleton />;
  }

  return (
    <div className="w-full  mx-auto bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">
        {listing ? "Edit Listing" : "Create New Listing"}
      </h2>

      {error && (
        <div className="mb-6 p-3 bg-red-900/40 text-red-300 border border-red-700 rounded-md">
          {error}
        </div>
      )}

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          encType="multipart/form-data"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormSectionTitle title="Title">
                  <Tag className="h-4 w-4 " />
                </FormSectionTitle>
                <FormControl>
                  <Input placeholder="E.g. iPhone 13 Pro Max" {...field} />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormSectionTitle title="Description">
                  <Text className="h-4 w-4 " />
                </FormSectionTitle>
                <FormControl>
                  <Textarea
                    placeholder="Describe your item in detail. Condition, specs, etc."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormSectionTitle title="Price">
                  <DollarSign className="h-4 w-4 " />
                </FormSectionTitle>
                <FormControl>
                  <Input type="number" placeholder="Enter price" {...field} />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormSectionTitle title="Category">
                  <Boxes className="h-4 w-4 " />
                </FormSectionTitle>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <FormField
              control={form.control}
              name="provinceId"
              render={({ field }) => (
                <FormItem>
                  <FormSectionTitle title="Province">
                    <MapPinned className="h-4 w-4 " />
                  </FormSectionTitle>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("districtId", "");
                    }}
                    defaultValue={field.value}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a province" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="districtId"
              render={({ field }) => (
                <FormItem>
                  <FormSectionTitle title="District">
                    <MapPinned className="h-4 w-4 " />
                  </FormSectionTitle>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a district" />
                      </SelectTrigger>
                      <SelectContent>
                        {provinces
                          .find((p) => p.id === form.getValues("provinceId"))
                          ?.districts.map((district) => (
                            <SelectItem key={district.id} value={district.id}>
                              {district.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          {/* Images Section */}
          <div className="space-y-6">
            <FormSectionTitle title="Images">
              <ImageIcon className="h-4 w-4 " />
            </FormSectionTitle>

            <div className=" space-y-6">
              <div className="border-2 border-dashed border-white/30 rounded-lg bg-gray-800/30 p-8 text-center transition-colors hover:bg-gray-800/50">
                <input
                  id="newImages"
                  name="newImages"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="newImages" className="cursor-pointer block">
                  <div className="mx-auto w-16 h-16 rounded-full bg-indigo-500/10 flex items-center justify-center mb-4">
                    <ImageIcon className="h-8 w-8 text-indigo-400" />
                  </div>
                  <span className="text-indigo-400 font-medium">
                    Click to upload
                  </span>{" "}
                  <span className="text-gray-400">or drag and drop</span>
                  <p className="text-xs text-gray-500 mt-2">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>

              {/* Image previews */}
              {imagePreviews.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-gray-300 mb-3">
                    Image Previews
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {imagePreviews.map((image, index) => (
                      <div
                        key={image}
                        className="relative group rounded-md overflow-hidden shadow-lg border border-gray-700"
                      >
                        <Image
                          src={getImageUrl(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full aspect-square object-contain"
                          width={100}
                          height={100}
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(image)}
                          className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
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

          {Object.keys(form.formState.errors).length > 0 && (
            <div className="mb-6 p-3 bg-red-900/40 text-red-300 border border-red-700 rounded-md text-sm">
              Please fix the errors above and try again.
            </div>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-8 bg-primary hover:bg-primary/80 text-white py-3 rounded-md transition-colors"
          >
            {isLoading
              ? listing
                ? "Updating..."
                : "Creating..."
              : listing
              ? "Update Listing"
              : "Create Listing"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
