export default class Utils {
  static arrayToObj(obj, ownedLeafNodesMap) {
    return obj.reduce((acc, { key }) => {
      const leafNodes = ownedLeafNodesMap[key];
      if (leafNodes) {
        acc = Object.assign(acc, leafNodes.keysMap);
      } else {
        acc[key] = 2;
      }
      return acc;
    }, {});
  }

  static getPredecessorsMap(treeData, predecessors = [], predecessorsOfNodeMap = {}, ownedLeafNodesMap = {}, allNodesMap = {}) {
    treeData.forEach((node) => {
      const { key, children, label } = node;
      predecessorsOfNodeMap[key] = predecessors;
      allNodesMap[key] = { key, label, isLeaf: !children };

      if (children) {
        ownedLeafNodesMap[key] = { count: 0, keysMap: {}, keys: [] };
      } else {
        predecessors.forEach(({ key: k }) => {
          ownedLeafNodesMap[k].count++;
          ownedLeafNodesMap[k].keysMap[key] = 2;
          ownedLeafNodesMap[k].keys.push(key);
        });
      }

      children && Utils.getPredecessorsMap(
        children,
        predecessors.concat(node),
        predecessorsOfNodeMap,
        ownedLeafNodesMap,
        allNodesMap
      );
    });

    return { predecessorsOfNodeMap, ownedLeafNodesMap, allNodesMap };
  }

  static traverseTree(treeData, fn) {
    treeData.map(node => {
      fn(node);
      node.children && Utils.traverseTree(node.children, fn);
    });
  }

  static getExpandedMap(nodeKeys, predecessorsOfNodeMap, expandedMap = {}) {
    nodeKeys.forEach(k => {
      predecessorsOfNodeMap[k].forEach(({ key }) => {
        expandedMap[key] = true;
      });
    });

    return expandedMap;
  }
}