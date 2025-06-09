import { createSlice, PayloadAction } from '@reduxjs/toolkit';



export interface PageSettings {
  font: string;
  smallText: boolean;
  fullWidth: boolean;
  lock: boolean;
}

export interface CoverPicture {
  url: string;
  verticalPosition: number;
}

export interface PageState {
  id: string;
  title: string;
  icon: string;
  content: any;
  pageSettings: PageSettings;
  coverPicture: CoverPicture;
}

const initialState: { pageInfo: PageState | null } = {
  pageInfo: null,
};

const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    setPage: (s, a: PayloadAction<PageState>) => {
      s.pageInfo = a.payload;
      localStorage.setItem('pageInfo', JSON.stringify(a.payload));
    },
    clearPage: s => {
      s.pageInfo = null;
      localStorage.removeItem('pageInfo');
    },
  },
});

export const { setPage, clearPage } = pageSlice.actions;
export default pageSlice.reducer;
