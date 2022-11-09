import { Box, Container, styled } from '@mui/material';
import PropTypes from 'prop-types';
import { FC, ReactNode } from 'react';

const PageTitle = styled(Box)(
  ({ theme }) => ``
);

interface PageTitleWrapperProps {
  children?: ReactNode;
}

const PageTitleWrapper: FC<PageTitleWrapperProps> = ({ children }) => {
  return (
    <PageTitle className="MuiPageTitle-wrapper" sx={{ p: 1 }}>
      <Container maxWidth={false}> {children}</Container>
    </PageTitle>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageTitleWrapper;
