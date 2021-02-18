import React from 'react';
import { action } from '@storybook/addon-actions'
import { Table } from '../components/Table';
import Calc from '../utils/Calc';

const mock = {
  name: 'Countries Table',
  columns: [{
    name: 'category',
    title: 'Category',
    type: String
  },
  {
    name: 'country',
    title: 'Country',
    type: String
  },
  {
    name: 'name',
    title: 'Name',
    type: String,
    total: (val) => Calc.count(val)
  },
  {
    name: 'status',
    title: 'Status',
    type: String
  },
  {
    name: 'price',
    title: 'Price',
    type: Number
  },
  {
    name: 'quant',
    title: 'Quant',
    type: Number,
    total: (val) => Calc.sum(val)
  },
  {
    name: 'sum',
    title: 'Summ',
    type: Number,
    render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
    formula: '{quant} * {price}',
    total: (val) => Calc.sum(val)
  }],
  rows: [
    { category: 'Sporting Goods', price: 5, quant: 5, status: 'new', name: 'Football', country: 'USA' },
    { category: 'Sporting Goods', price: 80, quant: 50, status: 'new', name: 'Aikido', country: 'Japan' },
    { category: 'Sporting Goods', price: 35, quant: 5, status: 'delivery', name: 'Baseball', country: 'USA' },
    { category: 'Sporting Goods', price: 66.5, quant: 20, status: 'processing', name: 'Basketball', country: 'USA' },
    { category: 'Sporting Goods', price: 66.5, quant: 20, status: 'return', name: 'Hockey', country: 'Russia' },
    { category: 'Electronics', price: 25, quant: 10, status: 'delivery', name: 'Asus', country: 'China' },
    { category: 'Electronics', price: 20, quant: 3, status: 'delivery', name: 'Blackberry', country: 'China' },
    { category: 'Electronics', price: 45.5, quant: 12, status: 'processing', name: 'iPod Touch', country: 'Japan' },
    { category: 'Electronics', price: 25.4, quant: 12, status: 'processing', name: 'iPhone 5', country: 'Japan' },
    { category: 'Electronics', price: 66.5, quant: 45, status: 'delivery', name: 'Nexus 7', country: 'Japan' },
    { category: 'Electronics', price: 25, quant: 1, status: 'new', name: 'Samsung', country: 'Russia' }
  ],

  theme: 'default',
  activeRow: 2,
  showGroups: false,
  moveColumns: true,
  showFooter: false,
  showFilter: false
}
export default {
  title: 'Example/Table',
  component: Table,
  argTypes: {
    theme: {
      control: {
        type: 'inline-radio',
        options: ['default', 'dark'],
      },
    },

  },
};

const Template = (args) => <Table table={{ ...mock, ...args }} onSelectRow={(e)=>action()(e)}></Table>;

export const Themes = Template.bind({});
Themes.args = {
  theme: 'default'
}
export const Groups = Template.bind({});
Groups.args = {
  showGroups: true,
  theme: 'dark',
  showFooter: true,
  groups: ['category', 'country']
}
export const moveColumns = Template.bind({});
moveColumns.args = {
  theme: 'default',
  moveColumns: true
}

