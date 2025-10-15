import axiosInstance from './axiosServices';



export const getPrompt = (answer_type) =>
  axiosInstance.get(`/prompts/default-prompt?answer_type=${answer_type}&_t=${Date.now()}`);