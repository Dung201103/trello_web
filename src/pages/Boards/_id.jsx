import Container from '@mui/material/Container'
import AppBar from '../../components/AppBar/AppBar'
import BoarBar from './BoarBar/BoarBar'
import BoardContent from './BoardContent/BoardContent'
import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import { fetchBoardDetailsAPI, createNewColumnAPI, createNewCardAPI } from '~/apis'
function Board() {
  const [board, setBoard] = useState(null)
  useEffect(() => {
    const boardId = '68bd00f2023deade0c2accd1'
    fetchBoardDetailsAPI(boardId).then(board => {
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
    console.log('createdcolumn', createdColumn)
  }
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI(
      {
        ...newCardData,
        boardId: board._id
      }
    )
    console.log('createdcard', createdCard)
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoarBar board={board} />
      <BoardContent board={board} createNewColumn={createNewColumn} createNewCard={createNewCard} />
    </Container>
  )
}

export default Board