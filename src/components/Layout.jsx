import React from 'react';
import { Row, Col} from 'react-bootstrap';
import Button from "./Button.jsx";

const renderColumns = (cols, i, seats) => {
  const c = [];
  for(var j=1; j<=cols; j++){
    c.push(<Col key={`${i}${j}`}><Button selected={seats[i+j]?.status}/></Col>)
  }
  return c;
};

const renderRows = (rows, cs, seats) => {
  const r = [];
  for(var i=1; i<=rows; i++){
    r.push(i); //<Row key={`${i}`}></Row>)
  }
  return r.map(i => <Row key={`${i}`}>{renderColumns(cs,String.fromCharCode(96+i), seats)}</Row>);
};

export default function Layout(props) {
  const { rows, columns, seats} = props;

  return (
    <div>
      {renderRows(rows,columns,seats)}
    </div>
  );
}
