import { createAction } from "@reduxjs/toolkit";
type Payload = { [key: string]: any };

export const getNotificationAction = createAction<undefined | Payload>("notification/getNotification");
export const updateNotificationAction = createAction<undefined | Payload>("notification/updateNotification");