import React, { useMemo, useEffect, useReducer } from 'react';
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


function Table({ table }) {

  const [state, dispatch] = useReducer(reducer, table);

  let { columns, groups, rows, filter, paintRows, ready, moveColumn, hoverColumn, groupsList } = state || null;
  const marginGroup = useMemo(() => columns.filter(col => col.isGroup === true).length * 20);

  useEffect(() => {
    dispatch({ type: 'calc-formula' })
    if (table.groups) {
      const result = new Groups().create(table)
      dispatch({ type: 'set-data', payload: result });
      const list = []
      table.groups.forEach(g => {
        const c = columns.find(c => c.name === g);
        list.push({ name: c.name })
      })

      dispatch({ type: 'set-grouplist', payload: list })
    }

    dispatch({ type: 'ready', payload: true })
  }, [table]);

  useEffect(() => {
    if (ready) {
      handleOrderBy(columns.find(c => c?.sort), false);
    }
  }, [ready]);

  const handleMoveStart = (columnName) => {
    dispatch({ type: 'mouse-down', payload: true });
    dispatch({ type: 'move-column', payload: columnName });
  }

  const handleMove = (position) => {
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
            type: 'set-hover',
            payload: column.name
          })
        }
      }
    });

    if (groupsList && groupsList.length) {
      groupsList.forEach(group => {
        const { left, top, height, width } = group.position;
        if (
          position.left + position.width > (left + (width / 2))
          && position.left + (position.width / 2) < left + width
          && position.top + position.height > (top + (height / 2))
          && position.top + (position.height / 2) < top + height
        ) {
          dispatch({
            type: 'set-hover',
            payload: group.name
          })
        }
      });
    }

  }

  const handleMoveStop = () => {
    dispatch({ type: 'mouse-up', payload: moveColumn });
    dispatch({ type: 'mouse-down', payload: false });
    dispatch({ type: 'set-hover', payload: '' });
    dispatch({ type: 'move-column', payload: '' });
    dispatch({ type: 'set-data', payload: { filter: { ...filter } } });
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
    <Context.Provider value={{ handleOrderBy, dispatch, state }}>
      <div className="react-table">
        <ul className="react-table__groups-list">
          {groupsList &&
            groupsList.map((group, i) =>
              <MoveComponent
                key={i}
                handleMoveStart={() => handleMoveStart(group.name)}
                handleMoveStop={handleMoveStop}
                handleMove={handleMove}>
                <GroupListItem
                  key={i}
                  hoverColumn={hoverColumn}
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
                      hoverColumn={hoverColumn}
                      column={column}>{column.name}</Column>
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
                    hoverColumn={hoverColumn}
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
// React.memo(Table, (prevProps, nextProps) => {
//  return prevProps.filter &&  prevProps.filter === nextProps.filter ? true : false
// });
