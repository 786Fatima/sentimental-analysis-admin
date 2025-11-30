import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../Api";
import { toast } from "react-toastify";

// Login admin
export const useLoginAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await API.post("/admin-panel/admin/login", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Admin logged in successfully");
    },
    onError: (error) => {
      toast.error(
        Object.values(error?.response?.data?.details || {})[0] ||
          error?.response?.data?.error ||
          "Error !!"
      );
    },
  });
};
