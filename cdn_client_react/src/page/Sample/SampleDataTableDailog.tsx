import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ReactElement } from 'react';

interface DataTableInfoProp {
  title?: string,
  isOpen: boolean,
  children?: ReactElement,
  handleClose: () => void,
  submit: () => void,
}

export default function SampleDataTableDailog(props: DataTableInfoProp) {
  const { title, isOpen, children, handleClose, submit } = props;

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {children}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={submit}>確定</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

