// @flow
import http from 'http';
import https from 'https';
import { URL, URLSearchParams } from 'url';
import jitson from 'jitson';
import flatstr from 'flatstr';

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

type RestProxyRequest = (method: string, path: ?string, options: ?RestProxyRequestOptions) => Promise<RestProxyResponse>;

const restProxy = (options: ?RestProxyOptions = {}): RestProxyRequest => {
  // Gather variables
  let { host, headers, parseJson } = options;
  // Create instance of http or https and verify host
  const isSecure = host.startsWith('https://');
  if (!isSecure && !host.startsWith('http://')) throw new Error('INVALID_HOST');
  let client = http;
  if (isSecure) client = https;

  // Get Port
  const port = options.port || (isSecure ? 443 : 80);

  // Return an axios style instance that accepts a
  // path, additional headers, body, method, and query params
  return (method: string, path: ?string = '/', options: ?RestProxyRequestOptions = { parseJson: false }): Promise<RestProxyResponse> => {
    // Gather variables
    const { headers: additionalHeaders, query, data } = options;
    const requestMethod = method.trim().toUpperCase();

    // Parse out the passed host
    const url = new URL(host.trim());

    // Add in query params
    url.search = (new URLSearchParams(query || {})).toString();

    // Check if method would have data.
    const hasData = requestMethod !== 'GET' || requestMethod !== 'DELETE';

    // Build data
    let dataToSend = data || '';
    if (hasData) {
      if (data === Object(data)) {
        try {
          dataToSend = JSON.stringify(data);
        } catch (err) {
          dataToSend = data;
        }
      }
    }

    // Build options
    const requestOptions = {
      hostname: url.hostname,
      port: url.port || port,
      headers: {
        ...headers,
        ...additionalHeaders,
      },
      method: requestMethod,
      path: path.trim(),
    };

    if (hasData) {
      requestOptions.headers['Content-Length'] = dataToSend.length;
    }

    // Request
    return new Promise((resolve, reject) => {
      const request =  client.request(requestOptions, (response) => {

        let responseBody = '';

        response.on('data', (body) => {
          responseBody += body;
        });

        response.on('end', () => {
          responseBody = flatstr(responseBody);
          if (parseJson) {
            const parse = jitson();
            responseBody = parse(responseBody);
          }
          resolve({
            body: responseBody,
            headers: response.headers,
            statusCode: response.statusCode,
          })
        });
      });

      request.on('error', (error) => {
        reject(error);
      });

      if (hasData) {
        request.write(data);
      }
      request.end();
    });
  };
};

export default restProxy;
