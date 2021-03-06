import React, { useMemo, useEffect, useReducer, useState, useRef } from 'react';
import PropTypes from 'prop-types';
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
import '../assets/fonts/boxicons/css/boxicons.min.css'
import MoveComponent from './MoveComponent/MoveComponent';
import GroupListItem from './Groups/GroupListItem';
import Themes from './themes';
import { CALC_FORMULA, DRAG_ELEMENT, MOUSE_DOWN, MOVE_ELEMENT, ORDER_BY, READY, SET_DATA, CREATE_GROUPS, SET_HOVER } from './Constants/ActionTypes';
import { COLUMN, CONTAINER, GROUP } from './Constants/ColumnTypes';

export const Table = (props) => {

  const [table, setTable] = useState(props.table);
  const [updateGroups, setUpdateGroups] = useState(false);

  const [state, dispatch] = useReducer(reducer, table);
  const groupsListContainer = useRef();

  let {
    theme,
    columns,
    groups,
    rows,
    filter,
    paintRows,
    ready,
    hoverElement,
    dragElement,
    groupsList,
    showGroups,
    moveColumns,
    showFooter,
    showFilter } = state || null;
  const marginGroup = useMemo(() => columns.filter(col => col.isGroup === true).length * 20, [columns]);

  // load or table change
  useEffect(() => {
    if (table.groups)
      dispatch({ type: CREATE_GROUPS, payload: table })
    dispatch({ type: READY, payload: true })
    dispatch({ type: CALC_FORMULA });

  }, [table]);

  // if prop rows has been change
  useEffect(() => {

    dispatch({
      type: SET_DATA, payload: {
        theme: Themes[props.table.theme],
        showGroups: props.table.showGroups,
        moveColumns: props.table.moveColumns,
        showFooter: props.table.showFooter,
        showFilter: props.table.showFilter,
        rows: props.table.rows
      }
    });
    setTable({ ...table, ...{ rows: props.table.rows } });
  }, [props.table]);

  // groups update
  useEffect(() => {
    if (groupsList) {
      const newTable = { ...table, columns, groups: groupsList.map(g => g.name) }
      setTable(newTable);
      dispatch({ type: SET_HOVER, payload: null });
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

  const handleMoveStart = (name, type = COLUMN) => {
    dispatch({ type: MOUSE_DOWN, payload: true });
    dispatch({ type: DRAG_ELEMENT, payload: { name, type } });
    isHoverOnGroupsList.current = false;
  }

  const isHoverOnGroupsList = useRef(false)
  const handleMove = (position) => {
    if (groupsListContainer.current) {
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
    }


    columns.forEach(column => {

      if (!column?.isGroup) {
        const { left, top, height, width } = column.position;
        if (
          position.left + position.width > (left + (width / 2))
          && position.left + (position.width / 2) < left + width
          && position.top + position.height > (top + (height / 2))
          && position.top + (position.height / 2) < top + height
        ) {
          isHoverOnGroupsList.current = false;
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
    if (groupsList) {
      setUpdateGroups(!updateGroups)
    }
    refreshFilter()
  }

  const handleSearchBar = (value) => {
    dispatch({
      type: SET_DATA,
      payload: { filter: { ...filter, ...{ searchStr: value } } }
    })
  }

  const handleOrderBy = (column, revers = true) => {
    if (!column) return;
    dispatch({
      type: ORDER_BY,
      payload: { column, revers }
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
      {ready ?
        <div className="react-table">
          {showGroups &&
            <ul className={'react-table__groups-list'} ref={groupsListContainer}>
              {groupsList && groupsList.length ?
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
                ) : <li className={'react-table__groups-list-empty'}>Move column here for grouping</li>
              }
            </ul>
          }
          {showFilter &&
            <SearchBar
              onChange={value => handleSearchBar(value)}
              value={filter?.searchStr}></SearchBar>}
          {groups?.length ?
            <GroupsComponent>
              <div style={{ marginLeft: marginGroup }}>
                <Columns>
                  {columns.filter(c => !c?.isGroup && c?.visible !== false).map((column, i) =>
                    <React.Fragment key={i}>
                      {moveColumns ?
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
                        :
                        <Column
                          key={i}
                          hoverElement={hoverElement?.name}
                          column={column}>
                          {column.name}
                        </Column>
                      }
                    </React.Fragment>
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
                        {showFooter &&
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
                        }
                      </div>
                    </>}
                </React.Fragment>
              )}
            </GroupsComponent>
            :
            <>
              <Columns>
                {columns.filter(c => c?.visible !== false).map((column, i) =>
                  <React.Fragment key={i}>
                    {moveColumns ?
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
                      :
                      <Column
                        key={i}
                        hoverElement={hoverElement?.name}
                        column={column}>
                        {column.name}
                      </Column>}
                  </React.Fragment>
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
              {showFooter &&
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
              }
            </>
          }
        </div>
        : '<p>Please wait...</p>'}
    </Context.Provider>
  );
}


Table.propTypes = {
  table: PropTypes.shape({
    name: PropTypes.string,
    columns: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      type: PropTypes.func,
      render: PropTypes.func,
      sort: PropTypes.oneOf(['asc', 'desc']),
      formula: PropTypes.string,
      total: PropTypes.func
    })),
    rows: PropTypes.array,
    paintRows: PropTypes.arrayOf(PropTypes.shape({
      type: PropTypes.oneOf(['row', 'cell']),
      name: PropTypes.string.isRequired,
      style: PropTypes.object.isRequired,
      condition: PropTypes.func.isRequired
    })),
    theme: PropTypes.string,
    activeRow: PropTypes.number,
    groups: PropTypes.array,
    showGroups: PropTypes.bool,
    showFooter: PropTypes.bool,
    moveColumns: PropTypes.bool,
    showFilter: PropTypes.bool,
    filter: PropTypes.shape({
      searchStr: PropTypes.string.isRequired
    }),
    onSelectRow: PropTypes.func,
  })
}