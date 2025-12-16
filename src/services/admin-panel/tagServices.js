import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import API from "../Api";
import { toast } from "react-toastify";

// Create a new tag
export const useCreateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await API.post(`/admin-panel/tag/create`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag"] });
      toast.success("Tag created successfully");
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

// Get all tags with pagination
export const useGetAllTags = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["tag", page, limit],
    queryFn: async () => {
      const response = await API.get(`/admin-panel/tag/get-all`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ` },
      });
      return response?.data;
    },
  });
};

// Get a single tag by ID
export const useGetTagById = (id) => {
  return useQuery({
    queryKey: ["tag", id],
    queryFn: async () => {
      const response = await API.get(`/admin-panel/tag/get-one-by-id/${id}`);
      return response?.data;
    },
    enabled: !!id,
  });
};

// Update an tag
export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await API.put(
        `/admin-panel/tag/update-by-id/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag"] });
      toast.success("Tag updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error !!");
    },
  });
};

// Delete an tag
export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await API.delete(`/admin-panel/tag/delete-by-id/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tag"] });
      toast.success("Tag deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error !!");
    },
  });
};
