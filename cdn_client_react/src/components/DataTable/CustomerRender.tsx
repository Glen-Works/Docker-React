import moment from 'moment';
import { MUIDataTableMeta } from "mui-datatables";

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

// export const CustomHeadLabelLowerCase = (options: CustomHeadLabelRenderOptions): string | React.ReactNode => {
//   let label = options.label?.toLowerCase() ?? "";
//   return label;
// }
