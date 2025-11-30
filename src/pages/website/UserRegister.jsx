import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff, FiLock, FiMail, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import PageTransition from "../../components/website/PageTransition";
import { useRegisterUser } from "../../services/website/userServices";
import { WEBSITE_ROUTES } from "../../utils/routes";
import { DEFAULT_COUNTRY, INDIAN_STATES } from "../../utils/constants";
import { capitalizeWords } from "../../utils/functions";

const schema = yup.object().shape({
  fullName: yup.string().required("Name is required"),
  mobileNumber: yup
    .number()
    .typeError("Mobile number must be a number")
    .required("Mobile number is required")
    .min(10, "Mobile number must be at least 10 digits"),
  email: yup.string().email("Invalid email").required("Email is required"),
  location: yup.object().shape({
    country: yup.string().required("Country is required"),
    state: yup.string().required("State is required"),
    city: yup.string().required("City is required"),
    pincode: yup
      .number()
      .typeError("Pincode must be a number")
      .required("Pincode is required")
      .min(6, "Pincode must be at least 6 digits"),
  }),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm Password is required"),
});

export default function UserRegister() {
  const navigate = useNavigate();

  const { mutate: registerUser, isLoading: isRegisteringUser } =
    useRegisterUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      mobileNumber: "",
      email: "",
      location: { country: DEFAULT_COUNTRY, state: "", city: "", pincode: "" },
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { HOME, LOGIN } = WEBSITE_ROUTES;

  const onSubmit = async (data) => {
    try {
      await registerUser(data, {
        onSuccess: () => {
          navigate(LOGIN);
        },
      });
    } catch (error) {
      console.error(error);
      toast.error(error?.message || "Registration failed. Please try again.");
    }
    // finally {

    // }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              <span className="text-blue-600">Senti</span>Post
            </h1>
            <p className="text-gray-600">Create your account to get started.</p>
          </div>

          {/* Register Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Create Account
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    {...register("fullName")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors?.fullName && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.fullName.message}
                  </p>
                )}
              </div>

              {/* Mobile Number Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    minLength={10}
                    maxLength={10}
                    {...register("mobileNumber")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors?.mobileNumber && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.mobileNumber.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    {...register("email")}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors?.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors?.password && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    {...register("confirmPassword")}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors?.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors?.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Location Fields - two column on md+ */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      {...register("location.country")}
                      readOnly
                      value={DEFAULT_COUNTRY}
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors?.location?.country && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location.country.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <select
                      {...register("location.state")}
                      className={`w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors?.location?.state
                          ? "border-red-500"
                          : "border-gray-300"
                      }`}
                      // disabled={isView}
                    >
                      <option value="" className="uppercase">
                        Select State
                      </option>
                      {Object.values(INDIAN_STATES)?.map((state) => (
                        <option key={state} value={state}>
                          {capitalizeWords(state)}
                        </option>
                      ))}
                    </select>
                    {/* <input
                      type="text"
                      {...register("location.state")}
                      placeholder="State"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    /> */}
                    {errors?.location?.state && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location.state.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      {...register("location.city")}
                      placeholder="City"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors?.location?.city && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location.city.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <input
                      type="text"
                      {...register("location.pincode")}
                      placeholder="Pincode"
                      className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {errors?.location?.pincode && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.location.pincode.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Terms Agreement */}
              <div>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-600">
                    I agree to the{" "}
                    <Link to="#" className="text-blue-600 hover:text-blue-700">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="#" className="text-blue-600 hover:text-blue-700">
                      Privacy Policy
                    </Link>
                  </span>
                </label>
              </div>

              {/* Register Button */}
              <button
                type="submit"
                disabled={isRegisteringUser}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isRegisteringUser ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            {/* Divider */}
            {/* <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div> */}

            {/* Google Signup */}
            {/* <button
              type="button"
              onClick={handleGoogleSignup}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              <FcGoogle className="text-2xl" />
              Continue with Google
            </button> */}

            {/* Login Link */}
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <Link
                to={LOGIN}
                className="text-blue-600 font-semibold hover:text-blue-700"
              >
                Login
              </Link>
            </p>

            {/* Back to Home */}
            <p className="mt-4 text-center">
              <Link
                to={HOME}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← Back to Home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
