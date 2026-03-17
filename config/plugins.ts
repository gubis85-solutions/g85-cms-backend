import type { Core } from "@strapi/strapi";

const config = ({ env }: Core.Config.Shared.ConfigParams): Core.Config.Plugin => ({
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: "mail.gubis85.co.za",
        port: 587,
        secure: false,
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: "princeb@gubis85.co.za",
        defaultReplyTo: "princeb@gubis85.co.za",
      },
    },
  },
});

export default config;