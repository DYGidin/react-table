import React from 'react'
function FilterRows({ rows, filter, excludeColumns = [], result }) {

  const orderBy = (column, sort = 'asc') => {

    if (!column) return;
    const newRows = [...rows].sort((a, b) => {
      if (column.type === Number)
        return (sort === 'asc' ?
          parseFloat(a[column.name]) > parseFloat(b[column.name])
          : parseFloat(a[column.name]) < parseFloat(b[column.name])) ? 1 : -1
      else
        return (sort === 'asc' ?
          a[column.name] > b[column.name]
          : a[column.name] < b[column.name]) ? 1 : -1
    });

    return newRows;
  }


  const filterData = () => {
    let filteredData = [...rows];

    if (filter?.orderBy)
      filteredData = orderBy(filter.orderBy[0], filter.orderBy[1])

    const lowercasedValue = filter?.searchStr ? filter.searchStr.toLowerCase().trim() : '';

    if (lowercasedValue === '') {
      return filteredData;
    } else {
      filteredData = [...filteredData].filter(item => {
        return Object.keys(item).some(key =>
          excludeColumns.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });      
    }
    return filteredData;
  }

  return (result(filterData()))
}
export default React.memo(FilterRows, (prevProps, nextProps) => {
  const check = (prevProps.filter && prevProps.filter === nextProps.filter ? true : false) && (prevProps.rows[0] === nextProps.rows[0] ? true : false)
  return check
});

