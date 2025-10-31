import { createSlice } from '@reduxjs/toolkit'

const taskSlice = createSlice({
  name: 'task',
  initialState: {
    task: []
  },
  reducers: {
    addTask: (state, action) => {
        state.task = action.payload
    }
  }
})

export const { addTask } = taskSlice.actions
export default taskSlice.reducer;