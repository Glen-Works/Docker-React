import { Grid, Typography, useTheme } from '@mui/material';

interface PageHeaderProp {
  title: string,
  subTitle: string
}

function PageHeader(props: PageHeaderProp) {
  const { title, subTitle } = props;
  const theme = useTheme();

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item
        sx={{
          margin: '8px 8px',
        }}
      >
        <Typography variant="h5" component="h5">
          {title}
        </Typography>
        < Typography variant="subtitle2" sx={{ paddingLeft: '15px' }}>
          {subTitle}
        </Typography>
      </Grid>
    </Grid >
  );
}

export default PageHeader;
