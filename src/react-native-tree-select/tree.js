import React from 'react';
import PropTypes from 'prop-types';
import {
  LayoutAnimation,
  ScrollView,
  View,
} from 'react-native';
import TreeNode from './treeNode';
import Utils from './utils';

export default class TreeSelect extends React.Component {
  static defaultProps = {
    multiple: false,
    onlyCheckLeaf: false,
    treeDefaultExpandedKeys: [],
    treeDefaultExpandAll: false,
  }

  static propTypes = {
    onSelect: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string,
      })),
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.string,
      })
    ]),
    multiple: PropTypes.bool,
    onlyCheckLeaf: PropTypes.bool,
    treeDefaultExpandedKeys: PropTypes.arrayOf(PropTypes.string),
    treeDefaultExpandAll: PropTypes.bool,
    treeData: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      children: PropTypes.array,
    })).isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedKeysMap: {},
      expandedMap: {},
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.selectedKeysMap !== this.state.selectedKeysMap
      || nextState.expandedMap !== this.state.expandedMap;
  }

  componentWillMount() {
    const { value, multiple, treeData, treeDefaultExpandedKeys, treeDefaultExpandAll } = this.props;
    const { predecessorsOfNodeMap, ownedLeafNodesMap, allNodesMap } = Utils.getPredecessorsMap(treeData);

    let leafNodesSelectedKeysMap = {};
    let predecessorsSelectedKeysMap = {};
    if (multiple) {
      leafNodesSelectedKeysMap = Utils.arrayToObj(value, ownedLeafNodesMap);
      Utils.traverseTree(treeData, (node) => {
        const { children, key } = node;
        if (children) {
          const { count, keysMap } = ownedLeafNodesMap[key];
          const selectedCount = Object.keys(leafNodesSelectedKeysMap).filter(k => keysMap[k]).length;
          predecessorsSelectedKeysMap[key] = selectedCount && (selectedCount === count ? 2 : 1);
        }
      });
    } else {
      const predecessors = predecessorsOfNodeMap[value.key].forEach(({ key }) => {
        predecessorsSelectedKeysMap[key] = 2;
      });
    }

    let expandedMap = {};
    if (treeDefaultExpandAll) {
      Utils.traverseTree(treeData, (node) => {
        expandedMap[node.key] = true;
      });
    } else if (treeDefaultExpandedKeys.length !== 0) {
      expandedMap = Utils.getExpandedMap(treeDefaultExpandedKeys, predecessorsOfNodeMap);
    } else {
      expandedMap = predecessorsSelectedKeysMap;
    }

    const selectedKeysMap = multiple ?
      { ...leafNodesSelectedKeysMap, ...predecessorsSelectedKeysMap }
      : { [value.key]: 2 };

    this.allNodesMap = allNodesMap;
    this.predecessorsOfNodeMap = predecessorsOfNodeMap;
    this.ownedLeafNodesMap = ownedLeafNodesMap;

    this.setState({ selectedKeysMap, expandedMap });
  }

  onSelect = (node, check) => {
    const { multiple } = this.props;
    const { expandedMap: preExpandedMap } = this.state;
    const { predecessorsOfNodeMap, ownedLeafNodesMap } = this;
    const { key, children } = node;
    const predecessors = predecessorsOfNodeMap[key];
    const hasChildren = !!children;
    const nextCheck = check ? 0 : 2;
    const updatedSubKeys = { [key]: nextCheck };

    let selectedKeysMap = updatedSubKeys;
    if (multiple) {
      hasChildren && Utils.traverseTree(children, (node) => {
        const { key, children } = node;
        updatedSubKeys[key] = nextCheck;
      });
      selectedKeysMap = { ...this.state.selectedKeysMap, ...updatedSubKeys };

      predecessors && predecessors.forEach(({ key }) => {
        const { count, keys } = ownedLeafNodesMap[key];
        const leafCount = keys.filter(k => selectedKeysMap[k] === 2).length;
        selectedKeysMap[key] = leafCount && (leafCount === count ? 2 : 1);
      });
    }

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({
      selectedKeysMap,
      expandedMap: nextCheck === 2 ? { ...preExpandedMap, [key]: true } : preExpandedMap,
    });
  }

  onExpand = (key, expanded) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    this.setState({ expandedMap: { ...this.state.expandedMap, [key]: !expanded } });
  }

  getSelectValue = () => {
    const { multiple, onlyCheckLeaf } = this.props;
    const { allNodesMap } = this;
    const { selectedKeysMap } = this.state;

    if (multiple) {
      const allSelectedNodes = Object.keys(selectedKeysMap).reduce((acc, k) => {
        if (selectedKeysMap[k] === 2) {
          acc.push(this.allNodesMap[k]);
        }
        return acc;
      }, []);

      if (!onlyCheckLeaf) {
        return allSelectedNodes;
      }

      return allSelectedNodes.filter(({ isLeaf }) => isLeaf);
    } else {
      const k = Object.keys(selectedKeysMap)[0];
      return this.allNodesMap[k];
    }
  }

  renderNode(nodeData) {
    const { onlyCheckLeaf, multiple } = this.props;
    const { expandedMap, selectedKeysMap } = this.state;
    const { key } = nodeData;
    const predecessorsCount = this.predecessorsOfNodeMap[key].length;

    return (
      <TreeNode
        onExpand={this.onExpand}
        onSelect={this.onSelect}
        predecessorsCount={predecessorsCount}
        check={selectedKeysMap[key]}
        onlyCheckLeaf={onlyCheckLeaf}
        multiple={multiple}
        expanded={expandedMap[key]}
        nodeData={nodeData} />
    );
  }

  renderTree(children, parentExpanded) {
    const { expandedMap } = this.state;

    return children.map((nodeData) => {
      const { key, label, children } = nodeData;

      return (
        <View key={key} style={{
          height: parentExpanded ? 'auto' : 0,
          overflow: 'hidden',
        }}>
          {this.renderNode(nodeData)}
          {children && this.renderTree(children, expandedMap[key])}
        </View>
      );
    });
  }

  render() {

    return (
      <ScrollView>
        {this.renderTree(this.props.treeData, true)}
      </ScrollView>
    );
  }
}