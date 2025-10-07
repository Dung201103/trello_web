import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip';
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup';
const Menu_Styles = {
  color: 'white',
  bgcolor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoarBar({ board }) {

  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip sx=
            {Menu_Styles}
            icon={<DashboardIcon />} label={board?.title}
            clickable />
        </Tooltip>
        <Chip sx=
          {Menu_Styles}
          icon={<VpnLockIcon />} label={capitalizeFirstLetter(board?.type)}
          clickable />
        <Chip sx=
          {Menu_Styles}
          icon={<AddToDriveIcon />} label="Add To Google Drive"
          clickable />
        <Chip sx=
          {Menu_Styles}
          icon={<BoltIcon />} label="Automation"
          clickable />
        <Chip sx=
          {Menu_Styles}
          icon={<FilterListIcon />} label="Filter"
          clickable />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Button
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          variant="outlined"
          startIcon={<PersonAddIcon />} >
          Invite
        </Button>
        {/* XU ly hien thi danh sach thanh vien group */}
        <BoardUserGroup />
      </Box>
    </Box>
  )
}

export default BoarBar