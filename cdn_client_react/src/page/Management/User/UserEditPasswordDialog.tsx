import { Grid, TextField, Typography } from "@mui/material";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/Dialog/DialogFormat";

interface UserAddAndEditDialogProp {
  selectedId: number,
  editPasswordOpen: boolean,
  handleEditPwdClose: () => void,
  submitEditPwd: (formObj, event) => void,
  onError: (errors, e) => void,
  registerPwd: any,
  handleSubmitPwd: any,
  watchPwd: any,
  pwdErrors: any,
}

export default function UserAddAbdEditDialog(props: UserAddAndEditDialogProp) {
  const {
    selectedId,
    editPasswordOpen,
    handleEditPwdClose,
    registerPwd,
    handleSubmitPwd,
    watchPwd,
    pwdErrors,
    submitEditPwd,
    onError
  } = props;

  return (
    <>
      <DataTableDialog
        title={"修改使用者密碼"}
        maxWidth="md"
        isOpen={editPasswordOpen}
        handleClose={handleEditPwdClose}
        submit={handleSubmitPwd(submitEditPwd, onError)}
      >
        <Grid container justifyContent="center" alignItems="center" direction="column" >
          <DialogFormat title="ID :" >
            <Typography variant="h5" textAlign="left">{selectedId}</Typography>
          </DialogFormat>
          <DialogFormat title="密碼 :" >
            <TextField
              id="password"
              name="password"
              type="password"
              {...registerPwd("password", {
                required: "Required field",
                minLength: { value: 5, message: "at least 5 letter" },
                maxLength: { value: 100, message: "need less 100 length" },
              })}
              fullWidth={true}
              error={!!pwdErrors?.password}
              helperText={pwdErrors?.password ? pwdErrors.password.message : null}
            />
          </DialogFormat>
          <DialogFormat title="密碼確認 :" >
            <TextField
              id="passwordCheck"
              name="passwordCheck"
              type="password"
              {...registerPwd("passwordCheck", {
                required: "Required field",
                validate: (val: string) => {
                  if (watchPwd('password') != val) {
                    return "Your passwords do no match";
                  }
                }
              })}
              fullWidth={true}
              error={!!pwdErrors?.passwordCheck}
              helperText={pwdErrors?.passwordCheck ? pwdErrors.passwordCheck.message : null}
            />
          </DialogFormat>
        </Grid>
      </DataTableDialog>
    </>
  )
}