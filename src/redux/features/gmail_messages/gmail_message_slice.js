import { createSlice } from '@reduxjs/toolkit'

export const gmailMessageSlice = createSlice({
  name: 'gmailMessages',
  initialState: {
    messages: {},
  },
  reducers: {
    addMessage: (state, action) => {
      const { messageId, messageDetails } = action.payload
      state.messages[messageId] = messageDetails
    },
    deleteMessage: (state, action) => {
      const { messageId } = action.payload
      delete state.messages[messageId]
    },
    updateMessage: (state, action) => {
      const { messageId, messageDetails } = action.payload
      state.messages[messageId] = {
        ...state.messages[messageId],
        ...messageDetails,
      }
    },
  },
})

// Action creators are generated for each case reducer function
export const { addMessage, deleteMessage, updateMessage } = gmailMessageSlice.actions

export default gmailMessageSlice.reducer