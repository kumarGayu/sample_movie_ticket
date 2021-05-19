import React from 'react';

export default function Button(props) {
  const { id, selected } = props;
  return <img src="/public/imgs/seat-svgrepo-com.svg" className={`btn ${selected?.toLowerCase()}`} />;
}
