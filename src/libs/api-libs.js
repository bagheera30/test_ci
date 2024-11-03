import { axiosIntense } from "./axios";

export const getApiResponse = async (resource, query) => {
  const response = await axiosIntense.get(`${resource}?${query}`);

  return response;
};

export const getApiResponseById = async (resource, id) => {
  const response = await axiosIntense.get(`${resource}/${id}`);
  return response;
};
export const updateApiResponseById = async (resource, id, data) => {
  const response = await axiosIntense.put(`${resource}/${id}`, data);
  return response;
};
export const deleteApiResponseById = async (resource, id) => {
  const response = await axiosIntense.delete(`${resource}/${id}`);
  return response;
};
export const postApiResponse = async (resource, data) => {
  const response = await axiosIntense.post(`${resource}`, data);
  return response;
};
export const patchApiResponse = async (resource, id, data) => {
  const response = axiosIntense.patch(`${resource}/${id}`, data);
  return response;
};
export const putApiresponse = async (resource, id, data) => {
  const response = axiosIntense.put(`${resource}/${id}`, data);
  return response;
};
