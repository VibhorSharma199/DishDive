"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const SignupPage = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleOnSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post("/api/user/register", {
        username,
        email,
        password,
      });
      if (response) {
        console.log(response);
        toast.success(response.data.message);
        setUsername("");
        setEmail("");
        setPassword("");
        router.push("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(`Something went wrong`);
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">
          Create an Account
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleOnSubmit}>
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-700"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500 p-2 text-gray-700"
              required
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 text-white font-semibold rounded-md py-2 hover:bg-blue-700 transition duration-200"
            >
              Sign Up
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?
          <a href="/login" className="text-blue-600 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
