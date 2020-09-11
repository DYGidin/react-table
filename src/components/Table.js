import React, { useState, useEffect, useCallback, useRef, useReducer } from 'react';
import { Columns, Column } from './Columns';
import { Rows, Row, FilterRows } from './Rows';
import { Footer, FooterCell } from './Footer';
import Calc from '../utils/Calc';
import Groups from '../utils/Groups';
import GroupsComponent from './Groups/Groups';
import Group from './Groups/Group';
import SearchBar from './SearchBar/SearchBar';
import { Context } from './context'
import reducer from './reducer';
import '../assets/css/style.css';
function Table({ table }) {
  const [state, dispatch] = useReducer(reducer, table);
  const { columns, groups, rows, filter, paintRows, ready, mouseDown, moveColumn } = state || null;
  const marginGroup = columns.filter(col => col.isGroup === true).length * 20;

  useEffect(() => {
    calcFormulaRows();
    if (table.groups) {
      const result = new Groups().create(table)
      dispatch({ type: 'set-data', payload: result })
    }
    dispatch({ type: 'ready', payload: true })
  }, [table]);

  useEffect(() => {
    if (ready) {
      handleOrderBy(columns.find(c => c?.sort), false);
      document.addEventListener('mouseup', () => {
        dispatch({ type: 'mouse-down', payload: false })
      });
    }
  }, [ready]);

  useEffect(() => {
    if (mouseDown)
      document.addEventListener('mousemove', move)
    else
      dispatch({ type: 'move-column', payload: null })

    return () => document.removeEventListener('mousemove', move)
  }, [mouseDown])

  const move = e => {
    e.preventDefault();
    const style = moveColumn.style;
    const { offsetX, offsetY } = offset.current;
    const { scrollX, scrollY } = window;
    const position = {
      display: 'initial',
      left: (e.pageX - offsetX - scrollX),
      top: (e.pageY - offsetY - scrollY)
    }
    console.log(columns)
    columns.forEach(col => {
      const { left, right, top, bottom, width } = col.el.getBoundingClientRect();

      if (position.left > left && position.left < left + width && moveColumn.name !== col.name && !col?.isGroup)
        console.log(col.name)
    })
    dispatch({
      type: 'move-column',
      payload: { ...moveColumn, ...{ style: { ...style, ...position } } }
    })
  }

  const offset = useRef();
  const handeMouseDown = ({ column, el, event }) => {
    const { left, top, width, height } = el.current.getBoundingClientRect();

    offset.current = {
      offsetX: event.clientX - left,
      offsetY: event.clientY - top
    }

    const style = {
      display: 'none',
      left,
      top,
      width,
      height,
      position: 'fixed',
      zIndex: 9999
    }

    dispatch({ type: 'move-column', payload: { ...column, ...{ style } } })
    dispatch({ type: 'mouse-down', payload: true })
  }

  const calcFormulaRows = () => {
    columns.filter(col => col.formula).forEach(column => {
      rows.map(row => {
        let newRow = {}
        newRow[column.name] = Calc.formula(row, column.formula);
        return {
          ...row, ...newRow
        }
      });
    });
  }

  const handleSearchBar = (value) => {
    dispatch({
      type: 'set-data',
      payload: { filter: { ...filter, ...{ searchStr: value } } }
    })
  }

  const handleOrderBy = (column, revers = true) => {
    if (!column) return;

    const newColumns = columns.map(c => {
      let sort = '';
      if (c.name === column.name) {
        sort = revers === true ? (c.sort === 'asc' ? 'desc' : 'asc') : column.sort;
      }
      return { ...c, sort: sort }
    });

    const sort = newColumns.find(c => c.name === column.name).sort;
    dispatch({
      type: 'set-data',
      payload: { columns: newColumns, filter: { ...filter, ...{ orderBy: [column, sort] } } }
    })
  }

  const handleOpenClose = ({ group, open }) => {
    const groupData = new Groups().getGroupData(group.path);
    const matchStr = groupData.path.join(',').replaceAll(',', '}{');
    const newGroups = groups.map(g => {
      if (g.path.indexOf(matchStr) !== -1 && group.name !== g.name)
        return { ...g, ...{ visible: open } }
      else if (g.path.indexOf(matchStr) !== -1 && group.name === g.name)
        return { ...g, ...{ open: open } }
      else
        return g
    });
    dispatch({
      type: 'set-data',
      payload: { groups: newGroups }
    })
  }

  return (
    <Context.Provider value={{ handeMouseDown, dispatch }}>
      <div className="react-table">
        {moveColumn &&
          <div className="column-move" style={moveColumn?.style}>
            <Column column={moveColumn}>{moveColumn.name}</Column>
          </div>
        }
        <SearchBar
          onChange={useCallback(value => handleSearchBar(value), [filter])}
          value={filter?.searchStr}></SearchBar>
        {groups?.length ?
          <GroupsComponent>
            <div style={{ marginLeft: marginGroup }}>
              <Columns>
                {columns.filter(c => c?.isGroup === false && c?.visible !== false).map((column, i) =>
                  <Column
                    key={i}
                    onClickEvn={handleOrderBy}
                    mouseDown={handeMouseDown}
                    column={column}>{column.name}</Column>
                )}
              </Columns>
            </div>
            {groups.map((group, i) =>
              <React.Fragment key={i}>
                {group?.visible &&
                  <Group group={group} openClose={(e) => handleOpenClose(e)}>
                    {group.key}: {group.name}
                  </Group>
                }
                {group.root === false && group?.visible && group?.open &&
                  <>
                    <div className="react-table__group-content" style={{ marginLeft: marginGroup }}>
                      <Rows>
                        <FilterRows
                          rows={rows.filter(r => r.path === group.path)}
                          filter={filter}
                          result={(rows) =>
                            rows.map((row, i) =>
                              <Row paintRows={paintRows} columns={columns} row={row} key={i} index={i} />
                            )
                          }>
                        </FilterRows>
                      </Rows>
                      <Footer columns={columns}>
                        {columns.map((column, i) =>
                          !column?.isGroup && column?.visible !== false &&
                          <FilterRows
                            rows={rows.filter(r => r.path === group.path)}
                            filter={filter}
                            key={i}
                            result={(rows, i) =>
                              <FooterCell column={column} rows={rows} />
                            }>
                          </FilterRows>
                        )}
                      </Footer>
                    </div>
                  </>}
              </React.Fragment>
            )}
          </GroupsComponent>
          :
          <>
            <Columns>
              {columns.filter(c => c?.visible !== false).map((column, i) =>
                <Column key={i} onClickEvn={handleOrderBy} column={column}>
                  {column.name}
                </Column>
              )}
            </Columns>
            <Rows>
              <FilterRows
                rows={rows}
                filter={filter}
                result={(rows) =>
                  rows.map((row, i) =>
                    <Row paintRows={paintRows} columns={columns} row={row} key={i} index={i} />)
                }>
              </FilterRows>
            </Rows>
            <Footer columns={columns}>
              {columns.filter(c => c?.visible !== false).map((column, i) =>
                <FilterRows
                  rows={rows}
                  filter={filter}
                  key={i}
                  result={(rows, i) =>
                    <FooterCell column={column} rows={rows} />
                  }>
                </FilterRows>
              )}
            </Footer>
          </>
        }
      </div>
    </Context.Provider>
  );
}

export default Table;
