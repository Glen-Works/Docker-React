import { useContext, useEffect, useState } from 'react';

import {
  alpha,
  Box, styled
} from '@mui/material';
import { SidebarContext } from 'src/contexts/SidebarContext';

import { useAuthMenuContext } from 'src/contexts/AuthMenuContext';
import { makeMenuTree } from 'src/middleware/authMenuMiddleware';
import MenuTreeView from './MenuTreeView';

const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }
    
        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }
          
          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create(['transform', 'opacity'])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

const MenuTreeWrapper = styled(Box)(
  ({ theme }) => `
  .MuiTreeView-root {
    padding: ${theme.spacing(0.5)};
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

    .MuiTreeItem-label{
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      line-height: 1.5;

      &:hover {
        background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
        color: ${theme.colors.alpha.trueWhite[100]};
  
        .MuiTreeItem-iconContainer {
          color: ${theme.colors.alpha.trueWhite[100]};
        }
    }
    
    

    .MuiTreeItem-iconContainer {
      transition: ${theme.transitions.create(['color'])};
      font-size: inherit;
      transition: none;
      color: ${theme.colors.alpha.trueWhite[30]};
      font-size: ${theme.typography.pxToRem(20)};
      
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
      setMenuList(makeMenuTree(AuthMenu.state));
    }
  }, []);

  function setSelectMenu(data: string[]) {
    setSelected(data);
  }

  // console.log(AuthMenu.state);
  // console.log(menuList);

  return (
    <>
      {/* <MenuWrapper>
        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/user"
                  startIcon={<DesignServicesTwoToneIcon />}
                >
                  User
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/menu"
                  startIcon={<BrightnessLowTwoToneIcon />}
                >
                  Menu
                </Button>
              </ListItem>
              <ListItem component="div">
                <Button
                  disableRipple
                  component={RouterLink}
                  onClick={closeSidebar}
                  to="/role"
                  startIcon={<MmsTwoToneIcon />}
                >
                  Role
                </Button>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>

      </MenuWrapper> */}
      <MenuTreeWrapper>
        <MenuTreeItemWrapper>
          {
            menuList?.map((menu) => (
              // <h1 key={menu.id}>{menu.id}</h1>
              <MenuTreeView
                key={menu.id}
                data={menu}
                selected={selected}
                setSelectMenu={setSelectMenu}
              />
            ))
          }
        </MenuTreeItemWrapper>
      </MenuTreeWrapper>
    </>
  );
}

export default SidebarMenu;
