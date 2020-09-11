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
      filteredData = [...rows].filter(item => {
        return Object.keys(item).some(key =>
          excludeColumns.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });
    }
    return filteredData;
  }

  return (result(filterData()))
}
export default FilterRows;