import React, { useState } from "react";
import axios from "axios";
const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    accesskey: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  }; //set the changes get from the input of user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/login",
        loginData
      );
      if (response.data.success) {
        if (response.data.usertype == 0) {
          localStorage.setItem("admin", response.data.username);
        } else if (response.data.usertype == 2) {
          localStorage.setItem("manager", response.data.username);
        } else if (response.data.usertype == 1) {
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
    <div>
      <form className="login-form" onSubmit={handleSubmit}>
        <label for="text" className="input-label">
          Username
        </label>
        <input
          type="text"
          id="username"
          name="username"
          className="input-field"
          placeholder="username"
          value={loginData.username}
          onChange={handleChange}
          required
        />
        <label for="accesskey" className="input-label">
          Access Key
        </label>
        <input
          type="password"
          id="accesskey"
          name="accesskey"
          className="input-field"
          placeholder="accesskey"
          value={loginData.accesskey}
          onChange={handleChange}
          required
        />
        <div class="button-wrapper">
          <button type="submit" className="sign-in-button">
            SIGN IN
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
