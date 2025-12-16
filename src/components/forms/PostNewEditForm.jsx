import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  FiBold,
  FiImage,
  FiItalic,
  FiList,
  FiUnderline,
  FiUpload,
  FiX,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import {
  useCreatePost,
  useGetPostById,
  useUpdatePost,
} from "../../services/admin-panel/postServices";
import { useGetAllTags } from "../../services/admin-panel/tagServices";
import { ADMIN_ROUTES } from "../../utils/routes";
import LoadingSpinner from "../LoadingSpinner";
import AppPageTitle from "../breadcrumbs/AppPageTitle";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string().required("Description is required"),
  tags: yup.array().of(yup.string()).min(1, "At least one tag is required"),
  images: yup.array().of(yup.mixed()),
});

export default function PostNewEditForm() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const isEdit = Boolean(postId);

  const { mutate: createPost, isLoading: isCreatingPost } = useCreatePost();
  const { mutate: updatePost, isLoading: isUpdatingPost } = useUpdatePost();

  const {
    data: post,
    isLoading: postIsLoading,
    isError: postIsError,
  } = useGetPostById(postId);
  const {
    data: tags,
    isLoading: tagIsLoading,
    isError: tagIsError,
  } = useGetAllTags(postId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      title: post?.title || "",
      description: post?.description || "",
      tags: post?.tags || [],
      images: post?.images || [],
    },
  });

  const values = watch();

  useEffect(() => {
    if (isEdit && post) {
      setValue("title", post?.title || "");
      setValue("description", post?.description || "");
      setValue("tags", post?.tags || []);
      setValue("images", post?.images || []);
    }
  }, [isEdit, post]);

  //---------------------------------------------------------------------------
  // local loading state removed in favor of isCreatingPost / isUpdatingPost
  const [dragOver, setDragOver] = useState(false);
  const editorRef = useRef(null);

  if (postIsLoading || tagIsLoading) return <LoadingSpinner />;

  if (postIsError || tagIsError) return <ErrorScreen />;

  const handleDescriptionChange = (e) => {
    setValue("description", e.target.innerHTML);
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    // Handle common shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case "b":
          e.preventDefault();
          executeCommand("bold");
          break;
        case "i":
          e.preventDefault();
          executeCommand("italic");
          break;
        case "u":
          e.preventDefault();
          executeCommand("underline");
          break;
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (values?.images?.length + imageFiles.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const newImages = imageFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: Date.now() + Math.random(),
    }));

    setValue("images", [...values.images, ...newImages]);
  };

  const handleImageRemove = (imageId) => {
    const imageToRemove = values?.images.find((img) => img.id === imageId);
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    setValue(
      "images",
      values.images.filter((img) => img.id !== imageId)
    );
  };

  //----------------------------------------------------------------------------
  const onSubmit = async (data) => {
    const formData = {
      title: data?.title,
      description: data?.description,
      tags: data?.tags,
      images: [],
    };

    try {
      if (isEdit && postId) {
        await updatePost(
          { postId, data },
          {
            onSuccess: () => {
              navigate(ADMIN_ROUTES.POSTS);
            },
          }
        );
      } else {
        await createPost(formData, {
          onSuccess: () => {
            navigate(ADMIN_ROUTES.POSTS);
          },
        });
      }
    } catch (error) {
      console.log("error", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  return (
    <>
      <AppPageTitle
        title={isEdit ? "Edit Post" : "Compose Post"}
        description={
          isEdit
            ? "Edit an existing post."
            : "Create a new post to share with your audience."
        }
      />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Title *
            </label>
            <input
              type="text"
              {...register("title")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="Enter post title..."
            />
            {errors?.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>

            {/* Rich Text Toolbar */}
            <div className="border border-gray-300 rounded-t-md bg-gray-50 px-3 py-2 flex items-center space-x-2">
              <button
                type="button"
                onClick={() => executeCommand("bold")}
                className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Bold (Ctrl+B)"
              >
                <FiBold className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand("italic")}
                className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Italic (Ctrl+I)"
              >
                <FiItalic className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand("underline")}
                className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Underline (Ctrl+U)"
              >
                <FiUnderline className="w-4 h-4" />
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <button
                type="button"
                onClick={() => executeCommand("insertUnorderedList")}
                className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Bullet List"
              >
                <FiList className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => executeCommand("insertOrderedList")}
                className="p-1 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                title="Numbered List"
              >
                <span className="text-sm font-bold">1.</span>
              </button>
              <div className="w-px h-4 bg-gray-300"></div>
              <select
                onChange={(e) => executeCommand("formatBlock", e.target.value)}
                className="text-sm border-0 bg-transparent focus:outline-none"
                title="Heading"
              >
                <option value="div">Normal</option>
                <option value="h1">Heading 1</option>
                <option value="h2">Heading 2</option>
                <option value="h3">Heading 3</option>
              </select>
            </div>

            {/* Rich Text Editor */}
            <div
              ref={editorRef}
              contentEditable
              onInput={handleDescriptionChange}
              onKeyDown={handleKeyDown}
              className="w-full min-h-[150px] p-3 border border-t-0 border-gray-300 rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
              data-placeholder="Write your post description..."
              suppressContentEditableWarning={true}
            />
            {errors?.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.description.message}
              </p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                {/* <FaBriefcase className="h-5 w-5 text-gray-400" /> */}
              </div>
              <select
                multiple
                {...register("tags")}
                className={`pl-10 w-full border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                  errors?.tags ? "border-red-500" : "border-gray-300"
                }`}
                // disabled={isView}
              >
                <option value="" className="uppercase">
                  Select Tag
                </option>
                {tags?.map((tag) => (
                  <option key={tag?._id} value={tag?._id}>
                    {tag?.name}
                  </option>
                ))}
              </select>
            </div>
            {errors?.tags && (
              <p className="mt-1 text-sm text-red-500">
                {errors?.tags.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images (Max 5)
            </label>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragOver
                  ? "border-primary-400 bg-primary-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileInput}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FiImage className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Drag and drop images here, or click to select
              </p>
              <p className="text-xs text-gray-500">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>

            {/* Image Preview */}
            {!isEdit && values?.images?.length > 0 && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {values?.images?.map((image) => (
                  <div key={image.id} className="relative group">
                    <img
                      src={image.url}
                      alt="Preview"
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleImageRemove(image.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isCreatingPost || isUpdatingPost}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            <FiUpload className="w-4 h-4" />
            <span>
              {isCreatingPost || isUpdatingPost
                ? "Publishing..."
                : "Publish Post"}
            </span>
          </button>
        </div>
      </form>
    </>
  );
}
