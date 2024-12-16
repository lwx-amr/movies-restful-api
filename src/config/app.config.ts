export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    environment: process.env.NODE_ENV || 'development',
    externalRequestsTimeout: parseInt(process.env.EXTERNAL_REQUESTS_TIMEOUT, 10) || 5000,
  },
});
