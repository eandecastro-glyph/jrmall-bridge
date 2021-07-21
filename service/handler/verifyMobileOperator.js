import { callVerifyMobileOperator } from '../business';
// import { SYNTAX } from '../constants/syntax';
// import logger from '../helper/logger';
// import { errHandler } from '../helper/error';

export default async (item) => {
  try {
    const params = { ...item.pathParameters };
    const result = await callVerifyMobileOperator(params);
    return {
      statusCode: 200,
      body: JSON.stringify(result),
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  } catch (error) {
    console.log('[ERROR]', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
    };
  }
};
