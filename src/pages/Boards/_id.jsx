import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoarBar from './BoarBar/BoarBar'
import BoardContent from './BoardContent/BoardContent'
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