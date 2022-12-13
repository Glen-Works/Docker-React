import EditIcon from '@mui/icons-material/Edit';
import KeyTwoToneIcon from '@mui/icons-material/KeyTwoTone';
import { Container, Grid, Typography, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { userProfileInfoApi, userUpdateProfileApi, userUpdateProfilePasswordApi } from 'src/api/Client/UserProfile/userProfileApi';
import { ColumnIconButton } from 'src/components/DataTable/CustomerIconRender';
import DialogFormat from "src/components/Dialog/DialogFormat";
import Footer from 'src/components/Footer';
import PageHeader from 'src/components/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import { useAuthStateContext } from 'src/contexts/AuthContext';
import ProfileEditDialog from './ProfileEditDialog';
import ProfileEditPasswordDialog from './ProfileEditPasswordDialog';

interface ProfileData {
  name: string,
  email: string,
}

interface UserPassword {
  newPassword: string,
  checkPassword: string,
}

function UserProfile() {
  const theme = useTheme();
  const { state } = useAuthStateContext();

  const onError = (errors, e) => console.log(errors, e);
  const [editPasswordOpen, setEditPwdOpen] = useState<boolean>(false);
  const [editProfileOpen, setEditProfileOpen] = useState<boolean>(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, setValue: setProfileValue, getValues: getProfileValue,
    watch: watchProfile, reset: resetProfile, formState: { errors: ProfileErrors } } = useForm(
      {
        defaultValues: {
          name: "",
          email: "",
        }
      }
    );

  const { register: registerPwd, handleSubmit: handleSubmitPwd, getValues: getPwdValue,
    watch: watchPwd, reset: resetPwd, formState: { errors: pwdErrors } } = useForm(
      {
        defaultValues: {
          password: "",
          passwordCheck: "",
        }
      });

  useEffect(() => { }, [watchProfile(), watchPwd()]);

  useEffect(() => {
    getData();
  }, []);

  const handleEditPwdOpen = () => {
    setEditPwdOpen(true);
  };

  const handleEditProfileOpen = () => {
    getData().then(() => { setEditProfileOpen(true) });
  };

  const handleEditPwdClose = () => {
    setEditPwdOpen(false);
    resetPwd();
  };

  const handleEditProfileClose = () => {
    setEditProfileOpen(false);
  };


  function getDialogProfileData(): ProfileData {
    var profileData: ProfileData = {
      name: getProfileValue("name"),
      email: getProfileValue("email")
    }
    return profileData;
  }

  const submitEditPwd = (formObj, event) => {
    var userPwd: UserPassword = {
      newPassword: getPwdValue("password"),
      checkPassword: getPwdValue("password"),
    }

    // console.log(userPwd);
    editProfilePwd(userPwd);
  };

  const submitEditProfile = (formObj, event) => {
    var data = getDialogProfileData();

    // console.log(userPwd);
    editUserProfile(data);
  };

  async function getData() {
    await userProfileInfoApi(state)
      .then(res => {
        let data = res.data.userInfo;
        setProfileValue("name", data.name, { shouldValidate: true });
        setProfileValue("email", data.email, { shouldValidate: true });
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function editUserProfile(data: any) {
    // console.log(data);
    userUpdateProfileApi(data, state)
      .then(res => {
        handleEditProfileClose();
        getData()
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  function editProfilePwd(data: any) {
    // console.log(data);
    userUpdateProfilePasswordApi(data, state)
      .then(res => {
        handleEditPwdClose();
      })
      .catch(error => {
        console.log("error:" + error.response?.data?.msg);
      });
  }

  return (
    <>
      <Helmet>
        <title>Transactions - Applications</title>
      </Helmet>
      <PageTitleWrapper>
        <PageHeader
          title={"個人設定"}
          subTitle={""}
        />
      </PageTitleWrapper>
      <Container maxWidth={false} >
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
          height={542}
        >
          <Grid item xs={12}>

            <Grid container justifyContent="center" alignItems="center" direction="column" >
              <Grid container justifyContent="flex-end" alignItems="center" direction="row" >
                <Grid item xs={3} >
                  <ColumnIconButton
                    title="修改使用者"
                    handleClickOpen={handleEditProfileOpen}
                    color={theme.palette.info.main}
                    background={theme.colors.error.lighter}
                  >
                    <EditIcon fontSize="small" sx={{ mr: '0.3em' }} />
                    {"資料修改"}
                  </ColumnIconButton>

                  <ColumnIconButton
                    title="修改密碼"
                    handleClickOpen={handleEditPwdOpen}
                    color={theme.palette.info.main}
                    background={theme.colors.error.lighter}
                  >
                    <KeyTwoToneIcon fontSize="small" sx={{ mr: '0.3em' }} />
                    {"密碼修改"}
                  </ColumnIconButton>
                </Grid>
              </Grid>

              <DialogFormat title="名稱 :" >
                <Typography variant="h5" textAlign="left">{getProfileValue("name")}</Typography>
              </DialogFormat>
              <DialogFormat title="信箱 :" >
                <Typography variant="h5" textAlign="left">{getProfileValue("email")}</Typography>
              </DialogFormat>

              <ProfileEditDialog
                isOpen={editProfileOpen}
                handleClose={handleEditProfileClose}
                submitEdit={submitEditProfile}
                onError={onError}
                register={registerProfile}
                handleSubmit={handleSubmitProfile}
                getValue={getProfileValue}
                errors={ProfileErrors}
              />

              <ProfileEditPasswordDialog
                editPasswordOpen={editPasswordOpen}
                handleEditPwdClose={handleEditPwdClose}
                submitEditPwd={submitEditPwd}
                onError={onError}
                registerPwd={registerPwd}
                handleSubmitPwd={handleSubmitPwd}
                watchPwd={watchPwd}
                pwdErrors={pwdErrors}
              />

            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

export default UserProfile;
