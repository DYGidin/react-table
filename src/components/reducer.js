import Calc from '../utils/Calc';
import Groups from '../utils/Groups';
import {
  READY,
  SET_DATA,
  MOUSE_DOWN,
  MOVE_ELEMENT,
  DRAG_ELEMENT,
  SET_HOVER,
  CALC_FORMULA,
  SET_COLUMN_POSITION,
  CREATE_GROUPS,
  SET_GROUP_POSITION,
  ORDER_BY
} from './Constants/ActionTypes'
import { GROUP } from './Constants/ColumnTypes';


export default function (state, action) {
  switch (action.type) {
    case READY:
      return { ...state, ready: action.payload }
    case SET_DATA:
      return { ...state, ...action.payload }
    case MOUSE_DOWN:
      return { ...state, mouseDown: action.payload }
    case MOVE_ELEMENT:
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
          case GROUP:
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
        case GROUP:

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

          state.columns = moveArr(state.columns, currentIndex, newIndex);
          break;
      }

      return { ...state, mouseDown: false, hoverElement: null, dragElement: null }
    case DRAG_ELEMENT:
      return { ...state, dragElement: action.payload }
    case SET_HOVER:
      return { ...state, hoverElement: action.payload };
    case CALC_FORMULA:
      state.columns.filter(col => col.formula).forEach(column => {
        state.rows = state.rows.map(row => {
          let newRow = {}
          newRow[column.name] = Calc.formula(row, column.formula);
          return { ...row, ...newRow }
        });
      });
      return { ...state };
    case SET_COLUMN_POSITION:
      state.columns = state.columns.map(col => {
        if (col.name === action.payload.name) {
          col.position = action.payload.position
        }
        return col
      })
      return state;
    case CREATE_GROUPS:

      const result = new Groups().create(action.payload)
      state = { ...state, ...result };

      const list = []
      action.payload.groups.forEach(g => {
        const c = state.columns.find(c => c.name === g);
        list.push({ name: c.name })
      })

      return { ...state, groupsList: list }
    case SET_GROUP_POSITION:
      state.groupsList = state.groupsList.map(group => {
        if (group.name === action.payload.name) {
          group.position = action.payload.position
        }
        return group
      })

      return state;
    case ORDER_BY:

      const newColumns = state.columns.map(c => {
        let sort = '';
        if (c.name === action.payload.column.name) {
          sort = action.payload.revers === true ? (c.sort === 'asc' ? 'desc' : 'asc') : action.payload.column.sort;
        }
        return { ...c, sort: sort }
      });

      const sort = newColumns.find(c => c.name === action.payload.column.name).sort;

      return { ...state, ...{ columns: newColumns, filter: { ...state.filter, ...{ orderBy: [action.payload.column, sort] } } } };
    default:
      return state;
  }
}