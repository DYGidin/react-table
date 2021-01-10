import Calc from '../utils/Calc'
export default function (state, action) {
  switch (action.type) {
    case 'ready':
      return { ...state, ready: action.payload }
    case 'set-data':
      return { ...state, ...action.payload }
    case 'mouse-down':
      return { ...state, mouseDown: action.payload }
    case 'move-element':
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

      if (!state.mouseDown || !state.hoverElement)
        return { ...state, mouseDown: false };

      let newIndex;
      let currentIndex = newIndex = -1;

      // move column to groups or group to columns
      if (state.dragElement.type !== state.hoverElement.type) {

        switch (state.dragElement.type) {
          case 'group':
            newIndex = state.columns.indexOf(state.columns.find(g => g.name === state.hoverElement.name));
            const group = state.groupsList.find(c => c.name === action.payload.name);
            let col = state.columns.find(c => c.name === action.payload.name);
            col.isGroup = false;
            currentIndex = state.groupsList.indexOf(group);
            const oldIndex = state.columns.indexOf(col);
            if (newIndex === -1) return { ...state, mouseDown: false };

            state.groupsList.splice(currentIndex, 1);
                      
            if (Math.abs(newIndex - oldIndex) !== 1)
              state.columns = moveArr(state.columns, oldIndex, newIndex);

            return { ...state, mouseDown: false }
          default:
            
            newIndex = state.groupsList.indexOf(state.groupsList.find(g => g.name === state.hoverElement.name));
            let column = state.columns.find(c => c.name === action.payload.name);
            currentIndex = state.columns.indexOf(column);

            if (newIndex === -1) return { ...state, mouseDown: false };

            column.isGroup = true;
            state.groupsList.splice(newIndex, 0, { name: action.payload.name, position: null });
            return { ...state, mouseDown: false }
        }
      }

      switch (action.payload.type) {
        case 'group':
        
          newIndex = state.groupsList.indexOf(state.groupsList.find(g => g.name === state.hoverElement.name));
          currentIndex = state.groupsList.indexOf(state.groupsList.find(c => c.name === action.payload.name));

          if (newIndex === -1)
            return { ...state, mouseDown: false };

          state.groupsList = moveArr(state.groupsList, currentIndex, newIndex);
          break;
        default:          
          newIndex = state.columns.indexOf(state.columns.find(c => c.name === state.hoverElement.name));
          currentIndex = state.columns.indexOf(state.columns.find(c => c.name === action.payload.name));
          if (newIndex === -1)
            return { ...state, mouseDown: false };
            console.log(state.columns)
          state.columns = moveArr(state.columns, currentIndex, newIndex);
          break;
      }

      return { ...state, mouseDown: false }
    case 'drag-element':
      return { ...state, dragElement: action.payload }
    case 'set-hover':
      return { ...state, hoverElement: action.payload };
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
    default:
      return state;
  }
}