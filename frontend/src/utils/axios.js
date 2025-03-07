import axios from 'axios'

const axiosInstance = axios.create()

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        const response = await axios.post('/api/token/refresh/', {
          refresh: refreshToken,
        })

        const newToken = response.data.access
        localStorage.setItem('token', newToken)

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`
        return axios(originalRequest)
      } catch (refreshError) {
        localStorage.removeItem('token')
        localStorage.removeItem('refresh_token')
        window.location.href = '/'
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default axiosInstance
