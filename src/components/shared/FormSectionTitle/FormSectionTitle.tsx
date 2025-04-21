import { FormLabel } from "@/components/ui/form";
import IconContainer from "./components/IconContainer";

const FormSectionTitle = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <FormLabel className="flex items-center gap-2 text-gray-300">
      <IconContainer>{children}</IconContainer>
      {title}
    </FormLabel>
  );
};

export default FormSectionTitle;
