function FilterRows({ rows, filter, result }) {
  const excludeColumns = ['id'];

  const orderBy = (column, sort = 'asc') => {
    if (!column) return;
    const newRows = [...rows].sort((a, b) => {
      return (sort === 'asc' ?
        a[column] > b[column]
        : a[column] < b[column]) ? 1 : -1
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