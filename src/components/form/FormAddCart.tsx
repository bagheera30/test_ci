import React from "react";

const FormAddCart = ({ childern, item }) => {
  function addCart(e: SubmitEvent) {
    e.preventDefault();
    addCart(item);
  }
  return <form onSubmit={addCart}>{childern}</form>;
};

export default FormAddCart;
