import test from 'ava';
import psl from 'psl';
import uuid from 'uuid';
import { StorageTestAuthenticationManager } from './auth-manager';
import { logger } from './common';
import {
  SOLID_PASSWORD,
  SOLID_PROVIDER_URL,
  SOLID_USERNAME,
  SOLID_WEBID
} from './constants';
import { StorageRdfManager } from './rdf-manager';
import {
  ResourceConfig,
  SolidResourceType,
  StorageFileManager
} from './storage-manager';

// tslint:disable

let session;

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf('//') > -1) {
    hostname = url.split('/')[2];
  } else {
    hostname = url.split('/')[0];
  }

  //find & remove port number
  hostname = hostname.split(':')[0];
  //find & remove "?"
  hostname = hostname.split('?')[0];

  return hostname;
}

const folderConfigurationResource: ResourceConfig = new ResourceConfig(
  {
    path:
      'https://' +
      SOLID_USERNAME.toLowerCase() +
      '.' +
      psl.get(extractHostname(SOLID_PROVIDER_URL)),
    title: uuid.v4(),
    type: SolidResourceType.Folder
  },
  SOLID_WEBID
);

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
  await StorageFileManager.createResource(folderConfigurationResource);
});

test.serial('testUpdateAppFolder', async t => {
  await StorageRdfManager.updateAppFolder(
    SOLID_WEBID,
    folderConfigurationResource.fullPath()
  );
  const fileContent = await StorageFileManager.getResource(
    SOLID_WEBID,
    undefined
  );
  t.assert(fileContent.includes(folderConfigurationResource.resource.title));
});

test.after(async () => {
  await StorageFileManager.deleteResource(folderConfigurationResource);
});
