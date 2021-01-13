import React, { useMemo, useEffect, useReducer, useState, useRef } from 'react';
import { Columns, Column } from './Columns';
import { Rows, Row, FilterRows } from './Rows';
import { Footer, FooterCell } from './Footer';

import Groups from '../utils/Groups';
import GroupsComponent from './Groups/Groups';
import Group from './Groups/Group';
import SearchBar from './SearchBar/SearchBar';
import { Context } from './context'
import reducer from './reducer';
import '../assets/css/style.css';

import MoveComponent from './MoveComponent/MoveComponent';
import GroupListItem from './Groups/GroupListItem';
import Themes from './themes';
import { CALC_FORMULA, DRAG_ELEMENT, MOUSE_DOWN, MOVE_ELEMENT, READY, SET_DATA, SET_GROUPLIST, SET_HOVER } from './Constants/ActionTypes';
import { COLUMN, CONTAINER, GROUP } from './Constants/ColumnTypes';

function Table(props) {

  const [table, setTable] = useState(props.table);
  const [updateGroups, setUpdateGroups] = useState(false);

  const [state, dispatch] = useReducer(reducer, table);
  const groupsListContainer = useRef();

  let { theme, columns, groups, rows, filter, paintRows, ready, hoverElement, dragElement, groupsList } = state || null;
  const marginGroup = useMemo(() => columns.filter(col => col.isGroup === true).length * 20);

  // load or table change
  useEffect(() => {

    if (table.groups)
      createGroups();

    dispatch({ type: READY, payload: true })
    dispatch({ type: CALC_FORMULA });
  }, [table]);

  // if prop rows has been change
  useEffect(() => {
    dispatch({ type: SET_DATA, payload: { theme: Themes[props.table.theme], rows: props.table.rows } });
    setTable({ ...table, ...{ rows: props.table.rows } });
  }, [props.table]);

  // groups update
  useEffect(() => {
    if (groupsList) {
      const newTable = { ...table, columns, groups: groupsList.map(g => g.name) }
      setTable(newTable);
    }
  }, [updateGroups]);

  // order rows if table is loaded
  useEffect(() => {
    if (ready) {
      handleOrderBy(columns.find(c => c?.sort), false);
    }
  }, [ready]);

  useEffect(() => {
    dispatch({ type: SET_DATA, payload: { columns, filter: { ...filter } } });
  }, [columns])

  const createGroups = () => {
    const result = new Groups().create(table)
    dispatch({ type: SET_DATA, payload: result });
    const list = []
    table.groups.forEach(g => {
      const c = columns.find(c => c.name === g);
      list.push({ name: c.name })
    })
    dispatch({ type: SET_GROUPLIST, payload: list })
  }

  const handleMoveStart = (name, type = COLUMN) => {
    dispatch({ type: MOUSE_DOWN, payload: true });
    dispatch({ type: DRAG_ELEMENT, payload: { name, type } });
    isHoverOnGroupsList.current = false;
  }

  const isHoverOnGroupsList = useRef(false)
  const handleMove = (position) => {
    const { left: leftContainer, top: topContainer, height: heightContainer, width: widthContainer } = groupsListContainer.current.getBoundingClientRect();
    if (
      position.left > leftContainer
      && position.left < leftContainer + widthContainer
      && position.top > topContainer
      && position.top < topContainer + heightContainer
    ) {
      if (!isHoverOnGroupsList.current) {        
        dispatch({
          type: SET_HOVER,
          payload: { type: CONTAINER, name: 'groupListContainer' }
        })

        isHoverOnGroupsList.current = true;
      }
    };

    columns.forEach(column => {

      if (!column?.isGroup) {
        const { left, top, height, width } = column.position;
        if (
          position.left + position.width > (left + (width / 2))
          && position.left + (position.width / 2) < left + width
          && position.top + position.height > (top + (height / 2))
          && position.top + (position.height / 2) < top + height
        ) {          
          dispatch({
            type: SET_HOVER,
            payload: { type: COLUMN, name: column.name }
          })
        }
      }
    });

    if (groupsList && groupsList.length) {
      
      groupsList.forEach(group => {
        if (!group.position) return;
        
        const { left, top, height, width } = group.position;
        if (
          position.left + position.width > (left + (width / 2))
          && position.left + (position.width / 2) < left + width
          && position.top + position.height > (top + (height / 2))
          && position.top + (position.height / 2) < top + height
        ) {
          dispatch({
            type: SET_HOVER,
            payload: { type: GROUP, name: group.name }
          })
        }
      });
    }
  }

  const refreshFilter = () => {
    dispatch({ type: SET_DATA, payload: { filter: { ...filter } } });
    handleOrderBy(columns.find(c => c?.sort), false);
  }

  const handleMoveStop = () => {

    // if there are no groups
    if (isHoverOnGroupsList.current === true && !groupsList?.length) {
      setTable({ ...table, groups: [dragElement.name] });
      columns = columns.map(c => {
        if (c.name === dragElement.name) {
          c.isGroup = true
        }
        return c;
      })
      dispatch({ type: SET_DATA, payload: { columns: columns } });
      return;
    }

    dispatch({ type: MOVE_ELEMENT, payload: dragElement });
    dispatch({ type: MOUSE_DOWN, payload: false });
    dispatch({ type: SET_HOVER, payload: '' });
    dispatch({ type: DRAG_ELEMENT, payload: '' });

    if (groupsList) {
      setUpdateGroups(!updateGroups)
      refreshFilter()
    }
  }

  const handleSearchBar = (value) => {
    dispatch({
      type: SET_DATA,
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
      type: SET_DATA,
      payload: { columns: newColumns, filter: { ...filter, ...{ orderBy: [column, sort] } } }
    })
  }

  const handleClick = (row) => {
    dispatch({ type: SET_DATA, payload: { activeRow: row } });
    props.onSelectRow(row)
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
      type: SET_DATA,
      payload: { groups: newGroups }
    })
  }

  return (
    <Context.Provider value={{ handleOrderBy, handleClick, dispatch, state, theme }}>
      <div className="react-table">
        <ul className={'react-table__groups-list'} ref={groupsListContainer}>
          {groupsList &&
            groupsList.map((group, i) =>
              <MoveComponent
                key={i}
                handleMoveStart={() => handleMoveStart(group.name, GROUP)}
                handleMoveStop={handleMoveStop}
                handleMove={handleMove}>
                <GroupListItem
                  key={i}
                  hoverElement={hoverElement?.name}
                  column={group}>{group.name}</GroupListItem>
              </MoveComponent>
            )
          }
        </ul>
        <SearchBar
          onChange={value => handleSearchBar(value)}
          value={filter?.searchStr}></SearchBar>
        {groups?.length ?
          <GroupsComponent>
            <div style={{ marginLeft: marginGroup }}>
              <Columns>
                {columns.filter(c => !c?.isGroup && c?.visible !== false).map((column, i) =>
                  <MoveComponent
                    key={i}
                    handleMoveStart={() => handleMoveStart(column.name)}
                    handleMoveStop={handleMoveStop}
                    handleMove={handleMove}
                  >
                    <Column
                      key={i}
                      hoverElement={hoverElement?.name}
                      column={column}>
                      {column.name}
                    </Column>
                  </MoveComponent>
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
                <MoveComponent
                  key={i}
                  handleMoveStart={() => handleMoveStart(column.name)}
                  handleMoveStop={handleMoveStop}
                  handleMove={handleMove}
                >
                  <Column
                    key={i}
                    hoverElement={hoverElement?.name}
                    column={column}>
                    {column.name}
                  </Column>
                </MoveComponent>
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