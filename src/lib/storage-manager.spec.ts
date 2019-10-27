import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import {
  AccessControlNamespace,
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

async function createResource(t: any, input: any, expected: any): Promise<any> {
  const result = await StorageFileManager.createResource(input);
  t.is(result.status, expected);
}

async function deleteResource(t: any, input: any, expected: any): Promise<any> {
  const result = await StorageFileManager.deleteResource(input);
  t.is(result.status, expected);
}

async function resourceExists(t: any, input: any, expected: any): Promise<any> {
  const result = await StorageFileManager.resourceExists(input);
  t.is(result.status, expected);
}

async function updateACL(t: any, input: any, expected: any): Promise<any> {
  const result = await StorageFileManager.updateACL(input);
  t.is(result.status, expected);
}

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

test.serial(
  'createFolderResource',
  createResource,
  folderConfigurationResource,
  201
);

test.serial(
  'folderResourceExists',
  resourceExists,
  folderConfigurationResource.resource.path,
  200
);

test.serial(
  'folderResourceUpdateACL',
  updateACL,
  {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
      ...folderConfigurationResource.resource,
      isPublic: true
    }
  },
  201
);

test.serial(
  'deleteFolderResource',
  deleteResource,
  folderConfigurationResource,
  200
);

test.serial(
  'folderResourceDoesNotExist',
  resourceExists,
  fileConfigurationResource.resource.path,
  404
);

test.serial(
  'createFileResource',
  createResource,
  fileConfigurationResource,
  201
);

test.serial(
  'fileResourceExists',
  resourceExists,
  fileConfigurationResource.resource.path,
  200
);

test.serial(
  'fileResourceUpdateACL',
  updateACL,
  {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
      ...fileConfigurationResource.resource,
      isPublic: true
    }
  },
  201
);

test.serial(
  'deleteFileResource',
  deleteResource,
  fileConfigurationResource,
  200
);

test.serial(
  'fileResourceDoesNotExist',
  resourceExists,
  fileConfigurationResource.resource.path,
  404
);
