import { useToast } from "@/hooks/useToast";

export const useCustomToast = () => {
  const { toast } = useToast();

  const showSuccessToast = (message: string) => {
    return toast({
      title: message || "Success",
      description: "Your action was successful.",
    });
  };

  const showErrorToast = (message: string) => {
    return toast({
      variant: "destructive",
      title: message || "Uh oh! Something went wrong.",
      description: "There was a problem with your request.",
    });
  };

  return { showSuccessToast, showErrorToast };
};
