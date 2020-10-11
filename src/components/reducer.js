import Calc from '../utils/Calc'
export default function (state, action) {
  switch (action.type) {
    case 'ready':
      return { ...state, ready: action.payload }
    case 'set-data':
      return { ...state, ...action.payload }
    case 'mouse-down':
      return { ...state, mouseDown: action.payload }
    case 'mouse-up':

      const moveArr = (arr, old_index, new_index) => {
        if (new_index >= arr.length) {
          let k = new_index - arr.length + 1;
          while (k--) {
            arr.push(undefined);
          }
        }
        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
      }

      if (!state.mouseDown)
        return { ...state, mouseDown: false };

      const newIndex = state.columns.indexOf(state.columns.find(c => c.name === state.hoverColumn));
      const oldIndex = state.columns.indexOf(state.columns.find(c => c.name === action.payload));

      if (newIndex === -1)
        return { ...state, mouseDown: false };

      state.columns = moveArr(state.columns, oldIndex, newIndex);

      state.mouseDown = false
      return { ...state, mouseDown: false }
    case 'move-column':
      return { ...state, moveColumn: action.payload }
    case 'calc-formula':
      state.columns.filter(col => col.formula).forEach(column => {
        state.rows = state.rows.map(row => {
          let newRow = {}
          newRow[column.name] = Calc.formula(row, column.formula);
          return { ...row, ...newRow }
        });
      });
      return { ...state };
    case 'set-column-postion':
      state.columns = state.columns.map(col => {
        if (col.name === action.payload.name) {
          col.position = action.payload.position
        }
        return col
      })
      return state;
    case 'set-grouplist':
      return { ...state, groupsList: action.payload }
    case 'set-group-position':
      state.groupsList = state.groupsList.map(group => {        
        if (group.name === action.payload.name) {
          group.position = action.payload.position
        }
        return group
      })
      
      return state;
    case 'set-hover':
      state.hoverColumn = '';
      state.columns.forEach(col => {
        if (col.name === action.payload) {
          state.hoverColumn = col.name
        }
      })
      return { ...state };
    default:
      return state;
  }
}