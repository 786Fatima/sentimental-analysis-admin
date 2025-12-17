import DOMPurify from "dompurify";
import { useState } from "react";
import {
  FiBarChart,
  FiEye,
  FiHeart,
  FiMessageCircle,
  FiX,
} from "react-icons/fi";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  useGetPostById,
  useGetPostSentimentById,
} from "../../services/admin-panel/postServices";
import { ADMIN_ROUTES, URL_PARAMS } from "../../utils/routes";
import { ClipLoader } from "react-spinners";

export default function FeedbackDetail() {
  const { [URL_PARAMS.POST_ID]: postId } = useParams();
  const navigate = useNavigate();

  const {
    data: postDetail,
    isLoading: postIsLoading,
    isError: postIsError,
  } = useGetPostById(postId);

  const [showAnalysis, setShowAnalysis] = useState(false);

  if (postIsLoading) return <LoadingSpinner isLoading={postIsLoading} />;

  // if (postIsError) return <ErrorScreen />;

  const handleGoBack = () => {
    navigate(ADMIN_ROUTES.FEEDBACKS);
  };

  const handleAnalyze = () => {
    setShowAnalysis(true);
  };

  const postComments = postDetail?.feedback?.filter((fb) => !!fb?.comment);

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            className="text-primary-600 hover:text-primary-700 font-medium"
            onClick={handleGoBack}
          >
            ← Back to Posts
          </button>
          {postComments?.length > 0 && (
            <button
              onClick={handleAnalyze}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center space-x-2"
            >
              <FiBarChart className="w-4 h-4" />
              <span>Analyse</span>
            </button>
          )}
        </div>

        {/* Post Details */}
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {postDetail?.title}
          </h1>
          <p
            className="text-gray-700 mb-4"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(postDetail?.description || ""),
            }}
          />

          {postDetail?.images && postDetail?.images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {postDetail?.images?.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${postDetail?.title} - ${index + 1}`}
                  className="w-full h-48 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span className="flex items-center space-x-1">
              <FiHeart className="w-4 h-4" />
              <span>{postDetail?.feedbackStats?.totalLikes} likes</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiEye className="w-4 h-4" />
              <span>{postDetail?.feedbackStats?.totalViews} views</span>
            </span>
            <span className="flex items-center space-x-1">
              <FiMessageCircle className="w-4 h-4" />
              <span>{postComments?.length} comments</span>
            </span>
          </div>
        </div>

        {/* Comments */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Comments ({postComments?.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {postComments?.map((feedback) => (
              <div key={feedback?._id} className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">
                      {feedback?.user?.fullName?.toString().charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {feedback?.user?.fullName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(feedback?.postedAt).toLocaleDateString()}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          feedback?.sentiment === "positive"
                            ? "bg-green-100 text-green-800"
                            : feedback?.sentiment === "negative"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {feedback?.sentiment}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm">{feedback?.comment}</p>
                    {/* <div className="flex items-center space-x-2 mt-2">
                      <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
                        <FiHeart className="w-4 h-4" />
                        <span className="text-xs">{feedback?.likes}</span>
                      </button>
                    </div> */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* {loadedComments < postComments.length && (
            <div className="p-6 text-center border-t">
              <button
                onClick={loadMoreComments}
                className="px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
              >
                Load More Comments ({postComments.length - loadedComments}{" "}
                remaining)
              </button>
            </div>
          )} */}
        </div>
      </div>
      {showAnalysis && (
        <AnalysisModal postId={postId} setShowAnalysis={setShowAnalysis} />
      )}
    </>
  );
}

const AnalysisModal = ({ postId = null, setShowAnalysis = () => {} }) => {
  const {
    data: sentimentData,
    isFetching: postSentimentIsLoading,
    isError: postSentimentIsError,
  } = useGetPostSentimentById(postId);

  const positive = sentimentData?.sentiment?.counts?.positive ?? 0;
  const neutral = sentimentData?.sentiment?.counts?.neutral ?? 0;
  const negative = sentimentData?.sentiment?.counts?.negative ?? 0;

  // Always trust sentiment counts
  const total = positive + neutral + negative;

  // SVG geometry
  const radius = 80;
  const circumference = 2 * Math.PI * radius;

  // Convert count → arc length
  const positiveLen = (positive / total) * circumference;
  const neutralLen = (neutral / total) * circumference;
  const negativeLen = (negative / total) * circumference;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            Sentiment Analysis
          </h2>
          <button
            onClick={() => setShowAnalysis(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        {postSentimentIsLoading ? (
          <div className="w-full aspect-[16/9] flex flex-row justify-center items-center space-y-4">
            <ClipLoader color="#0ea5e9" size={40} />
            {/* <p className="text-gray-600 font-medium">Loading...</p> */}
          </div>
        ) : (
          <div className="p-6 space-y-6">
            {/* Sentiment Chart */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Sentiment Analysis</h3>
              <div className="flex items-center justify-center mb-6">
                <div className="relative w-48 h-48">
                  {/* Pie Chart Simulation */}
                  <svg className="w-full h-full" viewBox="0 0 200 200">
                    {/* Positive */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke="#10b981"
                      strokeWidth="40"
                      strokeDasharray={`${positiveLen} ${
                        circumference - positiveLen
                      }`}
                      transform="rotate(-90 100 100)"
                    />

                    {/* Neutral */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke="#f59e0b"
                      strokeWidth="40"
                      strokeDasharray={`${neutralLen} ${
                        circumference - neutralLen
                      }`}
                      strokeDashoffset={-positiveLen}
                      transform="rotate(-90 100 100)"
                    />

                    {/* Negative */}
                    <circle
                      cx="100"
                      cy="100"
                      r={radius}
                      fill="transparent"
                      stroke="#ef4444"
                      strokeWidth="40"
                      strokeDasharray={`${negativeLen} ${
                        circumference - negativeLen
                      }`}
                      strokeDashoffset={-(positiveLen + neutralLen)}
                      transform="rotate(-90 100 100)"
                    />

                    {/* Center text */}
                    <text
                      x="100"
                      y="105"
                      textAnchor="middle"
                      className="text-2xl font-bold fill-gray-900"
                    >
                      {total}
                    </text>
                  </svg>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-sm font-medium">Positive</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    {(positive / total) * 100}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                    <span className="text-sm font-medium">Neutral</span>
                  </div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {(neutral / total) * 100}%
                  </p>
                </div>
                <div>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <div className="w-4 h-4 bg-red-500 rounded"></div>
                    <span className="text-sm font-medium">Negative</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">
                    {(negative / total) * 100}%
                  </p>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Summary</h3>
              <p className="text-gray-700">
                {sentimentData?.sentiment?.summary || "No summary available."}
              </p>
            </div>

            {/* Highlights */}
            {/* <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Highlights</h3>
            <div className="space-y-4">
              <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Most Liked Comment
                  </h4>
                  <div className="bg-white p-3 rounded border-l-4 border-primary-500">
                    <p className="text-sm text-gray-700">
                      "{highlights.mostLikedComment?.comment}"
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {highlights.mostLikedComment?.likes} likes
                    </p>
                  </div>
                </div>

              <div>
                  <h4 className="font-medium text-gray-900 mb-2">Key Topics</h4>
                  <div className="flex flex-wrap gap-2">
                    {highlights.topKeywords.map((keyword, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                      >
                        {keyword.word} ({keyword.count})
                      </span>
                    ))}
                  </div>
                </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">
                    {highlights.totalEngagement}
                  </p>
                  <p className="text-sm text-gray-600">
                    Total Likes on Comments
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{total}</p>
                  <p className="text-sm text-gray-600">Total Comments</p>
                </div>
              </div>
            </div>
          </div> */}
          </div>
        )}
      </div>
    </div>
  );
};
