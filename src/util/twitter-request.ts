import config from '../config/config';
import * as request from 'request';
import { ApiError } from '../api/common/api-error';

const LIMIT_OF_ATTEMPTS = 3;

// Utility for wrapping twitter develop api request. Currently we will only enable get and post methods.
class TwitterRequest {
  public static get(options: any, callback: any) {
    return intercept(request.get, options, callback, 0);
  }

  public static post(options: any, callback: any) {
    return intercept(request.post, options, callback, 0);
  }
}

const intercept = function (method: Function, options: any, callback: any, attempts: number) {
  if (attempts < LIMIT_OF_ATTEMPTS) {
    Object.assign(options, {
      headers: {
        Authorization: `Bearer ${config.twitterApi.accessToken}`
      },
    })
    method(options, (err: any, response: any, body: any) => {
      if (err || (response && response.statusCode >= 400)) {
        intercept(method, options, callback, attempts + 1);
      } else {
        callback(err, response, body);
      }
    });
  } else {
    const err: ApiError = {
      code: 'TSERR001',
      message: 'Error requesting data from Twitter Dev Api. Number of attempts excedeed',
    };
    callback(err, undefined, undefined);
  }

}

export default TwitterRequest;
