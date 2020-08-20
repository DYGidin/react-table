const Utils = {
  sum: (val) => val.reduce((acc, val) => acc + val),
  count: (val) => val.reduce((acc, val) => acc + 1, 0),
  max: (val) => val.reduce((acc, val) => Math.max(acc, val)),
  min: (val) => val.reduce((acc, val) => Math.min(acc, val)),
  formula: (val, formulaStr) => {
    try {
      const keys = formulaStr.match(/[^{}]+(?=\})/g);
      const values = keys.map(k => {
        return {
          name: '{' + k + '}',
          value: val[k]
        }
      });

      values.forEach(v => {
        formulaStr = formulaStr.replace(v.name, v.value, '/g');
      });

      return eval(formulaStr);
    }
    catch (error) {
      throw new Error('Error formula parsing');
    }
  },
  groupBy: (items, key) => items.reduce(
    (result, item) => ({
      ...result,
      [item[key]]: [
        ...(result[item[key]] || []),
        item,
      ],
    }),
    {},
  )
}

export default Utils;