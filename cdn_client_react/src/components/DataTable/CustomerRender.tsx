import { Box, Grid } from '@mui/material';
import Switch from '@mui/material/Switch';
import moment from 'moment';
import { MUIDataTableMeta } from "mui-datatables";
import Label from '../Label';

export const CustomBodyTime = (value: any, tableMeta: MUIDataTableMeta, updateValue: (value: string) => void): string | React.ReactNode => {
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


export const CustomBodySwitchBool = (value: any, tableMeta: MUIDataTableMeta, updateValue: (value: string) => void): string | React.ReactNode => {
  const statusMap = {
    0: {
      text: '停用',
      color: 'error'
    },
    1: {
      text: '啟用',
      color: 'primary'
    }
  };

  const userTypeMap = {
    1: {
      text: '管理者',
      color: 'primary'
    },
    2: {
      text: '一般使用者',
      color: 'secondary'
    }
  };

  const getStatusLabel = (status): JSX.Element => {
    const map = (tableMeta["columnData"]["name"] == "status") ? statusMap : userTypeMap;

    if (map[status] == undefined) {
      return <Box component="span">{status}</Box>
    } else {
      const { text, color }: any = map[status];
      return <Label color={color}>{text}</Label>;
    }
  };

  return (
    <div>
      {getStatusLabel(value)}
      {/* <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
      >
        <Grid item xs={2}>
          <Switch checked={Boolean(value)} />
        </Grid>
      </Grid> */}
    </div>
  );
}