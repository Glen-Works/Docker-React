import { FormControlLabel } from "@material-ui/core";
import { TreeItem, TreeView } from "@mui/lab";
import { Avatar, Link } from "@mui/material";
import React, { useEffect } from "react";
import { NavLink as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { MenuTree, routerList } from "src/middleware/authMenuMiddleware";

interface MenuTreeViewProp {
  data: MenuTree
}

export default function MenuTreeView(prop: MenuTreeViewProp) {
  const { data } = prop;
  let location = useLocation();
  let navigate = useNavigate();

  const [selected, setSelected] = React.useState<number[]>([]);

  useEffect(() => {
    setSelected(getChildById(data, location.pathname));
  }, [selected]);

  const getChildById = (nodes: MenuTree, key: string) => {
    let path: number[] = []; //取的到節點的路徑

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
    // console.log(path);

    return path;
  };

  function getOnChange(nodes: MenuTree) {
    const parentList = getChildById(data, nodes.key);
    console.log("path", [nodes.id, ...parentList]);
    setSelected([nodes.id, ...parentList]);
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
                  <Avatar variant={"rounded"}
                    alt=""
                    src={RouterLink[nodes.key] ?? null}
                    style={{
                      width: 10,
                      height: 10,
                    }} />
                  <Link
                    component="button"
                    variant="body2"
                    onClick={() => {
                      // getOnChange(nodes);
                      navigate(routerList[nodes.key] ?? "/dashboard");
                    }}
                  >
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
    <TreeView
      // defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpanded={selected?.map(String) ?? null}
    // defaultExpandIcon={<ChevronRightIcon />}
    >
      {renderTree(data)}
    </TreeView>
  );
}
