import axios from "axios"
import { toast } from "react-toastify"
import { interceptorLoadingElements } from "./formatters"
import { refreshTokenAPI } from "~/apis"
import { logoutUserAPI } from '~/redux/user/userSlice'

//Injectstore
let axiosReduxStore
export const injectStore = _mainStore => {
  axiosReduxStore = _mainStore
}
const authorizedAxiosInstance = axios.create()
//Thoi gian cho toi da cua 1 reqquest:
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
//withCredential
authorizedAxiosInstance.defaults.withCredentials = true


// Add a request interceptor
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Do something before request is sent
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
},
)

let refreshTokenPromise = null

// Add a response interceptor
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  interceptorLoadingElements(false)
  return response
}, (error) => {
  interceptorLoadingElements(false)
  //Truong hop 1: neu nhu ma 401 tu be thi goi api logout
  if (error.response?.status === 401) {
    axiosReduxStore.dispatch(logoutUserAPI(false))
  }
  //TH2:Neu nhu ma 410 tu be thi goi api refresh token de lam moi  accesstoken
  const originalRequests = error.config

  if (error.response?.status === 410 && originalRequests) {
    originalRequests._retry = true
    //kiem tra chua co refreshtoken thi gan viec goi api rf_token dong thoi gan vao cho cai reftokenpromise
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenAPI()
        //Accesstoken da nam trong httpOnly cookie(xl tu be)
        .then(data => { return data?.accessToken })
        //Neu api refresh token loi thi logout
        .catch((_error) => {
          axiosReduxStore.dispatch(logoutUserAPI(false))
          return Promise.reject(_error)
        })
        //Du api ok hay loi thi van set refreshTokenPromise ve null
        .finally(() => { refreshTokenPromise = null })
    }
    //Can return TH refreshTokenPromise chay thanh cong
    return refreshTokenPromise.then(accessToken => {
      //B1: Neu can luu accesstoken vao localstorage thi se viet them code o day
      //Hien tai accesstoken da dua vao cookie sau khi goi api refresh token thanh cong

      //Buoc 2: return authorizedAxiosInstance ket hop voi cac originalRequests de goi lai nhung api ban dau bi loi
      return authorizedAxiosInstance(originalRequests)
    })
  }

  let errorMessage = error?.errorMessage
  if (error.response?.data?.message) {
    errorMessage = error.response?.data?.message
  }
  else if (error.message) {
    errorMessage = error.message
  } else {
    errorMessage = `Request failed with status code ${error.response?.status || 'unknown'}`
  }
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})
export default authorizedAxiosInstance