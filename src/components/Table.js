import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Columns, Column } from './Columns';
import { Rows, Row, FilterRows } from './Rows';
import { Footer, FooterCell } from './Footer';
import Calc from '../utils/Calc';
import Groups from '../utils/Groups';
import GroupsComponent from './Groups/Groups';
import Group from './Groups/Group';
import SearchBar from './SearchBar/SearchBar';
import { Context } from './context'
import '../assets/css/style.css';
function Table({ table }) {

  const [dataTable, setDataTable] = useState(table);
  const [filter, setFilter] = useState(table.filter || null);
  const [dataReady, setDataReady] = useState(false);
  const [moveColumn, setMoveColumn] = useState(null);
  const [mouseDown, setMouseDown] = useState(false);
  const { columns, groups, rows } = dataTable || [];
  const marginGroup = columns.filter(col => col.isGroup === false).length * 20;

  useEffect(() => {
    calcFormulaRows();
    if (table.groups) {
      const result = new Groups().create(table)
      setDataTable(result);
    }
    setDataReady(true);
    document.addEventListener('mouseup', () => {
      setMouseDown(false);
      setMoveColumn(null);

    });

  }, [table]);

  useEffect(() => {
    if (dataReady)
      handleOrderBy(dataTable.columns.find(c => c?.sort), false);


  }, [dataReady]);


  useEffect(() => {
    if (mouseDown)
      document.addEventListener('mousemove', move)


    return () => {
      document.removeEventListener('mousemove', move)
    }
  }, [mouseDown])




  const move = e => {
    e.preventDefault();
    const mstyle = moveColumn.style;
    const { offsetX, offsetY } = offset.current;
    setMoveColumn({ ...moveColumn, ...{ style: { ...mstyle, ...{ left: (e.pageX - offsetX) + 'px', top: (e.pageY - offsetY) + 'px' } } } })
  }
  const offset = useRef();
  const handeMouseDown = ({ column, el, e }) => {
    const { left, top, width, height } = el.current.getBoundingClientRect();

    offset.current = {
      offsetX: e.clientX - left,
      offsetY: e.clientY - top
    }

    setMoveColumn({ ...column, ...{ style: { left, top, width, height, position: 'fixed', zIndex: 9999 } } });
    setMouseDown(true)
  }

  const calcFormulaRows = () => {
    dataTable.columns.filter(col => col.formula).forEach(column => {
      dataTable.rows = dataTable.rows.map(row => {
        let newRow = {}
        newRow[column.name] = Calc.formula(row, column.formula);
        return {
          ...row, ...newRow
        }
      });
    });
  }

  const handleSearchBar = (value) => {
    setFilter({ ...filter, ...{ searchStr: value } })
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
    setDataTable({ ...dataTable, ...{ columns: newColumns } });
    setFilter({ ...filter, ...{ orderBy: [column, sort] } });
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

    setDataTable({ ...dataTable, ...{ groups: newGroups } });
  }



  return (
    <Context.Provider value={{ handeMouseDown }}>
      <div className="react-table">
        {moveColumn &&
          <div className="column-move" style={moveColumn?.style}>
            <Column column={moveColumn}>{moveColumn.name}</Column>
          </div>
        }
        <SearchBar
          onChange={useCallback(value => handleSearchBar(value), [])}
          value={filter?.searchStr}></SearchBar>
        {groups?.length ?
          <GroupsComponent>
            <div style={{ marginLeft: marginGroup }}>
              <Columns>
                {columns.filter(c => c?.isGroup !== false && c?.visible !== false).map((column, i) =>
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
                              <Row paintRows={table.paintRows} columns={columns} row={row} key={i} index={i} />
                            )
                          }>
                        </FilterRows>
                      </Rows>
                      <Footer columns={columns}>
                        {columns.map((column, i) =>
                          column?.isGroup && column?.visible !== false &&
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
                    <Row paintRows={dataTable.paintRows} columns={columns} row={row} key={i} index={i} />)
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
