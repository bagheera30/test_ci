import React from "react";
import { useStore } from "@nanostores/react";
import { cartItems } from "../cart";

function cartFlayout() {
  const $cartItem = useStore(cartItems);
  return <div>cartFlayout</div>;
}

export default cartFlayout;
