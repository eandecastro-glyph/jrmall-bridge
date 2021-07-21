import db from '../helper/db';
import { callStepOrder, callEmail } from '../business/index';

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

    await db.update(MAIN_TABLE, bodyObj);

    const orderDetails = await db.getDetails(MAIN_TABLE, bodyObj);
    const stepOrderBody = {
      externalId: orderDetails.Item.referenceId, // any reference id used by client app
      customerMobile: orderDetails.Item.cardholderMobileNumber,
      customerEmail: orderDetails.Item.cardholderEmailAddress,
      sku: orderDetails.Item.sku,
      customerFirstname: orderDetails.Item.cardholdersFirstName,
      customerLastname: orderDetails.Item.cardholdersLastName,
      customerCity: orderDetails.Item.cardholdersCity,
      customerZip: orderDetails.Item.cardholdersZip,
      customerAddress: orderDetails.Item.cardholderAddress
    };
    const result = await callStepOrder(stepOrderBody);

    console.log('[STEP ORDER RESULTS]', result);
    const responseStatus = { ...result.response };
    if (responseStatus.status == '401' || responseStatus.status == '400') {
      console.log('[ERROR]', result.response);
      const bodyObject = {
        mailer: 'ses',
        sender: {
          firstname: 'JoyRide',
          lastname: 'Mall',
          email: 'jrdealer@yopmail.com',
        },
        subject: 'Error on StepOrder from JoyRide Mall Loading Website',
        receivers: ['eanjhon@glyph.com.ph', 'sharina@glyphgames.com', 'customersupport@glyphgames.com', 'gmaranan@glyphgames.com'],
        content: {
          type: 'plain',
          message: `<h3>Request:</h3> <br/>${responseStatus.config.data}<br/> <h3>Response:</h3> <br/>${JSON.stringify(responseStatus.data)}`,
        },
      };
      await callEmail(bodyObject);
    }

    const response = {
      message: 'success',
    };

    return {
      statusCode: 201,
      body: JSON.stringify(response),
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  } catch (error) {
    console.log('[ERROR]', error);
    return {
      statusCode: 500,
      body: error,
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
};
