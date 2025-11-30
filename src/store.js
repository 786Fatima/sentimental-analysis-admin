import { create } from "zustand";
import { persist } from "zustand/middleware";

// Helper functions for manual localStorage backup
const getStoredAuth = () => {
  try {
    const stored = localStorage.getItem("senti-auth");
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredAuth = ({
  data = null,
  accessToken = null,
  isAuthenticated = false,
  isUser = false,
  isAdmin = false,
}) => {
  try {
    const previousAuth = getStoredAuth() || {};
    if (isAdmin) {
      localStorage.setItem(
        "senti-auth",
        JSON.stringify({
          ...previousAuth,
          admin: data,
          isAdminAuthenticated: isAuthenticated,
          adminAccessToken: accessToken,
        })
      );
    }
    if (isUser) {
      localStorage.setItem(
        "senti-auth",
        JSON.stringify({
          ...previousAuth,
          user: data,
          isUserAuthenticated: isAuthenticated,
          userAccessToken: accessToken,
        })
      );
    }
  } catch (error) {
    console.warn("Failed to store auth data:", error);
  }
};

const clearStoredAuth = ({ clearAdmin = false, clearUser = false }) => {
  try {
    const previousAuth = getStoredAuth() || {};
    if (previousAuth === null) return;
    if (clearAdmin) {
      delete previousAuth.admin;
      delete previousAuth.isAdminAuthenticated;
      delete previousAuth.adminAccessToken;
    }
    if (clearUser) {
      delete previousAuth.user;
      delete previousAuth.isUserAuthenticated;
      delete previousAuth.userAccessToken;
    }
    localStorage.setItem("senti-auth", JSON.stringify(previousAuth));
  } catch (error) {
    console.warn("Failed to clear auth data:", error);
  }
};

// Initialize auth state from localStorage
const storedAuth = getStoredAuth();
console.log("store", storedAuth);
const useStore = create(
  persist(
    (set, get) => ({
      // Admin Auth state - Initialize from localStorage
      user: storedAuth?.user || null,
      admin: storedAuth?.admin || null,

      isAdminAuthenticated: storedAuth?.isAdminAuthenticated || false,
      isUserAuthenticated: storedAuth?.isUserAuthenticated || false,

      adminAccessToken: storedAuth?.adminAccessToken || null,
      userAccessToken: storedAuth?.userAccessToken || null,

      isLoading: false,

      // Data state
      users: [],
      posts: [],
      tags: [],
      interactions: [],
      comments: [],

      // UI state
      sidebarCollapsed: false,
      currentPage: "dashboard",

      // Admin Actions
      login: (adminData, adminAccessToken) => {
        if (!adminData || !adminAccessToken) return;
        set({ admin: adminData, isAdminAuthenticated: true, adminAccessToken });
        setStoredAuth({
          data: adminData,
          isAuthenticated: true,
          accessToken: adminAccessToken,
          isAdmin: true,
        });
      },
      logout: () => {
        set({
          admin: null,
          adminAccessToken: null,
          isAdminAuthenticated: false,
        });
        clearStoredAuth({ clearAdmin: true });
      },

      // Admin Actions
      adminLogin: ({ data: adminData, token: adminAccessToken }) => {
        if (!adminData || !adminAccessToken) return;
        set({ admin: adminData, adminAccessToken, isAdminAuthenticated: true });
        setStoredAuth({
          data: adminData,
          isAuthenticated: true,
          accessToken: adminAccessToken,
          isAdmin: true,
        });
      },
      adminLogout: () => {
        set({
          admin: null,
          adminAccessToken: null,
          isAdminAuthenticated: false,
        });
        clearStoredAuth({ clearAdmin: true });
      },

      // User Actions
      userLogin: ({ data: userData, token: userAccessToken }) => {
        if (!userData || !userAccessToken) return;
        set({ user: userData, userAccessToken, isUserAuthenticated: true });
        setStoredAuth({
          data: userData,
          isAuthenticated: true,
          accessToken: userAccessToken,
          isUser: true,
        });
      },
      userLogout: () => {
        set({ user: null, userAccessToken: null, isUserAuthenticated: false });
        clearStoredAuth({ clearUser: true });
      },

      setLoading: (loading) => set({ isLoading: loading }),

      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setCurrentPage: (page) => set({ currentPage: page }),

      // Data actions
      setUsers: (users) => set({ users }),
      setPosts: (posts) => set({ posts }),
      setTags: (tags) => set({ tags }),
      setInteractions: (interactions) => set({ interactions }),
      setComments: (comments) => set({ comments }),

      // Fetch data
      fetchData: async (endpoint) => {
        try {
          const response = await fetch(`/data/${endpoint}.json`);
          const data = await response.json();

          switch (endpoint) {
            case "users":
              set({ users: data });
              break;
            case "posts":
              set({ posts: data });
              break;
            case "tags":
              set({ tags: data });
              break;
            case "interactions":
              set({ interactions: data });
              break;
            case "comments":
              set({ comments: data });
              break;
            default:
              break;
          }

          return data;
        } catch (error) {
          console.error(`Error fetching ${endpoint}:`, error);
          return [];
        }
      },

      // Stats calculations
      getStats: () => {
        const { users, posts, interactions } = get();
        const today = new Date().toISOString().split("T")[0];

        const totalVisits = posts.reduce((sum, post) => sum + post.views, 0);
        const usersOnline = users.filter((user) => user.isOnline).length;
        const usersRegisteredToday = users.filter(
          (user) => user.registeredDate === today
        ).length;

        const todayInteractions = interactions.filter((interaction) =>
          interaction.createdAt?.startsWith(today)
        ).length;

        return {
          totalVisits,
          usersOnline,
          usersRegisteredToday,
          todayInteractions,
          totalUsers: users.length,
          totalPosts: posts.length,
        };
      },
    }),
    {
      name: "senti-storage", // unique name
      // Only persist auth state and UI preferences
      partialize: (state) => ({
        user: state.user,
        admin: state.admin,
        userAccessToken: state.userAccessToken,
        adminAccessToken: state.adminAccessToken,
        isAdminAuthenticated: state.isAdminAuthenticated,
        isUserAuthenticated: state.isUserAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export default useStore;
