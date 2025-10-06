import useAuthStore from "../store/authStore";
import { apiCallProtected } from "./axios";

const requestInterceptor = () => apiCallProtected.interceptors.request.use(
  (config) => {
    /*
      If access_token is available in the auth context then
      bearer token will we added to the header for every request.
      In other words without access_token the user is not logged in.
    */
    const authObj = useAuthStore?.getState().auth;
    if (authObj?.access_token?.length) {
      config.headers.Authorization = `Barrer ${authObj?.access_token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

export default requestInterceptor;