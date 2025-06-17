/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @author Ramachandran Gunasekeran
 * @email ramachandrangunasekeran@gmail.com
 * @create date 2019-11-13 15:02:43
 * @modify date 2019-11-13 16:28:18
 * @desc [description]
 */

import LocalStorage from '../localstorage.storage';

export const clearStorage = () => {
  // localStorage.remove
  localStorage.clear();
  const res = document.cookie;
  const multiple = res.split(';');
  for (let i = 0; i < multiple.length; i++) {
    const key = multiple[i].split('=');
    document.cookie = key[0] + ' =; expires = Thu, 01 Jan 1970 00:00:00 UTC';
  }
};
/**
 * Promise returns response object.
 * @param {Object} response The response object from Fetch API.
 */

export const handleHeaders = (response: any) =>
  new Promise((resolve, reject) => {
    console.log('response: ', response);
    const { headers } = response;
    const token = headers['x-access-token'];
    const refresh = headers['x-refresh-token'];
    if (token && refresh) {
      LocalStorage.write('token', headers['x-access-token']);
      LocalStorage.write('refresh-token', headers['x-refresh-token']);
    }

    if (!response) {
      reject(new Error('No response returned from fetch.'));
    }
    resolve(response);
  });
/**
 * Promise returns Errors checking the API Status else resolve ok.
 * @param {Object} response The response object from Fetch API.
 */
export const handleErrors = ({ response }: any) =>
  new Promise((_, reject) => {
    if (!response) {
      reject(new Error('No response returned from fetch.'));
      return;
    }
    console.log('response ', response);

    const errorMessage = response.data.message || 'Unauthorized Access';
    if (response.status === 500) {
      return reject({
        status: response.status,
        message: response?.data?.data?.fileResponse?.[0]?.errorMessage || response?.data?.message
      });
    }
    if (response.status === 401) {
      clearStorage();
      if (window.location.pathname !== '/login') {
        window.location = '/login' as any;
      } else {
        reject({
          status: 401,
          message: errorMessage
        });
      }
    }
    const { data, status } = response;
    switch (status) {
      // case 422:
      //   return reject({
      //     status: response.status,
      //     message: data.error.msg
      //   });

      // case 400:
      //   if (Array.isArray(json.message)) {
      //     return reject({
      //       status: 400,
      //       message: Array.isArray(json.message[0].error) ? json.message[0].error[0] : json.message[0].error
      //     });
      //   } else {
      //     return reject({
      //       status: 400,
      //       message: json.message
      //     });
      //   }
      case 400: // Handle 400 Bad Request
        // If the response data contains an array with a message, extract it
        if (Array.isArray(data)) {
          console.log('data: ', data);
          const formattedMessage = data.map((error: any) => `${error.field}: ${error.message}`).join(', ');
          reject({
            status: 400,
            message: formattedMessage || 'Bad Request'
          });
        } else {
          reject({
            status: 400,
            message: data[0]?.message || 'Bad Request'
          });
        }
        break;

      case 404:
        reject({
          status: 404,
          message: data.message
        });
        break;
      case 403:
        return reject({
          status: 404,
          message: data.message
        });
      case 409:
        return reject({
          status: response.status,
          message: data.message || ''
        });
      case 503:
      case 500:
      case 501:
        return reject({
          status: response.status,
          message: data.message || 'Internal Server Error'
        });
      default:
        return reject({
          status: null,
          message: response.statusText
        });
    }
    // response
    //   .json()
    //   .then((json: any) => {

    //   })
    //   .catch(() => {
    //     reject({
    //       status: 500,
    //       message: 'Response not JSON'
    //     });
    //   });
  });
/**
 * Promise returns the JSON Body as a promise from the API response.
 * @param {Object} response The response object from Fetch API.
 */
export const getResponseBody = (response: any) => {
  const bodyIsEmpty = response.status === 204;
  if (bodyIsEmpty) {
    return {};
  }
  return response.data;
};
