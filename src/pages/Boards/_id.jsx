import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoarBar from './BoarBar/BoarBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI,
  updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sorts'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress';
import { toast } from 'react-toastify'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '68bd00f2023deade0c2accd1'
    fetchBoardDetailsAPI(boardId).then(board => {
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
      setBoard(board)
    })
  }, [])
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI(
      {
        ...newColumnData,
        boardId: board._id
      }
    )
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI(
      {
        ...newCardData,
        boardId: board._id
      }
    )
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      //Neu column rong 
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderIds = [createdCard._id]
      } else {
        //Nguoc lai neu column da co data thi push vao cuoi mang
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    console.log("🚀 ~ createNewCard ~ columnToUpdate:", columnToUpdate)
    setBoard(newBoard)
  }
  const moveColumns = (dndorderedColumns) => {
    //Update cho chuan du lieu state board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    setBoard(newBoard)
    //Goi api
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }
  const moveCardInTheSameColumn = (dndorderedCards, dndorderedCardIds, columnId) => {
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndorderedCards
      columnToUpdate.cardOrderIds = dndorderedCardIds
    }
    setBoard(newBoard)
    //Call api
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndorderedCardIds })
  }
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndorderedColumns) => {
    //Update cho chuan du lieu state board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    setBoard(newBoard)

    //Call API
    let prevCardOrderIds = dndorderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    //Xu ly van de khi keo card cuoi cung ra khoi column
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndorderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }
  //Xu ly xoa mot column va card ben trong no
  const deleteColumnDetails = (columnId) => {
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)


    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, width: '100vw', height: '100vh' }}>
        <CircularProgress />
        <Typography>Loading Board ...</Typography>
      </Box>
    )
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoarBar board={board} />
      <BoardContent board={board}

        createNewColumn={createNewColumn} createNewCard={createNewCard} moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn} moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board