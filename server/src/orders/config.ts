import fromEnv from 'src/utils/env';

export const rzpConfig = {
  keyId: fromEnv('RAZORPAY_KEY_ID'),
  keySecret: fromEnv('RAZORPAY_KEY_SECRET'),
};
