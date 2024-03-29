import { Grid, TextField } from "@mui/material";
import { useIntl } from "react-intl";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/Dialog/DialogFormat";

interface ProfileEditPasswordDialogProp {
  // selectedId: number,
  editPasswordOpen: boolean,
  handleEditPwdClose: () => void,
  submitEditPwd: (formObj, event) => void,
  onError: (errors, e) => void,
  registerPwd: any,
  handleSubmitPwd: any,
  watchPwd: any,
  pwdErrors: any,
}

export default function ProfileEditPasswordDialog(props: ProfileEditPasswordDialogProp) {
  const {
    // selectedId,
    editPasswordOpen,
    handleEditPwdClose,
    registerPwd,
    handleSubmitPwd,
    watchPwd,
    pwdErrors,
    submitEditPwd,
    onError
  } = props;

  const intl = useIntl();

  return (
    <>
      <DataTableDialog
        title={
          intl.formatMessage({
            id: 'header.page.profile.password.update',
            defaultMessage: '密碼修改',
          })
        }
        maxWidth="md"
        isOpen={editPasswordOpen}
        handleClose={handleEditPwdClose}
        submit={handleSubmitPwd(submitEditPwd, onError)}
      >
        <Grid container justifyContent="center" alignItems="center" direction="column" >
          <DialogFormat
            title={
              intl.formatMessage({
                id: 'header.page.profile.password',
                defaultMessage: '密碼',
              })
            } >
            <TextField
              id="password"
              name="password"
              type="password"
              {...registerPwd("password", {
                required: intl.formatMessage({
                  id: 'error.required',
                  defaultMessage: '必填欄位',
                }),
                minLength: {
                  value: 5, message: intl.formatMessage({
                    id: 'error.min.length',
                    defaultMessage: '至少 {length} 字',
                  }, { 'length': '5' })
                },
                maxLength: {
                  value: 100, message: intl.formatMessage({
                    id: 'error.max.length',
                    defaultMessage: '最多 {length} 字',
                  }, { 'length': '100' })
                },
              })}
              fullWidth={true}
              error={!!pwdErrors?.password}
              helperText={pwdErrors?.password ? pwdErrors.password.message : null}
            />
          </DialogFormat>
          <DialogFormat title={
            intl.formatMessage({
              id: 'header.page.profile.password.check',
              defaultMessage: '密碼確認',
            })
          }>
            <TextField
              id="passwordCheck"
              name="passwordCheck"
              type="password"
              {...registerPwd("passwordCheck", {
                required: intl.formatMessage({
                  id: 'error.required',
                  defaultMessage: '必填欄位',
                }),
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