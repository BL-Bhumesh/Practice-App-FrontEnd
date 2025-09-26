import axiosInstance from './axiosServices';

export const getQuestions = (question_type = 'ASSIGNMENT', skip = 0, limit = 1) =>
  axiosInstance.get(
    `/questions/get_questions?question_type=${question_type}&skip=${skip}&limit=${limit}`
  );
