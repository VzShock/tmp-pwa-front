"use client";

import { useState } from "react";
//import bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const sendLogin = async () => {
    try {
      const res = await fetch("http://victoire-rabeau.com:3000/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "http://victoire-rabeau.com:3000",
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || "Login failed");
      }

      const data = await res.json();
      const accessToken = data.access_token;

      //tested : it stores the token in the browser storage
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("username", formData.username);

      // Redirect or perform other actions as needed
      router.push("/");
    } catch (error) {
      console.error("Error during Login:", error as any);
    }
  };

  //handle change
  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    sendLogin();
  };

  const handleForgotPassword = () => {
    router.push("/register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen from-purple-900 via-indigo-800 to-indigo-500 bg-gradient-to-br">
      <div className="w-full max-w-lg px-10 py-8 mx-auto bg-white border rounded-lg shadow-2xl">
        <div className="max-w-md mx-auto space-y-3">
          <h3 className="text-lg font-semibold">My Account</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label className="block py-1">Your username</label>
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
              <label className="block py-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border w-full py-2 px-2 rounded shadow hover:border-indigo-600 ring-1 ring-inset ring-gray-300 font-mono"
              />
            </div>
            <div className="flex gap-3 pt-3 items-center">
              <button
                type="submit"
                className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline-indigo active:bg-indigo-800"
              >
                Login
              </button>
              <a
                href="#"
                className="text-indigo-600 hover:underline"
                onClick={handleForgotPassword}
              >
                Need an account ?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
