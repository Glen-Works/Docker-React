import { useContext, useEffect, useState } from 'react';

import {
  alpha,
  Box, styled
} from '@mui/material';
import { SidebarContext } from 'src/contexts/SidebarContext';

import { useAuthMenuContext } from 'src/contexts/AuthMenuContext';
import { makeMenuTree } from 'src/middleware/authMenuMiddleware';
import TreeMenuView from './TreeMenuView';

const MenuTreeWrapper = styled(Box)(
  ({ theme }) => `
  .MuiTreeView-root {
    padding: ${theme.spacing(0.5)} ${theme.spacing(0.5)} ${theme.spacing(0.5)} ${theme.spacing(3)};
  }
`
);

const MenuTreeItemWrapper = styled(Box)(
  ({ theme }) => `
  .MuiTreeItem-root{
    text-transform: uppercase;
    padding: ${theme.spacing(0.5, 0.2)};
    color: ${theme.colors.alpha.trueWhite[70]};
    background-color: transparent;
    width: 100%;

    .MuiTreeItem-content {
      width: ${theme.sidebar.width}
      font-weight: bold;
      border-radius: 20px;

      &.Mui-selected,&:hover {
        background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
        color: ${theme.colors.alpha.trueWhite[100]};

        .MuiSvgIcon-root {
          color: ${theme.colors.alpha.trueWhite[100]};
        }
    }

    .MuiTreeItem-iconContainer {
      .MuiSvgIcon-root {      
        font-size: 2em;
        margin: ${theme.spacing(0.5)} ${theme.spacing(2)} 0 0 ;
      }
    }

    .MuiSvgIcon-root {
      transition: ${theme.transitions.create(['color'])};
      font-size: 1.2em;
      transition: none;
      color: ${theme.colors.alpha.trueWhite[30]};
      margin: ${theme.spacing(0.8)} ${theme.spacing(1)} 0 0 ;
    }

    .MuiTypography-root {
      font-size: 1.35em;
      margin: ${theme.spacing(0.3)} 0 ${theme.spacing(0.3)} ;
    }

    .MuiFormControlLabel-root {
      width: ${theme.sidebar.width};
    }
  }
  `
);

function SidebarMenu() {
  const { closeSidebar } = useContext(SidebarContext);
  const AuthMenu = useAuthMenuContext();
  const [menuList, setMenuList] = useState(null);
  const [selected, setSelected] = useState<string[]>([""]);

  useEffect(() => {
    let authMenu = AuthMenu.state;
    if (authMenu != null) {
      setMenuList(makeMenuTree(AuthMenu.state, 0));
    }
  }, []);

  function setSelectMenu(data: string[]) {
    setSelected(data);
  }

  return (
    <>
      <MenuTreeWrapper>
        <MenuTreeItemWrapper>
          {
            menuList?.map((menu) => (
              <TreeMenuView
                key={menu.id}
                data={menu}
                selected={selected}
                setSelectMenu={setSelectMenu}
                closeSidebar={closeSidebar}
              />
            ))
          }
        </MenuTreeItemWrapper>
      </MenuTreeWrapper>
    </>
  );
}

export default SidebarMenu;
