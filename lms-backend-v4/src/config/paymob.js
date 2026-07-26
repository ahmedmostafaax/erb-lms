export default {
  apiKey: process.env.PAYMOB_API_KEY,
  hmacSecret: process.env.PAYMOB_HMAC_SECRET,
  iframeId: process.env.PAYMOB_IFRAME_ID,
  integrationIds: {
    card: process.env.PAYMOB_INTEGRATION_ID_CARD,
    wallet: process.env.PAYMOB_INTEGRATION_ID_WALLET,
    kiosk: process.env.PAYMOB_INTEGRATION_ID_KIOSK,
  },
  baseUrl: "https://accept.paymob.com/api",
};