export const calcFields = Template.bind({});
calcFields.args = {
  theme: 'default',
  columns: [
    {
      name: 'price',
      title: 'Price',
      type: Number
    },
    {
      name: 'quant',
      title: 'Quant',
      sort: 'asc',
      type: Number,
      total: (val) => Calc.sum(val)
    }, {
      name: 'sum',
      title: 'Summ',
      type: Number,
      render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
      formula: '{quant} * {price}',
      total: (val) => Calc.sum(val)
    }]
}
export const paintRows = Template.bind({});
paintRows.args = {
  theme: 'default',
  paintRows: [
    {
      type: 'row',
      name: 'bluerow',
      style: {
        background: 'skyblue',
        color: 'black',
      },
      condition: (row) => row['category'] === 'Electronics'
    },
    {
      type: 'row',
      name: 'greenrow',
      style: {
        background: 'green',
        color: 'white',
      },
      condition: (row) => row['category'] === 'Sporting Goods'
    },
    {
      type: 'row',
      name: 'yellowrow',
      style: {
        background: 'yellow',
        color: 'black',
      },
      condition: (row) => row['status'] === 'processing'
    }
  ],
}
export const paintCell = Template.bind({});
paintCell.args = {
  theme: 'default',
  paintRows: [
    {
      type: 'cell',
      name: 'sum',
      style: {
        background: 'aqua',
        color: 'black',
      },
      condition: (row) => parseFloat(row['sum']) >= 500
    },
    {
      type: 'cell',
      name: 'price',
      style: {
        background: 'red',
        color: 'white',
        fontStyle: 'italic',
      },
      condition: (row) => parseFloat(row['price']) === 25
    },
    {
      type: 'cell',
      name: 'country',
      style: {
        background: 'red',
        color: 'white'
      },
      condition: (row) => row['country'] === 'China'
    }
  ],
}
export const paintRowAndCell = Template.bind({});
paintRowAndCell.args = {
  theme: 'default',
  paintRows: [
    {
      type: 'row',
      name: 'bluerow',
      style: {
        background: 'skyblue',
        color: 'black',
      },
      condition: (row) => row['category'] === 'Electronics'
    },
    {
      type: 'row',
      name: 'greenrow',
      style: {
        background: 'green',
        color: 'white',
      },
      condition: (row) => row['category'] === 'Sporting Goods'
    },
    {
      type: 'row',
      name: 'yellowrow',
      style: {
        background: 'yellow',
        color: 'black',
      },
      condition: (row) => row['status'] === 'processing'
    },
    {
      type: 'cell',
      name: 'sum',
      style: {
        background: 'blue',
        color: 'white',
      },
      condition: (row) => parseFloat(row['sum']) < 500
    },
    {
      type: 'cell',
      name: 'sum',
      style: {
        background: 'aqua',
        color: 'black',
      },
      condition: (row) => parseFloat(row['sum']) >= 500
    },
    {
      type: 'cell',
      name: 'price',
      style: {
        background: 'red',
        color: 'white',
        fontStyle: 'italic',
      },
      condition: (row) => parseFloat(row['price']) === 25
    },
    {
      type: 'cell',
      name: 'country',
      style: {
        background: 'red',
        color: 'white'
      },
      condition: (row) => row['country'] === 'China'
    }
  ],
}

export const renderRows = Template.bind({});
renderRows.args = {
  theme: 'default',
  columns: [
    {
      name: 'status',
      title: 'status',
      type: String,
      render: (val) => <><i className={val === 'delivery' ? 'bx bx-car' : 'bx bx-tree'}></i>&nbsp;{val}</>,
    },
    {
      name: 'country',
      title: 'Country',
      type: String,
      render: (val) => <><i className={val === 'Russia' ? 'bx bx-moon' : 'bx bx-tree'}></i>&nbsp;{val}</>,
    }]
}
export const sort = Template.bind({});
sort.args = {
  theme: 'default',
  columns: [{
    name: 'category',
    title: 'Category',
    type: String
  },
  {
    name: 'country',
    title: 'Country',
    type: String
  },
  {
    name: 'name',
    title: 'Name',
    type: String,
    total: (val) => Calc.count(val)
  },
  {
    name: 'status',
    title: 'Status',
    type: String
  },
  {
    name: 'price',
    title: 'Price',
    type: Number
  },
  {
    name: 'quant',
    title: 'Quant',
    sort: 'asc',
    type: Number,
    total: (val) => Calc.sum(val)
  }]
}
export const filter = Template.bind({});
filter.args = {
  theme: 'default',
  showFilter: true,
  filter: { searchStr: 'Jap' },
}

export const footer = Template.bind({});
footer.args = {
  theme: 'default',
  showFooter: true,
}

