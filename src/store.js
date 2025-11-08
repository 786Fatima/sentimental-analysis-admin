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

const setStoredAuth = (admin, isAdminAuthenticated) => {
  try {
    const previousAuth = getStoredAuth() || {};
    localStorage.setItem(
      "senti-auth",
      JSON.stringify({ ...previousAuth, admin, isAdminAuthenticated })
    );
  } catch (error) {
    console.warn("Failed to store auth data:", error);
  }
};

const clearStoredAuth = () => {
  try {
    localStorage.removeItem("senti-auth");
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

      // User Auth state (for user-facing pages)
      userInfo: null,
      isUserAuthenticated: false,

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
      login: (userData) => {
        console.log("first", userData, localStorage.getItem("senti-auth"));
        set({ admin: userData, isAdminAuthenticated: true });
        setStoredAuth(userData, true);
      },
      logout: () => {
        set({ admin: null, isAdminAuthenticated: false });
        clearStoredAuth();
      },

      // User Actions
      userLogin: (userData) => {
        set({ userInfo: userData, isUserAuthenticated: true });
      },
      userLogout: () => {
        set({ userInfo: null, isUserAuthenticated: false });
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
        isAdminAuthenticated: state.isAdminAuthenticated,
        userInfo: state.userInfo,
        isUserAuthenticated: state.isUserAuthenticated,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

export default useStore;
