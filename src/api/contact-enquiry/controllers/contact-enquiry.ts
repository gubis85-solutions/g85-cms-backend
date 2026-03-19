import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact-enquiry.contact-enquiry",
  ({ strapi }) => ({
    async submit(ctx) {
      strapi.log.info("=== CONTACT ENQUIRY SUBMIT HIT ===");
      strapi.log.info(JSON.stringify(ctx.request.body, null, 2));

      try {
        const body = ctx.request.body || {};

        const firstName = String(body.firstName || "").trim();
        const lastName = String(body.lastName || "").trim();
        const email = String(body.email || "").trim();
        const phone = String(body.phone || "").trim();
        const businessName = String(body.businessName || "").trim();
        const province = String(body.province || "").trim();
        const serviceInterest = String(body.serviceInterest || "").trim();
        const productInterest = String(body.productInterest || "").trim();
        const message = String(body.message || "").trim();

        if (
          !firstName ||
          !lastName ||
          !email ||
          !phone ||
          !businessName ||
          !province
        ) {
          strapi.log.error("=== VALIDATION FAILED ===");
          return ctx.badRequest(
            "First name, last name, email, phone, business name, and province are required."
          );
        }

        const submittedAt = new Date().toISOString().split("T")[0];

        let entry;

        try {
          entry = await strapi
            .documents("api::contact-enquiry.contact-enquiry")
            .create({
              data: {
                firstName,
                lastName,
                email,
                phone,
                businessName,
                province,
                serviceInterest,
                productInterest,
                message,
                submittedAt,
              },
            });

          strapi.log.info("=== ENQUIRY SAVED TO DATABASE ===");
        } catch (saveError: any) {
          strapi.log.error("=== DATABASE SAVE FAILED ===");
          strapi.log.error(saveError?.message || saveError);
          if (saveError?.stack) {
            strapi.log.error(saveError.stack);
          }

          return ctx.internalServerError("Failed to save enquiry.");
        }

        try {
          strapi.log.info("=== ATTEMPTING TO SEND EMAIL ===");

          await strapi.plugin("email").service("email").send({
            to: process.env.CONTACT_TO || "info@gubis85.co.za,hr@gubis85.co.za",
            from: process.env.SMTP_FROM,
            replyTo: email,
            subject: `New website enquiry from ${firstName} ${lastName}`,
            text: `
New website enquiry received

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Phone: ${phone}
Business Name: ${businessName}
Province: ${province}
Service Interest: ${serviceInterest || "-"}
Product Interest: ${productInterest || "-"}
Message: ${message || "-"}
            `,
            html: `
              <h2>New website enquiry received</h2>
              <p><strong>First Name:</strong> ${firstName}</p>
              <p><strong>Last Name:</strong> ${lastName}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Phone:</strong> ${phone}</p>
              <p><strong>Business Name:</strong> ${businessName}</p>
              <p><strong>Province:</strong> ${province}</p>
              <p><strong>Service Interest:</strong> ${serviceInterest || "-"}</p>
              <p><strong>Product Interest:</strong> ${productInterest || "-"}</p>
              <p><strong>Message:</strong><br>${(message || "-").replace(/\n/g, "<br/>")}</p>
            `,
          });

          strapi.log.info("=== EMAIL SENT SUCCESSFULLY ===");
        } catch (emailError: any) {
          strapi.log.error("=== EMAIL SEND FAILED ===");
          strapi.log.error(emailError?.message || emailError);

          if (emailError?.code) {
            strapi.log.error(`Email error code: ${emailError.code}`);
          }

          if (emailError?.command) {
            strapi.log.error(`Email error command: ${emailError.command}`);
          }

          if (emailError?.response) {
            strapi.log.error(`Email error response: ${emailError.response}`);
          }

          if (emailError?.stack) {
            strapi.log.error(emailError.stack);
          }

          return ctx.internalServerError(
            "Enquiry was saved, but email sending failed."
          );
        }

        return ctx.send({
          ok: true,
          message: "Enquiry submitted successfully.",
          data: entry,
        });
      } catch (error: any) {
        strapi.log.error("=== CONTACT ENQUIRY SUBMIT FAILED ===");
        strapi.log.error(error?.message || error);

        if (error?.stack) {
          strapi.log.error(error.stack);
        }

        return ctx.internalServerError("Failed to submit enquiry.");
      }
    },

    async testEmail(ctx) {
      strapi.log.info("=== TEST EMAIL ROUTE HIT ===");

      try {
        await strapi.plugin("email").service("email").send({
          to: process.env.CONTACT_TO || "info@gubis85.co.za",
          from: process.env.SMTP_FROM,
          subject: "Strapi test email",
          text: "This is a direct SMTP test from Strapi.",
          html: "<p>This is a direct SMTP test from Strapi.</p>",
        });

        strapi.log.info("=== TEST EMAIL SENT SUCCESSFULLY ===");

        return ctx.send({
          ok: true,
          message: "Test email sent successfully.",
        });
      } catch (error: any) {
        strapi.log.error("=== TEST EMAIL FAILED ===");
        strapi.log.error(error?.message || error);

        if (error?.code) {
          strapi.log.error(`Email error code: ${error.code}`);
        }

        if (error?.command) {
          strapi.log.error(`Email error command: ${error.command}`);
        }

        if (error?.response) {
          strapi.log.error(`Email error response: ${error.response}`);
        }

        if (error?.stack) {
          strapi.log.error(error.stack);
        }

        return ctx.internalServerError("Test email failed.");
      }
    },
  })
);