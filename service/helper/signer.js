import { sign } from '../business/secure';

const {
  PHOENIX_API_EMAIL, SELLER_ID, PHOENIX_API_SECRET, PHOENIX_API_KEY, PHOENIX_API_TAG,
} = process.env;

// Active signer for phoenix auth
export const phxHeaders = () => {
  const signed = sign(PHOENIX_API_EMAIL, SELLER_ID, PHOENIX_API_SECRET, PHOENIX_API_KEY, PHOENIX_API_TAG);
  return { headers: { Authorization: signed, 'content-type': 'application/json' } };
};
