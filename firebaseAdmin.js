const admin = require('firebase-admin');
require('dotenv').config();

const serviceAccount = {
  type: 'service_account',
  project_id: process.env.PROJECT_ID_FIREBASE,
  private_key_id: process.env.PRIVATE_KEY_ID_FIREBASE,
  private_key: process.env.PRIVATE_KEY_FIREBASE.replace(/\\n/g, '\n'),
  client_email: process.env.CLIENT_EMAIL_FIREBASE,
  client_id: process.env.CLIENT_ID_FIREBASE,
  auth_uri: process.env.AUTH_URI_FIREBASE,
  token_uri: process.env.TOKEN_URI_FIREBASE,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_FIREBASE,
  client_x509_cert_url: process.env.CLIENT_X509_CERT_URL_FIREBASE
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
