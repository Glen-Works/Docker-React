import { Box, Grid, styled, Typography } from "@mui/material";
import { ReactNode } from "react";

interface DialogFormatProp {
  title?: string
  children?: ReactNode
}

const TypographyWrapper = styled(Box)(
  ({ theme }) => `
  .MuiTypography-root {
    margin-right: ${theme.spacing(2)};
  }
  `);

export default function DialogFormat(props: DialogFormatProp) {
  const { title, children } = props;
  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="center" m={0.5}>
      <Grid item xs={2.5} justifyContent="flex-end">
        <TypographyWrapper>
          <Typography variant="h5" textAlign="right">{title}</Typography>
        </TypographyWrapper>
      </Grid>
      <Grid item xs={8.5} >
        {/* <ThemeProvider theme={theme}> */}
        {children}
        {/* </ThemeProvider> */}
      </Grid>
    </Grid>
  );
}

