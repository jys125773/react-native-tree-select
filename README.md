![](https://github.com/jys125773/react-native-tree-select/blob/master/treeselect.gif)

```
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
```