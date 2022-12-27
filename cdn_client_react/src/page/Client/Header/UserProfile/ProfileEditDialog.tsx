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
                required: intl.formatMessage({
                  id: 'error.required',
                  defaultMessage: '必填欄位',
                })
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
                required: intl.formatMessage({
                  id: 'error.required',
                  defaultMessage: '必填欄位',
                }),
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,}$/i,
                  message: intl.formatMessage({
                    id: 'error.email.format',
                    defaultMessage: '信箱格式錯誤',
                  })
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