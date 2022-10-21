import { Grid, Typography } from '@mui/material';


function PageHeader() {
  return (
    <Grid container justifyContent="space-between" alignItems="center">
      <Grid item>
        <Typography variant="h3" component="h3" gutterBottom>
          標題
        </Typography>
        <Typography variant="subtitle2">
          敘述
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
