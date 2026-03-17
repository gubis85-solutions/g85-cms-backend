import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::contact-enquiry.contact-enquiry",
  ({ strapi }) => ({
    async create(ctx) {
      const requestData = ctx.request.body?.data;

      if (!requestData) {
        return ctx.badRequest('Missing "data" payload in the request body.');
      }

      // Save enquiry in database first
      const response = await super.create(ctx);

      // Send email notification
      await strapi.plugin("email").service("email").send({
        to: "princeb@gubis85.co.za",
        from: "princeb@gubis85.co.za",
        replyTo: requestData.email,
        subject: `New Website Enquiry from ${requestData.firstName} ${requestData.lastName}`,
        text: `
A new enquiry has been submitted via the website.

Name: ${requestData.firstName} ${requestData.lastName}
Email: ${requestData.email}
Phone: ${requestData.phone}
Business Name: ${requestData.businessName}
Province: ${requestData.province}
Service Interest: ${requestData.serviceInterest || "Not specified"}
Product Interest: ${requestData.productInterest || "Not specified"}

Message:
${requestData.message || "No message provided"}
        `,
      });

      return response;
    },
  })
);