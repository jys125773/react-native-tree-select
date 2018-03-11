import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import TreeSelect from './src/react-native-tree-select';

const treeData = [
  {
    key: 'dongwu', label: '动物', children: [
      {
        key: 'youjizui', label: '有脊椎', children: [
          {
            key: 'taisheng', label: '胎生',
          },
          {
            key: 'ruansheng', label: '卵生', children: [
              {
                key: 'youyumao', label: '有羽毛',
              },
              {
                key: 'wuyumao', label: '无羽毛', children: [
                  {
                    key: 'ludichanluan', label: '陆地产卵',
                  },
                  {
                    key: 'shuixiachanluan', label: '水下产卵',
                  },
                ]
              }
            ]
          }
        ]
      },
      {
        key: 'wujizhui', label: '无脊椎', children: [
          {
            key: 'duoxibao', label: '多细胞', children: [
              {
                key: 'yichukou', label: '一出口', children: [
                  {
                    key: 'bianping', label: '扁平',
                  },
                  {
                    key: 'duichen', label: '对称',
                  }
                ]
              },
              {
                key: 'erchukou', label: '二出口', children: [
                  {
                    key: 'changhuobao', label: '长或薄',
                  },
                  {
                    key: 'feichanghuobao', label: '非长或薄',
                  }
                ]
              }
            ]
          },
          {
            key: 'danxibao', label: '单细胞',
          }
        ]
      }
    ]
  }
]

export default class App extends React.Component {
  state = {
    isVisible: false,
    value: [{ key: 'feichanghuobao', label: '非长或薄' }]
  }
  render() {
    return (
      <View style={styles.container}>
        {this.state.value.map(({ key, label }) => {
          return <Text key={key}>{label}</Text>
        })}
        <Button
          onPress={() => {
            this.treeSelectRef.open();
          }}
          title="Open TreeSelect" />
        <TreeSelect
          ref={node => this.treeSelectRef = node}
          onComfirm={(value) => {
            this.setState({ value });
          }}
          value={this.state.value}
          onlyCheckLeaf={true}
          multiple={true}
          treeData={treeData} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
});