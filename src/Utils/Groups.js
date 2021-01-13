/**
 * Autor: Denis Gidin
 * Version 1.0
 * Description:
 * Class for creating groups 
 */
import Calc from './Calc';

class Groups {
  /**
   * Create array for groups
   * @param inGroup - group
   * @param inlevel - level
   */
  getPath = (inGroup, inlevel) => {
    let result = [];
    const recursive = (group, level) => {
      result.push(`{root=${(group.children ? true : false)}}{${group.key}=${group.value}}{level=${level}}`);
      if (group.children) {
        if (group.children.length) {
          for (let index = 0; index < group.children.length; index++) {
            const child = group.children[index];
            child.value = `${child.value}}{${group.key}=${group.value}`;
            recursive(child, level + 1)
          }
        }
      }
      return result;
    }
    return recursive(inGroup, inlevel)
  }

  /**
   * Create map for object
   */
  createMap = () => {
    let result = '';
    this.dataTable.groups.forEach((g) => {
      if (result === '')
        result = '{"key":"' + g + '"';
      else
        result += ',"children":{"key":"' + g + '"'
    })
    result += '}';
    for (let index = 0; index < (this.dataTable.groups.length - 1); index++) {
      result += '}'
    }
    result = JSON.parse(result);
    return result;
  }

  /**
   * Create object from map
   * @param map - map
   * @param row - object (as string)
   */
  createObjectByMap = (map, row) => {
    const result = { key: map.key, value: row[map.key] }
    if (map.children) {
      result.children = this.createObjectByMap(map.children, row);
    }
    return result
  }

  /**
   * Create tree by map
   * @param map - map
   */
  mapToTree = (map) => {
    const tree = [];
    this.dataTable.rows.forEach(row => {
      for (let index = 0; index < Object.keys(row).length; index++) {
        let element = Object.keys(row)[index];
        row[element] = row[element].toString();
      }
      tree.push(this.createObjectByMap(map, row))
    });
    return tree;
  }

  /**
   * Create group
   * @param arr - object
   */
  createGroup = (arr) => {
    if (arr.children && arr.children.key) {
      const list = Calc.groupBy(this.dataTable.rows, arr.children.key);
      const key = arr.children.key;
      const children = arr.children;
      arr.children = []
      Object.keys(list).forEach(item => {
        arr.children.push({
          key: key,
          value: item,
          children: children.children || false
        })
      });

      for (let index = 0; index < arr.children.length; index++) {
        const element = arr.children[index];
        this.createGroup(element)
      }
    }
    return arr
  }

  /**
   * Create groups
   * @param tree - tree 
   */
  treeToGroups = (tree) => {
    let result = [];
    const list = Object.keys(Calc.groupBy(this.dataTable.rows, this.dataTable.groups[0]));
    list.forEach(g => {
      result.push(this.createGroup(tree.filter(r => r.value === g)[0]))
    });
    return result;
  }

  /**
   * Convert groups to path
   * @param groups - array of groups
   */
  groupsToPath = (groups) => {
    let result = [];
    let level = 0;
    for (let index = 0; index < groups.length; index++) {
      const group = groups[index];
      level = 0;
      result = [...result, ...this.getPath(group, level)]
    }

    return result;
  }

  /**   
   * Filter data by group string
   * @param rows - rows
   * @param filterStr - string / filter
   */
  filter = (rows, filterStr) => {
    const arr = filterStr.match(this.paramsRegExp);
    if (!arr) return [];

    const children = arr[0].split('=')[1];
    if (children === true)
      return rows;

    const args = arr.slice(1, arr.length - 1);

    const filtered = rows.filter(row => {
      let i = 0;
      for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (row[arg.split('=')[0]] === arg.split('=')[1]) {
          i++
        }
      }
      return i === args.length
    })
    return filtered
  }

  /**
   * Parse data by group
   * @param group - group as string
   */
  getGroupData = (group) => {

    const arr = group.match(this.paramsRegExp);
    return {
      key: arr[1].split('=')[0],
      name: arr[1].split('=')[1],
      path: [...arr].splice(1, arr.length - 2),
      root: arr[0].split('=')[1] === 'false' ? false : true,
      level: arr[arr.length - 1].split('=')[1]
    }
  }

  /**
   * Get groups list
   * @param groupsPath - pathes (strings of groups)
   * @param { columns, rows } - columns, rows
   */
  getGroups = (groupsPath, { columns, rows }) => {

    const newRows = [];
    let newGroups = [];
    groupsPath.forEach((path, i) => {
      const groupData = this.getGroupData(path);
      let countRows = 0;
      if (groupData.root === false) {
        countRows = 0;
        const f = this.filter(rows, path)
        f.forEach((row, i) => {
          const newRow = row;
          newRow.path = path
          newRows.push(newRow);
          countRows++;
        })

        if (countRows === 0) {
          delete groupsPath[i]
        }
      }

      newGroups.push({
        path: path,
        key: groupData.key,
        name: groupData.name,
        root: groupData.root,
        level: groupData.level,
        visible: true,
        open: true,
      });

    });

    newGroups = newGroups.map((group) => {
      return {
        childrenCount: this.filter(rows, group.path).length, ...group
      }
    });

    newGroups = newGroups.filter(g => g.childrenCount !== 0);
    columns = columns.map((column) => {
      return {
        isGroup: newGroups.filter(g => g.key === column.name).length ? true : false,
        ...column
      }
    });
    return { columns, groups: newGroups, rows: newRows }
  }

  create(dataTable) {
    if (!dataTable.groups.length)
      return { columns: dataTable.columns, groups: [], rows: dataTable.rows }
    this.dataTable = dataTable;
    const map = this.createMap();
    const tree = this.mapToTree(map);
    const groups = this.treeToGroups(tree);
    const paths = this.groupsToPath(groups);
    const result = this.getGroups(paths, this.dataTable);
    result.columns = result.columns.map(c => {
      return { ...c, isGroup: result.groups.find(g => g.key === c.name) ? true : false }
    })

    return result;
  }

  constructor() {
    this.paramsRegExp = /[^{}]+(?=\})/g;
  }
}

export default Groups;