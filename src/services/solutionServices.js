import axiosInstance from "./axiosServices";

// Submit an answer
export const submitAnswer = (payload) => {
  return axiosInstance.post('/reviews/answers/', payload);
};
