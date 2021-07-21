import moment from 'moment';
import { callPaymentUrl } from '../business';
import db from '../helper/db';

const {
  MAIN_TABLE,
} = process.env;

export default async (item) => {
  try {
    let bodyObj = {};

    try {
      bodyObj = JSON.parse(item.body);
      console.log(bodyObj);
    } catch (err) {
      console.log('[ERROR]', err);
      return {
        statusCode: 400,
        body: err,
        headers: { 'Access-Control-Allow-Origin': '*' },
      };
    }

    const firstNameInitial = bodyObj.user.firstName.split('')[0];
    const lastNameInitial = bodyObj.user.lastName.split('')[0];
    const refId = `TXNJRMPH${moment().format('X')}${firstNameInitial.toUpperCase()}${lastNameInitial.toUpperCase()}`;

    const convenienceFee = await calculateConvenienceFee(bodyObj.items[0].amount);

    bodyObj.items[1] = {
      name: 'Convenience Fee',
      quantity: 1,
      amount: convenienceFee,
    };
    bodyObj.misc.redirect_success = `http://localhost:1024/${refId}`;
    bodyObj.misc.redirect_cancel = `http://localhost:1024/${refId}`;
    bodyObj.misc.referenceId = refId;
    bodyObj.amount = parseFloat(bodyObj.items[0].amount) + parseFloat(bodyObj.items[1].amount);

    await db.add(MAIN_TABLE, bodyObj);

    delete bodyObj.misc.status;
    delete bodyObj.misc.image;
    delete bodyObj.misc.sku;
    delete bodyObj.misc.address2;

    try {
      const result = await callPaymentUrl(bodyObj);
      console.log('[PHOENIX PAYNAMICS RESULTS]', result);
      return {
        statusCode: 201,
        body: JSON.stringify(result),
        headers: { 'Access-Control-Allow-Origin': '*' },
      };
    } catch (err) {
      console.log('[ERROR]', err);
      return {
        statusCode: 400,
        body: err,
        headers: { 'Access-Control-Allow-Origin': '*' },
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: error,
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
};

const calculateConvenienceFee = (price) => {
  const feePercent = parseFloat(price) * 0.02;
  const feeCash = 25;

  if (feePercent > feeCash) {
    return feePercent;
  }

  return feeCash;
};
