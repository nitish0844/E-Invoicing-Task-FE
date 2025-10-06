import { postAPICall } from "../apiCall";

export const loginAPI = ({ body }) => {
  return postAPICall("auth/login", { body });
};
