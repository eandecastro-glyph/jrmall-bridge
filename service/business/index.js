import {
  getProductList, createPaymentUrl, createStepOrder, emailConcerns, verifyMobileOperator
} from './api';
import moment from 'moment';

export const callProductList = async () => {
  try {
    const result = await getProductList();
    return result;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const callPaymentUrl = async (body) => {
  try {
    const result = await createPaymentUrl(body);
    return result;
  } catch (error) {
    console.log('ERROR', error);
    return error;
  }
};

export const callStepOrder = async (body) => {
  try {
    const result = await createStepOrder(body);
    return result;
  } catch (error) {
    return error;
  }
};

export const callEmail = async (body) => {
  try {
    const result = await emailConcerns(body);
    return result;
  } catch (error) {
    console.log('ERROR', error);
    return error;
  }
};

export const callVerifyMobileOperator = async (data) => {
  try {
    data.referenceId = `TXNJRMPH${moment().format('X')}`;
    const result = await verifyMobileOperator(data);
    return result;
  } catch (error) {
    console.log('ERROR', error);
    return error;
  }
};
