import { Grid } from '@mui/material';
import Switch from '@mui/material/Switch';
import moment from 'moment';
import { MUIDataTableMeta } from "mui-datatables";

export const customBodyTime = (value: any, tableMeta: MUIDataTableMeta, updateValue: (value: string) => void): string | React.ReactNode => {
  let dateTime = "";

  if (value != null) {
    dateTime = moment(value).format('YYYY/MM/DD HH:mm:ss');
  }

  return (
    <div>
      {dateTime}
    </div>
  );
}

export const customBodySwitchBool = (value: any, tableMeta: MUIDataTableMeta, updateValue: (value: string) => void): string | React.ReactNode => {

  return (
    <div>
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={2}>
          <Switch checked={Boolean(value)} />
        </Grid>
      </Grid>
    </div>
  );
}