import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "@heroui/react";
import Header from "../src/component/common/Header";
import Footer from "../src/component/common/Footer";
import axios from "axios";
import { toast } from "react-toastify";
import { useMutation, useQuery } from "@tanstack/react-query";

const API_URL = "http://localhost:5000/api/auth";

export default function ProfileUpdatePage() {
  const [showPassword, setShowPassword] = useState(false);

  const fetchProfile = async () => {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  };

  // Query to fetch user profile
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
    mode: "onChange",
  });

  // Reset form with user data when it's available
  useEffect(() => {
    if (userData) {
      console.log("Data", userData);
      reset({
        name: userData?.data?.name || "",
        email: userData?.data?.email || "",
        bio: userData?.data?.bio || "",
        password: "",
      });
    }
  }, [userData, reset]);

  // Handle error with useEffect
  useEffect(() => {
    if (isError) {
      toast.error("Failed to fetch profile.");
    }
  }, [isError]);

  const updateMutation = useMutation({
    mutationFn: async (formData) => {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/users/profile`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    },
  });

  const password = watch("password");

  const onSubmit = (data) => {
    updateMutation.mutate(data);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-blue-100 flex flex-col justify-center py-12 px-6">
        <div className="max-w-md w-full mx-auto">
          {isLoading ? (
            <div className="text-center p-6 bg-white rounded shadow">
              <p>Loading profile data...</p>
            </div>
          ) : isError ? (
            <div className="text-center p-6 bg-white rounded shadow">
              <p className="text-red-500">Error loading profile</p>
              <Button
                color="primary"
                className="mt-4"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-8 space-y-6 bg-white p-6 rounded shadow"
            >
              <h2 className="text-center text-2xl font-bold text-gray-900">
                Update Profile
              </h2>
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: "Name is required" }}
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
                      value={field.value || ""}
                    />
                  )}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
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
                      value={field.value || ""}
                    />
                  )}
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bio
                </label>
                <Controller
                  name="bio"
                  control={control}
                  rules={{ required: "Bio is required" }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="bio"
                      type="text"
                      variant="bordered"
                      placeholder="I Am..."
                      isInvalid={!!errors.bio}
                      errorMessage={errors.bio?.message}
                      className="w-full"
                      value={field.value || ""}
                    />
                  )}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  New Password
                </label>
                <Controller
                  name="password"
                  control={control}
                  rules={{
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
                      value={field.value || ""}
                      endContent={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          ) : (
                            <Eye className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      }
                    />
                  )}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank to keep current password.
                </p>
              </div>

              {/* Submit */}
              <div>
                <Button
                  type="submit"
                  color="primary"
                  className="w-full"
                  isLoading={updateMutation.isPending}
                  isDisabled={!isValid || updateMutation.isPending}
                >
                  Update Profile
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
