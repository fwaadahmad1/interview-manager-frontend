// /pages/login.tsx
"use client";

import ApiClient from "@/lib/api/ApiClient";
import useGlobalStore from "@/stores/useGlobalStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Interviewer } from "../calendar/models/interviewer";

export default function Login() {
  const { setCurrentUser, setToken } = useGlobalStore();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const router = useRouter();

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await ApiClient.post<
        typeof formData,
        { token: string; user: Interviewer }
      >("/auth/login", formData);

      setToken(res.data.token);
      setCurrentUser(res.data.user);

      toast.success("Login successful!");
      router.push("/calendar/month"); // Redirect to dashboard after login
    } catch (error) {
      console.error("Error logging in:", error);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-green-400 to-blue-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Login
        </h2>

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          required
        />

        <button
          type="submit"
          className="mb-2 me-2 w-full rounded-lg bg-gradient-to-br from-green-400 to-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-800"
        >
          Login
        </button>
        <div className="text-center mt-4">
        <button
          className="text-sm text-blue-500 underline hover:text-blue-700 transition-colors duration-300"
          onClick={() => router.push("/register")}
        >
          New user? Sign up here
        </button>
    </div>
      </form>
    </div>
  );
}
