import {
  passwordResetOTPSendTemplate,
  userAccountActivatedNotificationTemplate,
  userActivationUrlEmailTemplate,
  userProfileUpdatedNotificationTemplate,
} from "./emailTemplates.js";
import { emailTransporter } from "./transport.js";
export const userActivationUrlEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(userActivationUrlEmailTemplate(obj));

  return info.messageId;
};
export const userActivatedNotificationEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(
    userAccountActivatedNotificationTemplate(obj)
  );

  return info.messageId;
};
export const passwordResetOTPNotificationEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(passwordResetOTPSendTemplate(obj));

  return info.messageId;
};
export const userProfileUpdatedNotificationEmail = async (obj) => {
  const transport = emailTransporter();
  const info = await transport.sendMail(
    userProfileUpdatedNotificationTemplate(obj)
  );
  console.log("info", info);
  return info.messageId;
};
