import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { ADMIN_ROUTES } from "../utils/routes";

const {
  HOME: ADMIN_HOME,
  DASHBOARD,
  USERS,
  USER_DETAIL,
  POSTS,
  COMPOSE_POST,
  FEEDBACKS,
  FEEDBACK_DETAIL,
} = ADMIN_ROUTES;

export default function Breadcrumbs() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const breadcrumbNameMap = {
    dashboard: DASHBOARD,
    compose: COMPOSE_POST,
    posts: POSTS,
    feedbacks: FEEDBACKS,
    login: "Login",
    register: "Register",
  };

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      <Link to={DASHBOARD} className="flex items-center hover:text-gray-900">
        <FiHome className="w-4 h-4" />
      </Link>

      {pathnames.map((pathname, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
        const isLast = index === pathnames.length - 1;
        const breadcrumbName = breadcrumbNameMap[pathname] || pathname;

        return (
          <React.Fragment key={pathname}>
            <FiChevronRight className="w-4 h-4 text-gray-400" />
            {isLast ? (
              <span className="font-medium text-gray-900">
                {breadcrumbName}
              </span>
            ) : (
              <Link to={routeTo} className="hover:text-gray-900 capitalize">
                {breadcrumbName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
