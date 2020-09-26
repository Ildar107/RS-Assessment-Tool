/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Table, Button, Select, Radio, Modal,
} from 'antd';
import './requestsPage.scss';

const { Option } = Select;

const RequestsPage = ({ user }) => {
  const [users, setUsers] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [crossCheckSessions, setCrossCheckSessions] = useState([]);
  const [reviewRequest, setReviewRequest] = useState([]);
  const [visible, setVisible] = useState(false);
  const [pullRequest, setPullRequest] = useState('');

  const [basicScore, setBasicScore] = useState([]);
  const [extraScore, setExtraScore] = useState([]);
  const [finesScore, setFinesScore] = useState([]);

  const [basicComments, setBasicComments] = useState([]);
  const [extraComments, setExtraComments] = useState([]);
  const [finesComments, setFinesComments] = useState([]);

  const [basicTotal, setBasicTotal] = useState(0);
  const [extraTotal, setExtraTotal] = useState(0);
  const [finesTotal, setFinesTotal] = useState(0);

  const [score, setScore] = useState(0);

  const [data2, setData2] = useState([]);
  const [selectedTask, setSelectedTask] = useState('Select a task');

  const [currentTask, setCurrentTask] = useState('Choose a task from one of the left tables');

  const userFromDB = 'Maddison_Yost'; // replace with user later, placeholder user for now
  const [keyForTable2, setKeyForTable2] = useState(1);

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
      setCrossCheckSessions(fetchedData?.crossCheckSessions);
      setReviewRequest(fetchedData?.reviewRequest);
    };
    fetchData();
  }, []);

  const ParseJsonIntoTaskCheck = (task) => {
    if (typeof task === 'string') return task;

    const { items, selfGrade, pullRequest } = task;
    const basicItems = items.filter(({ category }) => category === 'Basic Scope');
    const extraItems = items.filter(({ category }) => category === 'Extra Scope');
    const finesItems = items.filter(({ category }) => category === 'Fines');

    const basicScope = (
      <div>
        <h3>Basic Scope</h3>
        <ul>
          {basicItems.map(({
            minScore, maxScore, title, name,
          }, index) => (
            <li style={{ listStyle: 'none' }} key={`${index} and ${title}`}>
              {selfGrade && (
              <h4>
                Self Grade :
                {' '}
                {JSON.stringify(selfGrade?.[name])}
              </h4>
              )}
              <h5>{title}</h5>
              <Radio.Group
                onChange={({ target }) => {
                  const newBasicScore = [...basicScore];
                  newBasicScore.splice(index, 1, target.value);
                  setBasicScore(newBasicScore);
                  const newBasicScoreTotal = newBasicScore.reduce(
                    (accum, value) => accum + value, 0,
                  );
                  setBasicTotal(newBasicScoreTotal);
                  setScore(newBasicScoreTotal + extraTotal + finesTotal);
                }}
                value={basicScore[index]}
              >
                <Radio value={minScore}>Не выполнено</Radio>
                <Radio value={Math.round((maxScore + minScore) / 2)}>Выполнено частично</Radio>
                <Radio value={maxScore}>Выполнено полностью</Radio>
              </Radio.Group>
              <h4>
                Leave comment :
                {' '}
                <input
                  type="text"
                  value={basicComments[index]}
                  onChange={({ target }) => setBasicComments((state) => {
                    const copy = [...state];
                    copy.splice(index, 1, target.value);
                    return copy;
                  })}
                />
              </h4>
            </li>
          ))}
        </ul>
      </div>
    );
    const extraScope = (
      <div>
        <h3>Extra Scope</h3>
        <ul>
          {extraItems.map(({
            minScore, maxScore, title, name,
          }, index) => (
            <li style={{ listStyle: 'none' }} key={`${index} and ${title}`}>
              {selfGrade && (
              <h4>
                Self Grade :
                {' '}
                {JSON.stringify(selfGrade?.[name])}
              </h4>
              )}
              <h5>{title}</h5>
              <Radio.Group
                onChange={({ target }) => {
                  const newExtraScore = [...extraScore];
                  newExtraScore.splice(index, 1, target.value);
                  setExtraScore(newExtraScore);
                  const newExtraScoreTotal = newExtraScore.reduce(
                    (accum, value) => accum + value, 0,
                  );
                  setExtraTotal(newExtraScoreTotal);
                  setScore(basicTotal + newExtraScoreTotal + finesTotal);
                }}
                value={extraScore[index]}
              >
                <Radio value={minScore}>Не выполнено</Radio>
                <Radio value={Math.round((maxScore + minScore) / 2)}>Выполнено частично</Radio>
                <Radio value={maxScore}>Выполнено полностью</Radio>
              </Radio.Group>
              <h4>
                Leave comment :
                {' '}
                <input
                  type="text"
                  value={extraComments[index]}
                  onChange={({ target }) => setExtraComments((state) => {
                    const copy = [...state];
                    copy.splice(index, 1, target.value);
                    return copy;
                  })}
                />
              </h4>
            </li>
          ))}
        </ul>
      </div>
    );
    const fines = (
      <div>
        <h3>Fines</h3>
        <ul>
          {finesItems.map(({
            minScore, maxScore, title, name,
          }, index) => (
            <li style={{ listStyle: 'none' }} key={`${index} and ${title}`}>
              {selfGrade && (
              <h4>
                Self Grade :
                {' '}
                {JSON.stringify(selfGrade?.[name])}
              </h4>
              )}
              <h5>{title}</h5>
              <Radio.Group
                onChange={({ target }) => {
                  const newFinesScore = [...finesScore];
                  newFinesScore.splice(index, 1, target.value);
                  setFinesScore(newFinesScore);
                  const newFinesScoreTotal = newFinesScore.reduce(
                    (accum, value) => accum + value, 0,
                  );
                  setFinesTotal(newFinesScoreTotal);
                  setScore(basicTotal + extraTotal + newFinesScoreTotal);
                }}
                value={finesScore[index]}
              >
                <Radio value={minScore}>Не выполнено</Radio>
                <Radio value={Math.round((maxScore + minScore) / 2)}>Выполнено частично</Radio>
                <Radio value={maxScore}>Выполнено полностью</Radio>
              </Radio.Group>
              <h4>
                Leave comment :
                {' '}
                <input
                  type="text"
                  value={finesComments[index]}
                  onChange={({ target }) => setFinesComments((state) => {
                    const copy = [...state];
                    copy.splice(index, 1, target.value);
                    return copy;
                  })}
                />
              </h4>
            </li>
          ))}
        </ul>
      </div>
    );

    return (
      <div>
        <h4>
          Pull request :
          {' '}
          {pullRequest}
        </h4>
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
    const filteredReviewRequests = reviewRequest
      .filter(({ userId, state }) => userFromDB !== userId && state === 'PUBLISHED');
    filteredReviewRequests.forEach(({
      taskId, userId, selfGrade, pullRequest,
    }) => {
      const findTask = tasks.find(({ id }) => taskId === id);
      const { name, items } = findTask;
      res.push({
        key: String(+key + 1),
        name,
        id: userId,
        pullRequest,
        items,
        selfGrade,
      });
      key = String(+key + 1);
    });
    return res;
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
      title: 'Pull Request',
      dataIndex: 'pullRequest',
      sorter: (a, b) => a.pullRequest.length - b.pullRequest.length,
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
      title: 'Pull Request',
      dataIndex: 'pullRequest',
      sorter: (a, b) => a.pullRequest.length - b.pullRequest.length,
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
      dataIndex: 'score',
      sorter: {
        compare: (a, b) => a.score - b.score,
      },
    },
  ];
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
          onRow={(record) => ({
            onClick: () => {
              console.log(record);
              setCurrentTask(record);
              setBasicComments([]);
              setExtraComments([]);
              setFinesComments([]);
              setBasicScore([]);
              setExtraScore([]);
              setFinesScore([]);
              setBasicTotal(0);
              setExtraTotal(0);
              setFinesTotal(0);
              setScore(0);
            },
          })}
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
          onRow={(record) => ({
            onClick: () => {
              console.log(record);
              setCurrentTask(record);
              setBasicComments([]);
              setExtraComments([]);
              setFinesComments([]);
              setBasicScore([]);
              setExtraScore([]);
              setFinesScore([]);
              setBasicTotal(0);
              setExtraTotal(0);
              setFinesTotal(0);
              setScore(0);
            },
          })}
        />
        <Button type="primary" onClick={() => setVisible(true)}>New Review Request</Button>
      </div>

      <div className="task-review-wrapper">
        <header className="task-review-header">
          <h3>Task Review</h3>
          <span>
            Score:
            {' '}
            {score}
          </span>
          <Button
            type="primary"
            onClick={() => {
              if (typeof currentTask === 'string') return;
              if (!currentTask.selfGrade) {
                currentTask.score = score;
                currentTask.checked = 'yes';
                // form object and fetch to review request here?
                setCurrentTask('Choose a task from one of the left tables');
                setBasicComments([]);
                setExtraComments([]);
                setFinesComments([]);
                setBasicScore([]);
                setExtraScore([]);
                setFinesScore([]);
                setBasicTotal(0);
                setExtraTotal(0);
                setFinesTotal(0);
                setScore(0);
              }
              // form object and fetch to reviews here?
              setCurrentTask('Choose a task from one of the left tables');
              setBasicComments([]);
              setExtraComments([]);
              setFinesComments([]);
              setBasicScore([]);
              setExtraScore([]);
              setFinesScore([]);
              setBasicTotal(0);
              setExtraTotal(0);
              setFinesTotal(0);
              setScore(0);
            }}
          >
            Save
          </Button>
          <Button onClick={() => {
            setCurrentTask('Choose a task from one of the left tables');
            setBasicComments([]);
            setExtraComments([]);
            setFinesComments([]);
            setBasicScore([]);
            setExtraScore([]);
            setFinesScore([]);
            setBasicTotal(0);
            setExtraTotal(0);
            setFinesTotal(0);
            setScore(0);
          }}
          >
            Cancel
          </Button>
        </header>
        <main className="task-review-main">
          {ParseJsonIntoTaskCheck(currentTask)}
        </main>
      </div>
      <Modal
        title="New Review Request"
        visible={visible}
        onOk={() => {
          setKeyForTable2(keyForTable2 + 1);
          const newReviewRequestTask = {
            name: JSON.parse(selectedTask).name,
            pullRequest,
            checked: 'no',
            score: '-',
            task: JSON.parse(selectedTask),
            key: keyForTable2,
            items: JSON.parse(selectedTask).items,
          };
          setData2([...data2, newReviewRequestTask]);
          setSelectedTask('Select a task');
          setPullRequest('');
          setVisible(false);
        }}
        onCancel={() => {
          setSelectedTask('Select a task');
          setPullRequest('');
          setVisible(false);
        }}
        okButtonProps={{ disabled: !(pullRequest && selectedTask !== 'Select a task') }}
      >
        <div>
          <span>
            Task Name:
            {' '}
          </span>
          <Select
            style={{ width: 250 }}
            value={selectedTask}
            onChange={setSelectedTask}
          >
            {tasks.map((task) => (
              <Option value={JSON.stringify(task)} key={task.id}>{task.name}</Option>
            ))}
          </Select>
        </div>
        <div>
          <span>
            Pull Request:
            {' '}
          </span>
          <input
            type="text"
            style={{ width: 250 }}
            value={pullRequest}
            onChange={({ target }) => setPullRequest(target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default RequestsPage;
