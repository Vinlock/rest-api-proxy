// @flow
import http from 'http';
import https from 'https';

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
  // Create instance of http or https
  const isSecure = options.host.startsWith('https://');
  let client = http;
  if (isSecure) client = https;

  // Return an axios style instance that accepts a
  // path, additional headers, body, method, and query params
  const defaultOptions = {
    port: isSecure ? 443 : 80,
  };
  return {
    get: async (path: ?string, options: ?RestProxyRequestOptions = defaultOptions): Promise<RestProxyResponse> => {


      return {
        body: '',
        headers: {},
      };
    },
    post: async (path: ?string, options: ?RestProxyRequestOptions = defaultOptions): Promise<RestProxyResponse> => {
      return {
        body: '',
        headers: {},
      };
    },
    head: async (path: ?string, options: ?RestProxyRequestOptions = defaultOptions): Promise<RestProxyResponse> => {
      return {
        body: '',
        headers: {},
      };
    },
    delete: async (path: ?string, options: ?RestProxyRequestOptions = defaultOptions): Promise<RestProxyResponse> => {
      return {
        body: '',
        headers: {},
      };
    },
    put: async (path: ?string, options: ?RestProxyRequestOptions = defaultOptions): Promise<RestProxyResponse> => {
      return {
        body: '',
        headers: {},
      };
    },
  };
};

export default restProxy;
