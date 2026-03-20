import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::contact-enquiry.contact-enquiry',
  ({ strapi }) => ({
    async submit(ctx) {
      try {
        const body = ctx.request.body?.data || ctx.request.body || {};

        const requiredFields = [
          'firstName',
          'lastName',
          'email',
          'phone',
          'businessName',
          'province',
        ];

        for (const field of requiredFields) {
          if (!body[field] || String(body[field]).trim() === '') {
            return ctx.badRequest(`${field} is required.`);
          }
        }

        const result = await strapi
          .service('api::contact-enquiry.contact-enquiry')
          .submitEnquiry(body);

        ctx.send({
          message: 'Enquiry submitted successfully.',
          data: result,
        });
      } catch (error: any) {
        strapi.log.error('Contact enquiry submit error:', error);
        ctx.status = 500;
        ctx.body = {
          data: null,
          error: {
            status: 500,
            name: error?.name || 'ContactEnquirySubmitError',
            message: error?.message || 'Failed to submit enquiry.',
          },
        };
      }
    },
  })
);
