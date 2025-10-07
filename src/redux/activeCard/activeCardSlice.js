import { createSlice } from '@reduxjs/toolkit'

//Khởi tạo giá trị state trong redux
const initialState = {
  currentActiveCard: null
}


//Khởi tạo một slice trong kho lưu trữ redux
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {
    clearCurrentActiveCard: (state) => {
      state.currentActiveCard = null
    },
    updateCurrentActiveCard: (state, action) => {
      const fullCard = action.payload
      //Xử lý dữ liệu nếu cần thiết
      //...
      state.currentActiveCard = fullCard
    }
  },
  //Extra reducer: Noi xu ly du lieu bat dong bo
  extraReducers: (builder) => { }
})

// Action creators are generated for each case reducer function
export const { clearCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions
//Selectors
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer