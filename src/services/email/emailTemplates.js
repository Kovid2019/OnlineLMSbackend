export const userActivationUrlEmailTemplate = ({ email, name, url }) => {
  return {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Action required : Activate your new account", // Subject line
    text: `Hello.. ${name}, click the link to activate your account. ${url}`, // plain text body
    html: `
    <p> Hellow ${name}</p>
    <br>
    <br>
    <p> Your account has been created. Click the button below to activate your account.</p>
    <br>
    <br>
    <a href=${url}>
    <button style="background:green; color:white; padding: 2rem"> Activate Now</button>
    <br>
    <br>
    Regards,
    <br>
    ---
    </a>
    `, // html body
  };
};
export const userAccountActivatedNotificationTemplate = ({ email, name }) => {
  return {
    from: `"Local Library" <${process.env.SMTP_EMAIL}>`, // sender address
    to: email, // list of receivers
    subject: "Account Activated", // Subject line
    text: `Hello.. ${name}, your account has been activated. You may go and sign in now.`, // plain text body
    html: `
    <p> Hellow ${name}</p>
    <br>
    <br>
    <p> Your account has been activated. You can now login and start using our services.</p>
    <br>
    <br>
    <br>
    Regards,
    <br>
    ---
    `, // html body
  };
};
