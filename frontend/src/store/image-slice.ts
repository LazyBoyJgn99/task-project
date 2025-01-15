import { createSlice } from '@reduxjs/toolkit';

const imageSlice = createSlice({
  name: 'image',
  initialState: {
    mapUrl: '',
  },
  reducers: {
    setMapUrl: (state, action) => {
      return {
        ...state,
        mapUrl: action.payload,
      };
    },
  },
});

export const imageReducer = imageSlice.reducer;
export const { setMapUrl } = imageSlice.actions;
