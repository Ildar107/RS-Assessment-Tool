import React, { useState, useEffect } from 'react';
import {
  Table, Button, Select, Radio, Modal,
} from 'antd';
import './requestsPage.scss';

const { Option } = Select;

const RequestsPage = ({ user }) => {
  // const [data, setData] = useState([]);
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [crossCheckSessions, setCrossCheckSessions] = useState([]);
  const [reviewRequest, setReviewRequest] = useState([]);
  const [visible, setVisible] = useState(false); // for modal

  const [basicScore, setBasicScore] = useState([]);
  const [extraScore, setExtraScore] = useState([]);
  const [finesScore, setFinesScore] = useState([]);

  const [basicTotal, setBasicTotal] = useState(0);
  const [extraTotal, setExtraTotal] = useState(0);
  const [finesTotal, setFinesTotal] = useState(0);

  const [score, setScore] = useState(0);

  const [currentTask, setCurrentTask] = useState('Choose a task from one of the left tables');
  const [currentDate] = useState('2020-07-10'); // replace with new Date and format to yyyy-mm-dd later somehow

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
    };
    fetchData();
  }, []);

  const ParseJsonIntoTaskCheck = (task) => {
    if (typeof task === 'string') return task;

    const { items } = task;
    const basicItems = items.filter(({ category }) => category === 'Basic Scope');
    const extraItems = items.filter(({ category }) => category === 'Extra Scope');
    const finesItems = items.filter(({ category }) => category === 'Fines');

    const basicScope = (
      <div>
        <h3>Basic Scope</h3>
        <ul>
          {basicItems.map(({ minScore, maxScore, title }, index) => (
            <li style={{ listStyle: 'none' }} key={`${index} and ${title}`}>
              <h5>{title}</h5>
              <Radio.Group
                onChange={({ target }) => {
                  setBasicScore((state) => {
                    const copy = [...state];
                    copy.splice(index, 1, target.value);
                    return copy;
                  });
                  setBasicTotal(basicScore.reduce(
                    (accum, value) => accum + value, 0,
                  ));
                  setScore(basicTotal + extraTotal + finesTotal);
                }}
                value={basicScore[index]}
              >
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
          {extraItems.map(({ minScore, maxScore, title }, index) => (
            <li style={{ listStyle: 'none' }} key={`${index} and ${title}`}>
              <h5>{title}</h5>
              <Radio.Group
                onChange={({ target }) => {
                  setExtraScore((state) => {
                    const copy = [...state];
                    copy.splice(index, 1, target.value);
                    return copy;
                  });
                  setExtraTotal(extraScore.reduce(
                    (accum, value) => accum + value, 0,
                  ));
                  setScore(basicTotal + extraTotal + finesTotal);
                }}
                value={extraScore[index]}
              >
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
          {finesItems.map(({ minScore, maxScore, title }, index) => (
            <li style={{ listStyle: 'none' }} key={`${index} and ${title}`}>
              <h5>{title}</h5>
              <Radio.Group
                onChange={({ target }) => {
                  setFinesScore((state) => {
                    const copy = [...state];
                    copy.splice(index, 1, target.value);
                    return copy;
                  });
                  setFinesTotal(finesScore.reduce(
                    (accum, value) => accum + value, 0,
                  ));
                  setScore(basicTotal + extraTotal + finesTotal);
                }}
                value={finesScore[index]}
              >
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
          checked: 'no', // make it yes when graded a task somehow
          categoriesOrder,
          items,
        });
        key = String(+key + 1);
      });
    });
    // console.log(res);
    return res;
  };

  const generateSecondTableData = () => {
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
          checked: 'no', // make it yes when graded a task somehow
          categoriesOrder,
          items,
        });
        key = String(+key + 1);
      });
    });
    // console.log(res);
    return res;
  };

  const data1 = generateFirstTableData();

  const data2 = generateSecondTableData();

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

  const columns2 = [
    {
      title: 'Task',
      dataIndex: 'name',
      sorter: (a, b) => a.name.length - b.name.length,
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
    {
      title: 'Score',
      dataIndex: 'english',
      sorter: {
        compare: (a, b) => a.english - b.english,
      },
    },
  ];
  console.log(basicScore);
  return (
    <div className="request-page-wrapper">
      <div className="table-wrapper">
        <Table
          columns={columns1}
          dataSource={data1}
          style={{ width: 650 }}
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
          style={{ width: 650 }}
          pagination={{ defaultPageSize: 5 }}
          title={() => 'Selfchecking'}
          bordered
          size="small"
          tableLayout="fixed"
          onRow={(record) => ({ onClick: () => setCurrentTask(record) })}
        />
        <Button type="primary" onClick={() => setVisible(true)}>New Task Request</Button>
        <Button>Check Task</Button>
      </div>

      <div className="task-review-wrapper">
        <header className="task-review-header">
          <h3>Task Review</h3>
          <span>
            Score:
            {' '}
            {score}
          </span>
          <Button>Save</Button>
          <Button>Cancel</Button>
        </header>
        <main className="task-review-main">
          {ParseJsonIntoTaskCheck(currentTask)}
        </main>
      </div>

      {/* <div className="task-request-wrapper">
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
      </div> */}
      <Modal
        title="New Task Request"
        visible={visible}
        onOk={(e) => {
          console.log(e);
          // some async actions, save to db?
          setVisible(false);
        }}
        onCancel={() => setVisible(false)}
      >
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
      </Modal>
    </div>
  );
};

export default RequestsPage;
