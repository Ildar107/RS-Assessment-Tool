import React, { useState, useEffect } from 'react';
import {
  Table, Checkbox, Space, Input, Button,
} from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import './reviewsPage.scss';

const ReviewsPage = () => {
  const [requestedTasks, setRequestedTasks] = useState();
  const [requestReviews, setRequestReviews] = useState();
  const [selectedRequestRow, setSelectedRequestRow] = useState();
  const [review, setReview] = useState();
  const [filter, setFilter] = useState({
    searchText: '',
    searchedColumn: '',
  });

  useEffect(() => {
    (async () => {
      const reviewsRequestResp = await fetch('https://x-check-json-server.herokuapp.com/reviewRequest');
      const requests = await reviewsRequestResp.json();
      const reviewsResp = await fetch('https://x-check-json-server.herokuapp.com/reviews');
      const reviews = await reviewsResp.json();
      const taskstResp = await fetch('https://x-check-json-server.herokuapp.com/tasks');
      const tasks = await taskstResp.json();

      let topLevel = tasks;// .filter((x) => x.userId === 'Bertram_Lemke68');

      // расширить объекты реквеста
      topLevel.map((x) => {
        x.key = x.id;
        // найти все реквесты пользователя
        x.requests = requests.filter((r) => r.taskId === x.id);

        x.requestCounts = x.requests.length;
        // найти все ревью для ревью реквеста
        x.requests.map((req) => {
          req.key = req.id;
          req.reviews = reviews.filter((rev) => rev.reviewRequestId === req.id);
          req.count = req.reviews.length;
          // средний балл
          if (req.reviews.length > 0) {
            req.reviews.map((rev) => {
              rev.key = rev.id;
              rev.score = Object.keys(rev.grade).reduce(
                (acc, key) => acc + rev.grade[key].score,
                0,
              );
              return rev;
            });
            req.score = req.reviews.reduce((acc, r) => acc + r.score, 0) / req.reviews.length;
          } else {
            req.score = 0;
          }
          return req;
        });
        return x;
      });

      topLevel = topLevel.filter((t) => t.requests.length > 0);
      topLevel.map((x, i) => { x.index = i + 1; return x; });

      setRequestedTasks(topLevel.filter((t) => t.requests.length > 0));
    })();
  }, []);

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

  let searchInput = null;

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

  const taskColumnsTop = [
    {
      title: 'Task name',
      dataIndex: 'name',
      ...getColumnSearchProps('name'),
      sorter: {
        compare: (a, b) => a.name.localeCompare(b.name),
        multiple: 3,
      },
    },
    {
      title: 'Request counts',
      dataIndex: 'requestCounts',
      ...getColumnSearchProps('requestCounts'),
      sorter: {
        compare: (a, b) => a.requestCounts - b.requestCounts,
        multiple: 2,
      },
    },

  ];

  const taskColumnsInner = [
    {
      title: 'User request creator',
      dataIndex: 'userId',
      ...getColumnSearchProps('userId'),
      sorter: {
        compare: (a, b) => a.userId.localeCompare(b.userId),
        multiple: 3,
      },
    },
    {
      title: 'Average score',
      dataIndex: 'score',
      ...getColumnSearchProps('score'),
      sorter: {
        compare: (a, b) => a.score - b.score,
        multiple: 2,
      },
    },
    {
      title: 'Reviews count',
      dataIndex: 'count',
      ...getColumnSearchProps('count'),
      sorter: {
        compare: (a, b) => a.count - b.count,
        multiple: 1,
      },
    },
  ];

  const reviewColumns = [
    {
      title: 'Student ',
      dataIndex: 'userId',
      ...getColumnSearchProps('userId'),
      sorter: {
        compare: (a, b) => a.userId.localeCompare(b.userId),
        multiple: 3,
      },
    },
    {
      title: 'Average score',
      dataIndex: 'score',
      ...getColumnSearchProps('score'),
      sorter: {
        compare: (a, b) => a.score - b.score,
        multiple: 2,
      },
    },
    {
      title: 'Status',
      dataIndex: 'state',
      ...getColumnSearchProps('state'),
      sorter: {
        compare: (a, b) => a.state.localeCompare(b.state),
        multiple: 1,
      },
    },
  ];

  const renderTaskItems = ({ grade, taskId }) => {
    const task = requestedTasks.find((t) => t.id === taskId);
    const result = [];
    if (task) {
      const categoryMap = new Map();
      task.items.forEach((t) => {
        if (!categoryMap.has(t.category)) {
          categoryMap.set(t.category, [t]);
        } else {
          const catItems = categoryMap.get(t.category);
          catItems.push(t);
        }
      });

      categoryMap.forEach((v, k) => {
        const maxScore = v.reduce((a, c) => a + c.maxScore, 0);
        const catScore = v.reduce((a, c) => a + (grade[c.name] ? grade[c.name].score : 0), 0);
        result.push(
          <div className="category" key={k}>
            <h3>
              {`${k}`}
              {` ${catScore}/${maxScore}`}
            </h3>
            <ul>
              {
                    v.map((x) => (grade[x.name]
                      ? (
                        <li className="category__list-item" key={x.name}>
                          <Checkbox defaultChecked={grade[x.name].score !== x.minScore} disabled />
                          <span className="title">{x.title}</span>
                          <span className="score">
                            {grade[x.name].score}
                          </span>
                          <p className="comment">{grade[x.name].comment}</p>
                        </li>
                      )
                      : ''))
                }
            </ul>
          </div>,

        );
      });
      return result;
    }

    return '';
  };

  return (
    <div className="reviews__container">
      <div className="tables__container">
        <h3>Reviewed tasks</h3>
        <Table
          pagination={{
            defaultPageSize: '5',
            pageSizeOptions: ['5', '10', '15'],
          }}
          columns={taskColumnsTop}
          expandable={{
            expandedRowRender: (record) => (
              <Table
                rowClassName={(row) => `custom__row ${row.id === selectedRequestRow ? 'row_selected' : ''}`}
                columns={taskColumnsInner}
                dataSource={record.requests}
                onRow={(row) => ({
                  onClick: () => {
                    setRequestReviews(row.reviews);
                    setSelectedRequestRow(row.id);
                  },
                })}
              />
            ),
          }}
          dataSource={requestedTasks}
        />
        <hr />
        <h3>Reviews</h3>
        <Table
          rowClassName={(row) => `custom__row ${row.id === review?.id ? 'row_selected' : ''}`}
          columns={reviewColumns}
          dataSource={requestReviews}
          onRow={(row) => ({
            onClick: () => {
              setReview(row);
              console.log(row);
            },
          })}
        />
      </div>
      <div className="review__description">
        <h2>Score description</h2>
        {review
          ? (
            <div className="description__header">
              <h3>
                Final score:
                {'  '}
                <span>{review?.score}</span>
              </h3>
              <h3>
                Author:
                {'  '}
                <span>{review?.userId}</span>
              </h3>
              <h3>
                Status:
                {'  '}
                <span>{review?.state}</span>
              </h3>
            </div>
          )
          : ''}
        <div className="description__body">
          {review ? <h3>Score detalization:</h3> : ''}
          { review
            ? renderTaskItems(review)
            : <h3>Please choose review from left table</h3>}
        </div>
      </div>

    </div>
  );
};

export default ReviewsPage;
