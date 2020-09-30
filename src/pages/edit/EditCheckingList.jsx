import React from 'react';
import {
  Input, Button, Radio,
} from 'antd';
// import { DownOutlined } from '@ant-design/icons';
// import { data } from './Data';
import './editPage.scss';
import TableAnt from '../../components/ReviewRequests/TableAnt';
import ModalPreview from '../../components/EditCheckingList/ModalPreview';

const { TextArea } = Input;

export default class EditCheckingList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      taskId: '',
      markdown: '',
      valueTaskTitle: '',
      valueAuthor: '',
      valueState: '',
      view: '',
      selectedRow: null,
      isShowPreview: false,
      data: [],
    };
    // this.getTasks = this.getTasks.bind(this);
    // this.saveTask = this.saveTask.bind(this);
    // this.editTask = this.editTask.bind(this);
    // this.newTask = this.newTask.bind(this);
    // this.createMarkdown = this.createMarkdown.bind(this);
    // this.createTaskFromMarkdown = this.createTaskFromMarkdown.bind(this);
  }

    getTasks = async () => {
      try {
        const res = await fetch('https://x-check-json-server.herokuapp.com/tasks');
        const data = await res.json();

        this.setState({ data: data.map((x) => { x.key = x.id; return x; }) });
      } catch (e) {
        console.error(e);
      }
    }

    saveTask = async (task) => {
      const dbTask = { ...task };
      delete dbTask.key;
      if (this.state.taskId === null) {
        try {
          const res = await fetch('https://x-check-json-server.herokuapp.com/tasks', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dbTask),
          });
          const data = await res.json();
          task.state = data.state;
          task.id = data.id;
          task.key = data.id;

          this.setState({ data: [...this.state.data, task] });
        } catch (e) {
          console.log(e);
        }
      } else {
        const res = await fetch(`https://x-check-json-server.herokuapp.com/tasks/${this.state.taskId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dbTask),
        });
        const data = await res.json();
        const newTaskArr = this.state.data.filter((t) => t.id !== data.id);
        task.id = data.id;
        task.key = data.id;
        newTaskArr.push(task);
        newTaskArr.sort((a, b) => a.id - b.id);
        this.setState({ data: [...newTaskArr] });
      }
    }

    componentDidMount() {
      this.getTasks();
    }

    editTask = (task) => {
      this.setState({
        markdown: this.createMarkdown(task),
        valueAuthor: task.userId,
        valueTaskTitle: task.name,
        valueState: task.state,
        taskId: task.id,
        view: '',
      });
    }

    newTask = () => {
      this.setState({ selectedRow: null });
      this.setState({
        markdown: '* **Категория1 +140**: \n'
                + '  * Пункт1. +10 \n'
                + '  * Пункт2. +10\n'
                + '  * Пункт3. -20',
        valueAuthor: '',
        valueTaskTitle: '',
        valueState: 'DRAFT',
        taskId: null,
        view: '',
      });
    }

    createMarkdown = (task) => {
      let markdown = '';

      task.categoriesOrder.forEach((item) => {
        const { categoryTitle } = task.items.find((x) => x.category === item);
        markdown += `  * **${categoryTitle}**:\n`;

        task.items.forEach((it) => {
          const score = it.minScore === 0 ? `+${it.maxScore}` : `${it.minScore}`;
          markdown += item === it.category ? `  * ${it.title}. ${score}\n` : '';
        });
      });
      return markdown;
    }

    createTaskFromMarkdown = (markdown) => {
      const arrCategories = markdown.match(/\*\s+\*\*.+\*\*/gm).map((x, i) => `category${i}`);
      const arrCategoriesTitle = markdown.match(/\*\s+\*\*.+\*\*/gm).map((item) => item.split('**')[1]);
      const arrItems = markdown.split(/\*\s+\*\*.+\*\*/);
      arrItems.splice(0, 1);
      const arrItemsSeparate = arrItems.map((item) => item.split('*'));
      arrItemsSeparate.forEach((item) => item.splice(0, 1));
      const arrClean = arrItemsSeparate.map((item) => item
        .map((it) => it.replace(/(^[\s*\n:]*)|([\s*\n:]*$)/g, '')));
      const arrObj = arrClean.map((item, number) => item.map((it, num) => ({
        title: it.replace(/[+\s*\n\-\d]*$/, '').replace(/\.$/g, ''),
        maxScore: it.match(/[+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, '').search(/\+/) === -1
          ? 0 : +it.match(/[+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, '').replace('+', ''),
        minScore: it.match(/[+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, '').search(/-/) === -1
          ? 0 : +it.match(/[+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, ''),
        name: `${arrCategories[number]}_p${num}`,
        category: arrCategories[number],
        categoryTitle: arrCategoriesTitle[number],
        description: '',
      })));

      const flatArr = arrObj.flat(2);

      return {
        // id: this.state.numOfTask === 'new' ? this.state.data.length : +this.state.numOfTask,
        name: this.state.valueTaskTitle,
        userId: this.state.valueAuthor,
        state: this.state.valueState,
        categoriesOrder: arrCategories,
        items: flatArr,
      };
    }

    generateView = (markdown, currentTask) => {
      const task = this.createTaskFromMarkdown(markdown || this.state.markdown);
      const list = task.categoriesOrder.map((item, number) => (
        <div className="task__view__item" key={item + number}>
          <h3>
            {`● ${task.items.find((x) => x.category === item).categoryTitle}:`}
          </h3>
          {
                    task.items.map((it, num) => (
                      item === it.category
                        ? (
                          <p key={it + num} className="item__unit">
                            {`○ ${it.title}. ${it.maxScore === 0 ? `${it.minScore}` : `+${it.maxScore}`}`}
                          </p>
                        ) : null
                    ))
                }
        </div>
      ));

      const view = (
        <div className="task__view">
          <div className="task__view__header">
            <h3 key="taskName">
              Task name:
              {` ${markdown ? currentTask.name : this.state.valueTaskTitle}`}
            </h3>
            <h3 key="author">
              Author:
              {` ${markdown ? currentTask.userId : this.state.valueAuthor}`}
            </h3>
            <h3 key="score">
              Max score:
              {` ${task.items.reduce((a, c) => a + c.maxScore, 0)}`}
            </h3>
          </div>
          {list}
        </div>
      );

      this.setState({ view });
    }

    closeModal = () => {
      this.setState({ isShowPreview: false });
    }

    handleSubmit = (e) => {
      e.preventDefault();
      const task = this.createTaskFromMarkdown(this.state.markdown);
      this.saveTask(task);
      this.setState({
        taskId: '',
        valueTaskTitle: '',
        valueAuthor: '',
        valueState: '',
        view: '',
        markdown: '',
      });
    }

    render() {
      const {
        markdown, view, valueTaskTitle, valueAuthor,
        valueState, selectedRow, taskId, data, isShowPreview,
      } = this.state;

      const options = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];
      console.log(this.props.role);
      return (

        <div className="edit-task-wrapper">
          <div className="tables__container">
            <div className="tasks__header">
              <h3>Tasks</h3>
              <Button
                type="primary"
                className={this.props.role !== 'student' ? '' : 'hideButton'}
                onClick={() => this.newTask()}
              >
                Create new Task
              </Button>
            </div>
            <TableAnt
              tableName="tasks"
              datasource={data}
              selectedRow={selectedRow}
              previewClick={(id) => {
                const task = data.find((t) => t.id === id);
                if (task) {
                  this.generateView(this.createMarkdown(task), task);
                  this.setState({ isShowPreview: true });
                }
              }}
              handleClick={(record) => {
                this.setState({ selectedRow: record });
                this.editTask(record);
              }}
            />
          </div>
          <div className="task__container">
            {(taskId === null || taskId.length !== 0)
                && (
                <form onSubmit={this.handleSubmit}>
                  <div>
                    <p className="input-name">Status:</p>
                    <Radio.Group
                      options={options}
                      onChange={(e) => this.setState({ valueState: e.target.value })}
                      value={valueState}
                    />
                  </div>
                  <p className="input-name">Task name:</p>
                  <Input
                    key="taskNameInput"
                    className="vvv"
                    placeholder="Please write task name"
                    required
                    value={valueTaskTitle}
                    onChange={(e) => {
                      this.setState({ valueTaskTitle: e.target.value });
                    }}
                  />
                  <p className="input-name">Author:</p>
                  <Input
                    key="authorNameInput"
                    className="vvv"
                    placeholder="Please write author"
                    required
                    value={valueAuthor}
                    onChange={(e) => {
                      this.setState({ valueAuthor: e.target.value });
                    }}
                  />
                  <p className="input-name">Task editor:</p>
                  <TextArea
                    key="editInput"
                    name="editInput"
                    className="vvv"
                    required
                    placeholder={'Please write task description... \n Use next format: \n * **Category +100**: \n *Point +10 \n *Point +10'}
                    autoSize
                    value={markdown}
                    onChange={(e) => {
                      this.setState({ markdown: e.target.value });
                    }}
                  />
                  <Button
                    key="edit"
                    className="edit-button"
                    disabled={markdown.length === 0}
                    onClick={() => {
                      this.generateView();
                      this.setState({ isShowPreview: true });
                    }}
                  >
                    Show preview
                  </Button>
                  <Button
                    key="save"
                    type="primary"
                    className="edit-button"
                    disabled={this.props.role === 'student' || (selectedRow !== null && selectedRow.state !== 'DRAFT')}
                    htmlType="submit"
                  >
                    Save
                  </Button>
                </form>
                )}
          </div>
          <ModalPreview isShowPreview={isShowPreview} view={view} closeModal={this.closeModal} />
        </div>
      );
    }
}
