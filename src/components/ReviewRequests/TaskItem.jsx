import React, { useState } from 'react';
import { Radio, Input } from 'antd';

const { TextArea } = Input;
const unrealScore = -999;

const TaskItem = ({
  item, selfCheckItem, updateScore,
}) => {
  const isCustom = !!item?.score
    && (item.score > item.minScore
        && item.score < item.maxScore
        && item.score !== (item.maxScore + item.minScore) / 2);

  const [customScore, setCustomScore] = useState(isCustom
    ? item?.score
    : item.maxScore < 0 ? item.maxScore : 0);
  const [score, setScore] = useState(isCustom ? unrealScore : item?.score);
  const [requiredComment, setRequiredComment] = useState(false);

  const handleChangeScore = (e) => {
    const value = Number(e.target.value);
    setRequiredComment(value !== selfCheckItem?.score && selfCheckItem);
    updateScore(value !== unrealScore ? value : customScore, item.name);
    setScore(value);
  };

  const handleInputCustomScore = (e) => {
    const value = Number(e.target.value);
    if (value > item.maxScore) {
      setCustomScore(item.maxScore);
      updateScore(item.maxScore, item.name);
    } else if (value < item.minScore) {
      setCustomScore(item.minScore);
      updateScore(item.minScore, item.name);
    } else {
      setCustomScore(value);
      updateScore(value, item.name);
    }
  };

  return (
    <>
      <p className="task__item__description">
        {item.title}
        {' '}
        <span>
          {`(min score: ${item.minScore} / max score: ${item.maxScore})` }
        </span>
      </p>
      <Radio.Group
        required
        onChange={handleChangeScore}
        value={score}
        name={`${item.name}_score`}
      >
        <Radio value={item.minScore}>Not done</Radio>
        <Radio value={Math.round((item.maxScore + item.minScore) / 2)}>Partially done</Radio>
        <Radio value={item.maxScore}>Full done</Radio>
        <Radio value={unrealScore}>
          {'Custom score '}
          <Input
            name={`${item.name}_custom`}
            style={{ width: '50%' }}
            value={customScore}
            disabled={score !== unrealScore}
            type="number"
            min={item.minScore}
            max={item.maxScore}
            onInput={handleInputCustomScore}
          />
        </Radio>
      </Radio.Group>
      <TextArea
        required={requiredComment}
        name={`${item.name}_comment`}
        placeholder="Please write comment..."
        autoSize={{ minRows: 2, maxRows: 6 }}
        defaultValue={item?.comment || ''}
      />
      {
        selfCheckItem ? (
          <div className="selfgrade__container">
            <p>
              Author score:
              {`  ${selfCheckItem.score}`}
            </p>
            <p>
              Author comment:
              {`  ${selfCheckItem.comment}`}
            </p>
          </div>
        )
          : ''
      }

    </>
  );
};

export default TaskItem;
