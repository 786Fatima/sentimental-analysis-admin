import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import API from "../Api";
import { toast } from "react-toastify";
import { getAPIRequestHeaders } from "../../utils/functions";
import useStore from "../../store";

// Create a new post
export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { adminAccessToken } = useStore();
  const headers = getAPIRequestHeaders(adminAccessToken);

  return useMutation({
    mutationFn: async (data) => {
      const response = await API.post(`/admin-panel/post/create`, data, {
        headers,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      toast.success("Post created successfully");
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

// Get all posts with pagination
export const useGetAllPosts = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["post", page, limit],
    queryFn: async () => {
      const response = await API.get(`/admin-panel/post/get-all`, {
        params: { page, limit },
        headers: { Authorization: `Bearer ` },
      });
      return response?.data;
    },
  });
};

// Get a single post by ID
export const useGetPostById = (id) => {
  return useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      const response = await API.get(`/admin-panel/post/get-one-by-id/${id}`);
      return response?.data;
    },
    enabled: !!id,
  });
};

// Get a single post sentiment by ID
export const useGetPostSentimentById = (id) => {
  return useQuery({
    // queryKey: ["post", id],
    queryFn: async () => {
      const response = await API.get(
        `/admin-panel/post/get-sentiment-by-id/${id}`
      );
      return response?.data;
    },
    enabled: !!id,
  });
};

// Update an post
export const useUpdatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await API.put(
        `/admin-panel/post/update-by-id/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      toast.success("Post updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error !!");
    },
  });
};

// Delete an post
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await API.delete(`/admin-panel/post/delete-by-id/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error !!");
    },
  });
};
