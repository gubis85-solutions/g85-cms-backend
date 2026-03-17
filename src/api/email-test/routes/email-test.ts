export default {
  routes: [
    {
      method: "GET",
      path: "/email-test",
      handler: "email-test.sendTestEmail",
      config: {
        auth: false,
      },
    },
  ],
};