import { Grid, TextField } from "@mui/material";
import { useIntl } from "react-intl";
import DataTableDialog from "src/components/DataTable/DataTableDialog";
import DialogFormat from "src/components/Dialog/DialogFormat";

interface ProfileEditDialogProp {
  isOpen: boolean,
  handleClose: () => void,
  submitEdit: (formObj, event) => void,
  onError: (errors, e) => void,
  register: any,
  handleSubmit: any,
  getValue: any,
  errors: any,
}

export default function ProfileEditDialog(props: ProfileEditDialogProp) {
  const {
    isOpen,
    handleClose,
    submitEdit,
    onError,
    register,
    handleSubmit,
    getValue,
    errors,
  } = props;

  const intl = useIntl();

  return (
    <>
      <DataTableDialog
        title={intl.formatMessage({
          id: 'header.page.profile.update',
          defaultMessage: '資料修改',
        })}
        maxWidth="md"
        isOpen={isOpen}
        handleClose={handleClose}
        submit={handleSubmit(submitEdit, onError)}
      >
        <Grid container justifyContent="center" alignItems="center" direction="column" >
          <DialogFormat
            title={intl.formatMessage({
              id: 'header.page.profile.name',
              defaultMessage: '名稱',
            })} >
            <TextField
              name="name"
              value={getValue("name")}
              {...register("name", {
                required: "Required field"
              })}
              fullWidth={true}
              error={!!errors?.name}
              helperText={errors?.name ? errors.name.message : null}
            />
          </DialogFormat>

          <DialogFormat
            title={intl.formatMessage({
              id: 'header.page.profile.email',
              defaultMessage: '信箱',
            })} >
            <TextField
              name="email"
              value={getValue("email")}
              {...register("email", {
                required: "Required field",
                minLength: {
                  value: 5, message: intl.formatMessage({
                    id: 'error.min.length',
                    defaultMessage: '至少 {length} 字',
                  }, { 'length': '5' })
                },
                maxLength: {
                  value: 100, message: intl.formatMessage({
                    id: 'error.max.length',
                    defaultMessage: '至少 {length} 字',
                  }, { 'length': '100' })
                },
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                }
              })}
              fullWidth={true}
              error={!!errors?.email}
              helperText={errors?.email ? errors.email.message : null}
            />
          </DialogFormat>
        </Grid>
      </DataTableDialog >
    </>
  )
}