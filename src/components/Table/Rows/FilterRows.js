function FilterRows(props) {
  const excludeColumns = ['id'];

  const sortRows = (column, revers = true) => {
    if (!column) return;

    const newColumns = columns.map(c => {
      let sort = '';
      if (c.name === column.name) {
        sort = revers === true ? c.sort === 'asc' ? 'desc' : 'asc' : column.sort;
      }
      return { ...c, sort: sort }
    });

    const sort = newColumns.find(c => c.name === column.name).sort;

    const newRows = [...rows].sort((a, b) => {
      return (sort === 'asc' ?
        a[column.name] > b[column.name]
        : a[column.name] < b[column.name]) ? 1 : -1
    });

    dataTable = { ...dataTable, ...{ rows: newRows }, ...{ columns: newColumns } }
    setDataTable(dataTable);
  }

  let filteredData = [];
  const filterData = (value) => {
    const lowercasedValue = value.toLowerCase().trim();
    if (lowercasedValue === '') {
      return props.rows;
    } else {
      filteredData = [...props.rows].filter(item => {
        return Object.keys(item).some(key =>
          excludeColumns.includes(key) ? false : item[key].toString().toLowerCase().includes(lowercasedValue)
        );
      });

    }
    return filteredData;
  }

  return (props.searchResult(filterData(props.searchStr || '')))
}
export default FilterRows;