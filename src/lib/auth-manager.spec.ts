// tslint:disable
import test from 'ava';
import {
  StorageTestAuthenticationManager,
  StorageAuthenticationManager
} from './auth-manager';
import { logger } from './common';
import {
  SOLID_PASSWORD,
  SOLID_PROVIDER_URL,
  SOLID_USERNAME,
  SOLID_WEBID
} from './constants';

let session;

test('testLogin', async t => {
  session = await StorageTestAuthenticationManager.currentSession();
  if (!session) {
    session = await StorageTestAuthenticationManager.login({
      idp: SOLID_PROVIDER_URL,
      password: SOLID_PASSWORD,
      username: SOLID_USERNAME
    });
    logger.info('Authentication response: ', session.webID);
  }

  t.assert(session !== undefined);
});

test('testFetch', async t => {
  const response = await StorageTestAuthenticationManager.fetch(SOLID_WEBID, {
    method: 'GET',
    Accept: 'text/turtle'
  });
  const secondResponse = await StorageAuthenticationManager.fetch(SOLID_WEBID, {
    method: 'GET',
    Accept: 'text/turtle'
  });
  t.assert(response.status === 200);
  t.assert(secondResponse.status === 200);
});
