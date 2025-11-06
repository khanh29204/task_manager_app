import {combineReducers, configureStore} from '@reduxjs/toolkit';
import {persistStore, persistReducer, PersistConfig} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/es/stateReconciler/autoMergeLevel2';

import {taskReducer} from './slice/task.slice';
import {notificationReducer} from './slice/notification.slice';
import {mmkvStorage} from './storage';

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

const taskPersistConfig: PersistConfig<ReturnType<typeof taskReducer>> = {
  key: 'task',
  storage: mmkvStorage,
  stateReconciler: autoMergeLevel2,
  throttle: 2000,
  whitelist: ['tasks'],
};

const rootReducer = combineReducers({
  task: persistReducer(taskPersistConfig, taskReducer),
  notification: notificationReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
});

export const persistor = persistStore(store);
