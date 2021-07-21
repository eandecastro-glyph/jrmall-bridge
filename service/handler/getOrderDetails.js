import db from '../helper/db';

const {
  MAIN_TABLE,
} = process.env;

export default async (item) => {
  try {
    const bodyObj = { ...item.pathParameters };
    const result = await db.getDetails(MAIN_TABLE, bodyObj);
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
