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
      gData: [],
      valueCreateCategory: '',
      valueCreateItem: '',
      valueTaskTitle: '',
      valueAuthor: '',
      valueState: '',
      value: '',
      key: '',
      field: '',
    };

    editTask = (task, number) => {
      this.setState({
        gData: this.createGData(task),
        valueAuthor: task.author,
        valueTaskTitle: task.title,
        valueState: task.state,
        numOfTask: number,
        valueCreateCategory: '',
        valueCreateItem: '',
        value: '',
        key: '',
        field: '',
      });
    }

    newTask = () => {
      this.setState({
        gData: [{
          title: 'Example Category',
          key: 'new',
          enableChildren: true,
          children: [],
        }],
        valueAuthor: '',
        valueTaskTitle: '',
        valueState: 'DRAFT',
        numOfTask: 'new',
        valueCreateCategory: '',
        valueCreateItem: '',
        value: '',
        key: '',
        field: '',
      });
    }

    createGData = (data) => {
      const gData = data.categoriesOrder.map((item, number) => ({
        title: item,
        key: item + number,
        enableChildren: true,
        children: data.items.filter((obj) => obj.category === item)
          .map((it, num) => ({
            title: it.title,
            key: it.id,
            enableChildren: false,
            description: it.description,
            minScore: it.minScore,
            maxScore: it.maxScore,
          })),
      }));
      return gData;
    }

    createOutData = (data) => {
      const items = [];
      data.forEach((item, number) => {
        item.children.forEach((it, num) => {
          items.push({
            id: `${it.title}-p${number}${num}`,
            title: it.title,
            description: it.description,
            minScore: +it.minScore,
            maxScore: +it.maxScore,
            category: item.title,
          });
        });
      });

      return {
        id: `${this.state.valueTaskTitle}-v1`,
        title: this.state.valueTaskTitle,
        author: this.state.valueAuthor,
        state: this.state.valueState,
        categoriesOrder: data.map((item) => item.title),
        items,

      };
    }

    editItem = (key, field, value) => {
      this.state.gData.forEach((item, number) => {
        if (item.key === key) {
          const data = this.state.gData;
          data[number][field] = value;
          this.setState({ gData: data });
        }
        item.children.forEach((it, num) => {
          if (it.key === key) {
            const data = this.state.gData;
            data[number].children[num][field] = value;
            this.setState({ gData: data });
          }
        });
      });
    }

    deleteItem = (key) => {
      this.state.gData.forEach((item, number) => {
        if (item.key === key) {
          const data = this.state.gData;
          data.splice(number, 1);
          this.setState({ gData: data });
        }
        item.children.forEach((it, num) => {
          if (it.key === key) {
            const data = this.state.gData;
            data[number].children.splice(num, 1);
            this.setState({ gData: data });
          }
        });
      });
    }

    createCategory = (value) => {
      this.state.gData.push({
        title: value,
        key: value + this.state.gData.length,
        enableChildren: true,
        children: [],
      });
    }

    createItem = (value) => {
      const [title, description, minScore, maxScore] = value.split('//');
      this.state.gData[this.state.gData.length - 1].children.push({
        title,
        key: title + this.state.gData[this.state.gData.length - 1].children.length,
        enableChildren: false,
        description,
        minScore,
        maxScore,
      });
    }

    onDrop = (info) => {
      console.log(info);
      const dropKey = info.node.props.eventKey;
      const dragKey = info.dragNode.props.eventKey;
      const dropPos = info.node.props.pos.split('-');
      const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

      const loop = (data, key, callback) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
          if (data[i].children) {
            loop(data[i].children, key, callback);
          }
        }
      };
      const data = [...this.state.gData];

      // Find dragObject
      let dragObj;
      let arr1;
      let index1;
      loop(data, dragKey, (item, index, arr) => {
        dragObj = item;
        arr1 = arr;
        index1 = index;
      });

      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          if (!dragObj.enableChildren && item.enableChildren) {
            arr1.splice(index1, 1);
            item.children.push(dragObj);
          }
        });
      } else if (
        (info.node.props.children || []).length > 0 // Has children
            && info.node.props.expanded // Is expanded
            && dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || [];
          if (dragObj.enableChildren === item.enableChildren) {
            arr1.splice(index1, 1);
            item.children.unshift(dragObj);
          }
        });
      } else {
        let ar;
        let i;
        let item1;
        loop(data, dropKey, (item, index, arr) => {
          ar = arr;
          i = index;
          item1 = item;
        });
        if (dropPosition === -1) {
          if (dragObj.enableChildren === item1.enableChildren) {
            arr1.splice(index1, 1);
            ar.splice(i, 0, dragObj);
          }
        } else if (dragObj.enableChildren === item1.enableChildren) {
          arr1.splice(index1, 1);
          ar.splice(i + 1, 0, dragObj);
        }
      }

      this.setState({
        gData: data,
      });
    };

    render() {
      console.log(this.state.gData);
      const {
        gData, key, field, value, valueCreateItem, valueCreateCategory, valueTaskTitle, valueAuthor, valueState,
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

      const view = gData.map((item, index) => (
        <>
          <h4
            key={item.key}
            onClick={() => {
              this.setState({
                value: item.title,
                key: item.key,
                field: 'title',
              });
            }}
          >
            {`${index + 1} ${item.title}`}
          </h4>
          {item.children.map((it, ind) => (
            <>
              <p
                key={it.key}
                onClick={() => {
                  this.setState({
                    value: it.title,
                    key: it.key,
                    field: 'title',
                  });
                }}
              >
                {`   ${ind + 1} ${it.title}`}
              </p>
              <span
                key={it.key + 1}
                onClick={() => {
                  this.setState({
                    value: it.description,
                    key: it.key,
                    field: 'description',
                  });
                }}
              >
                {` ( ${it.description} )`}
              </span>
              <span
                key={it.key + 2}
                onClick={() => {
                  this.setState({
                    value: it.minScore.toString(),
                    key: it.key,
                    field: 'minScore',
                  });
                }}
              >
                {`минимальная оценка: ${it.minScore}`}
              </span>
              <span
                key={it.key + 3}
                onClick={() => {
                  this.setState({
                    value: it.maxScore.toString(),
                    key: it.key,
                    field: 'maxScore',
                  });
                }}
              >
                {`максимальная оценка: ${it.maxScore}`}
              </span>
            </>
          ))}
        </>
      ));
      return (
        <>
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
              Выбор таска
              {' '}
              <DownOutlined />
            </a>
          </Dropdown>
          {gData.length !== 0
                && (
                <>
                  <Button
                    onClick={() => {
                      console.log('>>>', this.createOutData(gData));
                    }}
                  >
                    out data
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
                  <Tree
                    className="draggable-tree"
                    draggable
                            // blockNode
                    onDrop={this.onDrop}
                    treeData={gData}
                  />
                  <TextArea
                    className="vvv"
                    placeholder="Редактирование"
                    autoSize
                    value={value}
                    onChange={(e) => {
                      this.setState({ value: e.target.value });
                    }}
                  />
                  <Button
                    disabled={value.length === 0}
                    onClick={() => {
                      this.editItem(key, field, value);
                      this.setState({
                        value: '',
                        key: '',
                        field: '',
                      });
                    }}
                  >
                    сохранить изменения
                  </Button>
                  <Button
                    disabled={value.length === 0 || field !== 'title'}
                    onClick={() => {
                      this.deleteItem(key);
                      this.setState({
                        value: '',
                        key: '',
                        field: '',
                      });
                    }}
                  >
                    удалить
                  </Button>
                  <TextArea
                    className="vvv"
                    placeholder="Создать категорию"
                    autoSize
                    value={valueCreateCategory}
                    onChange={(e) => {
                      this.setState({ valueCreateCategory: e.target.value });
                    }}
                  />
                  <Button
                    disabled={valueCreateCategory.length === 0}
                    onClick={() => {
                      this.createCategory(valueCreateCategory);
                      this.setState({
                        valueCreateCategory: '',
                      });
                    }}
                  >
                    Создать новую категорию
                  </Button>
                  <TextArea
                    className="vvv"
                    placeholder="Создать пункт в категории (Название//Описание//Минимальная оценка//Максимальная оценка)"
                    autoSize
                    value={valueCreateItem}
                    onChange={(e) => {
                      this.setState({ valueCreateItem: e.target.value });
                    }}
                  />
                  <Button
                    disabled={valueCreateItem.split('//').length !== 4 || gData.length === 0}
                    onClick={() => {
                      this.createItem(valueCreateItem);
                      this.setState({
                        valueCreateItem: '',
                      });
                    }}
                  >
                    Создать новый пункт
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
                    {view}
                  </div>
                </>
                )}
        </>
      );
    }
}
