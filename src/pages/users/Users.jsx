import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiFilter,
  FiUser,
  FiMapPin,
  FiPhone,
  FiMail,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { toast } from "react-toastify";
import useStore from "../../store";
import { useGetAllUsers } from "../../services/admin-panel/userServices";
import LoadingSpinner from "../../components/LoadingSpinner";
import { STATUS } from "../../utils/constants";
import { capitalizeWords, getStatusBadge } from "../../utils/functions";
import Avatar from "../../components/Avatar";
import { ADMIN_ROUTES } from "../../utils/routes";

export default function Users() {
  const { setUsers } = useStore();
  const {
    data: users,
    isLoading: userIsLoading,
    isError: userIsError,
  } = useGetAllUsers();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  // const [roleFilter, setRoleFilter] = useState("all");

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    if (!userIsLoading && users) {
      return users?.filter((user) => {
        const matchesSearch =
          searchTerm === "" ||
          user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user?.mobileNumber?.includes(searchTerm) ||
          user?.location?.city
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          user?.location?.state
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase());

        const matchesStatus =
          statusFilter === "all" || statusFilter === user?.status;

        // const matchesRole = roleFilter === "all" || user.role === roleFilter;

        return matchesSearch && matchesStatus;
        // && matchesRole
      });
    } else {
      return [];
    }
  }, [userIsLoading, users, searchTerm, statusFilter]);

  if (userIsLoading) return <LoadingSpinner isLoading={userIsLoading} />;

  // if (userIsError) return <ErrorScreen />;

  const handleToggleUserStatus = (userId) => {
    const updatedUsers = users.map((user) =>
      user.id === userId ? { ...user, isEnabled: !user.isEnabled } : user
    );
    setUsers(updatedUsers);
    const user = users.find((u) => u.id === userId);
    toast.success(
      `User ${user.isEnabled ? "disabled" : "enabled"} successfully`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="mt-1 text-gray-600">
            Manage and monitor all user accounts
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiUsers className="w-4 h-4" />
            <span>{filteredUsers.length} users found</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                placeholder="Search by name, email, phone, or location..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="all">All</option>
              {Object.values(STATUS).map((status) => (
                <option key={status} value={status}>
                  <span>{capitalizeWords(status)}</span>
                </option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          {/* <div>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="moderator">Moderator</option>
              <option value="admin">Admin</option>
            </select>
          </div> */}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Active
                </th> */}
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Avatar
                        imageUrl={user?.profilePicture}
                        name={user?.fullName}
                      />
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user?.fullName}
                        </div>
                        {/* <div className="text-sm text-gray-500">
                          @{user?.username}
                        </div>
                        <div className="mt-1">
                          {getRoleBadge(user?.fullName)}
                        </div> */}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-900">
                        <FiMail className="w-3 h-3 mr-2 text-gray-400" />
                        {user?.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <FiPhone className="w-3 h-3 mr-2 text-gray-400" />
                        {user.mobileNumber}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <FiMapPin className="w-3 h-3 mr-2 text-gray-400" />
                      <div>
                        <div>{user?.location?.city}</div>
                        <div className="text-xs text-gray-500">
                          {capitalizeWords(user?.location?.state)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="space-y-1">
                      {getStatusBadge(user?.status)}
                    </div>
                  </td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-500">
                      <FiClock className="w-3 h-3 mr-2" />
                      {formatLastActive(user.lastActive)}
                    </div>
                  </td> */}
                  <td className="whitespace-nowrap text-sm font-medium">
                    <div className="flex justify-center items-center space-x-2">
                      <Link
                        to={`${ADMIN_ROUTES.USER_DETAIL}/${user?._id}`}
                        className="text-primary-600 hover:text-primary-900 p-2 hover:bg-primary-50 rounded-md transition-colors"
                        title="View Details"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      {/* <button
                        onClick={() => handleToggleUserStatus(user?._id)}
                        className={`p-2 rounded-md transition-colors ${
                          user.isEnabled
                            ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                            : "text-green-600 hover:text-green-900 hover:bg-green-50"
                        }`}
                        title={user.isEnabled ? "Disable User" : "Enable User"}
                      >
                        {user.isEnabled ? (
                          <FiUserX className="w-4 h-4" />
                        ) : (
                          <FiUserCheck className="w-4 h-4" />
                        )}
                      </button> */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <FiUser className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search criteria or filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
