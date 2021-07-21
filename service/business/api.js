import * as axios from 'axios';
import { phxHeaders } from '../helper/signer';
// import { NOTIFY_LAMBDA } from '../constants';

const {
  PHOENIX_API_URL, PHOENIX_STG_PAYMENT, PHOENIX_STG_EMAIL_JRMALL, PHOENIX_STG_PREFIX_MICRO
} = process.env;

/** ======== PHOENIX API CALLS ===== */

export const getProductList = async () => { //eslint-disable-line
  const url = `${PHOENIX_API_URL}Products/list`;

  try {
    const res = await axios.get(url, phxHeaders());
    return res.data.data;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const createPaymentUrl = async (body) => { //eslint-disable-line
  const url = `${PHOENIX_STG_PAYMENT}`;
  console.log('TO CALL API', body);

  try {
    const res = await axios.post(url, body, phxHeaders());
    return res.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const createStepOrder = async (body) => { //eslint-disable-line
  const url = `${PHOENIX_API_URL}StepOrders/transact`;
  console.log('[PHOENIX PAYNAMICS BODY]', body);

  try {
    const res = await axios.post(url, body, phxHeaders());
    return res.data;
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const emailConcerns = async (body) => { //eslint-disable-line
  const url = `${PHOENIX_STG_EMAIL_JRMALL}`;

  const EMAIL = {
    BASE_URL: url,
    SEND: 'send',
    MAILER: 'ses',
    AUTH: 'Mzlg*vPAqwl0YSwqL9^i9iqNuASzusmc&H6C1ueWVscxUrKHj^rPo@o-0M$^F9SeKT+ECDnL',
    SENDER: {
      EMAIL: 'jrdealer@yopmail.com',
      FIRSTNAME: 'JoyRide',
      LASTNAME: 'Mall',
    },
  };

  try {
    const res = await axios.post(EMAIL.BASE_URL + EMAIL.SEND, body, {
      headers:
      { Authorization: 'Mzlg*vPAqwl0YSwqL9^i9iqNuASzusmc&H6C1ueWVscxUrKHj^rPo@o-0M$^F9SeKT+ECDnL', 'content-type': 'application/json' },
    });
    console.log('[EMAIL RESPONSE]', res.data)
    return res.data.message;
  } catch (error) {
    console.error(error);
  }
};

export const verifyMobileOperator = async (data) => { //eslint-disable-line
  const url = `${PHOENIX_STG_PREFIX_MICRO}?mobileNumber=${data.mobileNumber}&referenceId=${data.referenceId}`;

  try {
    const res = await axios.get(url);
    console.log('[RESULT]', res.data.data)
    return res.data.data;
  } catch (error) {
    console.log('[ERROR]', error)
    return error;
  }
};