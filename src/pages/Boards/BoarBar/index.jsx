import Box from '@mui/material/Box'

function BoarBar() {
  return (
    <Box sx={{
      backgroundColor: 'primary.dark',
      width: '100%',
      height: (theme) => theme.trelloCustom.boardBarHeight,
      display: 'flex',
      alignItems: 'center'
    }}>
      Boar Bar
    </Box>
  )
}

export default BoarBar