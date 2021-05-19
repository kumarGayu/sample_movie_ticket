import React, { useState, useEffect }  from 'react';
import ReactDOM from 'react-dom';
import Search from './components/Search.jsx';
import Layout from './components/Layout.jsx';

// Main Entry point function
function App() {
  const [seats, setSeats] = useState({});
  const [rows, setRows] = useState(0);
  const [columns, seatColumns] = useState(0);

  useEffect( () => {
    fetch("/data/venues.json")
    .then( res =>  res.json())
    .then(data => {
      setSeats(data?.seats);
      setRows(data?.venue?.layout?.rows);
      seatColumns(data?.venue?.layout?.columns);
    })
  }, {});
	return (
    <React.Fragment>
      <Search />
      <Layout rows={rows} columns={columns} seats={seats} />
    </React.Fragment>
  );
}

/**
 * TODO:
 * add routing configuration
 * add redux or any other state manager
 * check out any best practises
 */

// Rendering the entire react application
ReactDOM.render(<App/>, document.getElementById('root'));