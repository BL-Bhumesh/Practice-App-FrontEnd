import axiosInstance from './axiosServices';

  export const getPrompt = (answer_type) => {
  return axiosInstance.get(`/prompts/default-prompt?answer_type=${answer_type}`);
};

