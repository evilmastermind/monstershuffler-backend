export default {
  defaults: { from: `Ismael <${process.env.AUTH_USER}>` },
  transport: {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    // secureConnection: false, // TLS requires secureConnection to be false
    secure: true,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASSWORD,
    },
    tls: {
      ciphers: 'SSLv3',
    },
  },
};
