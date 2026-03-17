export default {
  async sendTestEmail(ctx) {
    try {
      await strapi.plugin("email").service("email").send({
        to: "princeb@gubis85.co.za",
        subject: "Strapi Email Test",
        text: "Your Strapi email configuration is working correctly.",
      });

      ctx.send({
        message: "Email sent successfully",
      });
    } catch (error) {
      ctx.send({
        error: "Email failed",
        details: error.message,
      });
    }
  },
};