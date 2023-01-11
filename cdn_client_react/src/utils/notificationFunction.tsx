import { AlertPayload } from "src/contexts/AlertContext";

export function notifyError(intl, actions, msg: string) {
  const data: AlertPayload = {
    title: intl.formatMessage({
      id: 'response.error',
      defaultMessage: '錯誤',
    }),
    text: msg,
    type: "error",
    id: Date.now().toString()
  };
  actions.addAlert(data);
}

export function notifySuccess(intl, actions, msg: string) {
  const data: AlertPayload = {
    title: intl.formatMessage({
      id: 'response.success',
      defaultMessage: '成功',
    }),
    text: msg,
    type: "success",
    id: Date.now().toString()
  };
  actions.addAlert(data);
}

