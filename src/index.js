// @flow
import http from 'http';
import https from 'https';
import { URL } from 'url';
import jitson from 'jitson';

type RestProxyResponse = {
  body: ?string | ?{},
  headers: ?{},
};

type RestProxyRequestOptions = {
  headers: ?{},
  query: ?{},
  data: ?string,
};

type RestProxyOptions = {
  host: string,
  port: ?number,
  headers: {},
  parseJson: boolean,
};

type RestProxyRequest = (path: ?string, options: ?RestProxyRequestOptions) => Promise<RestProxyResponse>;

type RestProxyInstance = {
  get: RestProxyRequest,
  post: RestProxyRequest,
  head: RestProxyRequest,
  delete: RestProxyRequest,
  put: RestProxyRequest,
};

const restProxy = (options: ?RestProxyOptions = {}): RestProxyInstance => {
  // Gather variables
  let { host, headers, parseJson } = options;
  // Create instance of http or https
  const isSecure = host.startsWith('https://');
  let client = http;
  if (isSecure) client = https;

  // Get Port
  const port = options.port || (isSecure ? 443 : 80);

  // Return an axios style instance that accepts a
  // path, additional headers, body, method, and query params
  return (method: string, path: ?string = '/', options: ?RestProxyRequestOptions = { parseJson: false }): Promise<RestProxyResponse> => {
    // Gather variables
    const { headers: additionalHeaders, query, data } = options;

    const url = new URL(host);

    // Build data
    let dataToSend = data || '';
    if (data === Object(data)) {
      try {
        dataToSend = JSON.stringify(data);
      } catch (err) {
        dataToSend = data;
      }
    }

    // Build options
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || port,
      headers: {
        ...headers,
        ...additionalHeaders,
        'Content-Length': dataToSend.length,
      },
      method, path,
    };

    // Request
    return new Promise((resolve, reject) => {
      const request =  client.request(requestOptions, (response) => {
        response.on('data', (responseBody) => {
          if (parseJson) {
            const parse = jitson();
            responseBody = parse(responseBody);
          }

          resolve({
            body: responseBody,
            headers: response.headers,
            statusCode: response.statusCode,
          });
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      request.write(data);
      request.end();
    });
  };
};

export default restProxy;
