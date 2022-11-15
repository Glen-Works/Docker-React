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
  const statusMap = [
    { id: 0, label: '停用', color: 'error' },
    { id: 1, label: '啟用', color: 'primary' }
  ];

  const userTypeMap = [
    { id: 1, label: '管理者', color: 'primary' },
    { id: 2, label: '一般使用者', color: 'secondary' }
  ];

  const getStatusLabel = (status): JSX.Element => {
    const data = (tableMeta["columnData"]["name"] == "status") ? statusMap : userTypeMap;
    let htmlCode = <Box component="span">{status}</Box>;

    data.map((value, index) => {
      const { id, label, color }: any = value;
      if (value.id == status) {
        htmlCode = <Label color={color}>{label}</Label>;
        return false;
      }
    });

    return htmlCode;

    /*if (map[status] == undefined) {
      return <Box component="span">{status}</Box>
    } else {
      const { text, color }: any = map[status];
      return <Label color={color}>{text}</Label>;
    }*/
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