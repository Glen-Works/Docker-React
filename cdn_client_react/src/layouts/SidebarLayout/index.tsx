import { alpha, Box, lighten, useTheme } from '@mui/material';
import { FC, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

interface SidebarLayoutProps {
  children?: ReactNode;
}

const SidebarLayout: FC<SidebarLayoutProps> = () => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          flex: 1,
          height: '100%',
          '.MuiPageTitle-wrapper': {
            background:
              theme.palette.mode === 'dark'
                ? theme.colors.alpha.trueWhite[5]
                : theme.colors.alpha.white[50],
            // marginBottom: `20px`,
            boxShadow:
              theme.palette.mode === 'dark'
                ? `0 1px 0 ${alpha(
                  lighten(theme.colors.primary.main, 0.7),
                  0.15
                )} inset , 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1) inset`
                : `0px -2px 4px -3px ${alpha(
                  theme.colors.alpha.black[100],
                  0.15
                )} inset, 0px -5px 12px -4px ${alpha(
                  theme.colors.alpha.black[100],
                  0.15
                )} inset`
          }
        }}
      >
        <Header />
        <Sidebar />
        <Box
          sx={{
            position: 'relative',
            zIndex: 5,
            display: 'block',
            flex: 1,
            pt: `70px`,
            [theme.breakpoints.up('lg')]: {
              ml: `${theme.sidebar.width}`
            }
          }}
        >
          <Box display="block">
            <Outlet />
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default SidebarLayout;
