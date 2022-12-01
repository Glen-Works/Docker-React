import { Checkbox, FormControlLabel } from "@material-ui/core";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TreeItem, TreeView } from "@mui/lab";
import React from "react";
import { MenuTree } from "src/middleware/authMenuMiddleware";

interface TreeCheckBoxProp {
  data: MenuTree
}

export default function TreeCheckBox(prop: TreeCheckBoxProp) {
  const { data } = prop;
  const [selected, setSelected] = React.useState<number[]>([]);

  const selectedSet = React.useMemo(() => new Set(selected), [selected]);

  const parentMap = React.useMemo(() => {
    return goThroughAllNodes(data);
  }, []);

  function goThroughAllNodes(nodes: MenuTree, map: Record<string, any> = {}) {
    if (!nodes?.children) {
      return null;
    }

    map[nodes.id] = getAllChild(nodes).splice(1);

    for (let childNode of nodes.children) {
      goThroughAllNodes(childNode, map);
    }

    return map;
  }

  // Get all children from the current node.
  function getAllChild(
    childNode: MenuTree | null,
    collectedNodes: any[] = []
  ) {
    if (childNode === null) return collectedNodes;

    collectedNodes.push(childNode.id);

    if (Array.isArray(childNode.children)) {
      for (const node of childNode.children) {
        getAllChild(node, collectedNodes);
      }
    }

    return collectedNodes;
  }

  const getChildById = (nodes: MenuTree, id: number) => {
    let array: number[] = [];
    let path: number[] = [];

    // recursive DFS
    function getNodeById(node: MenuTree, id: number, parentsPath: number[]) {
      let result = null;

      if (node.id === id) {
        return node;
      } else if (Array.isArray(node.children)) {
        for (let childNode of node.children) {
          result = getNodeById(childNode, id, parentsPath);

          if (!!result) {
            parentsPath.push(node.id);
            return result;
          }
        }

        return result;
      }

      return result;
    }

    const nodeToToggle = getNodeById(nodes, id, path);

    return { childNodesToToggle: getAllChild(nodeToToggle, array), path };
  };

  function getOnChange(checked: boolean, nodes: MenuTree) {
    const { childNodesToToggle, path } = getChildById(data, nodes.id);
    console.log("childNodesToChange", { childNodesToToggle, checked });

    let array = checked
      ? [...selected, ...childNodesToToggle]
      : selected
        .filter((value) => !childNodesToToggle.includes(value))
        .filter((value) => !path.includes(value));

    array = array.filter((v, i) => array.indexOf(v) === i);

    setSelected(array);
  }

  const renderTree = (nodes: MenuTree) => {
    const allSelectedChildren = parentMap[
      nodes.id
    ]?.every((childNodeId: number) => selectedSet.has(childNodeId));
    const checked = selectedSet.has(nodes.id) || allSelectedChildren || false;

    const indeterminate =
      parentMap[nodes.id]?.some((childNodeId: number) =>
        selectedSet.has(childNodeId)
      ) || false;

    if (allSelectedChildren && !selectedSet.has(nodes.id)) {
      console.log("if allSelectedChildren");

      setSelected([...selected, nodes.id]);
    }

    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id.toString()}
        label={
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                indeterminate={!checked && indeterminate}
                onChange={(event) =>
                  getOnChange(event.currentTarget.checked, nodes)
                }
                onClick={(e) => e.stopPropagation()}
              />
            }
            label={<>{nodes.name}</>}
            key={nodes.id}
          />
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map((node) => renderTree(node))
          : null}
      </TreeItem>
    );
  };

  return (
    <TreeView
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(data)}
    </TreeView>
  );
}
