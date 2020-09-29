import React, { useState } from 'react';
import {
  Checkbox, Table, Button, Input, Space,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';

const TableAnt = ({
  tableName, handleClick, datasource, selectedRow,
}) => {
  let columns = [];
  let searchInput = null;
  const [filter, setFilter] = useState({
    searchText: '',
    searchedColumn: '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setFilter({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setFilter({ searchText: '', searchedColumn: '' });
  };
  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys, selectedKeys, confirm, clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) => (record[dataIndex]
      ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
      : ''),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (text) => (filter.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[filter.searchText]}
        autoEscape
        textToHighlight={text ? text.toString() : ''}
      />
    ) : (
      text
    )),
  });

  switch (tableName) {
    case 'requests': {
      columns = [{
        title: 'Task',
        dataIndex: 'taskName',
        sorter: (a, b) => a.taskName.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
        ...getColumnSearchProps('taskName'),
      },
      {
        title: 'Author',
        dataIndex: 'userId',
        sorter: (a, b) => a.userId.localeCompare(b.id),
        sortDirections: ['descend', 'ascend'],
        ...getColumnSearchProps('userId'),
      },
      {
        title: 'Score',
        dataIndex: 'score',
        sorter: (a, b) => a.score - b.score,
        sortDirections: ['descend', 'ascend'],
        ...getColumnSearchProps('score'),
      },
      {
        title: 'Checked',
        dataIndex: 'checked',
        sorter: (a, b) => a.checked.toString().localeCompare(b.checked.toString()),
        sortDirections: ['descend', 'ascend'],
        ...getColumnSearchProps('checked'),
        render: (checked) => (
          <Checkbox checked={checked} disabled />
        ),
      }];
      break;
    }
    case 'selfreviews': {
      columns = [{
        title: 'Task',
        dataIndex: 'taskName',
        sorter: (a, b) => a.taskName.localeCompare(b.name),
        sortDirections: ['descend', 'ascend'],
        ...getColumnSearchProps('taskName'),
      },
      {
        title: 'State',
        dataIndex: 'state',
        sorter: (a, b) => a.state.localeCompare(b.state),
        sortDirections: ['descend', 'ascend'],
        ...getColumnSearchProps('state'),
      },
      {
        title: 'Score',
        dataIndex: 'selfScore',
        sorter: {
          compare: (a, b) => a.selfScore - b.selfScore,
        },
        ...getColumnSearchProps('selfScore'),
      },
      {
        title: 'Self checked',
        dataIndex: 'selfCheck',
        sorter: (a, b) => a.selfCheck.toString().localeCompare(b.selfCheck.toString()),
        sortDirections: ['descend', 'ascend'],
        ...getColumnSearchProps('selfCheck'),
        render: (selfCheck) => (
          <Checkbox checked={selfCheck} disabled />
        ),
      }];
      break;
    }
    default: {
      columns = [];
    }
  }

  return (
    <Table
      rowClassName={(row) => `custom__row ${row.id === selectedRow?.id ? 'row_selected' : ''}`}
      columns={columns}
      dataSource={datasource}
      pagination={{ defaultPageSize: 5 }}
      onRow={(record) => ({
        onClick: () => handleClick(record),
      })}
    />
  );
};

export default TableAnt;
