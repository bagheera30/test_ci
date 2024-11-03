import axios from "axios";

export const axiosIntense = axios.create({
  baseURL: import.meta.env.PUBLIC_API_PRODUCT,
});
