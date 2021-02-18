import React, { useState } from 'react';
import './App.css';

import { Table } from './components/Table';
import Calc from './utils/Calc';

function App() {

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
    groups:['category', 'status']
    //filter: { searchStr: 'Jap' },
  }


  const [table, setTable] = useState(mock);

  const handleClick = () => {
    setTable({
      ...table,
      theme: 'dark',
      showGroups:true,
      rows: [
        { category: 'Electronics', price: 25.4, quant: 12, status: 'processing', name: 'iPhone 5', country: 'Japan' },
        { category: 'Electronics', price: 66.5, quant: 45, status: 'delivery', name: 'Nexus 7', country: 'Japan' },
        { category: 'Electronics', price: 25, quant: 1, status: 'new', name: 'Samsung', country: 'Russia' }
      ],
    });
  }

  const handleSelectRow = (row) => {
    console.log(row)
  }

  return (
    <div className="app">
      <button onClick={handleClick}>test</button>
      <Table table={table} onSelectRow={(row) => handleSelectRow(row)}></Table>
    </div>
  );
}

export default App;
