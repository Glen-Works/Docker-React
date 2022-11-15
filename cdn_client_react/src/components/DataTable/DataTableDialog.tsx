import { Breakpoint, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { ReactElement } from 'react';

interface DataTableInfoProp {
  title?: string,
  maxWidth?: Breakpoint,
  isOpen: boolean,
  children?: ReactElement,
  handleClose: () => void,
  submit: () => void,
}

export default function DataTableDialog(props: DataTableInfoProp) {
  const { title, maxWidth, isOpen, children, handleClose, submit } = props;

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose} fullWidth maxWidth={maxWidth}>
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

