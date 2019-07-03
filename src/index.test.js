import nock from 'nock';
import restProxy from './';

describe('restProxy', () => {
  it('should have restProxy function', () => {
    return expect(restProxy).toBeInstanceOf(Function);
  });

  it('should return a function', () => {
    return expect(restProxy({
      host: 'https://api.test.com',
      headers: {
        'X-Auth-Token': '1234',
      },
    })).toBeInstanceOf(Function);
  });

  describe('RestProxyResponse', () => {
    afterEach(() => {
      nock.cleanAll();
    });

    it('should return an object with "body" key from get call', () => {
      // Mock request
      nock('https://api.test.com', {
        'X-Auth-Token': '1234',
      }).defaultReplyHeaders({
        'Content-Type': 'application/json',
      }).get('/info')
        .reply(200, {
          info: 'received',
          status: true,
        }, {
          'Content-Type': 'application/json',
        });

      // Proxy
      const proxy = restProxy({
        host: 'https://api.test.com',
        headers: {
          'X-Auth-Token': '1234',
        },
      });
      return expect(proxy('GET', '/info', {})).resolves.toHaveProperty('body');
    });

    describe('GET request', () => {
      it('should return an object with "headers" key from get call', () => {
        // Mock request
        nock('https://api.test.com', {
          'X-Auth-Token': '1234',
        }).defaultReplyHeaders({
          'Content-Type': 'application/json',
        }).get('/info')
          .reply(200, {
            info: 'received',
            status: true,
          }, {
            'Content-Type': 'application/json',
          });

        // Proxy
        const proxy = restProxy({
          host: 'https://api.test.com',
          headers: {
            'X-Auth-Token': '1234',
          },
        });
        return expect(proxy('GET', '/info', {})).resolves.toHaveProperty('headers');
      });

      it('should return correct response object from parsing the json', () => {
        // Mock request
        nock('https://api.test.com', {
          'X-Auth-Token': '1234',
        }).defaultReplyHeaders({
          'Content-Type': 'application/json',
        }).get('/info')
          .reply(200, {
            info: 'received',
            status: true,
          }, {
            'Content-Type': 'application/json',
          });

        // Proxy
        const proxy = restProxy({
          host: 'https://api.test.com',
          headers: {
            'X-Auth-Token': '1234',
          },
          parseJson: true,
        });
        return expect(proxy('GET', '/info', {})).resolves.toHaveProperty('body.info');
      });
    });

    describe('POST request', () => {
      it('should return an object with "headers" key from POST call', () => {
        // Mock request
        nock('https://api.test.com', {
          'X-Auth-Token': '1234',
        }).defaultReplyHeaders({
          'Content-Type': 'application/json',
        }).post('/info')
          .reply(200, {
            info: 'received',
            status: true,
          }, {
            'Content-Type': 'application/json',
          });

        // Proxy
        const proxy = restProxy({
          host: 'https://api.test.com',
          headers: {
            'X-Auth-Token': '1234',
          },
        });
        return expect(proxy('POST', '/info', {})).resolves.toHaveProperty('headers');
      });

      it('should return correct response object from parsing the json', () => {
        // Mock request
        nock('https://api.test.com', {
          'X-Auth-Token': '1234',
        }).defaultReplyHeaders({
          'Content-Type': 'application/json',
        }).post('/info')
          .reply(200, {
            info: 'received',
            status: true,
          }, {
            'Content-Type': 'application/json',
          });

        // Proxy
        const proxy = restProxy({
          host: 'https://api.test.com',
          headers: {
            'X-Auth-Token': '1234',
          },
          parseJson: true,
        });
        return expect(proxy('POST', '/info', {})).resolves.toHaveProperty('body.info');
      });
    });
  });
});