import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact-enquiry.contact-enquiry",
  ({ strapi }) => ({
    async create(ctx) {
      const requestData = ctx.request.body?.data;

      if (!requestData) {
        return ctx.badRequest('Missing "data" payload in the request body.');
      }

      const response = await super.create(ctx);

      try {
        await strapi.plugin("email").service("email").send({
          to: "info@gubis85.co.za, hr@gubis85.co.za",
          from: "info@gubis85.co.za",
          replyTo: requestData.email,
          subject: `New Website Enquiry – ${requestData.firstName} ${requestData.lastName}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height:1.6; color:#333;">
              <h2 style="margin-bottom:5px;">New Website Enquiry</h2>
              <p style="color:#777;">Submitted via gubis85.co.za</p>
              <hr/>
              <h3>Contact Details</h3>
              <p><strong>Name:</strong> ${requestData.firstName} ${requestData.lastName}</p>
              <p><strong>Email:</strong> ${requestData.email}</p>
              <p><strong>Phone:</strong> ${requestData.phone}</p>
              <hr/>
              <h3>Business Information</h3>
              <p><strong>Business Name:</strong> ${requestData.businessName || "Not specified"}</p>
              <p><strong>Province:</strong> ${requestData.province || "Not specified"}</p>
              <p><strong>Service Interest:</strong> ${requestData.serviceInterest || "Not specified"}</p>
              <p><strong>Product Interest:</strong> ${requestData.productInterest || "Not specified"}</p>
              <hr/>
              <h3>Message</h3>
              <p style="background:#f5f5f5;padding:12px;border-radius:6px;">
                ${requestData.message || "No message provided"}
              </p>
            </div>
          `,
        });
      } catch (error) {
        strapi.log.error("Email sending failed", error);
        return ctx.internalServerError("Enquiry saved, but email sending failed.");
      }

      return response;
    },
  })
);