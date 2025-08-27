import Container from '@mui/material/Container'
import AppBar from '../../components/Appbar'
import BoarBar from './BoarBar'
import BoardContent from './BoardContent'
function Board() {
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoarBar />
      <BoardContent />
    </Container>
  )
}

export default Board