export function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value) ?? "";
}

//樹狀資料 
interface TreeBase {
  id: number;
  parent: number;
  children?: any[];
}

export function makeRecursionTree<T extends TreeBase>(menuList: T[], parent: number = 0): T[] {

  let menuTree: T[] = [];
  for (let value of menuList) {
    if (value.parent == parent) {
      value.children = makeRecursionTree(menuList, value.id);
      menuTree.push(value);
    }
  }
  return menuTree;
}