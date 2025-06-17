/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @author Ramachandran Gunasekeran
 * @email ramachandrangunasekeran@gmail.com
 * @create date 2019-11-13 16:00:14
 * @modify date 2019-11-13 16:00:14
 * @desc [description]
 */

import queryString from 'query-string';
import isEmpty from 'lodash/isEmpty';

/**
 * Function returns the First Error of the Array or Object.
 * @param {Object} error The Object of Error's returned from API Service.
 */
export const parseInputErrors = (error: any) => {
  if (!error) {
    return;
  }
  const firstError = error[0];
  // eslint-disable-next-line consistent-return
  return `${firstError.param.toUpperCase()}: ${firstError.msg}`;
};
/**
 * Function appending QS to the provided URL.
 * @param {String} url The URL to which the QS needed to be added.
 * @param {Object} params The QS.
 */
export const applyQueryParams = (url: string, params = {}) => {
  if (isEmpty(params)) {
    return url;
  }
  const queryParams = queryString.stringify(params);
  return `${url}?${queryParams}`;
};
/**
 * Function returns the QueryString parsed to Object.
 * @param {String} qs QueryString from the URL.
 */
export const parseQueryStrings = (qs: string) => {
  return queryString.parse(qs);
};

export const buildQueryString = (params: any) => {
  let newParams = null;
  if (params) {
    newParams = [];
    for (const key in params) {
      if (params[key]) {
        if (key === 'q' && params[key] !== '') {
          newParams.push(`q=${params[key]}`);
        } else if (key === 'page' || key === 'perPage') {
          newParams.push(`${key}=${params[key]}`);
        } else {
          if (key !== 'q') {
            newParams.push(`filter[${key}]=${params[key]}`);
          }
        }
      }
    }
    newParams = '?' + newParams.join('&');
  }
  return newParams;
};
