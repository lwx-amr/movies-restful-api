export default () => ({
  throttling: {
    ttl: parseInt(process.env.RATE_LIMIT_TTL, 10),
    limit: parseInt(process.env.RATE_LIMIT_LIMIT, 10),
  },
});
