import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import {
  ResourceConfig,
  SolidResourceType,
  StorageFileManager
} from './storage-manager';

let session;

const SOLID_PROVIDER_URL = process.env.SOLID_PROVIDER_URL;
const SOLID_PASSWORD = process.env.SOLID_PASSWORD;
const SOLID_USERNAME = process.env.SOLID_USERNAME;
const SOLID_WEBID = process.env.SOLID_WEBID;

const fileConfigurationResource: ResourceConfig = {
  resource: {
    path: `https://tester1.inrupt.net/${uuid.v4()}`,
    type: SolidResourceType.Folder
  },
  webID: SOLID_WEBID
};

const folderConfigurationResource: ResourceConfig = {
  resource: {
    path: `https://tester1.inrupt.net/${uuid.v4()}`,
    type: SolidResourceType.Folder
  },
  webID: SOLID_WEBID
};

test.before(async () => {
  session = await auth.currentSession();
  if (!session) {
    session = await auth.login({
      idp: SOLID_PROVIDER_URL,
      password: SOLID_PASSWORD,
      username: SOLID_USERNAME
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
