import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import API from "./Api";
import { toast } from "react-toastify";

// // Create a new user
// export const useCreateUser = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: async (data) => {
//       const response = await API.post(`user/create`, data);
//       return response.data;
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["user"] });
//       toast.success("User created successfully");
//     },
//     onError: (error) => {
//       toast.error(
//         Object.values(error?.response?.data?.details || {})[0] ||
//           error?.response?.data?.error ||
//           "Error !!"
//       );
//     },
//   });
// };

// Get all users with pagination
export const useGetAllUsers = (page = 1, limit = 10) => {
  return useQuery({
    queryKey: ["user", page, limit],
    queryFn: async () => {
      const response = await API.get(`user/get-all`, {
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
      const response = await API.get(`user/get-one-by-id/${id}`);
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
      const response = await API.put(`user/update-by-id/${id}`, data);
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

// Delete an user
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const response = await API.delete(`user/delete-by-id/${id}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast.success("User deleted successfully");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error !!");
    },
  });
};
