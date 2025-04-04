require("dotenv").config();

module.exports = {
  db: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT, 10) || 1433, // Default SQL Server port
    database: process.env.DB_DATABASE,
    options: {
      encrypt: true,
      trustServerCertificate: process.env.DB_TRUST_CERT === "true",
    },
    requestTimeout: 1000 * 10, // 10 seconds
  },
  monitor: {
    queryThreshold: process.env.QUERY_THRESHOLD || 5, // Default to 5 minute
  },
  externalService: {
    url: process.env.EXTERNAL_SERVICE_URL,
    token: process.env.EXTERNAL_SERVICE_TOKEN,
  },
};
