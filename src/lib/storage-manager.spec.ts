import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import {
  ResourceConfig,
  SolidResourceType,
  StorageFileManager
} from './storage-manager';

let session;
const webID = 'https://aorumbayev.lpapps.co:8443/profile/card#me';

test.before(async () => {
  session = await auth.currentSession();
  if (!session) {
    session = await auth.login({
      idp: 'https://inrupt.net',
      password: 'Looper248!',
      username: 'tester1'
    });
  }
});

test('createResource', async t => {
  const resourcePath = `https://tester1.inrupt.net/${uuid.v4()}`;
  const configurationResource: ResourceConfig = {
    resource: {
      path: resourcePath,
      type: SolidResourceType.Folder
    },
    webID
  };
  return StorageFileManager.createResource(configurationResource).then(
    result => {
      t.is(result.status, 201);
    }
  );
});
