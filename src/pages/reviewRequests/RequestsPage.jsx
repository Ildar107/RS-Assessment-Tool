import React, { useState } from 'react';
import { Table, Button } from 'antd';

const RequestsPage = () => {
  const [data, setData] = useState([]);
  return (
    <div className="request-page-wrapper">
      <Table />
      <Table />
    </div>
  );
};

export default requestsPage;
