import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { forwardRef } from 'react';

interface DataTableUserInfoProp {
  title: string,
  isOpen?: boolean,
  index?: number,
  handleClose: () => void,
  // submit: (id: number) => void,
}

function SampleDataTableDeleteUser(props: DataTableUserInfoProp) {
  const { title, isOpen, index, handleClose } = props;

  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* form input */}
          {index}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          {/* <Button onClick={() => { submit(index) }}>確定</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
}
export default forwardRef(SampleDataTableDeleteUser);
