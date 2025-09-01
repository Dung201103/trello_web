
import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  // PointerSensor,
  useSensor,
  MouseSensor,
  TouchSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners
} from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'

import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'
import { cloneDeep } from 'lodash'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}
function BoardContent({ board }) {
  // chuot di chuyen 10px thi moi goi event
  // const pointerSensor = useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  const mouseSensor = useSensor(MouseSensor, { activationConstraint: { distance: 10 } })
  //Nhan giu 250ms va dung sai cua cam ung thi moi kich hoat event
  const touchSensor = useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 500 } })
  //Ưu tiên sử dụng kết hợp 2 loại sensor mouse và touch để có trải nghiêm monile tốt nhất 
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumns, setOrderedColumns] = useState([])
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)
  useEffect(() => {
    setOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, '_id'))
  }, [board])
  //Tim mot cai column theo cardId
  const findColumnByCardId = (cardId) => {
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }
  const moveCardBetweenDifferentColumns = (overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData) => {
    setOrderedColumns(prevColumns => {
      //Tim vi tri cua overcard trong column dich
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)
      //Logic xu ly de biet duoc them vao tren hay duoi card moi
      let newCardIndex
      const isBelowOverItem =
        active.rect.current.translated &&
        active.rect.current.translated.top >
        over.rect.top + over.rect.height

      const modifier = isBelowOverItem ? 1 : 0

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)
      //Column cu
      if (nextActiveColumn) {
        //Xoa card o column cu
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)
        //Cap nhat lai mang oderids cho chuan du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }
      //Column moi
      if (nextOverColumn) {
        //Kiem tra xem card dang keo no co ton tai o overColumn chua , neu co thi can xoa truoc di
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        const rebuild_activeDraggingCardId = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        //Tiep theo la them cai card dang keo vao overColumn theo vi tri index moi 
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardId)
        //Cap nhat lai mang oderids cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      return nextColumns
    })
  }
  //Trigger khi bat dau keo 1 phan tu
  const handleDragStart = (event) => {
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)
    //Neu keo card moi thuc hien
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5'
        }
      }
    })
  }
  //Trigger trong khi keo 1 phan tu
  const handleDragOver = (event) => {

    // Khong lam gi them neu keo tha column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return
    // console.log('handleDragover', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (kéo ra ngoài linh tinh return luôn)

    if (!active || !over) return
    //activeDraggingCard: la cai card dang duoc keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    //overCardId: la card dang duoc tuong tac tren hoac duoi so voi card bi keo
    const { id: overCardId } = over

    //Tim 2 cai column theo cardId
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)
    // console.log('activeColumn', activeColumn)
    // console.log('overColumn', overColumn)
    if (!activeColumn || !overColumn) return
    // XU ly logic khi keo card qua column khac thi moi thuc hien
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
    }
  }

  //Trigger khi ket thuc keo 1 phan tu
  const handleDragEnd = (event) => {
    // console.log('handle', event)
    const { active, over } = event
    // Kiểm tra nếu không tồn tại over (kéo ra ngoài linh tinh return luôn)

    if (!active || !over) return
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      //activeDraggingCard: la cai card dang duoc keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      //overCardId: la card dang duoc tuong tac tren hoac duoi so voi card bi keo
      const { id: overCardId } = over

      //Tim 2 cai column theo cardId
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)
      // console.log('activeColumn', activeColumn)
      // console.log('overColumn', overColumn)
      if (!activeColumn || !overColumn) return
      //Keo tha giua 2 column
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(overColumn, overCardId, active, over, activeColumn, activeDraggingCardId, activeDraggingCardData)
      } else {
        //Keo tha giua 1 column
        //Lay vi tri cu (tu thang active)
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        //Lay vi tri moi (tu thang over)
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)
        // Dùng array move để xắp xếp cards
        const dndorderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        console.log("dnd", dndorderedCards)
        setOrderedColumns(prevColumns => {
          const nextColumns = cloneDeep(prevColumns)
          //Tim toi column dang tha
          const targetColumn = nextColumns.find(c => c._id === overColumn._id)
          //Cap nhat lai hai gia tri moi card va cardorderIds
          targetColumn.cards = dndorderedCards
          targetColumn.cardOrderIds = dndorderedCards.map(card => card._id)
          //Tra ve gia tri state moi chuan vi tri 
          return nextColumns
        })
      }
    }

    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      //Nếu vị trí sau khi kéo thả khác vtri ban đầu 
      if (active.id !== over.id) {
        //Lay vi tri cu (tu thang active)
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        //Lay vi tri moi (tu thang over)
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)
        // Dùng array move để xắp xếp columns
        const dndorderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)
        // Xử lý dữ liệu call api
        // const dndorderedColumnsIds =dndorderedColumns.map(c => c._id )
        // console.log('dnd', dndorderedColumns)
        //Cập nhật lại state columns sau khi kéo thả
        setOrderedColumns(dndorderedColumns)
      }
    }

    //Nhung du lieu phai dua ve gia tri null ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }
  return (
    <DndContext onDragStart={handleDragStart}
      collisionDetection={closestCorners}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0'
      }}>
        <ListColumns columns={orderedColumns} />
        <DragOverlay dropAnimation={dropAnimation}>
          {!activeDragItemType && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent