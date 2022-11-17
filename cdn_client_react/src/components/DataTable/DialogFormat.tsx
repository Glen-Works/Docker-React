import { createTheme, Grid, ThemeProvider, Typography } from "@mui/material";
import { ReactNode } from "react";

interface DialogFormatProp {
  title?: string
  children?: ReactNode
}

const TitleTheme = (Theme) =>
  createTheme({
    ...Theme,
    // typography: {
    //   ...Theme.typography,
    //   h3: {
    //     fontWeight: 500,
    //     fontSize: 20,
    //     lineHeight: 1.6,
    //     color: Theme.colors.alpha.black[100]
    //   },
    // }
  });


export default function DialogFormat(props: DialogFormatProp) {
  const { title, children } = props;
  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="center">
      <Grid item xs={1.5} justifyContent="flex-end">
        <ThemeProvider theme={TitleTheme}>
          <Typography variant="h3" textAlign="right" mr={2}>{title}</Typography>
        </ThemeProvider>
      </Grid>
      <Grid item xs={10} >
        {/* <ThemeProvider theme={theme}> */}
        {children}
        {/* </ThemeProvider> */}
      </Grid>
    </Grid>
  );
}

