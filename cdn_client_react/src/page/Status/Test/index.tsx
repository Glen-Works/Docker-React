import { Button } from "@material-ui/core";
// import Notification frosrc/components/Notificationert';
import { Alert } from "@mui/material";
import Notification from "src/components/Notification";
import { useAlertContext } from "src/contexts/AlertContext";

export default function Test() {
  const { actions } = useAlertContext();
  const alertTypes = ["success", "warning", "info", "error"];
  const selectedType =
    alertTypes[Math.floor(Math.random() * alertTypes.length)];
  const triggerNotification = () => {
    actions.addAlert({
      // text: "Notification text",
      title: ` Clicked on ${selectedType}`,
      type: selectedType,
      id: Date.now()
    });
  };
  return (
    <>
      <Alert severity="success">
        {/* <AlertTitle>Success</AlertTitle> */}
        This is a success alert — <strong>check it out!</strong>
      </Alert>
      <Button onClick={triggerNotification}>
        <h1>Click me</h1>
      </Button>
      <Notification duration={3000} />
    </>
  );
}
