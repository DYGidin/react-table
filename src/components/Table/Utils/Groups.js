/**
 * Автор: Денис Гидин (Denis Gidin)
 * Версия 1.0
 * Описание:
 * Класс для группировки данных
 * в качестве входных данных объект вида {groups:groups, rows:rows}
 * Пример: new Groups({groups:dataTable.groups, rows:dataTable.rows});
 * Успешным результатом является массив строк для последующей группировки
 */
import Utils from './Utils';

class Groups {

  /**
   * Формирование массива для группировки
   * @param {*} inGroup - группа
   * @param {*} inlevel - уровень
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
   * Создание карты для последующей сборки объекта
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
   * Создание объекта по карте
   * @param {*} map - карта
   * @param {*} row - объект (строка)
   */
  createObjectByMap = (map, row) => {
    const result = { key: map.key, value: row[map.key] }
    if (map.children) {
      result.children = this.createObjectByMap(map.children, row);
    }
    return result
  }

  /**
   * Создание дерева по карте
   * @param {*} map - карта
   */
  createTree = (map) => {
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
   * Создание группы
   * @param {*} arr - объект
   */
  createGroup = (arr) => {
    if (arr.children && arr.children.key) {
      const list = Utils.groupBy(this.dataTable.rows, arr.children.key);
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
   * Создание групп 
   * @param {*} tree - дерево 
   */
  createGroups = (tree) => {
    let result = [];
    const list = Object.keys(Utils.groupBy(this.dataTable.rows, this.dataTable.groups[0]));
    list.forEach(g => {
      result.push(this.createGroup(tree.filter(r => r.value === g)[0]))
    });
    return result;
  }

  /**
   * Конвертировать группы в путь
   * @param {*} groups - массив групп
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


  filter = (rows, filterStr) => {
    const arr = filterStr.match(/[^{}]+(?=\})/g);
    if (!arr) return [];

    const children = arr[0].split('=')[1], name = arr[1].split('=')[1];
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
      return i == args.length
    })
    return filtered
  }

  getGroupData = (group) => {
    const arr = group.match(/[^{}]+(?=\})/g);
    return { key: arr[1].split('=')[0], name: arr[1].split('=')[1], root: arr[0].split('=')[1], level: arr[arr.length - 1].split('=')[1] }
  }

  getGroups = (groupsPath, { columns, rows } = this.dataTable) => {
    const newRows = [];
    let newGroups = [];
    groupsPath.forEach((group, i) => {
      const groupData = this.getGroupData(group);
      let countRows = 0;
      if (groupData.root === 'false') {

        countRows = 0;
        this.filter(rows, group).map((row, i) => {
          newRows.push({ group: group, ...row });
          //newRows.push({ group: group, row: row });
          countRows++;
        })

        if (countRows === 0) {
          delete groupsPath[i]
        }
      }

      newGroups.push({
        group: group,
        key: groupData.key,
        name: groupData.name,
        root: groupData.root,
        level: groupData.level,
      });

    });

    newGroups = newGroups.map((group) => {
      return {
        childrenCount: this.filter(rows, group.group).length, ...group
      }
    });

    newGroups = newGroups.filter(g => g.childrenCount !== 0);    
    columns = columns.map((column) => {
      return {
        visible: newGroups.filter(g => g.key === column.name).length ? false : true,
        ...column
      }
    });
    return { columns, groups: newGroups, rows: newRows }
  }

  constructor(dataTable) {
    this.dataTable = dataTable;
    const map = this.createMap();
    const tree = this.createTree(map);
    const groups = this.createGroups(tree);
    const result = this.groupsToPath(groups);
    return this.getGroups(result, this.dataTable)
  }
}

export default Groups;