import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  Platform,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TouchableNativeFeedback,
} from 'react-native';
const TochableFeedback = Platform.OS === 'ios' ? TouchableOpacity : TouchableNativeFeedback;
const checkIconNames = ['square-o', 'minus-square', 'check-square'];

export default class TreeNode extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.check !== this.props.check
      || nextProps.expanded !== this.props.expanded;
  }

  render() {
    const {
      check, expanded, onExpand, onSelect, multiple, onlyCheckLeaf, predecessorsCount,
      nodeData, nodeData: { key, label, children },
    } = this.props;
    const Tochable = hasChildren ? TouchableWithoutFeedback : TochableFeedback;
    const hasChildren = !!children;
    const checkable = multiple || !onlyCheckLeaf || onlyCheckLeaf && !hasChildren;

    return (
      <View style={[
        styles.container,
        { paddingLeft: predecessorsCount * 10 },
        !hasChildren && { backgroundColor: 'rgb(240,240,240)' },
      ]}>
        <Tochable
          onPress={() => checkable && onSelect(nodeData, check)}
          style={styles.tochable}>
          <View style={styles.icons}>
            {hasChildren && <Icon
              name={expanded ? 'caret-down' : 'caret-right'}
              style={styles.caretIcon}
              size={18} />}
            {checkable && <Icon
              name={checkIconNames[check || 0]}
              size={16}
              style={styles.checkIcon} />}
            <Text style={styles.label}>{label}</Text>
          </View>
        </Tochable>
        {hasChildren && <Icon
          onPress={() => hasChildren && onExpand(key, expanded)}
          name={expanded ? 'chevron-down' : 'chevron-up'}
          style={styles.chevronIcon}
          size={18} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  icons: {
    paddingLeft: 8,
    flex: 1,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 20,
    marginLeft: 6,
    marginRight: 6,
  },
  tochable: {
    flex: 1,
  },
  label: {
    paddingLeft: 0,
  },
  caretIcon: {
    width: 12,
  },
  chevronIcon: {
    padding: 10,
  },
});