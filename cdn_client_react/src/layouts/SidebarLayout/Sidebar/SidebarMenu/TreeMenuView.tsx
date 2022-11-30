import { FormControlLabel } from "@material-ui/core";
import { TreeItem, TreeView } from "@mui/lab";
import { Avatar, Link } from "@mui/material";
import { useEffect, useState } from "react";
import { unstable_batchedUpdates } from "react-dom";
import { NavLink as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { getMenuKeyByValue, MenuTree, routerList } from "src/middleware/authMenuMiddleware";

type setMenu = (data: string[]) => void;

interface TreeMenuViewProp {
  data: MenuTree,
  selected: string[],
  setSelectMenu: setMenu,
}

export default function TreeMenuView(prop: TreeMenuViewProp) {
  const { data, selected, setSelectMenu } = prop;
  let location = useLocation();
  let navigate = useNavigate();

  const [expend, setExpend] = useState<string[]>([]);

  useEffect(() => {
    setDefaultExpanded(data);
  }, []);

  const handleToggle = (event: React.SyntheticEvent, nodeIds: string[]) => {
    setExpend(nodeIds);
  };

  const getChildById = (nodes: MenuTree, key: string, path: number[]) => {
    // let path: number[] = []; //取的到節點的路徑

    // recursive DFS
    function getNodeById(node: MenuTree, key: string, parentsPath: number[]) {
      let result = null;

      if (node.key === key) {
        return node;
      } else if (Array.isArray(node.children)) {
        for (let childNode of node.children) {
          result = getNodeById(childNode, key, parentsPath);

          if (!!result) {
            parentsPath.push(node.id);
            return result;
          }
        }

        return result;
      }

      return result;
    }

    const nodeToToggle = getNodeById(nodes, key, path);

    if (nodeToToggle != undefined) path.push(nodeToToggle.id);

    return nodeToToggle;
  };

  function setDefaultExpanded(nodes: MenuTree) {
    let parentList: number[] = [];
    const node = getChildById(data, getMenuKeyByValue(routerList, location.pathname), parentList);
    if (parentList?.length > 0) {
      unstable_batchedUpdates(() => {
        setExpend(parentList.map(String));
        setSelectMenu([node.id.toString()]);
      });
    }
  }

  const renderTree = (nodes: MenuTree) => {

    return (
      <TreeItem
        key={nodes.id}
        nodeId={nodes.id.toString()}
        label={
          <FormControlLabel
            control={
              <>
                {(nodes.feature == "P") && <>
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      // getOnChange(nodes);
                      setSelectMenu([nodes.id.toString()]);
                      navigate(routerList[nodes.key]?.uri ?? "/dashboard");
                    }}
                  >
                    <Avatar variant={"rounded"}
                      alt=""
                      src={RouterLink[nodes.key]?.icon ?? null}
                      style={{
                        width: 10,
                        height: 10,
                      }} />
                  </Link>
                </>
                }
              </>
            }
            label={<>{nodes.name}</>}
            key={nodes.id}
          />
        }
      >
        {
          Array.isArray(nodes.children)
            ? nodes.children.map((node) => renderTree(node))
            : null
        }
      </TreeItem >
    );
  };

  return (
    <>
      <TreeView
        expanded={expend}
        selected={selected}
        onNodeToggle={handleToggle}
      >
        {renderTree(data)}
      </TreeView>
    </>
  );
}
