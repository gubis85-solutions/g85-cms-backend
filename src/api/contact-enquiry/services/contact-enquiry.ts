import { factories } from '@strapi/strapi';
import { Resend } from 'resend';

type EnquiryPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessName: string;
  province: string;
  serviceInterest?: string;
  productInterest?: string;
  message?: string;
};

export default factories.createCoreService(
  'api::contact-enquiry.contact-enquiry',
  ({ strapi }) => ({
    async submitEnquiry(payload: EnquiryPayload) {
      const resendApiKey = process.env.RESEND_API_KEY;
      const from = process.env.RESEND_FROM || 'Website Enquiries <forms@mail.gubis85.co.za>';
      const notifyEmails = (process.env.NOTIFY_EMAILS || '')
        .split(',')
        .map((email) => email.trim())
        .filter(Boolean);

      if (!resendApiKey || resendApiKey === 're_your_key_here') {
        throw new Error(
          'RESEND_API_KEY is missing in g85-cms-backend/.env. Add your full Resend API key from the Resend dashboard and restart Strapi.',
        );
      }

      if (!notifyEmails.length) {
        throw new Error('NOTIFY_EMAILS is missing.');
      }

      const resend = new Resend(resendApiKey);

      const {
        firstName,
        lastName,
        email,
        phone,
        businessName,
        province,
        serviceInterest,
        productInterest,
        message,
      } = payload;

      const html = `
        <h2>New Website Enquiry</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Business Name:</strong> ${businessName}</p>
        <p><strong>Province:</strong> ${province}</p>
        <p><strong>Service Interest:</strong> ${serviceInterest || 'N/A'}</p>
        <p><strong>Product Interest:</strong> ${productInterest || 'N/A'}</p>
        <p><strong>Message:</strong><br/>${message || 'N/A'}</p>
      `;

      const emailResult = await resend.emails.send({
        from,
        to: notifyEmails,
        replyTo: email,
        subject: `New enquiry from ${firstName} ${lastName}`,
        html,
      });
      strapi.log.info(`Resend response: ${JSON.stringify(emailResult)}`);

      if ((emailResult as any)?.error) {
        throw new Error(
          (emailResult as any).error.message ||
            'Email sending failed. Verify your Resend domain and sender address.',
        );
      }

      const createdEntry = await strapi.documents('api::contact-enquiry.contact-enquiry').create({
        data: {
          firstName,
          lastName,
          email,
          phone,
          businessName,
          province,
          serviceInterest: serviceInterest || null,
          productInterest: productInterest || null,
          message: message || null,
        },
      });

      return {
        emailResult,
        createdEntry,
      };
    },
  })
);
