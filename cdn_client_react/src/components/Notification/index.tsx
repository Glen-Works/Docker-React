import { Alert, AlertTitle, Box, styled, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useAlertContext } from "src/contexts/AlertContext";

const NotificationWrapper = styled(Box)(
  ({ theme }) => `
  .root {
    position: 'fixed',
    right: ${theme.spacing(2)},
    bottom: ${theme.spacing(2)},
    zIndex: 2000
  }
`
);

export default function Notification(props) {
  const { duration = 1000 } = props;
  const { state, actions } = useAlertContext();
  const handleClose = (alert) => {
    actions.removeAlert(alert);
  };
  return (
    <NotificationWrapper component={'div'}>
      {state?.alerts.length > 0 &&
        state.alerts.map((alert, index) => (
          <SnackbarProvider
            key={alert.id + index}
            index={index}
            duration={duration}
            alert={alert}
            handleClose={handleClose}
            {...props}
          />
        ))}
    </NotificationWrapper>
  );
}


const SnackbarProvider = ({ duration, alert, handleClose }) => {
  const theme = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => handleClose(alert), duration);
    return () => {
      clearTimeout(timer);
    };
  }, [alert, duration, handleClose]);

  return (
    <Alert
      id={alert.id}
      onClose={() => handleClose(alert)}
      // variant="filled"
      severity={alert.type}
      elevation={6}
      sx={{ mb: theme.spacing(2) }}
    >
      <AlertTitle>{alert.title}</AlertTitle>
      {alert.text}
    </Alert>
  )
}
