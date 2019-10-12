// tslint:disable:no-ex
import * as $rdf from 'rdflib';
import auth from 'solid-auth-client';
import { StorageFileManager, SolidResourceType } from './storage-manager';

const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

async function login() {
  let session = await auth.currentSession();
  let popupUri = 'https://solid.community/common/popup.html';
  if (!session) session = await auth.popupLogin({ popupUri });

  StorageFileManager.updateACL({
    webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
    controlModes: [ACL('READ'), ACL('WRITE')],
    resource: {
      type: SolidResourceType.Folder,
      path: 'https://aorumbayev.lpapps.co:8443/linkedpipes43/',
      isPublic: true
    }
  }).then(response => {
    console.log(response);
  });
}

login();
