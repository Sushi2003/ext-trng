import { configureStore } from '@reduxjs/toolkit'
import {isDev} from "../utils/misc";


const store = configureStore({
  reducer: {},
});

isDev && (window.store = store); // Debugging without redux chrome extension

export default store;
