import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { FC, useState } from 'react';
import { userEditApi, userInfoApi } from 'src/api/Sample/sampleDataTableApi';

interface UserData {
  name: string,
  email: string,
  status: boolean,
  userType: boolean,
  remark: string,
}

interface DataTableUserInfoProp {
  title: string,
  userInfo: UserData,
  isOpen: boolean,
  state: any,
  handleClose: () => void,
}



export const SampleDataTableEditUser: FC<DataTableUserInfoProp> = (props) => {
  const { title, userInfo, isOpen, state, handleClose } = props;
  const [userDataState, setUserDataState] = useState<UserData>();


  function getEditDataById(id: number) {
    userInfoApi(id, state)
      .then(res => {
        let data = res.data;
        setUserDataState({
          name: data[0].name,
          email: data[0].email,
          status: data[0].status,
          userType: data[0].userType,
          remark: data[0].remark,
        });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function setEdit(data: UserData, id: number) {
    userEditApi(id, data, state)
      .then(res => {
        // getData({ ...tableState.pageManagement });
        handleClose();
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }


  return (
    <>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          {/* form input */}

        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          {/* <Button onClick={editSunbmit}>確定</Button> */}
        </DialogActions>
      </Dialog>
    </>
  );
}