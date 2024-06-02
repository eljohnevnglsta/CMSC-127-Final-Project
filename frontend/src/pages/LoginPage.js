import React, { useState } from "react";
import axios from "axios";
import "./LoginPage.css";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    accesskey: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        loginData
      );
      if (response.data.success) {
        if (response.data.usertype === 0) {
          localStorage.setItem("admin", response.data.username);
        } else if (response.data.usertype === 2) {
          localStorage.setItem("manager", response.data.username);
        } else if (response.data.usertype === 1) {
          localStorage.setItem("user", response.data.username);
        }
        window.location.replace("/");
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div className="login-background">
      <div className="area">
        <ul className="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-full max-w-md bg-sky-950 rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">Login</h2>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            <input
              placeholder="Username"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="text"
              name="username"
              value={loginData.username}
              onChange={handleChange}
            />
            <input
              placeholder="Access Key"
              className="bg-gray-700 text-gray-200 border-0 rounded-md p-2 mb-4 focus:bg-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition ease-in-out duration-150"
              type="password"
              name="accesskey"
              value={loginData.accesskey}
              onChange={handleChange}
            />
            <button
              type="submit"
              className="relative inline-flex items-center justify-center py-3 px-4 w-32 mx-auto overflow-hidden font-semibold shadow text-indigo-600 transition-all duration-150 ease-in-out rounded hover:pl-10 hover:pr-6 bg-gray-50 dark:bg-gray-700 dark:text-white dark:hover:text-gray-200 dark:shadow-none group"
            >
              <span className="absolute bottom-0 left-0 w-full h-1 transition-all duration-150 ease-in-out bg-indigo-600 group-hover:h-full"></span>
              <span className="absolute right-0 pr-4 duration-200 ease-out group-hover:translate-x-12">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  className="w-5 h-5 text-green-400"
                >
                  <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </span>
              <span className="absolute left-0 pl-2.5 -translate-x-12 group-hover:translate-x-0 ease-out duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  fill="none"
                  className="w-5 h-5 text-green-400"
                >
                  <path
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                  ></path>
                </svg>
              </span>
              <span className="relative w-full text-left transition-colors duration-200 ease-in-out group-hover:text-white dark:group-hover:text-gray-200">
                Login
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
