import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiEdit3,
  FiFileText,
  FiMessageSquare,
  FiMenu,
  FiLogOut,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import useStore from "../store";
import clsx from "clsx";
import { ADMIN_ROUTES } from "../utils/routes";

const {
  DASHBOARD,
  USERS,
  POSTS,
  COMPOSE_POST,
  FEEDBACKS,
  LOGIN: ADMIN_LOGIN,
} = ADMIN_ROUTES;

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { sidebarCollapsed, toggleSidebar, user, logout } = useStore();

  const navigation = [
    { name: "Dashboard", href: DASHBOARD, icon: FiHome },
    { name: "Compose", href: COMPOSE_POST, icon: FiEdit3 },
    { name: "Posts", href: POSTS, icon: FiFileText },
    { name: "Users", href: USERS, icon: FiUsers },
    { name: "Feedbacks", href: FEEDBACKS, icon: FiMessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate(ADMIN_LOGIN);
  };

  return (
    <aside
      className={clsx(
        "bg-white shadow-lg transition-all duration-300 flex flex-col min-h-screen",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div
        className={clsx(
          "border-b border-gray-200",
          sidebarCollapsed ? "p-2" : "p-4"
        )}
      >
        <div
          className={clsx(
            "flex items-center",
            sidebarCollapsed ? "justify-center" : "justify-between"
          )}
        >
          {!sidebarCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="font-semibold text-gray-900">Admin Panel</span>
            </div>
          )}
          <button
            onClick={toggleSidebar}
            className={clsx(
              "p-2 rounded-md hover:bg-gray-100 transition-colors",
              sidebarCollapsed && "w-full flex justify-center"
            )}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <FiMenu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* User Info */}
      <div
        className={clsx(
          "border-b border-gray-200",
          sidebarCollapsed ? "p-2" : "p-4"
        )}
      >
        <div
          className={clsx(
            "flex items-center",
            sidebarCollapsed ? "justify-center" : "space-x-3"
          )}
        >
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
            <FiUser className="w-5 h-5 text-gray-600" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email || "admin@co.in"}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className={clsx("flex-1", sidebarCollapsed ? "p-2" : "p-4")}>
        <ul className="space-y-2">
          {navigation.map((item) => {
            // normalize to absolute path (ensure leading slash)
            const to =
              item.href && item.href.startsWith("/")
                ? item.href
                : `/${item.href}`;
            const isActive = location.pathname === to;
            return (
              <li key={item.name}>
                <Link
                  to={to}
                  className={clsx(
                    "flex items-center rounded-md text-sm font-medium transition-colors group relative",
                    sidebarCollapsed ? "p-3 justify-center" : "px-3 py-2",
                    isActive
                      ? "bg-primary-50 text-primary-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  title={sidebarCollapsed ? item.name : ""}
                >
                  <item.icon
                    className={clsx(
                      "w-5 h-5 flex-shrink-0",
                      !sidebarCollapsed && "mr-3"
                    )}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate">{item.name}</span>
                  )}
                  {isActive && !sidebarCollapsed && (
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary-600 rounded-l"></div>
                  )}
                  {isActive && sidebarCollapsed && (
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-primary-600 rounded-l"></div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div
        className={clsx(
          "border-t border-gray-200",
          sidebarCollapsed ? "p-2" : "p-4"
        )}
      >
        <button
          onClick={handleLogout}
          className={clsx(
            "flex items-center w-full text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors",
            sidebarCollapsed ? "p-3 justify-center" : "px-3 py-2"
          )}
          title={sidebarCollapsed ? "Logout" : ""}
        >
          <FiLogOut
            className={clsx(
              "w-5 h-5 flex-shrink-0",
              !sidebarCollapsed && "mr-3"
            )}
          />
          {!sidebarCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
