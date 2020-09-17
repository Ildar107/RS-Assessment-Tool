import React from 'react';
import {
  Input, Tree, Button, Row, Col, Radio, Menu, Dropdown,
} from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { data } from './Data';

const { TextArea } = Input;

// const gData = [
//     {
//         title: 'Группа пунктов А',
//         key: 'a',
//         enableChildren: true,
//         children: [
//             {
//                 title: 'Пункт А',
//                 key: 'aa',
//                 enableChildren: false,
//                 children: []
//             },
//             {
//                 title: 'Пункт А1',
//                 key: 'aab',
//                 enableChildren: false,
//                 children: []
//             }
//         ]
//     },
//     {
//         title: 'Группа пунктов Б',
//         key: 'b',
//         enableChildren: true,
//         children: [
//             {
//                 title: 'Пункт Б',
//                 key: 'bb',
//                 enableChildren: false,
//                 children: [],
//             },
//             {
//                 title: 'Пункт Б1',
//                 key: 'bbb',
//                 enableChildren: false,
//                 children: [],
//             }
//         ]
//     },
//     {
//         title: 'Группа пунктов B',
//         key: 'ccc',
//         enableChildren: true,
//         children: []
//     }
//
// ];

export class EditCheckingList extends React.Component {
    state = {
      numOfTask: '',
      markdown: '',
      valueTaskTitle: '',
      valueAuthor: '',
      valueState: '',
      value: '',
    };

    editTask = (task, number) => {
      this.setState({
        markdown: this.createMarkdown(task),
        valueAuthor: task.author,
        valueTaskTitle: task.title,
        valueState: task.state,
        numOfTask: number,
        // value: '',
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
        numOfTask: 'new',
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
      const arrClean = arrItemsSeparate.map((item) => item.map((it) => it.replace(/(^[\s*\n:]*)|([\s*\n:]*$)/g, '')));
      const arrObj = arrClean.map((item, number) => item.map((it, num) => ({
        title: it.replace(/[\+\s*\n\-\d]*$/, '').replace(/\.$/g, ''),
        maxScore: it.match(/[\+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, '').search(/\+/) === -1
          ? 0 : +it.match(/[\+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, '').replace('+', ''),
        minScore: it.match(/[\+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, '').search(/\-/) === -1
          ? 0 : +it.match(/[\+\s*\n\-\d]*$/g)[0].replace(/^[\s*]/g, ''),
        id: `${it.replace(/[\+\s*\n\-\d]*$/, '').replace(/\.$/g, '')}-${number}${num}`,
        category: arrCategories[number],
      })));

      const flatArr = arrObj.flat(2);

      return {
        id: `${this.state.valueTaskTitle}-v1`,
        title: this.state.valueTaskTitle,
        author: this.state.valueAuthor,
        state: this.state.valueState,
        categoriesOrder: arrCategories,
        items: flatArr,
      };
    }

    insertTask = (task) => {
      const result = data;
      if (this.state.numOfTask === 'new') {
        result.push(task);
        console.log('>>>>', result);
      } else {
        result[this.state.numOfTask] = task;
        console.log('--->', result);
      }
    }

    render() {
      console.log(this.state.markdown);
      const {
        markdown, value, valueTaskTitle, valueAuthor, valueState, numOfTask,
      } = this.state;

      const menu = (
        <Menu>
          {
                    data.map((item, number) => (
                      <Menu.Item>
                        <span onClick={() => this.editTask(item, number)}>
                          {item.title}
                        </span>
                      </Menu.Item>
                    ))
                }
          <Menu.Item danger>
            <span onClick={() => this.newTask()}>Создать новый таск</span>
          </Menu.Item>
        </Menu>
      );

      const options = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

      // const view = gData.map((item, index) => (
      //   <>
      //     <h4
      //       key={item.key}
      //       onClick={() => {
      //         this.setState({
      //           value: item.title,
      //           key: item.key,
      //           field: 'title',
      //         });
      //       }}
      //     >
      //       {`${index + 1} ${item.title}`}
      //     </h4>
      //     {item.children.map((it, ind) => (
      //       <>
      //         <p
      //           key={it.key}
      //           onClick={() => {
      //             this.setState({
      //               value: it.title,
      //               key: it.key,
      //               field: 'title',
      //             });
      //           }}
      //         >
      //           {`   ${ind + 1} ${it.title}`}
      //         </p>
      //         <span
      //           key={it.key + 1}
      //           onClick={() => {
      //             this.setState({
      //               value: it.description,
      //               key: it.key,
      //               field: 'description',
      //             });
      //           }}
      //         >
      //           {` ( ${it.description} )`}
      //         </span>
      //         <span
      //           key={it.key + 2}
      //           onClick={() => {
      //             this.setState({
      //               value: it.minScore.toString(),
      //               key: it.key,
      //               field: 'minScore',
      //             });
      //           }}
      //         >
      //           {`минимальная оценка: ${it.minScore}`}
      //         </span>
      //         <span
      //           key={it.key + 3}
      //           onClick={() => {
      //             this.setState({
      //               value: it.maxScore.toString(),
      //               key: it.key,
      //               field: 'maxScore',
      //             });
      //           }}
      //         >
      //           {`максимальная оценка: ${it.maxScore}`}
      //         </span>
      //       </>
      //     ))}
      //   </>
      // ));

      return (
        <>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Выбор таска
              {' '}
              <DownOutlined />
            </a>
          </Dropdown>
          {numOfTask.length !== 0
                && (
                <>
                  <Button
                    onClick={() => {
                      this.insertTask(this.createTaskFromMarkdown(markdown));
                      this.setState({
                        numOfTask: '',
                        valueTaskTitle: '',
                        valueAuthor: '',
                        valueState: '',
                        value: '',
                      });
                    }}
                  >
                    сохранить таск
                  </Button>
                  <Radio.Group
                    options={options}
                    onChange={(e) => this.setState({ valueState: e.target.value })}
                    value={valueState}
                  />
                  <TextArea
                    className="vvv"
                    placeholder="Название таска"
                    autoSize
                    value={valueTaskTitle}
                    onChange={(e) => {
                      this.setState({ valueTaskTitle: e.target.value });
                    }}
                  />
                  <TextArea
                    className="vvv"
                    placeholder="Автор"
                    autoSize
                    value={valueAuthor}
                    onChange={(e) => {
                      this.setState({ valueAuthor: e.target.value });
                    }}
                  />

                  <TextArea
                    className="vvv"
                    placeholder="Редактирование"
                    autoSize
                    value={markdown}
                    onChange={(e) => {
                      this.setState({ markdown: e.target.value });
                    }}
                  />
                  <Button
                    disabled={value.length === 0}
                    onClick={() => {
                      // this.editItem(key, field, value);
                      this.setState({
                        value: '',
                        key: '',
                        field: '',
                      });
                    }}
                  >
                    сохранить изменения
                  </Button>

                  <div className="view">
                    <h3>
                      Название таска:
                      {` ${valueTaskTitle}`}
                    </h3>
                    <h3>
                      Автор:
                      {` ${valueAuthor}`}
                    </h3>
                    {/* {view} */}
                  </div>
                </>
                )}
        </>
      );
    }
}
