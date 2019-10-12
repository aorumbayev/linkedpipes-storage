// tslint:disable:no-ex
import * as $rdf from 'rdflib';
import auth from 'solid-auth-client';
import { StorageFileManager, SolidResourceType } from './storage-manager';

const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

async function login(idp) {
  const session = await auth.currentSession();
  if (!session) await auth.login(idp);
}

login('https://lpapps.co:8443');

StorageFileManager.updateACL({
  webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
  controlModes: [ACL('READ'), ACL('WRITE')],
  resource: {
    type: SolidResourceType.Folder,
    path: 'https://aorumbayev.lpapps.co:8443/linkedpipes4/',
    isPublic: true
  }
});
