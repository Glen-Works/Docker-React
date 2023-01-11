import PropTypes from 'prop-types';
import { FC, ReactNode } from 'react';
import { Outlet } from 'react-router-dom';

import { Box } from '@mui/material';
import Notification from "src/components/Notification";

interface BaseLayoutProps {
  children?: ReactNode;
}

const BaseLayout: FC<BaseLayoutProps> = ({ children }) => {
  return (
    <>
      <Notification />
      <Box
        sx={{
          flex: 1,
          height: '100%'
        }}
      >
        {children || <Outlet />}
      </Box>
    </>
  );
};

BaseLayout.propTypes = {
  children: PropTypes.node
};

export default BaseLayout;
