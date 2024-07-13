import { configureStore } from '@reduxjs/toolkit'
import {isDev} from "../utils/misc";
import gmailMessageReducer from './features/gmail_messages/gmail_message_slice';

const store = configureStore({
  reducer: {
    gmailMessages: gmailMessageReducer
  },
});

isDev && (window.store = store); // Debugging without redux chrome extension

export default store;