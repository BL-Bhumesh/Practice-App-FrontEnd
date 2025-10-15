import axiosInstance from './axiosServices';

// export const getQuestions = (answer_type, skip = 0, limit = 1) =>
//   axiosInstance.get(
//     `/questions/get_questions?answer_type=${answer_type}&skip=${skip}&limit=${limit}&_t=${Date.now()`
//   );

  export const getQuestions = (answer_type, skip = 0, limit = 1) =>
  axiosInstance.get(
    `/questions/get_questions?answer_type=${answer_type}&skip=${skip}&limit=${limit}&_t=${Date.now()}`
  );