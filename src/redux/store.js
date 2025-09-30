//Redux : state management tool
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'
import { combineReducers } from '@reduxjs/toolkit'
import persistReducer from 'redux-persist/lib/persistReducer'
import storage from 'redux-persist/lib/storage'

//Cau hinh persist
const rootPersistConfig = {
  key: 'root',
  storage: storage,
  whitelist: ['user']
}
//combine cac reducer trong du an
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

const persistedReducer = persistReducer(rootPersistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  //FIx warning error when implement redux-persist
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false })
})
