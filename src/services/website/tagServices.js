import { useQuery } from "@tanstack/react-query";

import API from "../Api";

// Get all tags with pagination
export const useGetAllTags = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["tag", page, limit],
    queryFn: async () => {
      const response = await API.get(`/website/tag/get-all`, {
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
      const response = await API.get(`/website/tag/get-one-by-id/${id}`);
      return response?.data;
    },
    enabled: !!id,
  });
};
