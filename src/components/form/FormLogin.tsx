
import axios from "axios";
import React, { useState } from "react";

const FormLogin = () => {
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  console.log("🚀 ~ file: FormLogin.tsx:9 ~ FormLogin ~ loginData:", loginData);

  const handleChange = (event) => {
    setLoginData({ ...loginData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(
        `http://localhost:3000/users/login`,
        loginData
      );
      localStorage.setItem("username", response.data.username);

      if (response.status === 200) {
        // Save the token to localStorage

        if (response.data.role === "Admin") {
          alert("login berhasil");
          window.location.href = "/admin";
        } else {
          window.location.href = "/dasbord";
        }
      } else {
        console.error(`Error: ${response.status}`);
        alert("Terjadi kesalahan saat mengirim data");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat mengirim data");
    }
  };

  return (
    <>
      <h1 className="text-black text-4xl font-bold">Masuk</h1>
      <form onSubmit={handleSubmit}>
        <div className="py-3">
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={loginData.username}
            placeholder="username"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-3">
          <input
            type="password"
            name="password"
            onChange={handleChange}
            value={loginData.password}
            placeholder="password"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="w-full btn btn-neutral bg-red-600">
            login
          </button>
        </div>
      </form>
      <div className="w-96 h-5 justify-center items-center gap-9 inline-flex">
        <div className="w-20 h-px border border-black border-opacity-50"></div>
        <div className="text-black text-opacity-50 text-lg font-normal font-['Roboto']">
          Belum punya akun?
        </div>
        <div className="w-20 h-px border border-black border-opacity-50"></div>
      </div>
      <div className="text-center py-5">
        <a href="/regiter">
          <button className="w-full btn btn-neutral bg-red-600">regiter</button>

        </a>
      </div>
    </>
  );
};

export default FormLogin;
