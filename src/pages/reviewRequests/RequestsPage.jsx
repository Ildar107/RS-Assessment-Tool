import React, { useState, useEffect } from 'react';
import {
  Table, Button, Select, Radio,
} from 'antd';
import './requestsPage.scss';

const { Option } = Select;

const ParseJsonIntoTaskCheck = (task) => {
  console.log(task);
  if (typeof task === 'string') return task;

  const { categoriesOrder, items } = task;
  // const headers = categoriesOrder
  const basicItems = items.filter(({ name }) => name.startsWith('basic'));
  const extraItems = items.filter(({ name }) => name.startsWith('extra'));
  const finesItems = items.filter(({ name }) => name.startsWith('fines'));
  console.log(basicItems);
  const basicScope = (
    <div>
      <h3>Basic Scope</h3>
      <ul>
        {basicItems.map(({ minScore, maxScore, title }) => (
          <li style={{ listStyle: 'none' }}>
            <h5>{title}</h5>
            <Radio.Group onChange={() => {}} value={0}>
              <Radio value={minScore}>Не выполнено</Radio>
              <Radio value={Math.round((maxScore + minScore) / 2)}>Выполнено частично</Radio>
              <Radio value={maxScore}>Выполнено полностью</Radio>
            </Radio.Group>
          </li>
        ))}
      </ul>
    </div>
  );
  const extraScope = (
    <div>
      <h3>Extra Scope</h3>
      <ul>
        {extraItems.map(({ minScore, maxScore, title }) => (
          <li style={{ listStyle: 'none' }}>
            <h5>{title}</h5>
            <Radio.Group onChange={() => {}} value={0}>
              <Radio value={minScore}>Не выполнено</Radio>
              <Radio value={Math.round((maxScore + minScore) / 2)}>Выполнено частично</Radio>
              <Radio value={maxScore}>Выполнено полностью</Radio>
            </Radio.Group>
          </li>
        ))}
      </ul>
    </div>
  );
  const fines = (
    <div>
      <h3>Fines</h3>
      <ul>
        {finesItems.map(({ minScore, maxScore, title }) => (
          <li style={{ listStyle: 'none' }}>
            <h5>{title}</h5>
            <Radio.Group onChange={() => {}} value={0}>
              <Radio value={minScore}>Не выполнено</Radio>
              <Radio value={Math.round((maxScore + minScore) / 2)}>Выполнено частично</Radio>
              <Radio value={maxScore}>Выполнено полностью</Radio>
            </Radio.Group>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      {basicScope}
      <br />
      {extraScope}
      <br />
      {fines}
    </div>
  );
};

const RequestsPage = ({ user }) => {
  // const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [crossCheckSessions, setCrossCheckSessions] = useState([]);
  const [reviewRequest, setReviewRequest] = useState([]);

  const [currentTask, setCurrentTask] = useState('Choose a task from one of the left tables');
  const [currentDate] = useState('2020-07-10'); // replace with new Date and format to yyyy-mm-dd later somehow

  console.log(user);

  const userFromDB = 'Ulises_Johns82'; // replace with user later

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('https://x-check-json-server.herokuapp.com/db', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const fetchedData = await res.json();
      setUsers(fetchedData?.users);
      setDisputes(fetchedData?.disputes);
      setReviews(fetchedData?.reviews);
      setTasks(fetchedData?.tasks);
      setCrossCheckSessions(fetchedData?.['cross-check-sessions']);
      setReviewRequest(fetchedData?.['review-request']);

      console.log(
        users,
        disputes,
        reviews,
        tasks,
        reviewRequest,
        crossCheckSessions,
      );
    };
    fetchData();
  }, []);

  const generateFirstTableData = () => {
    const res = [];
    let key = '0';
    const filteredCrossCheckSessions = crossCheckSessions
      .filter(({ startDate, endDate }) => new Date(currentDate) >= new Date(startDate)
       && new Date(currentDate) <= new Date(endDate));
    filteredCrossCheckSessions.forEach(({ endDate, taskId, attendees }) => {
      const findUserCrossCheck = attendees.find(({ githubId }) => githubId === userFromDB);
      const { reviewerOf } = findUserCrossCheck;
      const findTask = tasks.find(({ id }) => taskId === id);
      const { name, categoriesOrder, items } = findTask;
      reviewerOf.forEach(({ id }) => {
        res.push({
          key: String(+key + 1),
          name,
          id,
          endDate,
          checked: String(false), // make it true when graded a task somehow
          categoriesOrder,
          items,
        });
        key = String(+key + 1);
      });
    });
    console.log(res);
    return res;
  };

  const generateSecondTableData = () => {

  };

  const data1 = generateFirstTableData();

  const columns1 = [
    {
      title: 'Task',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'User',
      dataIndex: 'id',
      sorter: (a, b) => a.id.length - b.id.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Deadline',
      dataIndex: 'endDate',
      sorter: (a, b) => a.endDate.length - b.endDate.length,
      sortDirections: ['descend', 'ascend'],
    },
    {
      title: 'Checked',
      dataIndex: 'checked',
      sorter: (a, b) => a.checked.length - b.checked.length,
      sortDirections: ['descend', 'ascend'],
    },
  ];
  // const data1 = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     chinese: 98,
  //     math: 60,
  //     english: 70,
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     chinese: 98,
  //     math: 66,
  //     english: 89,
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     chinese: 98,
  //     math: 90,
  //     english: 70,
  //   },
  //   {
  //     key: '4',
  //     name: 'Jim Red',
  //     chinese: 88,
  //     math: 99,
  //     english: 89,
  //   },
  //   {
  //     key: '5',
  //     name: 'John Brown',
  //     chinese: 98,
  //     math: 60,
  //     english: 70,
  //   },
  //   {
  //     key: '6',
  //     name: 'Jim Green',
  //     chinese: 98,
  //     math: 66,
  //     english: 89,
  //   },
  //   {
  //     key: '7',
  //     name: 'Joe Black',
  //     chinese: 98,
  //     math: 90,
  //     english: 70,
  //   },
  //   {
  //     key: '8',
  //     name: 'Jim Red',
  //     chinese: 88,
  //     math: 99,
  //     english: 89,
  //   },
  //   {
  //     key: '9',
  //     name: 'John Brown',
  //     chinese: 98,
  //     math: 60,
  //     english: 70,
  //   },
  //   {
  //     key: '10',
  //     name: 'Jim Green',
  //     chinese: 98,
  //     math: 66,
  //     english: 89,
  //   },
  //   {
  //     key: '11',
  //     name: 'Joe Black',
  //     chinese: 98,
  //     math: 90,
  //     english: 70,
  //   },
  //   {
  //     key: '12',
  //     name: 'Jim Red',
  //     chinese: 88,
  //     math: 99,
  //     english: 89,
  //   },
  // ];

  const columns2 = [
    {
      title: 'Task',
      dataIndex: 'name',
      sorter: {
        compare: (a, b) => a.name - b.name,
      },
    },
    {
      title: 'Deadline',
      dataIndex: 'endDate',
      sorter: {
        compare: (a, b) => a.chinese - b.chinese,
      },
    },
    {
      title: 'Checked',
      dataIndex: 'checked',
      sorter: {
        compare: (a, b) => a.math - b.math,
      },
    },
    {
      title: 'Score',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
      },
    },
  ];
  const data2 = '';
  // const data2 = [
  //   {
  //     key: '1',
  //     name: 'John Brown',
  //     chinese: 98,
  //     math: 60,
  //     english: 70,
  //   },
  //   {
  //     key: '2',
  //     name: 'Jim Green',
  //     chinese: 98,
  //     math: 66,
  //     english: 89,
  //   },
  //   {
  //     key: '3',
  //     name: 'Joe Black',
  //     chinese: 98,
  //     math: 90,
  //     english: 70,
  //   },
  //   {
  //     key: '4',
  //     name: 'Jim Red',
  //     chinese: 88,
  //     math: 99,
  //     english: 89,
  //   },
  // ];

  return (
    <div className="request-page-wrapper">
      <div className="table-wrapper">
        <Table
          columns={columns1}
          dataSource={data1}
          style={{ width: 350 }}
          pagination={{ defaultPageSize: 5 }}
          title={() => 'Tasks for review'}
          bordered
          size="small"
          tableLayout="fixed"
          onRow={(record) => ({ onClick: () => setCurrentTask(record) })}
        />
        <Table
          columns={columns2}
          dataSource={data2}
          style={{ width: 350 }}
          pagination={{ defaultPageSize: 5 }}
          title={() => 'Selfchecking'}
          bordered
          size="small"
          tableLayout="fixed"
          onRow={(record) => ({ onClick: () => setCurrentTask(record) })}
        />
        <Button>New Task Request</Button>
        <Button>Check Task</Button>
      </div>

      <div className="task-review-wrapper">
        <header className="task-review-header">
          <h3>Task Review</h3>
          <span>Score: 69</span>
          <Button>Save</Button>
          <Button>Cancel</Button>
        </header>
        <main className="task-review-main">
          {ParseJsonIntoTaskCheck(currentTask)}
        </main>
      </div>

      <div className="task-request-wrapper">
        <header className="task-request-header">
          <h3>Task request</h3>
          <Button>Save</Button>
          <Button>Cancel</Button>
        </header>
        <main className="task-request-main">
          <div>
            <span>
              Task Name:
              {' '}
            </span>
            <Select style={{ width: 110 }} />
          </div>
          <div>
            <span>
              Pull Request:
              {' '}
            </span>
            <Select style={{ width: 110 }} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default RequestsPage;
