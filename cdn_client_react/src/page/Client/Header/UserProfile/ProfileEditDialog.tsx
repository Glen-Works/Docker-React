import { Grid, TextField } from "@mui/material";
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

  return (
    <>
      <DataTableDialog
        title={"修改資料"}
        maxWidth="md"
        isOpen={isOpen}
        handleClose={handleClose}
        submit={handleSubmit(submitEdit, onError)}
      >
        <Grid container justifyContent="center" alignItems="center" direction="column" >
          <DialogFormat title="名稱 :" >
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

          <DialogFormat title="信箱 :" >
            <TextField
              name="email"
              value={getValue("email")}
              {...register("email", {
                required: "Required field",
                minLength: { value: 5, message: "at least 5 letter" },
                maxLength: { value: 100, message: "need less 100 length" },
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