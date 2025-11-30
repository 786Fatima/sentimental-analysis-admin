import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import API from "../Api";
import { toast } from "react-toastify";

// Register a new user
export const useRegisterUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await API.post("/website/user/register", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User registered successfully");
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

// Login user
export const useLoginUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const response = await API.post(`/website/user/login`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User logged in successfully");
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

// Get all users with pagination
export const useGetAllUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["user", page, limit],
    queryFn: async () => {
      const response = await API.get(`/website/user/get-all`, {
        params: { page, limit },
      });
      return response?.data;
    },
  });
};

// Get a single user by ID
export const useGetUserById = (id) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await API.get(`/website/user/get-one-by-id/${id}`);
      return response?.data;
    },
    enabled: !!id,
  });
};

// Update an user
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await API.put(`/website/user/update-by-id/${id}`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User updated successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error !!");
    },
  });
};
