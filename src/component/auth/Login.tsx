import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button, Checkbox } from "@heroui/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onChange",
  });

  const onSubmit = (data) => {
    console.log("login submitted:", data);
    LoginMutation.mutate(data);
    // Handle registration logic here
  };

  const LoginMutation = useMutation({
    mutationFn: async (formData) => {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Login successful:", data);
      toast.success("Login successful!");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setLoading(false);
      reset();
      navigate("/dashboard");
    },
    onError: (error) => {
      console.error("Login failed:", error.response?.data || error.message);
      const message =
        error.response?.data?.message || "Login failed. Try again.";
      toast.error(message);
      setLoading(false);
    },
  });

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
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
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

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <Controller
                name="password"
                control={control}
                rules={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    variant="bordered"
                    className="w-full"
                    classNames={{
                      input: "text-sm",
                      inputWrapper: "border-gray-300",
                    }}
                    endContent={
                      <button
                        type="button"
                        className="focus:outline-none"
                        onClick={() => setShowPassword(!showPassword)}
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

            <div className="flex items-center justify-between">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <Checkbox
                    isSelected={value}
                    onValueChange={onChange}
                    size="sm"
                    color="primary"
                  >
                    <span className="text-sm text-gray-900">Remember me</span>
                  </Checkbox>
                )}
              />

              {/* <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </a>
              </div> */}
            </div>

            <div>
              <Button
                type="submit"
                color="primary"
                className="w-full"
                isDisabled={!isValid}
              >
                Sign in
              </Button>
            </div>
          </form>

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
                href="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Create a new account
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
