import { factories } from '@strapi/strapi';

export default factories.createCoreController(
  'api::contact-enquiry.contact-enquiry',
  ({ strapi }) => ({
    async submit(ctx) {
      try {
        // ✅ Safely extract body
        const body = ctx.request.body?.data || ctx.request.body || {};

        // ✅ Required fields validation
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

        // ✅ Call service
        const result = await strapi
          .service('api::contact-enquiry.contact-enquiry')
          .submitEnquiry(body);

        // ✅ Success response
        return ctx.send({
          message: 'Enquiry submitted successfully.',
          data: result,
        });

      } catch (error: any) {
        // ✅ Log full error in backend
        strapi.log.error('❌ Contact enquiry submit error:', error);

        // ✅ Return clean error to frontend
        return ctx.internalServerError(
          error?.message || 'Failed to submit enquiry.'
        );
      }
    },
  })
);