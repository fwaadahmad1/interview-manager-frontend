"use client";

import ApiClient from "@/lib/api/ApiClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import BusinessArea from "../calendar/models/business-area";
import { Interviewer } from "../calendar/models/interviewer";
import useGlobalStore from "@/stores/useGlobalStore";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();
  const [businessAreas, setBusinessAreas] = useState<BusinessArea[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    business_area_id: "",
    employee_id: "",
  });
  //   const router = useRouter();

  // Fetch available business areas on component mount
  useEffect(() => {
    async function fetchBusinessAreas() {
      try {
        const response = await ApiClient.get<BusinessArea[]>("/businessareas");
        setBusinessAreas(response.data);
      } catch (error) {
        console.error("Error fetching business areas:", error);
      }
    }

    fetchBusinessAreas();
  }, []);

  // Handle form field changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ApiClient.post<typeof formData, { user: Interviewer }>(
        "/auth/signup",
        formData,
      );
      toast.success("Registration successful!");
      router.push("/login"); // Redirect to calendar month after successful signup
    } catch (error) {
      console.error("Error registering:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-blue-400 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-lg bg-white p-8 shadow-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Sign Up
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          placeholder="Designation"
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="text"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleInputChange}
          placeholder="Employee ID"
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <select
          name="business_area_id"
          value={formData.business_area_id}
          onChange={handleInputChange}
          className="mb-4 w-full rounded-lg border p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        >
          <option value="">Select Business Area</option>
          {businessAreas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="mb-2 me-2 w-full rounded-lg bg-gradient-to-br from-purple-600 to-blue-500 px-5 py-2.5 py-3 text-center text-sm font-bold font-medium text-white hover:bg-gradient-to-bl focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
        >
          Register
        </button>
        <div className="text-center mt-4">
        <button
          className="text-sm text-blue-500 underline hover:text-blue-700 transition-colors duration-300"
          onClick={() => router.push("/login")}
        >
        
          Already have an account? Login here
        </button>
        </div>

      </form>
    </div>
  );
}
