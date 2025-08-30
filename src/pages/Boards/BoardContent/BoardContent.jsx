
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
function BoardContent({ board }) {
  // chuot di chuyen 10px thi moi goi event
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //Nhan giu 250ms va dung sai cua cam ung thi moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  //Ưu tiên sử dụng kết hợp 2 loại sensor mouse và touch để có trải nghiêm monile tốt nhất 
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])

  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  const handleDragEnd = (event) => {
    // console.log('handle', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (kéo ra ngoài linh tinh return luôn)

    if (!over) return
    //Nếu vị trí sau khi kéo thả khác vtri ban đầu 
    if (active.id !== over.id) {
      //Lay vi tri cu (tu thang active)
      const oldIndex = orderedColumns.findIndex(c => c._id === active.id)
      //Lay vi tri moi (tu thang over)
      const newIndex = orderedColumns.findIndex(c => c._id === over.id)
      // Dùng array move để xắp xếp columns
      const dndorderedColumns = arrayMove(orderedColumns, oldIndex, newIndex)
      // Xử lý dữ liệu call api
      // const dndorderedColumnsIds =dndorderedColumns.map(c => c._id )
      // console.log('dnd', dndorderedColumns)
      //Cập nhật lại state columns sau khi kéo thả
      setOrderedColumns(dndorderedColumns)
    }
  }
  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  )
}

export default BoardContent