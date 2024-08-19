import { configureStore } from '@reduxjs/toolkit'
import {isDev} from "../utils/misc";
import gmailMessageReducer from './features/OpenAi_messages/OpenAi_message_slice';

const store = configureStore({
  reducer: {
  },
});

isDev && (window.store = store); // Debugging without redux chrome extension

export default store;