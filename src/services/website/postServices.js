import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import API from "../Api";
import { toast } from "react-toastify";
import useStore from "../../store";
import { getAPIRequestHeaders } from "../../utils/functions";
// store not required here because tokens are read from localStorage via authToken helpers

// Get all posts with pagination
export const useGetAllPosts = (page = 1, limit = 10) => {
  const { userAccessToken } = useStore();
  const headers = getAPIRequestHeaders(userAccessToken);
  return useQuery({
    queryKey: ["post", page, limit],
    queryFn: async () => {
      const response = await API.get("/website/post/get-all", {
        params: { page, limit },
        headers,
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
      const response = await API.get(`/website/post/get-one-by-id/${id}`);
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
      const response = await API.put(`/website/post/update-by-id/${id}`, data);
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
