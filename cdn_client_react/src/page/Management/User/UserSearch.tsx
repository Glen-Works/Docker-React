import AddTwoToneIcon from '@mui/icons-material/AddTwoTone';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, TextField } from "@mui/material";
import { FormattedMessage } from 'react-intl';

interface UserSearchProp {
  checkFeatureCreate: boolean,
  register: any,
  handleSubmit: any,
  onFormSubmit: (formObj, event) => void,
  handleAddClickOpen: () => void,
}

export default function UserSearch(props: UserSearchProp) {
  const {
    checkFeatureCreate,
    register,
    handleSubmit,
    onFormSubmit,
    handleAddClickOpen,
  } = props;



  return (
    <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ width: 1, mt: 1 }} >
      <Grid
        container
        spacing={1}
        direction="row"
        justifyContent="flex-end"
        alignItems="stretch"
      >
        <Grid item >
          <TextField
            id="name"
            label="名稱"
            name="name"
            autoComplete="name"
            size="small"
            type="search"
            {...register("name", {})}
          />
        </Grid>
        <Grid item >
          <TextField
            id="email"
            label="信箱"
            name="email"
            autoComplete="email"
            size="small"
            type="search"
            {...register("email", {})}
          />
        </Grid>
        <Grid item  >
          <Button
            type="submit"
            color='success'
            variant="contained"
            startIcon={<SearchIcon fontSize="small" />}
          >
            <FormattedMessage
              id="page.search"
              defaultMessage="ywt"
            />
          </Button>
        </Grid>

        {
          (checkFeatureCreate) &&
          <Grid item >
            <Button
              variant="contained"
              color='warning'
              startIcon={<AddTwoToneIcon fontSize="small" />}
              onClick={handleAddClickOpen}
            >
              <FormattedMessage
                id="page.create"
                defaultMessage="xxxx"
              />
            </Button>
          </Grid>
        }
      </Grid>
    </Box>
  )
}