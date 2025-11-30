import React, { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Admin Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ComposeNewPost from "./pages/posts/ComposeNewPost";
import Posts from "./pages/posts/Posts";
import Feedbacks from "./pages/feedbacks/Feedbacks";
import Users from "./pages/users/Users";
import UserDetail from "./pages/users/UserDetail";
import FeedbackDetail from "./pages/feedbacks/FeedbackDetail";

// User Pages
import HomePage from "./pages/website/HomePage";
import UserLogin from "./pages/website/UserLogin";
import UserRegister from "./pages/website/UserRegister";
import PostsList from "./pages/website/PostsList";
import PostDetail from "./pages/website/PostDetail";

// Layout Components
import Sidebar from "./components/Sidebar";
import Breadcrumbs from "./components/Breadcrumbs";
import UserHeader from "./components/website/UserHeader";
import UserFooter from "./components/website/UserFooter";
import LoadingSpinner from "./components/LoadingSpinner";

// Store
import useStore from "./store";
import { ADMIN_ROUTES, URL_PARAMS, WEBSITE_ROUTES } from "./utils/routes";

const queryClient = new QueryClient();

const {
  HOME: ADMIN_HOME,
  LOGIN: ADMIN_LOGIN,
  DASHBOARD,
  USERS,
  USER_DETAIL,
  POSTS,
  COMPOSE_POST,
  FEEDBACKS,
  FEEDBACK_DETAIL,
} = ADMIN_ROUTES;

const {
  HOME: USER_HOME,
  LOGIN: USER_LOGIN,
  REGISTER: USER_REGISTER,
  POSTS: USER_POSTS,
  POST_DETAIL: USER_POST_DETAIL,
} = WEBSITE_ROUTES;

const { USER_ID, POST_ID } = URL_PARAMS;

// Admin Layout Wrapper
function AdminLayout({ children }) {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-6">
          <Breadcrumbs />
          {children}
        </div>
      </main>
    </div>
  );
}

// User Layout Wrapper
function UserLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <UserHeader />
      <main className="flex-1">{children}</main>
      <UserFooter />
    </div>
  );
}

export default function App() {
  const { isAdminAuthenticated, isLoading, fetchData } = useStore();

  const c = true;
  // Load initial data once
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchData("users"),
        fetchData("posts"),
        fetchData("tags"),
        fetchData("interactions"),
        fetchData("comments"),
      ]);
    };
    loadData();
  }, [fetchData]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* ---------------------- USER ROUTES ---------------------- */}
          <Route
            path={USER_HOME}
            element={
              <UserLayout>
                <HomePage />
              </UserLayout>
            }
          />

          <Route
            path={USER_LOGIN}
            element={
              <UserLayout>
                <UserLogin />
              </UserLayout>
            }
          />
          <Route
            path={USER_REGISTER}
            element={
              <UserLayout>
                <UserRegister />
              </UserLayout>
            }
          />
          <Route
            path={USER_POSTS}
            element={
              <UserLayout>
                <PostsList />
              </UserLayout>
            }
          />
          <Route
            path={USER_POST_DETAIL + `/:${POST_ID}`}
            element={
              <UserLayout>
                <PostDetail />
              </UserLayout>
            }
          />

          {/* ---------------------- ADMIN AUTH ROUTES ---------------------- */}
          <Route
            path={ADMIN_HOME}
            element={
              isAdminAuthenticated ? (
                <Navigate to={DASHBOARD} />
              ) : (
                <Navigate to={ADMIN_LOGIN} />
              )
            }
          />
          <Route
            path={`${ADMIN_HOME}/*`}
            element={<Navigate to={ADMIN_LOGIN} />}
          />
          <Route
            path={ADMIN_LOGIN}
            element={
              isAdminAuthenticated ? <Navigate to={DASHBOARD} /> : <Login />
            }
          />

          {(isAdminAuthenticated || c) && (
            <>
              {/* ---------------------- ADMIN PROTECTED ROUTES ---------------------- */}
              <Route
                path={DASHBOARD}
                element={
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                }
              />
              <Route
                path={COMPOSE_POST}
                element={
                  <AdminLayout>
                    <ComposeNewPost />
                  </AdminLayout>
                }
              />
              <Route
                path={POSTS}
                element={
                  <AdminLayout>
                    <Posts />
                  </AdminLayout>
                }
              />
              <Route
                path={USERS}
                element={
                  <AdminLayout>
                    <Users />
                  </AdminLayout>
                }
              />
              <Route
                path={USER_DETAIL + `/:${USER_ID}`}
                element={
                  <AdminLayout>
                    <UserDetail />
                  </AdminLayout>
                }
              />
              <Route
                path={FEEDBACKS}
                element={
                  <AdminLayout>
                    <Feedbacks />
                  </AdminLayout>
                }
              />
              <Route
                path={FEEDBACK_DETAIL + `/:${POST_ID}`}
                element={
                  <AdminLayout>
                    <FeedbackDetail />
                  </AdminLayout>
                }
              />
            </>
          )}
        </Routes>

        <LoadingSpinner isLoading={isLoading} />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
