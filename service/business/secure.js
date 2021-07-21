const CryptoJS = require('crypto-js'); // encryption library
const { v4: uuidv4 } = require('uuid');
// const momentz = require('moment-timezone');
const { format } = require('date-and-time');
/**
 * Create an auth header
 * @param {string} email - retailer's email address registered in the API
 * @param {string} id - retailer's ID paired w/ the API. will be created on registration
 * @param {string} secret - passphrase w/c would act like the apps password. will be coming from glyph after registration. IMPORTANT: keep this secure
 * @param {string} key - passphrase for encrypting the signature. will be coming from glyph after registration. IMPORTANT: keep this secure
 * @param {string} tag - tag associated to the retailer. will be coming from glyph after registration
 */
module.exports.sign = (email, id, secret, key, tag) => {
  // Validate params here
  email = email.toLowerCase(); // make sure lowercase
  tag = tag.toLowerCase(); // make sure lowercase
  // Create timestamp in UTC and YYYYMMDDHHmmss (length is 14) format - `timestamp`
  // const timestamp = momentz().utc().format('YYYYMMDDHHmmss'); // make sure it's UTC
  const timestamp = format(new Date(), 'YYYYMMDDHHmmss', true);
  // Generate a 32 char random string - let's call it `randomid` in this example
  const randomid = uuidv4().replace(/-/g, ''); // any random 32 chars
  // Hash `tag` using MD5 (hex string output) (32)  - `tag5`
  const tag5 = CryptoJS.MD5(tag).toString(CryptoJS.enc.Hex);
  // Replace all instances of /@|com|gmail|yahoo|ymail|ph|glyphgames/ in `email` to value of `tag5`;
  // Replace all instances of `.` in the result to `=`;
  // Concat `tag5` at beggining of the result - `rmail`
  const rmail = tag5 + email.replace(/@|com|gmail|yahoo|ymail|ph|glyphgames/g, tag5).replace(/\./g, '=');
  // Remove all instances of `-` in `id` (32) - `pretid`
  const pretid = id.replace(/-/g, '');
  // Use HMAC-SHA256 on `pretid` using `rmail` as passphrase (64) - `pretid256`
  const pretid256 = CryptoJS.HmacSHA256(pretid, rmail).toString(CryptoJS.enc.Hex);
  // Use HMAC-SHA1 on `email` using `pretid256` as passphrase (40) - `mail1`
  const mail1 = CryptoJS.HmacSHA1(email, pretid256).toString(CryptoJS.enc.Hex);
  // Concat `pretid256` and `mail1` respectively (104) - `locker` - will be used later
  const locker = pretid256 + mail1;
  // Concat `randomid` + `timestamp` then encode to hex string (92) - `signature`
  const signature = CryptoJS.enc.Utf8.parse(`${randomid}${timestamp}`).toString(CryptoJS.enc.Hex);
  // Lock the `signature` using our locking algorithm, w/ `locker` as key (or "lock-er") (92) - locking algo EXPLAINED LATER - `lockedSignature`
  const lockedSignature = lock(signature, locker);
  // Hash `randomid` using SHA256 (64) - `randomid256`
  const randomid256 = CryptoJS.SHA256(randomid).toString(CryptoJS.enc.Hex);
  // Encode `secret` to hex string - `hexSecret`
  const hexSecret = CryptoJS.enc.Utf8.parse(secret).toString(CryptoJS.enc.Hex);
  // Lock `hexSecret` w/ our locking algo using `randomid256` as key - `lockedSecret`
  const lockedSecret = lock(hexSecret, randomid256);

  // Hash `timestamp` using SHA256 (64) - `timestamp256`
  const timestamp256 = CryptoJS.SHA256(timestamp).toString(CryptoJS.enc.Hex);
  // Concat 3rd to 13th char in `randomid256` + 7th to 57th char in `timestamp256` + 53rd to 60th char in randomid256 - `ridts`
  const ridts = randomid256.substring(2, 13) + timestamp256.substring(6, 57) + randomid256.substring(52, 60);
  // Hash `ridts` using SH256 (64) - `ridts256`
  const ridts256 = CryptoJS.SHA256(ridts).toString(CryptoJS.enc.Hex);
  // Take the 27th to 36th character of `ridts256` (10) - `ridts256Cut`
  const ridts256Cut = ridts256.substring(26, 36);
  // Concat `lockedSignature` + `ridts256Cut` + `lockedSecret` (92 + 10 + <length-of-lockedSecret>) - `load`
  const load = lockedSignature + ridts256Cut + lockedSecret;
  // Parse `load` from Hex and encode to Base64 - `loadb64`
  const loadb64 = CryptoJS.enc.Hex.parse(load).toString(CryptoJS.enc.Base64);
  // Encrypt `loadb64` using AES using `key` as passphrase
  // Remove the prefix 'U2FsdGVkX1' as it is consistent - `auth`
  const auth = CryptoJS.AES.encrypt(loadb64, key).toString().substring(10); // remove prefix U2FsdGVkX1
  // Rearrange the `pretid` in a specific order - reordering EXPLAINED LATER - `idParts`
  const idParts = messUUID(pretid);
  // Concat 1st to 9th char of `auth` + 1st to 16th chars of `idParts` + 10th to 17th char of `auth` + 17th to 32nd chars of `idParts` + 18th to the rest of `auth` - `endAuth`
  const endAuth = auth.substring(0, 9) + idParts[0] + idParts[1] + auth.substring(9, 17) + idParts[2] + idParts[3] + auth.substring(17);
  // console.log(`sfsdf ${endAuth}`);
  return endAuth;
  // sample output (258 chars for this example):
  // 8zqKE5s1Ta17cb599eb9fb998TUH2MKTKac03bbc742ce4eeb7vnYNFD+rQoIFZE6i7/43BbZ9FYNr76fVkhgNL2yNPfwNNzEn8Asvaa1dw6S5d/l24MEHiUVbfhjw5oxcIAYgTI5FMtHQdZRQklWH1+VFEnhpjf8iYi5he5pRcXZxzR5jgTgKyfZnFD+7Nm7o6nVXECiTjuvzAF2+XqQQOcjMazo/u+g+a5HWIIvcx4tr5j+qHQhbdhmsbeElLhI=
  // Use `endAuth` as value for `Authorization` header
};
const lock = (data, locker) => {
  // Validate params here
  let lockedData = '';
  for (let i = 0; i < data.length; i++) {
    const dataChar = parseInt(data.charAt(i), 16);
    const lockerChar = parseInt(locker.charAt(i % locker.length), 16);
    lockedData += ((dataChar + lockerChar) % 0x10).toString(16);
  }
  return lockedData;
};
const messUUID = (uuid) => {
  const part1 = uuid.substring(0, 8);
  const part2 = uuid.substring(8, 16);
  const part3 = uuid.substring(16, 24);
  const part4 = uuid.substring(24);
  const output = [part3, part1, part4, part2];
  return output;
};
