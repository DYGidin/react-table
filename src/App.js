import React, { useState } from 'react';
import './App.css';
import Table from './components/Table/Table';
import Utils from './Utils/Utils';
import 'boxicons';

function App() {
  const mock = {
    columns: [{
      name: 'category',
      title: 'Category'
    },
    {
      name: 'country',
      title: 'Country',
      render: (val) => <><box-icon type='solid' name={val === 'Russia' ? 'moon' : 'tree'}></box-icon>{val}</>,
      type: String
    },
    {
      name: 'name',
      title: 'Name',
      type: String,
      total: (val) => Utils.count(val)
    },
    {
      name: 'status',
      title: 'Status',
      type: String
    },
    {
      name: 'price',
      title: 'Price',
      render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
      type: Number
    },
    {
      name: 'quant',
      title: 'Quant',
      sort: 'asc',
      type: Number,
      total: (val) => Utils.sum(val)
    },
    {
      name: 'sum',
      type: Number,
      title: 'Summ',
      render: (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val),
      formula: '{quant} * {price}',
      total: (val) => Utils.sum(val)
    }],
    rows: [
      { category: 'Sporting Goods', price: 5, quant: 5, status: 'new', name: 'Football', country: 'USA' },
      { category: 'Sporting Goods', price: 80, quant: 50, status: 'new', name: 'Aikido', country: 'Japan' },
      { category: 'Sporting Goods', price: 35, quant: 5, status: 'delivery', name: 'Baseball', country: 'USA' },
      { category: 'Sporting Goods', price: 66.5, quant: 20, status: 'processing', name: 'Basketball', country: 'USA' },
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
        style: {
          background: 'skyblue',
          color: 'black',
        },
        condition: (row) => row['category'] === 'Electronics'
      },
      {
        type: 'row',
        style: {
          background: 'green',
          color: 'white',
        },
        condition: (row) => row['category'] === 'Sporting Goods'
      },
      {
        type: 'row',
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
   // groups: ['category', 'status']
  }

  const [table, setTable] = useState(mock);

  const handleClick = () => {
    setTable({ ...table, groups: ['country', 'category', 'status'] });
  }

  return (
    <div className="app">
      <button onClick={handleClick}>test</button>
      <Table table={table}></Table>
    </div>
  );
}

export default App;
