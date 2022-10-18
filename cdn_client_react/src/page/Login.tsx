import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
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
import { useNavigate } from "react-router-dom";
import { loginApi } from 'src/api/loginApi';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import { jwtValidate } from 'src/middleware/jwtAuthMiddleware';
import SetUserInfo from 'src/stores/action/actions';

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
const theme = createTheme();

export default function SignInSide() {
  let navigate = useNavigate();
  const { state, dispatch } = useAuthStateContext();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchData = async () => {
      if (state.authorisation?.accessToken == undefined || state.authorisation?.accessToken == null) {
        console.log('authorisation:', "no");
        return;
      }
      //判斷 是否已登入
      const check = await jwtValidate(state);
      if (check == true) {
        navigate('/SampleDatatable');
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
      SetUserInfo(dispatch, res.data);
      return navigate("/transactions");
    }).catch(error => {
      console.log("error:" + error.response?.data?.msg);
    });
  };

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
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                fullWidth
                id="email"
                label="Email Address"
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
                label="Password"
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
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}

