import {
  createListingRequest,
  updateListingRequest,
} from "@/redux/slices/listingsSlice";
import { ListingFormValues, listingSchema } from "../schemas/listing";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, UseFormReturn } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Listing } from "@/types/entities/listing";
import { fetchCategories } from "../redux/slices/categoriesSlice";
import { fetchProvinces } from "../redux/slices/locationsSlice";
import { RootState } from "../redux/store";

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const useListingForm = (
  listing?: Listing
): {
  form: UseFormReturn<ListingFormValues>;
  onSubmit: (values: ListingFormValues) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (image: string) => void;
  imagePreviews: string[];
} => {
  const { categories } = useSelector((state: RootState) => state.categories);
  const { provinces } = useSelector((state: RootState) => state.locations);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    listing?.images || []
  );
  const [addedImages, setAddedImages] = useState<{ file: File; url: string }[]>(
    []
  );
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [createdObjectUrls, setCreatedObjectUrls] = useState<string[]>([]);

  console.log("imagePreviews", imagePreviews);

  const dispatch = useDispatch();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: listing?.title || "",
      description: listing?.description || "",
      price: listing?.price ? listing.price.toString() : "",
      categoryId: listing?.category?.id || "",
      provinceId: listing?.province?.id || "",
      districtId: listing?.district?.id || "",
      images: listing?.images || [],
    },
  });

  useEffect(() => {
    return () => {
      createdObjectUrls.forEach((url) => {
        URL.revokeObjectURL(url);
      });
    };
  }, []);

  form.watch("provinceId");
  form.watch("districtId");

  useEffect(() => {
    if (
      categories.length > 0 &&
      provinces.length > 0 &&
      provinces[0].districts.length > 0
    ) {
      form.setValue("title", "Example Title");
      form.setValue("description", "Example Description for listing");
      form.setValue("price", "100");
      form.setValue("categoryId", categories[0].id);
      form.setValue("provinceId", provinces[0].id);
      setTimeout(() => {
        form.setValue("districtId", provinces[0].districts[0].id);
      }, 1000);
    }
  }, [categories, provinces, form]);

  const onSubmit = (values: ListingFormValues) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("price", values.price);
    formData.append("categoryId", values.categoryId);
    formData.append("provinceId", values.provinceId);
    formData.append("districtId", values.districtId);

    if (addedImages.length > 0) {
      addedImages.forEach(({ file }) => {
        formData.append("newImages", file);
      });
    }

    if (removedImages.length > 0) {
      formData.append("imagesToDelete", removedImages.join(","));
    }

    if (listing) {
      dispatch(updateListingRequest({ id: listing.id, data: formData }));
    } else {
      dispatch(createListingRequest(formData));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles: { file: File; url: string }[] = [];
    const newPreviews: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > MAX_FILE_SIZE) {
        alert(`File ${file.name} is too large. Max size is 5MB.`);
        continue;
      }

      if (imagePreviews.length + newPreviews.length >= MAX_IMAGES) {
        alert(`You can only upload a maximum of ${MAX_IMAGES} images.`);
        break;
      }

      const url = URL.createObjectURL(file);
      newFiles.push({ file, url });
      setCreatedObjectUrls((old) => [...old, url]);
      newPreviews.push(url);
    }

    setAddedImages((old) => [...old, ...newFiles]);
    setImagePreviews((old) => [...old, ...newFiles.map((file) => file.url)]);
  };

  const removeImage = (image: string) => {
    const imageToRemove = image;

    if (imageToRemove.startsWith("blob:")) {
      URL.revokeObjectURL(imageToRemove);
    }
    setRemovedImages((old) => [...old, imageToRemove]);

    setImagePreviews((old) => old.filter((image) => image !== imageToRemove));

    setAddedImages((old) =>
      old.filter(({ url }) => {
        return !imageToRemove.includes(url);
      })
    );
  };

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchProvinces());
  }, [dispatch]);

  useEffect(() => {
    console.log("imagePreviews", imagePreviews);
  }, [imagePreviews]);

  useEffect(() => {
    console.log("removedImages", removedImages);
  }, [removedImages]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => {
        if (preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview);
        }
      });
    };
  }, [imagePreviews]);

  return { form, onSubmit, handleImageChange, removeImage, imagePreviews };
};

export default useListingForm;
