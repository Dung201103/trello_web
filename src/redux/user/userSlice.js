import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'

//Khởi tạo giá trị state trong redux
const initialState = {
  currentUser: null
}
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/login`, data)
    //axios se tra ve ket qua tra ve qua property cua no la data
    return response.data
  }
)

//Khởi tạo một slice trong kho lưu trữ redux
export const userSlice = createSlice({
  name: 'user',
  initialState,
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  //Extra reducer: Noi xu ly du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      //action.payload chinh la response.data tra ve
      const user = action.payload
      state.currentUser = user
    })
  }
})

// Action creators are generated for each case reducer function
// export const { } = userSlice.actions
//Selectors
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
// export default activeBoardSlice.reducer
export const userReducer = userSlice.reducer