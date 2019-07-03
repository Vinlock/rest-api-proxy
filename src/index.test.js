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

  describe('RestProxyInstance', () => {
    it('should have get as a function', () => {
      return expect(restProxy({
        host: 'https://api.test.com',
        headers: {
          'X-Auth-Token': '1234',
        },
      }).get).toBeInstanceOf(Function);
    });

    it('should have post as a function', () => {
      return expect(restProxy({
        host: 'https://api.test.com',
        headers: {
          'X-Auth-Token': '1234',
        },
      }).post).toBeInstanceOf(Function);
    });

    it('should have put as a function', () => {
      return expect(restProxy({
        host: 'https://api.test.com',
        headers: {
          'X-Auth-Token': '1234',
        },
      }).put).toBeInstanceOf(Function);
    });

    it('should have head as a function', () => {
      return expect(restProxy({
        host: 'https://api.test.com',
        headers: {
          'X-Auth-Token': '1234',
        },
      }).head).toBeInstanceOf(Function);
    });

    it('should have delete as a function', () => {
      return expect(restProxy({
        host: 'https://api.test.com',
        headers: {
          'X-Auth-Token': '1234',
        },
      }).delete).toBeInstanceOf(Function);
    });
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
  });
});