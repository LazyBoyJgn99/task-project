import { configureStore } from '@reduxjs/toolkit';
import { systemReducer } from './system-slice';
import { imageReducer } from './image-slice';

export default configureStore({
  reducer: {
    system: systemReducer,
    image: imageReducer,
  },
});