export const total = Template.bind({});
total.args = {
  name: 'Countries Table',
  columns: [{
    name: 'category',
    title: 'Category',
    type: String
  },
  {
    name: 'country',
    title: 'Country',
    type: String,
    render: (val) => <><i className={val === 'Russia' ? 'bx bx-moon' : 'bx bx-tree'}></i>{val}</>,
  },
  {
    name: 'name',
    title: 'Name',
    type: String,
    total: (val) => Calc.count(val)
  },
  {
    name: 'status',
    title: 'Status',
    type: String
  },
  {
    name: 'price',
    title: 'Price',
    type: Number,
    render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
  },
  {
    name: 'quant',
    title: 'Quant',
    sort: 'asc',
    type: Number,
    total: (val) => Calc.sum(val)
  },
  {
    name: 'sum',
    title: 'Summ',
    type: Number,
    render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
    formula: '{quant} * {price}',
    total: (val) => Calc.sum(val)
  }],
  rows: [
    { category: 'Sporting Goods', price: 5, quant: 5, status: 'new', name: 'Football', country: 'USA' },
    { category: 'Sporting Goods', price: 80, quant: 50, status: 'new', name: 'Aikido', country: 'Japan' },
    { category: 'Sporting Goods', price: 35, quant: 5, status: 'delivery', name: 'Baseball', country: 'USA' },
    { category: 'Sporting Goods', price: 66.5, quant: 20, status: 'processing', name: 'Basketball', country: 'USA' },
    { category: 'Sporting Goods', price: 66.5, quant: 20, status: 'return', name: 'Hockey', country: 'Russia' },
    { category: 'Electronics', price: 25, quant: 10, status: 'delivery', name: 'Asus', country: 'China' },
    { category: 'Electronics', price: 20, quant: 3, status: 'delivery', name: 'Blackberry', country: 'China' },
    { category: 'Electronics', price: 45.5, quant: 12, status: 'processing', name: 'iPod Touch', country: 'Japan' },
    { category: 'Electronics', price: 25.4, quant: 12, status: 'processing', name: 'iPhone 5', country: 'Japan' },
    { category: 'Electronics', price: 66.5, quant: 45, status: 'delivery', name: 'Nexus 7', country: 'Japan' },
    { category: 'Electronics', price: 25, quant: 1, status: 'new', name: 'Samsung', country: 'Russia' }
  ],
  paintRows: [
    {
      type: 'row',
      name: 'bluerow',
      style: {
        background: 'skyblue',
        color: 'black',
      },
      condition: (row) => row['category'] === 'Electronics'
    },
    {
      type: 'row',
      name: 'greenrow',
      style: {
        background: 'green',
        color: 'white',
      },
      condition: (row) => row['category'] === 'Sporting Goods'
    },
    {
      type: 'row',
      name: 'yellowrow',
      style: {
        background: 'yellow',
        color: 'black',
      },
      condition: (row) => row['status'] === 'processing'
    },
    {
      type: 'cell',
      name: 'sum',
      style: {
        background: 'blue',
        color: 'white',
      },
      condition: (row) => parseFloat(row['sum']) < 500
    },
    {
      type: 'cell',
      name: 'sum',
      style: {
        background: 'aqua',
        color: 'black',
      },
      condition: (row) => parseFloat(row['sum']) >= 500
    },
    {
      type: 'cell',
      name: 'price',
      style: {
        background: 'red',
        color: 'white',
        fontStyle: 'italic',
      },
      condition: (row) => parseFloat(row['price']) === 25
    },
    {
      type: 'cell',
      name: 'country',
      style: {
        background: 'red',
        color: 'white'
      },
      condition: (row) => row['country'] === 'China'
    }
  ],
  theme: 'default',
  activeRow: 2,
  showGroups: true,
  moveColumns: true,
  showFooter: true,
  showFilter: true,
  groups: ['status']
}