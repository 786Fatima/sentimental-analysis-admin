import { useState } from "react";
import { FiEdit, FiPlus, FiTrash2, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  useCreateTag,
  useDeleteTag,
  useGetAllTags,
  useUpdateTag,
} from "../services/admin-panel/tagServices";
import LoadingSpinner from "./LoadingSpinner";

export default function TagModal({ open, onClose }) {
  const {
    data: tags,
    isLoading: isLoadingAllTags,
    isError: errorInAllTags,
  } = useGetAllTags();
  const { mutate: createTag, isLoading: isCreatingTag } = useCreateTag();
  const { mutate: updateTag, isLoading: isUpdatingTag } = useUpdateTag();
  const { mutate: deleteTag, isLoading: isDeletingTag } = useDeleteTag();

  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    color: "#3b82f6",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Tag name is required");
      return;
    }

    if (editingTag) {
      await updateTag(
        { id: formData?.id, data: formData },
        {
          onSuccess: () => {
            // Reset form
            setFormData({ name: "", color: "#3b82f6" });
            setEditingTag(null);
          },
        }
      );
    } else {
      // Create new tag
      const newTag = {
        name: formData.name,
        color: formData.color,
      };
      await createTag(newTag, {
        onSuccess: () => {
          // Reset form
          setFormData({ name: "", color: "#3b82f6" });
          setEditingTag(null);
        },
      });
    }
  };

  const handleEdit = (tag) => {
    setEditingTag(tag);
    setFormData({
      id: tag?._id,
      name: tag?.name,
      color: tag?.color,
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tag?")) {
      await deleteTag(id);
    }
  };

  const handleCancel = () => {
    setFormData({ name: "", color: "#3b82f6" });
    setEditingTag(null);
  };

  if (!open) return null;

  if (isLoadingAllTags) return <LoadingSpinner isLoading={isLoadingAllTags} />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Manage Tags</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {/* Add/Edit Form */}
          <form
            onSubmit={handleSubmit}
            className="mb-6 p-4 bg-gray-50 rounded-lg"
          >
            <h3 className="text-lg font-medium mb-4">
              {editingTag ? "Edit Tag" : "Add New Tag"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="tagName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Tag Name
                </label>
                <input
                  type="text"
                  id="tagName"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter tag name..."
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="tagColor"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    id="tagColor"
                    value={formData.color}
                    onChange={(e) =>
                      setFormData({ ...formData, color: e.target.value })
                    }
                    className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <div
                    className="w-10 h-10 rounded-md border border-gray-300"
                    style={{ backgroundColor: formData.color }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 mt-4">
              <button
                type="submit"
                disabled={isCreatingTag || isUpdatingTag || isDeletingTag}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center space-x-2"
              >
                <span>{editingTag ? "Update Tag" : "Add Tag"}</span>
              </button>

              {editingTag && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* Tags List */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Existing Tags ({tags?.length})
            </h3>

            {tags?.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No tags created yet
              </p>
            ) : (
              <div className="space-y-2">
                {tags?.map((tag) => (
                  <div
                    key={tag?._id}
                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: tag?.color }}
                      />
                      <span className="font-medium text-gray-900">
                        #{tag?.name}
                      </span>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>{tag?.postsCount} posts</span>
                        {/* <span>{tag?.likesCount} likes</span>
                        <span>{tag?.commentsCount} comments</span> */}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(tag)}
                        disabled={isUpdatingTag || isDeletingTag}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(tag?._id)}
                        disabled={isUpdatingTag || isDeletingTag}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
