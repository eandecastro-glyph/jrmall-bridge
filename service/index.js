import productListHandler from './handler/getProductListHandler';
import createPaymentUrlHandler from './handler/createPaymentUrlHandler';
import updateStatusHandler from './handler/updateStatusHandler';
import getOrderDetailsHandler from './handler/getOrderDetails';
import verifyMobileOperator from './handler/verifyMobileOperator';
// import emailHandler from './handler/emailHandler';

exports.productList = productListHandler;
exports.createPaymentUrl = createPaymentUrlHandler;
exports.updateStatus = updateStatusHandler;
exports.getOrderDetails = getOrderDetailsHandler;
exports.verifyPrefix = verifyMobileOperator;
// exports.emailConcerns = emailHandler;
