import React from 'react'
import { InputGroup, FormControl} from 'react-bootstrap';

export default function Search(){

  return (
    <InputGroup className="mb-2">
      <InputGroup.Prepend>
        <InputGroup.Text>Enter number of seats</InputGroup.Text>
      </InputGroup.Prepend>
      <FormControl onInput={this}/>
    </InputGroup> 
  );
}
