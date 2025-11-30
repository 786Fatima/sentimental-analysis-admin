import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import API from "../Api";
import { toast } from "react-toastify";
import useStore from "../../store";
import { getAPIRequestHeaders } from "../../utils/functions";
// store not required here because tokens are read from localStorage via authToken helpers

// Update an post
export const useUpdatePostViewById = () => {
  const queryClient = useQueryClient();
  const { userAccessToken } = useStore();
  const headers = getAPIRequestHeaders(userAccessToken);

  return useMutation({
    mutationFn: async ({ id, data = {} }) => {
      const response = await API.put(
        `/website/feedback/update-post-view-by-id/${id}`,
        data,
        { headers }
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedback"] });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Error !!");
    },
  });
};
