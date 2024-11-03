import axios from "axios";
import React, { useState } from "react";

const FormRegister = () => {
  const [regis, setRegis] = useState({
    username: "",
    password: "",
    nomerWA: "0",
    name: "",
  });
  const handleChange = (event) => {
    setRegis({ ...regis, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post(
        `http://localhost:3000/users/register`,
        regis
      );

      if (response.status === 200) {
        alert("register berhasil");

        window.location.href = "/login";
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
    <div className="w-96 p-6 bg-zinc-100 rounded-md shadow-lg">
      <h1 className="text-black text-4xl font-bold">Register</h1>
      <form onSubmit={handleSubmit}>
        <div className="py-3">
          <input
            type="text"
            name="name"
            onChange={handleChange}
            value={regis.name}
            placeholder="Nama"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-3">
          <input
            type="text"
            name="nomerWA"
            onChange={handleChange}
            value={regis.nomerWA}
            placeholder="NO. Hanphone 08xxxxxxx"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-3">
          <input
            type="text"
            name="username"
            onChange={handleChange}
            value={regis.username}
            placeholder="username"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="py-3">
          <input
            name="password"
            onChange={handleChange}
            value={regis.password}
            type="password"
            placeholder="Password"
            className="input input-bordered w-full max-w-xs"
          />
        </div>
        <div className="text-center">
          <button type="submit" className="w-full btn btn-neutral bg-red-600">
            register
          </button>
        </div>
      </form>
      <div className="w-96 h-5 justify-center items-center gap-9 inline-flex">
        <div className="w-20 h-px border border-black border-opacity-50"></div>
        <div className="text-black text-opacity-50 text-lg font-normal font-['Roboto']">
          sudah punya akun?
        </div>
        <div className="w-20 h-px border border-black border-opacity-50"></div>
      </div>
      <div className="text-center py-5">
        <a href="/login">
          <button className="w-full btn btn-neutral bg-red-600">Login</button>
        </a>
      </div>
    </div>
  );
};

export default FormRegister;
