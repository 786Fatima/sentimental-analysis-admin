import { useQuery } from "@tanstack/react-query";

import API from "../Api";

export const useGetDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const response = await API.get(
        "/admin-panel/dashboard/get-dashboard-stats"
      );
      return response?.data;
    },
  });
};

export const useGetTopPostInteractions = ({ period = "today" }) => {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: async () => {
      const response = await API.get(
        "/admin-panel/dashboard/get-top-post-interactions",
        {
          params: { period },
        }
      );
      return response?.data;
    },
  });
};
export const useGetTopInteractionsByStates = ({ period = "today" }) => {
  return useQuery({
    queryKey: ["dashboard", period],
    queryFn: async () => {
      const response = await API.get(
        "/admin-panel/dashboard/get-top-interactions-by-states",
        {
          params: { period },
        }
      );
      return response?.data;
    },
  });
};
