/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
  Button, Select, Modal,
} from 'antd';

import './requestsPage.scss';
import ReviewRequestForm from '../../components/ReviewRequests/ReviewRequestForm';
import TableAnt from '../../components/ReviewRequests/TableAnt';

const { Option } = Select;

const firstMessage = 'Choose a review request from one of the left tables';
const selectTaskPlaceholder = 'Select a task';

const RequestsPage = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [ownRequests, setOwnRequests] = useState([]);
  const [reviewRequest, setReviewRequest] = useState([]);
  const [visible, setVisible] = useState(false);
  const [pullRequest, setPullRequest] = useState('');
  const [selectedTask, setSelectedTask] = useState('Select a task');
  const [isSelfReview, setIsSelfReview] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const requestRes = await fetch('https://x-check-json-server.herokuapp.com/reviewRequest');
      const requests = await requestRes.json();
      const reviewsRes = await fetch('https://x-check-json-server.herokuapp.com/reviews');
      const reviews = await reviewsRes.json();
      const tasksRes = await fetch('https://x-check-json-server.herokuapp.com/tasks');
      const tasks = await tasksRes.json();

      requests.map((x) => {
        x.key = x.id;
        // переделать объект user
        const currentUserReview = reviews
          .find((y) => x.id === y.reviewRequestId && y.userId === user.nickname);
        const requestTask = tasks.find((t) => t.id === x.taskId);
        x.score = currentUserReview
          ? Object.keys(currentUserReview.grade).reduce((a, c) => {
            const score = currentUserReview.grade[c] ? currentUserReview.grade[c].score : 0;
            return a + score;
          }, 0)
          : null;
        x.checked = !!x.score;
        x.review = currentUserReview || null;
        x.task = requestTask || null;
        x.taskName = requestTask?.name;
        if (x.userId === user.nickname) {
          x.selfScore = x.selfGrade
            ? Object.keys(x.selfGrade).reduce((a, c) => {
              const score = x.selfGrade[c] ? x.selfGrade[c].score : 0;
              return a + score;
            }, 0)
            : null;
          x.selfCheck = !!x.selfScore;
        }
        return x;
      });
      setTasks(tasks.filter((x) => x.state === 'PUBLISHED'));
      setOwnRequests(requests.filter((x) => x.state !== 'COMPLETED' && x.userId === user.nickname));
      setReviewRequest(requests.filter((x) => x.state === 'PUBLISHED' && x.userId !== user.nickname));
    };
    fetchData();
  }, []);

  const save = (isRequest) => {
    setSelectedRequest(null);
    if (isRequest) {
      setReviewRequest([...reviewRequest]);
    } else {
      setOwnRequests([...ownRequests]);
    }
  };
  const saveReview = async (review, isNew, reviewScore) => {
    await fetch('https://x-check-json-server.herokuapp.com/reviews', {
      method: isNew ? 'POST' : 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(review),
    });
    const request = reviewRequest.find((r) => r.id === review.reviewRequestId);
    request.review = review;
    request.score = reviewScore;
    request.checked = true;
    save(true);
  };

  const saveSelfGrade = async (selfRequest, selfScore) => {
    const res = await fetch(`https://x-check-json-server.herokuapp.com/reviewRequest/${selfRequest.id}`, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selfRequest),
    });
    console.log(res);
    const request = ownRequests.find((r) => r.id === selfRequest.id);
    request.state = 'PUBLISHED';
    request.selfGrade = selfRequest.selfGrade;
    request.selfScore = selfScore;
    request.selfCheck = true;
    save(false);
  };

  const createNewRequestReview = async () => {
    const checkRes = await fetch(`https://x-check-json-server.herokuapp.com/reviewRequest?taskId=${selectedTask}&userId=${user.nickname}`);
    const checkData = await checkRes.json();
    console.log(checkData);
    if (!checkData || !checkData.some((x) => x.state === 'PUBLISHED' || x.state === 'DRAFT')) {
      const newRequest = {
        state: 'DRAFT',
        taskId: selectedTask,
        pullRequest,
        crossCheckSessionsId: null,
        userId: user.nickname,
        selfGrade: {},
      };
      const res = await fetch('https://x-check-json-server.herokuapp.com/reviewRequest', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRequest),
      });
      const data = await res.json();
      newRequest.key = data.id;
      newRequest.task = tasks.find((x) => x.id === selectedTask);
      newRequest.taskName = newRequest.task.name;
      newRequest.id = data.id;
      newRequest.selfCheck = false;
      newRequest.review = null;
      setOwnRequests([...ownRequests, newRequest]);
    }
    setSelectedRequest(null);
  };

  return (
    <div className="request-page-wrapper">
      <div className="table-wrapper">
        <div className="request__table">
          <div className="request__header">
            <h3>Review requests</h3>
            <Button type="primary" onClick={() => setVisible(true)}>New Review Request</Button>
          </div>
          <TableAnt
            tableName="requests"
            selectedRow={selectedRequest}
            datasource={reviewRequest}
            handleClick={(record) => {
              setIsSelfReview(false);
              setSelectedRequest(record);
            }}
          />
        </div>
        <div className="selfcheck__table">
          <h3>Self Checking</h3>
          <TableAnt
            tableName="selfreviews"
            selectedRow={selectedRequest}
            datasource={ownRequests}
            handleClick={(record) => {
              setIsSelfReview(true);
              setSelectedRequest(record);
            }}
          />
        </div>
      </div>
      <div className="task-review-wrapper">
        <header className="task-review-header">
          <h3>Task review</h3>
        </header>
        <main className="task-review-main">
          {selectedRequest ? (
            <ReviewRequestForm
              request={selectedRequest}
              currentUserId={user.nickname}
              saveReview={saveReview}
              saveSelfGrade={saveSelfGrade}
              isSelfReview={isSelfReview}
              cancel={() => {
                setSelectedRequest(null);
              }}
            />
          ) : firstMessage }
        </main>
      </div>
      <Modal
        title="New Review Request"
        visible={visible}
        onOk={() => {
          createNewRequestReview();
          setSelectedTask(selectTaskPlaceholder);
          setPullRequest('');
          setVisible(false);
        }}
        onCancel={() => {
          setSelectedTask(selectTaskPlaceholder);
          setPullRequest('');
          setVisible(false);
        }}
        okButtonProps={{ disabled: !(pullRequest && selectedTask !== selectTaskPlaceholder) }}
      >
        <div className="model-item">
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
              <Option value={task.id} key={task.id}>{task.name}</Option>
            ))}
          </Select>
        </div>
        <div className="model-item">
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
