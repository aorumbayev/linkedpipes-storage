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
  AccessControlNamespace,
  ResourceConfig,
  SolidResourceType,
  StorageFileManager
} from './storage-manager';

let session;

const fileConfigurationResource: ResourceConfig = {
  resource: {
    path: `https://tester1.inrupt.net/${uuid.v4()}`,
    type: SolidResourceType.Folder,
    contentType: 'text/plain',
    body: 'This is a test text file'
  },
  webID: SOLID_WEBID
};

const fileConfigurationResourceRenamed: ResourceConfig = {
  resource: {
    path: fileConfigurationResource.resource.path + '_renamed',
    type: fileConfigurationResource.resource.type
  },
  webID: fileConfigurationResource.webID
};

const folderConfigurationResource: ResourceConfig = {
  resource: {
    path: `https://tester1.inrupt.net/${uuid.v4()}`,
    type: SolidResourceType.Folder
  },
  webID: SOLID_WEBID
};

const folderConfigurationResourceRenamed: ResourceConfig = {
  resource: {
    path: folderConfigurationResource.resource.path + '_renamed',
    type: folderConfigurationResource.resource.type
  },
  webID: folderConfigurationResource.webID
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
  folderConfigurationResource.resource.path,
  404
);

test.serial(
  'folderResourceUpdateACL',
  updateACL,
  {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
      ...folderConfigurationResourceRenamed.resource,
      isPublic: true
    }
  },
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

test.serial('updateRenamedFileResource', async t => {
  const updatedText = 'This is a test text file that was changed';
  await StorageFileManager.updateResource({
    resource: {
      path: fileConfigurationResourceRenamed.resource.path,
      type: SolidResourceType.Folder,
      contentType: 'text/plain',
      body: updatedText
    },
    webID: SOLID_WEBID
  });
  const updatedFileContent = await StorageFileManager.getResource(
    fileConfigurationResourceRenamed.resource.path
  );
  t.is(updatedFileContent, updatedText);
});

test.serial(
  'fileResourceDoesNotExists',
  resourceExists,
  fileConfigurationResource.resource.path,
  404
);

test.serial(
  'fileResourceUpdateACL',
  updateACL,
  {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
      ...fileConfigurationResourceRenamed.resource,
      isPublic: true
    }
  },
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
  fileConfigurationResourceRenamed.resource.path,
  404
);
