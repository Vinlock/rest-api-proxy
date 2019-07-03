# Rest API Proxy

This package allows you to proxy a rest API. For use in API routers to create routes that proxy to the given API.

# Installation
```bash
yarn add rest-api-proxy 
```

# Usage
```js
import express from 'express';
import restApiProxy from 'rest-api-proxy';

const app = express();

app.all('/proxy/twitter/:path*', async (req, res) => {
  const proxy = restApiProxy({
    host: 'https://api.twitter.com/v1',
    headers: {
      'X-Auth-Token': 'XXXXXXX',
    },
  });
  
  const requestData = req.body || undefined;
  
  const response = await proxy(req.method, req.param.path, {
    data: requestData,
    query: req.query,
    headers: req.headers,
  });
  
  return res.status(response.statusCode).set(response.headers).send(response.body);
});

app.listen(4000, () => {
  console.log('Server running...');
});
```