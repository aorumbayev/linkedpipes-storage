import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import {
  SOLID_PASSWORD,
  SOLID_PROVIDER_URL,
  SOLID_USERNAME,
  SOLID_WEBID
} from './constants';
import {
  AccessControlConfig,
  AccessControlNamespace,
  ResourceConfig,
  SolidResourceType,
  StorageFileManager
} from './storage-manager';

let session;

const fileConfigurationResource: ResourceConfig = new ResourceConfig(
  {
    path: `https://tester2.lpapps.co:8443`,
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
    title: `${uuid.v4()}_renamed.txt`,
    type: fileConfigurationResource.resource.type
  },
  fileConfigurationResource.webID
);

const folderConfigurationResource: ResourceConfig = new ResourceConfig(
  {
    path: `https://tester2.lpapps.co:8443`,
    title: uuid.v4(),
    type: SolidResourceType.Folder
  },
  SOLID_WEBID
);

const folderConfigurationResourceRenamed: ResourceConfig = new ResourceConfig(
  {
    path: folderConfigurationResource.resource.path,
    title: uuid.v4() + '_renamed',
    type: folderConfigurationResource.resource.type
  },
  folderConfigurationResource.webID
);

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
  folderConfigurationResource.fullPath(),
  200
);

test.serial('renameFolderResource', async t => {
  const response = await StorageFileManager.renameResource(
    folderConfigurationResource,
    folderConfigurationResourceRenamed
  );
  t.is(response.status, 200);
});

test.serial('renameSameFolderResource', async t => {
  const response = await StorageFileManager.renameResource(
    folderConfigurationResourceRenamed,
    folderConfigurationResourceRenamed
  );
  t.is(response.status, 200);
});

test.serial(
  'folderResourceDoesNotExists',
  resourceExists,
  folderConfigurationResource.fullPath(),
  404
);

test.serial(
  'folderResourceUpdateACL',
  updateACL,
  new AccessControlConfig(
    {
      ...folderConfigurationResourceRenamed.resource,
      isPublic: true
    },
    [AccessControlNamespace.Read, AccessControlNamespace.Write],
    SOLID_WEBID
  ),
  201
);

test.serial(
  'deleteFolderResource',
  deleteResource,
  folderConfigurationResourceRenamed,
  200
);

test.serial(
  'folderResourceDoesNotExist',
  resourceExists,
  fileConfigurationResource.fullPath(),
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
  'fileResourceUpdateACL',
  updateACL,
  new AccessControlConfig(
    {
      ...fileConfigurationResourceRenamed.resource,
      isPublic: true
    },
    [AccessControlNamespace.Read, AccessControlNamespace.Write],
    SOLID_WEBID
  ),
  201
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
