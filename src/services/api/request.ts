/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * @author Ramachandran Gunasekeran
 * @email ramachandrangunasekeran@gmail.com
 * @create date 2019-11-13 14:59:26
 * @modify date 2019-11-13 15:52:37
 * @desc [description]
 */
import { getResponseBody, handleErrors, handleHeaders } from './response';
import fetch from 'axios';
import LocalStorage from '../localstorage.storage';
/**
 * Promise which returns API response once performing API Request.
 * @param {String} uri The API Route Path.
 * @param {String} apiUrl The Base URL.
 * @param {Object} requestData The Object to fetch API which contains its header/body and other sensitive info.
 */
const _performRequest = (uri: string, apiUrl: string, requestData = {}) => {
  const url = `${apiUrl}${uri}`;
  return new Promise((resolve, reject) => {
    fetch(url, requestData)
      .then(handleHeaders)
      .then(getResponseBody)
      .then((response: any) => resolve(response))
      .catch((error) => {
        handleErrors(error).catch(reject);
      });
  });
};

const getSession = () => {
  return new Promise((res, rej) => {
    const token = LocalStorage.read('token');
    const refresh = LocalStorage.read('refresh-token');
    if (token) return res({ token, refresh });
    return rej(null);
  });
};

/**
 *
 * @param {Object} requestData The Object to fetch API which contains its header/body and other sensitive info.
 */
const _addTokenHeader = (requestData: any) =>
  getSession()
    .then(({ token, refresh }: any) => {
      if (token && refresh) {
        requestData.headers.Authorization = `Bearer ${token}`;
        requestData.headers['X-REFRESH-TOKEN'] = refresh;
      }
      return requestData;
    })
    .catch(() => requestData);

export class APIService {
  /**
   * Promise which performs GET Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async get(uri: string, authToken = undefined, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData: any = {
      method: 'get',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json'
      }
    };
    if (authToken) {
      requestData.headers.Authorization = `Bearer ${authToken}`;
    } else {
      requestData = await _addTokenHeader(requestData);
    }
    return _performRequest(uri, apiUrl, requestData);
  }

  /**
   * Promise which performs GET Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async getFile(uri: string, authToken = undefined, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData: any = {
      method: 'get',
      referrer: 'no-referrer',
      responseType: 'blob',
      headers: {
        Accept: 'application/json'
      }
    };
    if (authToken) {
      requestData.headers.Authorization = `Bearer ${authToken}`;
    } else {
      requestData = await _addTokenHeader(requestData);
    }
    return _performRequest(uri, apiUrl, requestData);
  }

  /**
   * Promise which performs POST Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {Object} data The Body of the request.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async post(uri: string, data: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData: any = {
      method: 'post',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data
    };
    requestData = await _addTokenHeader(requestData);
    return _performRequest(uri, apiUrl, requestData);
  }

  /**
   * Promise which performs POST Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {Object} data The Body of the request.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async upload(uri: string, data: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData = {
      method: 'post',
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data
    };
    requestData = await _addTokenHeader(requestData);
    return _performRequest(uri, apiUrl, requestData);
  }

  /**
   * Promise which performs DELETE Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {Object} data The body of the request.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async delete(uri: string, data?: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    // const decamelizeData = humps.decamelizeKeys(data);
    let requestData = {
      method: 'delete',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data
    };
    requestData = await _addTokenHeader(requestData);
    return _performRequest(uri, apiUrl, requestData);
  }

  /**
   * Promise which performs PUT Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {Object} data The body of the request.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async put(uri: any, data?: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    //  const decamelizeData = humps.decamelizeKeys(data);
    let requestData = {
      method: 'put',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data
    };
    requestData = await _addTokenHeader(requestData);
    return _performRequest(uri, apiUrl, requestData);
  }

  /**
   * Promise which performs PATCH Request to the Backend HTTP/S Service.
   * @param {String} uri The API Route.
   * @param {Object} data The body of the request.
   * @param {String} apiUrl The Base URL of the API.
   */
  static async patch(uri: string, data?: any, apiUrl: string = import.meta.env.VITE_API_ENDPOINT ?? '') {
    let requestData = {
      method: 'patch',
      referrer: 'no-referrer',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      data
    };
    requestData = await _addTokenHeader(requestData);
    return _performRequest(uri, apiUrl, requestData);
  }
}
