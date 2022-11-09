import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ReactElement } from 'react';

interface DataTableInfoProp {
  title?: string,
  content?: string,
  data?: string,
  buttonType: "button" | "submit" | "reset",
  isOpen: boolean,
  children?: ReactElement,
  handleClose: () => void,
  submit: () => void,
}

export default function SampleDataTableDailog(props: DataTableInfoProp) {
  const { title, content, data, buttonType, isOpen, children, handleClose, submit } = props;

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {(content == undefined) ? children : `${content} ${data} ?`}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button type={buttonType} onClick={submit}>確定</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

