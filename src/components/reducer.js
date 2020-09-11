export default function (state, action) {
  switch (action.type) {
    case 'ready':
      return { ...state, ready: action.payload }
    case 'set-data':
      return { ...state, ...action.payload }
    case 'mouse-down':
      return { ...state, mouseDown: action.payload }
    case 'move-column':
      return { ...state, moveColumn: action.payload }
    case 'set-column':
      state.columns = state.columns.map(col => {
        if (col.name === action.payload.column.name) {
          col.el = action.payload.el
        }
        return col
      })
      return state;
    default:
      return state;
  }
}