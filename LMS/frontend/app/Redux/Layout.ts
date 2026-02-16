import { createSlice } from "@reduxjs/toolkit";


export interface LayoutSlice {
    hero:{
        image:string,
        title:string,
        subtitle:string
    },
    faqs:[{question:string,answer:string}],
    categories:[{title:string}]
}    

const initialState: LayoutSlice = {
  hero:{
    image:'',
    title:'',
    subtitle:''
  },
  faqs:[{question:'',answer:''}],
  categories:[{title:''}]
};

export const LayoutReducer = createSlice({
  name: "layout",
  initialState,
  reducers: {
    dispatchHeroSection: (state, action) => {
      state.hero = action.payload
    },
    dispatchFaqs: (state, action) => {
      state.faqs = action.payload
    },
    dispatchCategories: (state, action) => {
      state.categories = action.payload
    },
  },
});

// Action creators are generated for each case reducer function
export const { dispatchHeroSection,dispatchCategories,dispatchFaqs } = LayoutReducer.actions;

export default LayoutReducer.reducer;
