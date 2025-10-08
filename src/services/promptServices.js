import axiosInstance from './axiosServices';

export const getPrompt = () =>
  axiosInstance.get(
    `prompts/default-prompt`
  );
