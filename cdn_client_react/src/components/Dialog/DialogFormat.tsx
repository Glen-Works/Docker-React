import { Box, Grid, styled, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from '@mui/material/styles';
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

const TextFieldTheme = (Theme) =>
  createTheme({
    ...Theme,
    components: {
      MuiTypography: {
        styleOverrides: {
          root: {
            mr: Theme.spacing(2)
          }
        }
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            lineHeight: 1.5,
            height: '1.4375em',
            fontSize: '1.4375em',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          input: {
            padding: '8.5px 14px',
          }
        }
      }
    },
  });


export default function DialogFormat(props: DialogFormatProp) {
  const { title, children } = props;
  return (
    <Grid container direction="row" justifyContent="flex-start" alignItems="center" m={0.5}>
      <Grid item xs={2} justifyContent="flex-end">
        <TypographyWrapper>
          <Typography variant="h6" textAlign="right">{title}</Typography>
        </TypographyWrapper>
      </Grid>
      <Grid item xs={9} >
        <ThemeProvider theme={TextFieldTheme}>
          {children}
        </ThemeProvider>
      </Grid>
    </Grid>
  );
}

