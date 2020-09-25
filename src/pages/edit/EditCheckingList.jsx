import React from 'react';
import {
  Input, Button, Radio, Menu, Dropdown,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
// import { data } from './Data';
import './editPage.scss';

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
      data: [],
    };
    this.getTasks = this.getTasks.bind(this);
    this.saveTask = this.saveTask.bind(this);
    this.editTask = this.editTask.bind(this);
    this.newTask = this.newTask.bind(this);
    this.createMarkdown = this.createMarkdown.bind(this);
    this.createTaskFromMarkdown = this.createTaskFromMarkdown.bind(this);
  }

    getTasks = () => {
      fetch('https://x-check-json-server.herokuapp.com/tasks', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .then((result) => {
          // console.log('+++>', result);
          this.setState({ data: result });
        })
        .catch((err) => console.log(err));

      // Response: {roles: Array(2), id: "your-github-name"}
    }

    saveTask = (task) => {
      if (this.state.taskId === null) {
        fetch('https://x-check-json-server.herokuapp.com/tasks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        })
          .then((res) => res.json())
          .then(() => {
            // console.log('-->', result);
            this.getTasks();
          })
          .catch((err) => console.log(err));
      } else {
        fetch(`https://x-check-json-server.herokuapp.com/tasks/${this.state.taskId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(task),
        })
          .then((res) => res.json())
          .then(() => {
            // console.log('-->', result);
            this.getTasks();
          })
          .catch((err) => console.log(err));
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
        markdown += `  * **${item}**:\n`;

        task.items.forEach((it) => {
          const score = it.minScore === 0 ? `+${it.maxScore}` : `${it.minScore}`;
          markdown += item === it.category ? `  * ${it.title}. ${score}\n` : '';
        });
      });
      return markdown;
    }

    createTaskFromMarkdown = (markdown) => {
      const arrCategories = markdown.match(/\*\s+\*\*.+\*\*/gm).map((item) => item.split('**')[1]);
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
        name: `${it.replace(/[+\s*\n\-\d]*$/, '').replace(/\.$/g, '')}-${number}${num}`,
        category: arrCategories[number],
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

    // insertTask = (task) => {
    //   const result = this.state.data;
    //   if (this.state.numOfTask === 'new') {
    //     result.push(task);
    //     this.setState({ data: result });
    //     return result;
    //     // console.log('>>>>', result);
    //   }
    //   result[this.state.numOfTask] = task;
    //   this.setState({ data: result });
    //   // console.log('--->', result);
    //   return result;
    // }

    generateView = () => {
      const task = this.createTaskFromMarkdown(this.state.markdown);
      const list = task.categoriesOrder.map((item, number) => (
        <div>
          <h4 key={item + number}>
            {`● ${item}:`}
          </h4>
          {
                    task.items.map((it, num) => (
                      item === it.category
                        ? (
                          <p key={it + num}>
                            {`○ ${it.title}. ${it.maxScore === 0 ? `${it.minScore}` : `+${it.maxScore}`}`}
                            :
                          </p>
                        ) : null
                    ))
                }
        </div>
      ));

      const view = (
        <>
          <h3 key="taskName">
            Название таска:
            {` ${this.state.valueTaskTitle}`}
          </h3>
          <h3 key="author">
            Автор:
            {` ${this.state.valueAuthor}`}
          </h3>
          {list}
        </>
      );

      this.setState({ view });
    }

    render() {
      // console.log(this.state.markdown);
      const {
        markdown, view, valueTaskTitle, valueAuthor, valueState, taskId, data,
      } = this.state;

      const menu = (
        <Menu>
          <Menu.Item
            key="danger"
            danger
          >
            <span
              key="dangerSpan"
              onClick={() => this.newTask()}
            >
              Создать новый таск
            </span>
          </Menu.Item>
          {
                    data.map((item, number) => (
                      <Menu.Item key={item + number}>
                        <span
                          key={`span${item}${number}`}
                          onClick={() => this.editTask(item, number)}
                        >
                          {item.name}
                        </span>
                      </Menu.Item>
                    ))
                }
        </Menu>
      );

      const options = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

      return (
        <div className="edit-task-wrapper">
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Выбор таска
              {' '}
              <DownOutlined />
            </a>
          </Dropdown>
          {(taskId === null || taskId.length !== 0)
                && (
                <>
                  <div>
                    <p className="input-name">Состояние:</p>
                    <Radio.Group
                      options={options}
                      onChange={(e) => this.setState({ valueState: e.target.value })}
                      value={valueState}
                    />
                  </div>
                  <p className="input-name">Название таска:</p>
                  <TextArea
                    key="taskNameInput"
                    className="vvv"
                    placeholder="Название таска"
                    autoSize
                    value={valueTaskTitle}
                    onChange={(e) => {
                      this.setState({ valueTaskTitle: e.target.value });
                    }}
                  />
                  <p className="input-name">Автор:</p>
                  <TextArea
                    key="authorNameInput"
                    className="vvv"
                    placeholder="Автор"
                    autoSize
                    value={valueAuthor}
                    onChange={(e) => {
                      this.setState({ valueAuthor: e.target.value });
                    }}
                  />
                  <p className="input-name">Окно редактирования:</p>
                  <TextArea
                    key="editInput"
                    className="vvv"
                    placeholder="Редактирование"
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
                    }}
                  >
                    Показать результат
                  </Button>
                  <Button
                    key="save"
                    className="edit-button"
                    disabled={markdown.length === 0
                            || valueTaskTitle.length === 0
                            || valueAuthor.length === 0}
                    onClick={() => {
                      const task = this.createTaskFromMarkdown(markdown);
                      // console.log('task-------', task);
                      this.saveTask(task);
                      this.setState({
                        taskId: '',
                        valueTaskTitle: '',
                        valueAuthor: '',
                        valueState: '',
                        view: '',
                        markdown: '',
                      });
                    }}
                  >
                    сохранить таск
                  </Button>
                  <div className="view">
                    {view}
                  </div>
                </>
                )}
        </div>
      );
    }
}
