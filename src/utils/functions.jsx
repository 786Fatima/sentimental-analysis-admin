import { FiUserCheck, FiUserX } from "react-icons/fi";
import { STATUS } from "./constants";

export const capitalizeWords = (input) => {
  if (input == null || typeof input !== "string") return input;
  const str = String(input).trim();
  if (str.length === 0) return "";

  return str
    .split(/\s+/)
    .map((word) =>
      // Preserve separators like hyphen and apostrophe but capitalize each segment
      word
        .split(/([-'])/)
        .map((seg) => {
          if (seg === "-" || seg === "'") return seg;
          return seg.charAt(0).toUpperCase() + seg.slice(1).toLowerCase();
        })
        .join("")
    )
    .join(" ")
    .replaceAll("_", " ");
};

export const getStatusBadge = (status) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
        status === STATUS.ACTIVE
          ? "bg-green-100 text-green-800"
          : "bg-red-100 text-red-800"
      }`}
    >
      {status === STATUS.ACTIVE ? (
        <FiUserCheck className="w-3 h-3 mr-1" />
      ) : (
        <FiUserX className="w-3 h-3 mr-1" />
      )}
      {capitalizeWords(status)}
    </span>
  );

  // if (status === STATUS.ONLINE) {
  //   return (
  //     <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
  //       <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
  //       Online
  //     </span>
  //   );
  // }

  // return (
  //   <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
  //     <div className="w-2 h-2 bg-gray-500 rounded-full mr-1"></div>
  //     Offline
  //   </span>
  // );
};

export const getAPIRequestHeaders = (token = null) => {
  const headerValue = {
    "Content-Type": "application/json",
  };
  if (!token) return headerValue;
  return {
    ...headerValue,
    Authorization: `Bearer ${token}`,
  };
};

// export const getRoleBadge = (role) => {
//   const styles = {
//     admin: "bg-purple-100 text-purple-800",
//     moderator: "bg-blue-100 text-blue-800",
//     user: "bg-gray-100 text-gray-800",
//   };

//   return (
//     <span
//       className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
//         styles[role] || styles.user
//       }`}
//     >
//       {role.charAt(0).toUpperCase() + role.slice(1)}
//     </span>
//   );
// };

// const formatLastActive = (timestamp) => {
//   const date = new Date(timestamp);
//   const now = new Date();
//   const diffMs = now - date;
//   const diffMins = Math.floor(diffMs / 60000);
//   const diffHours = Math.floor(diffMins / 60);
//   const diffDays = Math.floor(diffHours / 24);

//   if (diffMins < 60) {
//     return `${diffMins}m ago`;
//   } else if (diffHours < 24) {
//     return `${diffHours}h ago`;
//   } else {
//     return `${diffDays}d ago`;
//   }
// };
