import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import TaskItem from './TaskItem';

const ReviewRequestForm = ({
  request, currentUserId, saveReview, saveSelfGrade, isSelfReview, cancel,
}) => {
  const [score, setScore] = useState(isSelfReview
    ? request.selfScore || 0
    : request.score || 0);
  const [scoreMap, setScoreMap] = useState();

  const categoryArr = request.task.categoriesOrder;

  useEffect(() => {
    const newMap = new Map();
    request.task.items.forEach((x) => {
      const review = (isSelfReview ? request.selfGrade : request.review) || {};
      const itemScore = review[x.name]?.score || 0;
      newMap.set(x.name, itemScore);
    });
    setScoreMap(newMap);
    setScore(isSelfReview
      ? request.selfScore || 0
      : request.score || 0);
  }, [request]);

  const updateScore = (value, id) => {
    scoreMap.set(id, value);
    let finalScore = 0;
    scoreMap.forEach((v) => {
      finalScore += v;
    });
    setScore(finalScore);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let result = {};
    const getGrades = () => {
      const grade = {};
      request.task.items.forEach((t) => {
        const resultScore = e.target[`${t.name}_score`].value < t.minScore
          ? Number(e.target[`${t.name}_custom`].value)
          : Number(e.target[`${t.name}_score`].value);

        grade[t.name] = {
          score: resultScore,
          comment: e.target[`${t.name}_comment`].value,
        };
      });
      return grade;
    };
    if (isSelfReview) {
      result = {
        id: request.id,
        state: 'PUBLISHED',
        taskId: request.taskId,
        pullRequest: request.pullRequest,
        crossCheckSessionsId: request.crossCheckSessionsId,
        userId: request.userId,
        selfGrade: getGrades(),
      };
      saveSelfGrade(result, score);
    } else {
      result = {
        state: 'PUBLISHED',
        taskId: request.taskId,
        reviewRequestId: request.id,
        userId: currentUserId,
        grade: getGrades(),
      };
      saveReview(result, !request.checked, score);
    }
  };

  return (
    <>
      <form className="task-review-form" onSubmit={handleSubmit}>
        {request
          ? (
            <>
              <div>
                <div className="task-review-control">
                  <h3>
                    Score:
                    {` ${score}`}
                  </h3>
                  <Button type="primary" htmlType="submit">Save</Button>
                  <Button onClick={cancel}>Cancel</Button>
                </div>
                <h3>
                  Pull request:
                  <a href={request.pullRequest} target="_blank" rel="noreferrer">{` ${request.pullRequest}`}</a>
                </h3>
              </div>
              { categoryArr.map((c) => (
                <div className="task__item__container" key={c + request.id}>
                  <h3>{request.task.items.find((x) => x.category === c).categoryTitle}</h3>
                  <ul>
                    {
                      request.task.items.filter((x) => x.category === c).map((i) => {
                        const itemValue = isSelfReview
                          ? request.selfGrade[i.name]
                          : request.review?.grade[i.name] || {};
                        const selfCheck = isSelfReview ? null : request?.selfGrade[i.name] || null;
                        return (
                          <li key={i.name + request.id}>
                            <TaskItem
                              item={{ ...i, ...itemValue }}
                              selfCheckItem={selfCheck}
                              updateScore={updateScore}
                            />
                          </li>
                        );
                      })
                    }
                  </ul>
                </div>
              ))}
            </>
          )
          : ''}

      </form>
    </>
  );
};

export default ReviewRequestForm;
