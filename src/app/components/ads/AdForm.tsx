import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { RootState } from "../../redux/store";
import { createAdRequest, updateAdRequest } from "../../redux/slices/adsSlice";
import { Ad } from "../../types";

interface AdFormProps {
  ad?: Ad;
  isEditing?: boolean;
}

const AdForm: React.FC<AdFormProps> = ({ ad, isEditing = false }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoading } = useSelector((state: RootState) => state.ads);

  // State for managing image previews
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    ad && ad.images ? ad.images : []
  );

  const formik = useFormik({
    initialValues: {
      title: ad?.title || "",
      description: ad?.description || "",
      category: ad?.category || "",
      province: ad?.province || "",
      district: ad?.district || "",
      price: ad?.price || 0,
      images: [] as File[],
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .max(100, "Title must be 100 characters or less"),
      description: Yup.string().required("Description is required"),
      category: Yup.string().required("Category is required"),
      province: Yup.string().required("Province is required"),
      district: Yup.string().required("District is required"),
      price: Yup.number()
        .required("Price is required")
        .min(0, "Price must be a positive number"),
    }),
    onSubmit: (values) => {
      if (isEditing && ad) {
        dispatch(
          updateAdRequest({
            id: ad.id,
            data: values,
          })
        );
        router.push(`/ads/${ad.id}`);
      } else {
        dispatch(createAdRequest(values));
        router.push("/my-ads");
      }
    },
  });

  // Handle image file input changes
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      formik.setFieldValue("images", [...formik.values.images, ...files]);

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
    // Create a copy of the arrays
    const newPreviews = [...imagePreviews];
    const newImages = [...formik.values.images];

    // Remove the item at the specified index
    newPreviews.splice(index, 1);

    // Only remove from the images array if it's a newly added image
    // (not an existing image from the server)
    if (index < newImages.length) {
      newImages.splice(index, 1);
      formik.setFieldValue("images", newImages);
    }

    setImagePreviews(newPreviews);
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
      <form onSubmit={formik.handleSubmit}>
        {/* Title */}
        <div className="mb-4">
          <label
            htmlFor="title"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Enter a descriptive title"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.title && formik.errors.title
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.title}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Provide details about your item"
            rows={5}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.description && formik.errors.description
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
          />
          {formik.touched.description && formik.errors.description && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.description}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label
            htmlFor="category"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Category *
          </label>
          <select
            id="category"
            name="category"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.category && formik.errors.category
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          {formik.touched.category && formik.errors.category && (
            <p className="mt-1 text-sm text-red-500">
              {formik.errors.category}
            </p>
          )}
        </div>

        {/* Price */}
        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Price (₺) *
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            placeholder="Enter the price"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
              formik.touched.price && formik.errors.price
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-200"
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
          />
          {formik.touched.price && formik.errors.price && (
            <p className="mt-1 text-sm text-red-500">{formik.errors.price}</p>
          )}
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label
              htmlFor="province"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Province *
            </label>
            <select
              id="province"
              name="province"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formik.touched.province && formik.errors.province
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.province}
            >
              <option value="">Select a province</option>
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </select>
            {formik.touched.province && formik.errors.province && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.province}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="district"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              District *
            </label>
            <select
              id="district"
              name="district"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                formik.touched.district && formik.errors.district
                  ? "border-red-500 focus:ring-red-200"
                  : "border-gray-300 focus:ring-blue-200"
              }`}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.district}
              disabled={!formik.values.province}
            >
              <option value="">Select a district</option>
              {formik.values.province &&
                getDistricts(formik.values.province).map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
            {formik.touched.district && formik.errors.district && (
              <p className="mt-1 text-sm text-red-500">
                {formik.errors.district}
              </p>
            )}
          </div>
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Images
          </label>
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
          <button
            type="submit"
            disabled={isLoading}
            className={`px-8 py-3 rounded-lg font-bold text-white ${
              isLoading ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isLoading
              ? isEditing
                ? "Updating..."
                : "Creating..."
              : isEditing
              ? "Update Advertisement"
              : "Create Advertisement"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdForm;
