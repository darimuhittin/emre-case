import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import {
  Tag,
  AlignLeft,
  DollarSign,
  MapPin,
  MapPinned,
  Image as ImageIcon,
  Plus
} from "lucide-react";
import { RootState } from "../../redux/store";
import { createAdRequest, updateAdRequest } from "../../redux/slices/adsSlice";
import { Ad } from "../../types";
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

interface AdFormProps {
  ad?: Ad;
  isEditing?: boolean;
}

// Define schema with Zod
const adSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .max(100, "Title must be 100 characters or less"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().min(1, "District is required"),
  price: z.coerce.number()
    .min(0, "Price must be a positive number"),
  images: z.any().default([]),
});

type AdFormValues = z.infer<typeof adSchema>;

const AdForm: React.FC<AdFormProps> = ({ ad, isEditing = false }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((state: RootState) => state.ads);

  // State for managing image previews
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    ad && ad.images ? ad.images : []
  );

  // Initialize form with validation
  const form = useForm<AdFormValues>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      title: ad?.title || "",
      description: ad?.description || "",
      category: ad?.category || "",
      province: ad?.province || "",
      district: ad?.district || "",
      price: ad?.price || 0,
      images: [],
    },
  });

  // Watch province to enable/disable district selection
  const selectedProvince = form.watch("province");

  // Handle form submission
  const onSubmit = (values: AdFormValues) => {
    // We need to ensure 'images' is always present in the data
    const formData = {
      ...values,
      images: values.images || []
    };

    if (isEditing && ad) {
      dispatch(
        updateAdRequest({
          id: ad.id,
          data: formData,
        })
      );
      router.push(`/ads/${ad.id}`);
    } else {
      dispatch(createAdRequest(formData));
      router.push("/my-ads");
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
        .forEach(file => dataTransfer.items.add(file));

      form.setValue("images", dataTransfer.files);
    }
  };

  const categories = [
    "Electronics",
    "Vehicles",
    "Real Estate",
    "Furniture",
    "Clothing",
    "Services",
    "Jobs",
    "Other",
  ];

  const provinces = [
    "Istanbul",
    "Ankara",
    "Izmir",
    "Bursa",
    "Antalya",
    "Adana",
    "Other",
  ];

  const getDistricts = (province: string) => {
    switch (province) {
      case "Istanbul":
        return ["Kadikoy", "Besiktas", "Sisli", "Uskudar", "Fatih", "Other"];
      case "Ankara":
        return [
          "Cankaya",
          "Kecioren",
          "Yenimahalle",
          "Mamak",
          "Etimesgut",
          "Other",
        ];
      case "Izmir":
        return ["Konak", "Karsiyaka", "Bornova", "Buca", "Cigli", "Other"];
      default:
        return ["Central", "Other"];
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Title *
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter a descriptive title" {...field} />
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
                <FormLabel className="flex items-center gap-2">
                  <AlignLeft className="h-4 w-4" /> Description *
                </FormLabel>
                <FormControl>
                  <textarea
                    {...field}
                    placeholder="Provide details about your item"
                    rows={5}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Category *
                </FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
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
                <FormLabel className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" /> Price (₺) *
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Enter the price"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="province"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Province *
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                      <option value="">Select a province</option>
                      {provinces.map((province) => (
                        <option key={province} value={province}>
                          {province}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="district"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <MapPinned className="h-4 w-4" /> District *
                  </FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      disabled={!selectedProvince}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a district</option>
                      {selectedProvince &&
                        getDistricts(selectedProvince).map((district) => (
                          <option key={district} value={district}>
                            {district}
                          </option>
                        ))}
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Images */}
          <div className="space-y-4">
            <FormLabel className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" /> Images
            </FormLabel>
            <div className="border-dashed border-2 border-gray-300 p-4 rounded-lg text-center">
              <input
                id="images"
                name="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
              <label
                htmlFor="images"
                className="cursor-pointer block py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <span className="text-blue-600 font-medium">Click to upload</span>{" "}
                or drag and drop
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, GIF up to 5MB
              </p>
            </div>

            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <p className="text-sm font-bold mb-2">Image Previews:</p>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {imagePreviews.map((src, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={src}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button
              type="submit"
              disabled={isLoading}
              className="px-8 py-3"
            >
              <Plus className="mr-2 h-4 w-4" />
              {isLoading
                ? isEditing
                  ? "Updating..."
                  : "Creating..."
                : isEditing
                  ? "Update Advertisement"
                  : "Create Advertisement"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdForm;
