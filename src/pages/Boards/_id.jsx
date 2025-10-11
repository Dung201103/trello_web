import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoarBar from './BoarBar/BoarBar'
import BoardContent from './BoardContent/BoardContent'
import { useEffect, useState } from 'react'
import {
  updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardToDifferentColumnAPI,
} from '~/apis'
import { cloneDeep } from 'lodash'

import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'

function Board() {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()
  useEffect(() => {
    // const boardId = '68bd00f2023deade0c2accd1'

    dispatch(fetchBoardDetailsAPI(boardId))

  }, [dispatch, boardId])


  const moveColumns = (dndorderedColumns) => {
    //Update cho chuan du lieu state board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))
    //Goi api
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: newBoard.columnOrderIds })
  }
  const moveCardInTheSameColumn = (dndorderedCards, dndorderedCardIds, columnId) => {
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndorderedCards
      columnToUpdate.cardOrderIds = dndorderedCardIds
    }
    dispatch(updateCurrentActiveBoard(newBoard))
    //Call api
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndorderedCardIds })
  }
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndorderedColumns) => {
    //Update cho chuan du lieu state board
    const dndorderedColumnsIds = dndorderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndorderedColumns
    newBoard.columnOrderIds = dndorderedColumnsIds
    dispatch(updateCurrentActiveBoard(newBoard))

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


  if (!board) {
    return <PageLoadingSpinner caption='Loading Bar...' />
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <ActiveCard />

      <AppBar />
      <BoarBar board={board} />
      <BoardContent board={board}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        moveColumns={moveColumns}
      />
    </Container>
  )
}

export default Board