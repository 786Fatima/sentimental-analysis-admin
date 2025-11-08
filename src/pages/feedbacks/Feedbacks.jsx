import { FiEye, FiHeart, FiMessageCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useGetAllPosts } from "../../services/postServices";
import { ADMIN_ROUTES } from "../../utils/routes";

export default function Feedbacks() {
  const navigate = useNavigate();
  const {
    data: posts,
    isLoading: postIsLoading,
    isError: postIsError,
  } = useGetAllPosts();

  if (postIsLoading) return <LoadingSpinner isLoading={postIsLoading} />;

  // if (postIsError) return <ErrorScreen />;

  const handleViewPostDetail = (postId) => {
    navigate(`${ADMIN_ROUTES.FEEDBACK_DETAIL}/${postId}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Feedbacks</h1>
        <p className="text-gray-600">
          Analyze post engagement and user sentiment
        </p>
      </div>

      {/* Posts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts?.map((post) => (
          <div
            key={post?._id}
            onClick={() => handleViewPostDetail(post?._id)}
            className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer"
          >
            {post?.images && post?.images.length > 0 && (
              <img
                src={post?.images[0]}
                alt={post?.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
            )}

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {post?.title}
              </h3>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <FiHeart className="w-4 h-4" />
                    {post?.feedbackStats?.totalLikes > 0 && (
                      <span>{post?.feedbackStats?.totalLikes}</span>
                    )}
                  </span>
                  <span className="flex items-center space-x-1">
                    <FiEye className="w-4 h-4" />
                    {post?.feedbackStats?.totalViews > 0 && (
                      <span>{post?.feedbackStats?.totalViews}</span>
                    )}
                  </span>
                </div>
                <span className="flex items-center space-x-1 text-primary-600 font-medium">
                  <FiMessageCircle className="w-4 h-4" />
                  <span>View Details</span>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
