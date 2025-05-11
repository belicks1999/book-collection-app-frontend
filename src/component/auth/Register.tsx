import { useState, useEffect } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Checkbox } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    requirements: {
      length: false,
      uppercase: false,
      lowercase: false,
      number: false,
      special: false,
    },
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
    mode: "onChange",
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const agreeToTerms = watch("agreeToTerms");

  const registerMutation = useMutation({
    mutationFn: async (formData) => {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Registration successful:", data);
      toast.success("Registration successful!");
      setLoading(false);
      reset();
      navigate("/");
    },
    onError: (error) => {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      const message =
        error.response?.data?.message || "Registration failed. Try again.";
      toast.error(message);
      setLoading(false);
    },
  });

  // Update password strength whenever password changes
  useEffect(() => {
    if (password) {
      checkPasswordStrength(password);
    } else {
      setPasswordStrength({
        score: 0,
        requirements: {
          length: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false,
        },
      });
    }
  }, [password]);

  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };

    const score = Object.values(requirements).filter(Boolean).length;

    setPasswordStrength({
      score,
      requirements,
    });
  };

  const getStrengthColor = () => {
    if (passwordStrength.score <= 2) return "bg-red-500";
    if (passwordStrength.score <= 4) return "bg-yellow-500";
    return "bg-green-500";
  };

  const onSubmit = (data) => {
    console.log("Registration submitted:", data);
    registerMutation.mutate(data);
    // Handle registration logic here
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 rounded-full bg-blue-500 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full name
              </label>
              <div className="mt-1">
                <Controller
                  name="name"
                  control={control}
                  rules={{
                    required: "Name is required",
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      type="text"
                      variant="bordered"
                      placeholder="John Doe"
                      isInvalid={!!errors.name}
                      errorMessage={errors.name?.message}
                      className="w-full"
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "border-gray-300",
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      variant="bordered"
                      placeholder="you@example.com"
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                      className="w-full"
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "border-gray-300",
                      }}
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      variant="bordered"
                      placeholder="••••••••"
                      isInvalid={!!errors.password}
                      errorMessage={errors.password?.message}
                      className="w-full"
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "border-gray-300",
                      }}
                      endContent={
                        <button
                          type="button"
                          className="focus:outline-none"
                          onClick={toggleShowPassword}
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </div>
              <div className="mt-2">
                <div className="flex items-center">
                  <div
                    className={`h-2 flex-1 ${
                      passwordStrength.score > 0
                        ? getStrengthColor()
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 ml-1 flex-1 ${
                      passwordStrength.score > 1
                        ? getStrengthColor()
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 ml-1 flex-1 ${
                      passwordStrength.score > 2
                        ? getStrengthColor()
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 ml-1 flex-1 ${
                      passwordStrength.score > 3
                        ? getStrengthColor()
                        : "bg-gray-200"
                    }`}
                  ></div>
                  <div
                    className={`h-2 ml-1 flex-1 ${
                      passwordStrength.score > 4
                        ? getStrengthColor()
                        : "bg-gray-200"
                    }`}
                  ></div>
                </div>
                <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center text-gray-600">
                    {passwordStrength.requirements.length ? (
                      <Check className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>At least 8 characters</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {passwordStrength.requirements.uppercase ? (
                      <Check className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Uppercase letter</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {passwordStrength.requirements.lowercase ? (
                      <Check className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Lowercase letter</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {passwordStrength.requirements.number ? (
                      <Check className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Number</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    {passwordStrength.requirements.special ? (
                      <Check className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <X className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span>Special character</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>
              <div className="mt-1">
                <Controller
                  name="confirmPassword"
                  control={control}
                  rules={{
                    required: "Confirm Password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      variant="bordered"
                      placeholder="••••••••"
                      isInvalid={!!errors.confirmPassword}
                      errorMessage={errors.confirmPassword?.message}
                      className="w-full"
                      classNames={{
                        input: "text-sm",
                        inputWrapper: "border-gray-300",
                      }}
                      endContent={
                        <button
                          type="button"
                          className="focus:outline-none"
                          onClick={toggleShowConfirmPassword}
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5 text-gray-400" />
                          ) : (
                            <Eye className="h-5 w-5 text-gray-400" />
                          )}
                        </button>
                      }
                    />
                  )}
                />
              </div>
            </div>

            <div className="flex items-center">
              <Controller
                name="agreeToTerms"
                control={control}
                rules={{
                  required: "You must agree to the terms",
                }}
                render={({ field }) => (
                  <Checkbox
                    {...field}
                    id="agreeToTerms"
                    isSelected={field.value}
                    onValueChange={(isSelected) =>
                      setValue("agreeToTerms", isSelected)
                    }
                    className="text-blue-600"
                  >
                    <span className="text-sm text-gray-900">
                      I agree to the{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-blue-600 hover:text-blue-500">
                        Privacy Policy
                      </a>
                    </span>
                  </Checkbox>
                )}
              />
            </div>
            {errors.agreeToTerms && (
              <p className="text-sm text-red-600">
                {errors.agreeToTerms.message}
              </p>
            )}

            <div>
              <Button
                color="primary"
                isLoading={loading}
                isDisabled={
                  !isValid || !agreeToTerms || password !== confirmPassword
                }
                className="w-full"
                type="submit"
              >
                Create account
              </Button>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or</span>
                  </div>
                </div>

                <div className="mt-6 flex justify-center">
                  <a
                    href="/"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign in to your existing account
                  </a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
