const AWS = require('aws-sdk');

const DB = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
});

module.exports.add = (table, item) => { // eslint-disable-line no-unused-vars
  console.log('[jrm-transactions-stg] ADDING ITEMS', item);
  return DB.put({
    TableName: table,
    Item: {
      referenceId: item.misc.referenceId,
      status: item.misc.status,
      cardholdersFullName: `${item.user.firstName} ${item.user.lastName}`,
      cardholdersFirstName: item.user.firstName,
      cardholdersLastName: item.user.lastName,
      cardholdersCity: item.user.city,
      cardholdersZip: item.user.zip,
      cardholderAddress: `${item.user.address1} ${item.misc.address2} ${item.user.city} ${item.user.country}`,
      cardholderEmailAddress: item.user.email,
      cardholderMobileNumber: item.user.mobile,
      productPrice: parseInt(item.amount),
      productName: item.items[0].name,
      productImage: item.misc.image,
      sku: item.misc.sku,
    },
  }).promise();
};

module.exports.update = (table, item) => { // eslint-disable-line no-unused-vars
  console.log('[jrm-transactions-stg] UPDATING ITEMS', item);
  return DB.update({
    TableName: table,
    Key: {
      referenceId: item.referenceId,
    },
    UpdateExpression: 'set #status = :s',
    ExpressionAttributeNames: {
      '#status': 'status',
    },
    ExpressionAttributeValues: {
      ':s': item.status,
    },
    ReturnValues: 'UPDATED_NEW',
  })
    .promise();
};

module.exports.getDetails = (table, item) => {  // eslint-disable-line no-unused-vars
  return DB.get({
    TableName: table,
    Key:{
        referenceId: item.referenceId
    }
  })
  .promise()
} 
  
