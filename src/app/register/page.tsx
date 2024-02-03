"use client";

import { useState } from "react";
//import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

const Register = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const sendRegister = async () => {
    try {
      const res = await fetch("http://victoire-rabeau.com:3000/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://victoire-rabeau.com:3000",
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      // Check if the response status is OK (2xx)
      if (!res.ok) {
        const errorText = await res.text(); // Retrieve error text if available
        throw new Error(errorText || "Registration failed"); // Use error text or a default message
      }

      if (res.status === 201) {
        console.log("User created");
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendRegister();

    router.push("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen from-purple-900 via-indigo-800 to-indigo-500 bg-gradient-to-br">
      <div className="w-full max-w-lg px-10 py-8 mx-auto bg-white border rounded-lg shadow-2xl">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-lg font-semibold">Register</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block py-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              />
              <p className="text-sm mt-2 px-2 hidden text-gray-600">
                Text helper
              </p>
            </div>
            <div>
              <label className="block py-1">Your email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              />
              <p className="text-sm mt-2 px-2 hidden text-gray-600">
                Text helper
              </p>
            </div>
            <div>
              <label className="block py-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              />
            </div>
            <div>
              <label className="block py-1">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-indigo active:bg-indigo-800 mt-4"
            >
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
