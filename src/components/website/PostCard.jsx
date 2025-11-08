import React, { useState } from 'react';
import { FiHeart, FiEye, FiMessageCircle, FiEdit, FiTrash2, FiPower, FiMoreHorizontal } from 'react-icons/fi';
import clsx from 'clsx';

export default function PostCard({ post, onEdit, onDelete, onToggleStatus }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleEdit = () => {
    onEdit(post);
    setShowMenu(false);
  };

  const handleDelete = () => {
    onDelete(post.id);
    setShowMenu(false);
  };

  const handleToggleStatus = () => {
    onToggleStatus(post.id);
    setShowMenu(false);
  };

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
      {/* Post Image */}
      {post.images && post.images.length > 0 && (
        <div className="relative">
          <img
            src={post.images[0]}
            alt={post.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {post.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
              +{post.images.length - 1} more
            </div>
          )}
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <FiMoreHorizontal className="w-5 h-5 text-gray-500" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FiEdit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={handleToggleStatus}
                  className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <FiPower className="w-4 h-4" />
                  <span>{post.isActive ? 'Disable' : 'Enable'}</span>
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{post.tags.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <FiHeart className="w-4 h-4" />
              <span>{post.likes}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiEye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            <div className="flex items-center space-x-1">
              <FiMessageCircle className="w-4 h-4" />
              <span>{post.comments}</span>
            </div>
          </div>
          
          <div className={clsx(
            'px-2 py-1 rounded-full text-xs font-medium',
            post.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          )}>
            {post.isActive ? 'Active' : 'Disabled'}
          </div>
        </div>
      </div>
    </div>
  );
}
