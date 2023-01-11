import { Alert, AlertTitle, Box, useTheme } from "@mui/material";
import { useEffect } from "react";
import { useAlertContext } from "src/contexts/AlertContext";

interface NotificationWrapper {
  duration?: number
}

export default function Notification(props: NotificationWrapper) {
  const theme = useTheme();
  const { duration = 3000 } = props;
  const { state, actions } = useAlertContext();
  const handleClose = (alert) => {
    actions.removeAlert(alert);
  };
  return (
    <Box
      component={'div'}
      sx={{
        position: 'fixed',
        width: `70vw`,
        right: `calc((100vw - 70vw)/2)`,
        top: theme.spacing(2),
        zIndex: 2000
      }}>
      {
        state?.alerts.length > 0 &&
        state.alerts.map((alert, index) => (
          <SnackbarProvider
            key={alert.id + index}
            duration={duration}
            alert={alert}
            handleClose={handleClose}
            {...props}
          />
        ))
      }
    </Box >

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
