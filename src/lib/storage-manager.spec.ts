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

const fileConfigurationResource: ResourceConfig = {
  resource: {
    path: `https://tester1.inrupt.net/${uuid.v4()}`,
    type: SolidResourceType.Folder
  },
  webID
};

const folderConfigurationResource: ResourceConfig = {
  resource: {
    path: `https://tester1.inrupt.net/${uuid.v4()}`,
    type: SolidResourceType.Folder
  },
  webID
};

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

test.serial('createFolderResource', async t => {
  const result = await StorageFileManager.createResource(
    folderConfigurationResource
  );
  t.is(result.status, 201);
});

test.serial('deleteFolderResource', async t => {
  const result = await StorageFileManager.deleteResource(
    folderConfigurationResource
  );
  t.is(result.status, 200);
});

test.serial('createFileResource', async t => {
  const result = await StorageFileManager.createResource(
    fileConfigurationResource
  );
  t.is(result.status, 201);
});

test.serial('deleteFileResource', async t => {
  const result = await StorageFileManager.deleteResource(
    fileConfigurationResource
  );
  t.is(result.status, 200);
});
