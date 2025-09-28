import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { isEmpty } from 'lodash'
import { API_ROOT } from '~/utils/constants'
import { generatePlaceholderCard } from '~/utils/formatters'
import { mapOrder } from '~/utils/sorts'
//Khởi tạo giá trị state trong redux
const initialState = {
  currentActiveBoard: null,
}
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI',
  async (boardId) => {
    const response = await authorizedAxiosInstance.get(`${API_ROOT}/v1/boards/${boardId}`)
    //axios se tra ve ket qua tra ve qua property cua no la data
    return response.data
  }
)

//Khởi tạo một slice trong kho lưu trữ redux
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  // Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      const board = action.payload
      //Xử lý dữ liệu nếu cần thiết
      //...
      state.currentActiveBoard = board
    }
  },
  //Extra reducer: Noi xu ly du lieu bat dong bo
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload chinh la response.data tra ve
      let board = action.payload
      //Xap xep du lieu thu tu cac column truoc khi dua xuong ben duoi cac component con(bug 71)    
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')

      board.columns.forEach(column => {
        if (isEmpty(column.cards)) {
          column.cards = [generatePlaceholderCard(column)]
          column.cardOrderIds = [generatePlaceholderCard(column)._id]
        } else {
          //Xap xep du lieu thu tu cac cards truoc khi dua xuong ben duoi cac component con(bug 71)    
          column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
        }
      })
      state.currentActiveBoard = board
    })
  }
})

// Action creators are generated for each case reducer function
export const { updateCurrentActiveBoard } = activeBoardSlice.actions
//Selectors
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}
// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer