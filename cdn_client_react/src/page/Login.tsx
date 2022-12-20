import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate } from "react-router-dom";
import { loginApi } from 'src/api/loginApi';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import LanguageBox from 'src/layouts/SidebarLayout/Header/LanguageBox';
import { jwtValidate } from 'src/middleware/jwtAuthMiddleware';
import setUserInfo from 'src/stores/action/authActions';

interface Login {
  account: string,
  password: string,
}

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


// todo 記得密碼、註冊
const theme = (Theme) => createTheme({ ...Theme });

export default function SignInSide() {
  const navigate = useNavigate();
  const { state, dispatch } = useAuthStateContext();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (state.authorisation?.accessToken == undefined || state.authorisation?.accessToken == null) {
        // console.log('authorisation:', "no");
        return;
      }
      //判斷 是否已登入
      const check = await jwtValidate(state);
      if (check == true) {
        navigate('/SampleDataTable');
      }
    };
    fetchData();
  }, []);

  //login submit 
  const onFormSubmit = (formObj, event) => {
    const data = new FormData(event.target);

    var loginData: Login = {
      account: data.get("email").toString(),
      password: data.get("password").toString(),
    }

    loginApi(loginData)?.then(res => {
      setUserInfo(dispatch, res.data);
      return navigate("/dashboard");
    }).catch(error => {
      console.log("error:" + error.response?.data?.msg);
    });
  };

  const intl = useIntl();

  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: 'url(/static/images/logo/backimg.png)',
            backgroundRepeat: 'no-repeat',
            backgroundColor: (t) =>
              t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Grid
            container
            direction="row"
            justifyContent="flex-end"
            alignItems="center"
          >
            <LanguageBox />
          </Grid>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'background.main', width: 85, height: 85 }}>
              <PersonOutlineIcon sx={{ m: 1, width: 60, height: 60 }} />
            </Avatar>
            <Typography component="h1" variant="h5">
              <FormattedMessage
                id="login.sign.in"
                defaultMessage="登入"
              />
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label={
                  intl.formatMessage({
                    id: 'login.account',
                    defaultMessage: '帳號 (信箱)',
                  })
                }
                name="email"
                autoComplete="email"
                autoFocus
                {...register("email", {
                  required: "Required field",
                  minLength: { value: 5, message: "at least 5 letter" },
                  maxLength: { value: 100, message: "need less 100 length" },
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9._]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  }
                })}
                error={!!errors?.email}
                helperText={errors?.email ? errors.email.message : null}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label={
                  intl.formatMessage({
                    id: 'login.password',
                    defaultMessage: '密碼',
                  })
                }
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Required field",
                  minLength: { value: 5, message: "at least 5 letter" },
                  maxLength: { value: 100, message: "need less 100 length" },
                })}
                error={!!errors?.password}
                helperText={errors?.password ? errors.password.message : null}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label={
                  intl.formatMessage({
                    id: 'login.password.remember',
                    defaultMessage: '記住帳號密碼',
                  })
                }
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                <FormattedMessage
                  id="login.sign.in"
                  defaultMessage="登入"
                />
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    <FormattedMessage
                      id="login.password.forgot"
                      defaultMessage="忘記密碼"
                    />
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    <FormattedMessage
                      id="login.sign.up"
                      defaultMessage="目前無帳號，註冊"
                    />
                  </Link>
                </Grid>
              </Grid>
              {/* <Copyright sx={{ mt: 5 }} /> */}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

