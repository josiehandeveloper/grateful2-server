module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || "development",
  CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || "http://localhost:3000",
  DATABASE_URL:
    process.env.DATABASE_URL ||
    "postgresql://josephinghan@localhost/grateful2-server",
  TEST_DATABASE_URL:
    process.env.TEST_DATABASE_URL ||
    "postgresql://josephinehan@localhost/grateful-test",
  JWT_SECRET: process.env.JWT_SECRET || "grateful-jwt",
};
