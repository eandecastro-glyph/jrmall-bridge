import { callProductList } from '../business';
// import { SYNTAX } from '../constants/syntax';
// import logger from '../helper/logger';
// import { errHandler } from '../helper/error';

export default async () => {
  try {
    const result = await callProductList();
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
