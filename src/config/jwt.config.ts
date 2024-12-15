export default () => ({
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessTokenExpireAfter: process.env.JWT_ACCESS_TOKEN_EXPIRE_AFTER,
  },
});
