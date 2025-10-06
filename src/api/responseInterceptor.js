import useAuthStore from '../store/authStore'
import { apiCallProtected } from './axios'

const responseInterceptor = () =>
  apiCallProtected.interceptors.response.use(
    response => {
      if (response.status === 200 || response.status === 201) {
        return response?.data
      } else if (response.status === 204) {
        const data = { status: 'success' }
        return data
      } else {
        return response
      }
    },
    async error => {
      const { auth: authObj, resetAuth: logout } = useAuthStore.getState()
      /*
      User will be logged out once the access token expires and while the eod get's started
    */
      if (
        (error?.response?.status === 401) &&
        authObj?.access_token
      ) {
        logout()
      }
      /* 
      Response data from error
    */
      if (
        typeof error?.response?.data == 'undefined' ||
        error?.status?.toLowerCase() === 'error'
      ) {
        const data = error?.data || {}
        return Promise.reject({
          message:
            error?.message ||
            data?.message ||
            'Seems server is busy. Please try again after sometime!'
        })
      } else {
        return Promise.reject(error?.response?.data)
      }
    }
  )

export default responseInterceptor
