import React from 'react';
import {
  Input, Tree, Button, Row, Col, Menu, Dropdown,
} from 'antd';
// import {DownOutlined} from '@ant-design/icons';
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
      gData: [],
      valueEdit: '',
      valueTaskTitle: '',
      valueAuthor: '',
      valueTaskName: '',

      key: '',
      doubleClickedKey: '',
    };

    componentDidMount() {
      this.setState({
        gData: this.createGData(data),
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

    editItem = (key, value) => {
      this.state.gData.forEach((item, number) => {
        if (item.key === key) {
          const data = this.state.gData;
          data[number].title = value;
          this.setState({ gData: data });
        }
        item.children.forEach((it, num) => {
          if (it.key === key) {
            const data = this.state.gData;
            data[number].children[num].title = value;
            this.setState({ gData: data });
          }
        });
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
      const { gData, valueEdit, key } = this.state;
      const view = gData.map((item, index) => (
        <>
          <h4
            key={item.key}
            onClick={() => {
              this.setState({ valueEdit: item.title });
              this.setState({ key: item.key });
            }}
          >
            {`${index + 1} ${item.title}`}
          </h4>
          {item.children.map((it, ind) => (
            <p
              key={it.key}
              onClick={() => {
                this.setState({ valueEdit: it.title });
                this.setState({ key: it.key });
              }}
            >
              {`   ${ind + 1} ${it.title}`}
            </p>
          ))}
        </>
      ));
      return (
        <>
          <Row>
            <Col span={24} />
          </Row>
          <Tree
            className="draggable-tree"
            draggable
                    // blockNode
            onDrop={this.onDrop}
            treeData={gData}
          />
          {key && (
          <TextArea
            className="vvv"
            placeholder="Input"
            autoSize
            value={valueEdit}
            onChange={(e) => {
              this.setState({ valueEdit: e.target.value });
            }}
          />
          )}
          {key && (
          <Button
            onClick={() => {
              this.editItem(key, valueEdit);
              this.setState({ valueEdit: '' });
              this.setState({ key: '' });
            }}
          >
            сохранить изменения
          </Button>
          )}
          <div className="view">
            {view}
          </div>
        </>
      );
    }
}
