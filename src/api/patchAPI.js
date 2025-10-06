import { apiCallProtected } from './axios'
import useAuthStore from '../store/authStore'

const authObj = useAuthStore?.getState().auth

export const patchAPI = async (
  endpoint,
  data = {},
  params = {},
  options = {}
) => {
  const headers = {
    Authorization: `Bearer ${authObj?.access_token}`,
    ...options.headers
  }

  try {
    const response = await apiCallProtected.patch(`/${endpoint}`, data, {
      headers,
      params,
      ...options
    })

    return response.data
  } catch (error) {
    console.error('Error in patchAPI:', error)
    throw error
  }
}
