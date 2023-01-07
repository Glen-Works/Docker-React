import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import { FormattedMessage, useIntl } from 'react-intl';
import { useNavigate, useParams } from "react-router-dom";
import { forgotPwdApi, forgotPwdCheckValiCodeApi } from 'src/api/Login/ForgotPwdApi';

interface ResetPasswordInfo {
  validation: string
  newPassword: string,
  checkPassword: string,
}

export default function ForgotPwd() {
  const intl = useIntl();
  let { cachename } = useParams();
  const navigate = useNavigate();

  const [valiCode, setValiCode] = useState<boolean>(false);

  const { register, handleSubmit, setValue, getValues, watch, formState: { errors } } = useForm(
    {
      defaultValues: {
        password: "",
        checkPassword: "",
      }
    });

  useEffect(() => {
    checkValiCode();
  }, []);

  useEffect(() => { }, [watch()]);

  const checkValiCode = () => {
    //驗證 ValiCode exist
    forgotPwdCheckValiCodeApi(cachename)?.then(res => {
      setValiCode(true);
    }).catch(error => {
      // setValiCode(false);
      console.log("error:" + error.response?.msg);
      return navigate("/login");
    });
  }

  //login submit 
  const onFormSubmit = (formObj, event) => {
    var resetPasswordInfo: ResetPasswordInfo = {
      validation: cachename,
      checkPassword: getValues("checkPassword"),
      newPassword: getValues("password"),
    }

    forgotPwdApi(resetPasswordInfo)?.then(res => {
      //密碼重置成功
      return navigate("/login");
    }).catch(error => {
      console.log("error:" + error.response?.msg);
    });
  };

  return (
    <>
      {(!valiCode) ? ""
        : <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: 1
          }}
        >
          <Typography component="h1" variant="h4">
            <FormattedMessage
              id="page.password.reset"
              defaultMessage="重置密碼"
            />
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit(onFormSubmit)} sx={{ mt: 1, width: '84%', maxWidth: '559px' }}>
            <TextField
              margin="normal"
              fullWidth
              name="password"
              type="password"
              id="password"
              label={
                intl.formatMessage({
                  id: 'page.login.password',
                  defaultMessage: '密碼',
                })
              }
              {...register("password", {
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
              error={!!errors?.password}
              helperText={errors?.password ? errors.password.message : null}
            />
            <TextField
              id="checkPassword"
              name="checkPassword"
              type="password"
              label={
                intl.formatMessage({
                  id: 'page.user.password.check',
                  defaultMessage: '密碼確認',
                })}
              {...register("checkPassword", {
                required: intl.formatMessage({
                  id: 'error.required',
                  defaultMessage: '必填欄位',
                }),
                validate: (val: string) => {
                  if (watch('password') != val) {
                    return "Your passwords do no match";
                  }
                }
              })}
              fullWidth={true}
              error={!!errors?.checkPassword}
              helperText={errors?.checkPassword ? errors.checkPassword.message : null}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              <FormattedMessage
                id="page.password.reset"
                defaultMessage="重置密碼"
              />
            </Button>
            <Grid container sx={{ mt: 1 }}>
              <Grid item xs>
                <Link href="/login" variant="body2">
                  <FormattedMessage
                    id="page.login.link"
                    defaultMessage="回登入頁"
                  />
                </Link>
              </Grid>
              <Grid item>
                <Link href="/forgot/password" variant="body2">
                  <FormattedMessage
                    id="page.login.password.forgot"
                    defaultMessage="忘記密碼"
                  />
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      }
    </>
  );
}

