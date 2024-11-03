import React, { useState } from "react";
import axios from "axios";

const DeleteButton = ({ id }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:3000/products/${id}`); // Ganti dengan endpoint API Anda
      window.location.reload();
    } catch (error) {
      console.error(error);
      // Tampilkan pesan error kepada pengguna
      alert("Gagal menghapus data. Coba lagi nanti.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary"
      onClick={handleDelete}
      disabled={isLoading}
    >
      {isLoading ? "Menghapus..." : "Hapus"}
    </button>
  );
};

export default DeleteButton;
