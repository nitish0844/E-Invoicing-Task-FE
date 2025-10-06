import axios from 'axios'
import { URL } from './serverURLs'

// 
export const apiCall = axios.create({
  baseURL: URL.base
})

export const apiCallProtected = axios.create({
  baseURL: URL.base,
  headers: { 'Content-Type': 'application/json' }
})

export const apiCallFileProtected = axios.create({
  baseURL: URL.base,
  headers: { "content-type": "multipart/form-data", },
})
