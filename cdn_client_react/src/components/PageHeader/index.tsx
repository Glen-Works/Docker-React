import { Grid, Typography } from '@mui/material';

interface PageHeaderProp {
  title: string,
  subTitle: string
}

function PageHeader(props: PageHeaderProp) {
  const { title, subTitle } = props;

  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h4" component="h4" gutterBottom>
          {title}
        </Typography>
        <Typography variant="subtitle2">
          {subTitle}
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
