export default {
  routes: [
    {
      method: 'POST',
      path: '/contact-enquiries/submit',
      handler: 'contact-enquiry.submit',
      config: {
        auth: false,
      },
    },
  ],
};