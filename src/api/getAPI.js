import { apiCallProtected } from "./axios";
import useAuthStore from "../store/authStore";

const authObj = useAuthStore?.getState().auth;

export const getAPI = async (endpoint, params = {}, options = {}) => {
  const headers = {
    Authorization: `Bearer ${authObj?.access_token}`,
    ...options.headers,
  };

  try {
    const response = await apiCallProtected.get(`/${endpoint}`, {
      headers,
      params,
      ...options,
    });
    return response.data;
    
  } catch (error) {
    console.error("Error in getAPI:", error);
    throw error;
  }
};
