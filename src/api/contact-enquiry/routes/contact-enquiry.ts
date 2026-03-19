export default {
  routes: [
    {
      method: "POST",
      path: "/contact-enquiries/submit",
      handler: "contact-enquiry.submit",
      config: {
        auth: false,
      },
    },
    {
      method: "GET",
      path: "/contact-enquiries/test-email",
      handler: "contact-enquiry.testEmail",
      config: {
        auth: false,
      },
    },
  ],
};