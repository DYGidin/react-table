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
      type: Number
    },
    {
      name: 'quant',
      title: 'Quant',
      type: Number,
      total: (val) => Utils.sum(val)
    },
    {
      name: 'sum',
      type: Number,
      title: 'Summ',
      formula: '{quant} * {price}',
      total: (val) => Utils.sum(val)
    }],
    rows: [
      { category: 'Sporting Goods', price: 5, quant: 5, status: 'new', name: 'Football', country: 'USA' },
      { category: 'Sporting Goods', price: 35, quant: 5, status: 'delivery', name: 'Baseball', country: 'USA' },
      { category: 'Sporting Goods', price: 66.5, quant: 20, status: 'processing', name: 'Basketball', country: 'USA' },
      { category: 'Electronics', price: 45.5, quant: 12, status: 'processing', name: 'iPod Touch', country: 'Japan' },
      { category: 'Electronics', price: 25.4, quant: 12, status: 'processing', name: 'iPhone 5', country: 'Japan' },
      { category: 'Electronics', price: 66.5, quant: 45, status: 'delivery', name: 'Nexus 7', country: 'Japan' },
      { category: 'Electronics', price: 25, quant: 1, status: 'new', name: 'Samsung', country: 'Russia' }
    ],
    //groups: ['status', 'country', 'category']
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
