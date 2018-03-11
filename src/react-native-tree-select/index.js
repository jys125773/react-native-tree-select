import React from 'react';
import PropTypes from 'prop-types';
import {
  InteractionManager,
  StyleSheet,
  Platform,
  Dimensions,
  ScrollView,
  View,
  Text,
  Button,
} from 'react-native';
import Modal from "react-native-modal";
import Tree from './tree';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const IS_IOS = Platform.OS === 'ios';

export default class TreeSelect extends React.Component {
  static defaultProps = {
    ...Tree.defaultProps,
    isVisible: false,
  }

  static propTypes = {
    ...Tree.propTypes,
    isVisible: PropTypes.bool,
    onCancel: PropTypes.func,
    onComfirm: PropTypes.func,
  }

  state = {
    isVisible: false,
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.isVisible !== this.state.isVisible;
  }

  open = () => {
    this.setState({ isVisible: true });
  }

  close = () => {
    this.setState({ isVisible: false });
  }

  onOk = () => {
    const selectedValue = this.treeRef.getSelectValue();
    this.props.onComfirm(selectedValue);
    this.close();
  }

  render() {
    const { onComfirm, ...rest } = this.props;

    return (
      <Modal
        isVisible={this.state.isVisible}
        style={styles.modal}>
        <View style={styles.modalContent}>
          <View style={styles.tab}>
            <Button title="取消" color="red" onPress={this.close} />
            <Button title="确认" onPress={this.onOk} />
          </View>
          <Tree {...rest} ref={node => this.treeRef = node} />
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    marginTop: SCREEN_HEIGHT * 0.14,
  },
  tab: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#fff',
  }
});