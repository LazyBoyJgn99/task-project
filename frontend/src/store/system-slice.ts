import { createSlice } from '@reduxjs/toolkit';
import Taro from '@tarojs/taro';

const systemSlice = createSlice({
  name: 'system',
  initialState: {
    tabbarIndex: 0,
    barHeight: Taro.getSystemInfoSync().statusBarHeight || 0,
  },
  reducers: {
    setTabbarIndex: (state, action) => {
      return {
        ...state,
        tabbarIndex: action.payload,
      };
    },
  },
});

export const systemReducer = systemSlice.reducer;
export const { setTabbarIndex } = systemSlice.actions;
