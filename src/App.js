import React from 'react';
import './App.css';
import Table from './components/Table/Table';
import Utils from './components/Table/Utils/Utils';
import Groups from './components/Table/Utils/Groups';

function App() {
  const table = {
    columns: [{
      name: 'category',
      title: 'Category',
      total: (val) => Utils.count(val)
    },
    {
      name: 'country',
      title: 'Country',
      type: Number,
      editable: true
    },
    {
      name: 'name',
      title: 'Name',
      type: String
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
      editable: true
    },
    {
      name: 'quant',
      title: 'Quant',
      editable: true,
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
      { category: 'Sporting Goods', price: 30, quant: 5, status: 'new', name: 'Football', country: 'USA' },
      { category: 'Sporting Goods', price: 35, quant: 5, status: 'delivery', name: 'Baseball', country: 'USA' },
      { category: 'Sporting Goods', price: 66.5, quant: 20, status: 'processing', name: 'Basketball', country: 'USA' },
      { category: 'Electronics', price: 45.5, quant: 12, status: 'processing', name: 'iPod Touch', country: 'Japan' },
      { category: 'Electronics', price: 25.4, quant: 12, status: 'processing', name: 'iPhone 5', country: 'Japan' },
      { category: 'Electronics', price: 66.5, quant: 45, status: 'delivery', name: 'Nexus 7', country: 'Japan' },
      { category: 'Electronics', price: 30, quant: 1, status: 'new', name: 'Samsung', country: 'Russia' }
    ],
    groups: ['country', 'status', 'category']
  }

  let dataTable = JSON.parse(JSON.stringify(table));  
  dataTable = new Groups(dataTable);
  
  return (
    <div className="app">
      <Table dataTable={dataTable}></Table>
    </div>
  );
}

export default App;
