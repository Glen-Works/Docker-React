import { Container, useTheme } from "@mui/material";
import { ReactNode } from "react";

interface PageContentProp {
  children?: ReactNode
}

function PageContent(props: PageContentProp) {
  const { children } = props;
  const theme = useTheme();
  return (
    <Container maxWidth={false}
      sx={{
        width: 1,
        minHeight: 'calc(100vh - 70px)',
        background: `${theme.colors.alpha.white[100]}`,
        pt: '25px',
        pb: '50px',
      }} >
      {children}
    </Container>
  );
};

export default PageContent;
