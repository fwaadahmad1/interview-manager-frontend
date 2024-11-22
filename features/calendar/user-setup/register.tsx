"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import BusinessArea from '../models/business-area';
import AllBusinessAreaResponse from '../models/response/all-business-areas.response';

export default function Register() {
  const [businessAreas, setBusinessAreas] = useState<BusinessArea[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    designation: '',
    business_area_id: '',
    employee_id: 'EMP' + Math.floor(100000 + Math.random() * 900000).toString(),
  });
//   const router = useRouter();

  // Fetch available business areas on component mount
  useEffect(() => {
    async function fetchBusinessAreas() {
      try {
        const response = await axios.get<AllBusinessAreaResponse[]>('http://localhost:8000/api/businessareas');
        setBusinessAreas(response.data.businessAreas);
      } catch (error) {
        console.error('Error fetching business areas:', error);
      }
    }

    fetchBusinessAreas();
  }, []);

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/auth/signup', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Registration successful!');
    //   router.push('/login'); // Redirect to login after successful signup
    } catch (error) {
      console.error('Error registering:', error);
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-600">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign Up</h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleInputChange}
          placeholder="Designation"
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />

        <select
          name="business_area_id"
          value={formData.business_area_id}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
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
          className="w-full py-3 font-bold text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        >
          Register
        </button>
      </form>
    </div>
  );
}
