import { z } from "zod";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters")
    .max(1000),
  price: z
    .string()
    .refine((val) => !isNaN(parseFloat(val)), {
      message: "Price must be a number",
    })
    .refine((val) => parseFloat(val) >= 0, {
      message: "Price must be positive",
    }),
  categoryId: z.string().min(1, "Please select a category"),
  provinceId: z.string().min(1, "Please select a province"),
  districtId: z.string().min(1, "Please select a district"),
  images: z.array(z.string()).optional(),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export { listingSchema, type ListingFormValues };
