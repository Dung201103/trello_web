import { createSlice } from '@reduxjs/toolkit'

//Khởi tạo giá trị state trong redux
const initialState = {
  currentActiveCard: null,
  isShowModalActiveCard: false
}


//Khởi tạo một slice trong kho lưu trữ redux
export const activeCardSlice = createSlice({
  name: 'activeCard',
  initialState,
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {
    showModalActiveCard: (state) => {
      state.isShowModalActiveCard = true
    },
    clearAndHideCurrentActiveCard: (state) => {
      state.currentActiveCard = null
      state.isShowModalActiveCard = false
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
export const { showModalActiveCard, clearAndHideCurrentActiveCard, updateCurrentActiveCard } = activeCardSlice.actions
//Selectors
export const selectCurrentActiveCard = (state) => {
  return state.activeCard.currentActiveCard
}
export const selectIsShowModalActiveCard = (state) => {
  return state.activeCard.isShowModalActiveCard
}
// export default activeCardSlice.reducer
export const activeCardReducer = activeCardSlice.reducer