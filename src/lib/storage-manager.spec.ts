// tslint:disable
import test from 'ava';
import uuid from 'uuid';
import { StorageTestAuthenticationManager } from './auth-manager';
import { logger } from './common';
import {
  SOLID_PASSWORD,
  SOLID_PROVIDER_URL,
  SOLID_USERNAME,
  SOLID_WEBID
} from './constants';
import {
  ResourceConfig,
  SolidResourceType,
  StorageFileManager,
  AccessControlConfig,
  AccessControlNamespace
} from './storage-manager';

let session;

const fileConfigurationResource: ResourceConfig = new ResourceConfig(
  {
    path: `https://aorumbayev123.inrupt.net`,
    title: `${uuid.v4()}.txt`,
    type: SolidResourceType.File,
    contentType: 'text/plain',
    body: 'This is a test text file'
  },
  SOLID_WEBID
);

const fileConfigurationResourceRenamed: ResourceConfig = new ResourceConfig(
  {
    path: fileConfigurationResource.resource.path,
    title: fileConfigurationResource.fullPath() + `_renamed.txt`,
    type: fileConfigurationResource.resource.type
  },
  fileConfigurationResource.webID
);

const folderConfigurationResource: ResourceConfig = new ResourceConfig(
  {
    path: `https://aorumbayev123.inrupt.net`,
    title: uuid.v4(),
    type: SolidResourceType.Folder,
    isPublic: true
  },
  SOLID_WEBID
);

const folderConfigurationResourceRenamed: ResourceConfig = new ResourceConfig(
  {
    path: folderConfigurationResource.resource.path,
    title: folderConfigurationResource.resource.title + '_renamed',
    type: folderConfigurationResource.resource.type
  },
  folderConfigurationResource.webID
);

const folderInFolderResource: ResourceConfig = new ResourceConfig(
  {
    path: folderConfigurationResource.fullPath(),
    title: 'sub_folder',
    type: folderConfigurationResource.resource.type
  },
  folderConfigurationResource.webID
);

async function createResource(t: any, input: any, expected: any): Promise<any> {
  const result = await StorageFileManager.createResource(input);
  logger.info(result.text());
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
  session = await StorageTestAuthenticationManager.currentSession();
  if (!session) {
    session = await StorageTestAuthenticationManager.login({
      idp: SOLID_PROVIDER_URL,
      password: SOLID_PASSWORD,
      username: SOLID_USERNAME
    });
    logger.info('Authentication response: ', session.webID);
  }
});

test.serial(
  'createFolderResource',
  createResource,
  folderConfigurationResource,
  201
);

test.serial(
  'createFolderResourceAcl',
  updateACL,
  new AccessControlConfig(
    folderConfigurationResource.resource,
    [
      AccessControlNamespace.Read,
      AccessControlNamespace.Write,
      AccessControlNamespace.Control
    ],
    folderConfigurationResource.webID
  ),
  201
);

test.serial(
  'createFolderInFolder',
  createResource,
  folderInFolderResource,
  201
);

test.serial(
  'createFolderInFolderResourceAcl',
  updateACL,
  new AccessControlConfig(
    folderInFolderResource.resource,
    [
      AccessControlNamespace.Read,
      AccessControlNamespace.Write,
      AccessControlNamespace.Control
    ],
    folderInFolderResource.webID
  ),
  201
);

test.serial(
  'createFileResourceInFolderResourceInFolder',
  createResource,
  new ResourceConfig(
    {
      path: folderInFolderResource.fullPath(),
      title: 'testFile',
      type: SolidResourceType.File
    },
    folderConfigurationResource.webID
  ),
  201
);

test.serial('renameFolderResource', async t => {
  const response = await StorageFileManager.renameResource(
    folderConfigurationResource,
    folderConfigurationResourceRenamed
  );
  t.is(response.status, 200);
});

test.serial(
  'folderResourceDoesNotExist',
  resourceExists,
  folderConfigurationResource.fullPath(),
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
  fileConfigurationResource.fullPath(),
  200
);

test.serial('renameFileResource', async t => {
  const response = await StorageFileManager.renameResource(
    fileConfigurationResource,
    fileConfigurationResourceRenamed
  );
  t.is(response.status, 200);
});

test.serial('renameSameFileResource', async t => {
  const response = await StorageFileManager.renameResource(
    fileConfigurationResourceRenamed,
    fileConfigurationResourceRenamed
  );
  t.is(response.status, 200);
});

test.serial(
  'fileResourceDoesNotExists',
  resourceExists,
  fileConfigurationResource.fullPath(),
  404
);

test.serial(
  'deleteFileResource',
  deleteResource,
  fileConfigurationResourceRenamed,
  200
);

test.serial(
  'fileResourceDoesNotExist',
  resourceExists,
  fileConfigurationResourceRenamed.fullPath(),
  404
);
