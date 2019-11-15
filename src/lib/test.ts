// tslint:disable:no-ex
// import * as $rdf from 'rdflib';
import auth from 'solid-auth-cli';
// import uuid from 'uuid';

import { StorageRdfManager } from './rdf-manager';

// const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

// const LPA = $rdf.Namespace('https://w3id.org/def/lpapps#');

// const store = $rdf.graph();
// const fetcher = new $rdf.Fetcher(store);
// const updater = new $rdf.UpdateManager(store);
// const requiresForceReload = false;

// async function update(
//   deletions: $rdf.Statement[],
//   insertions: $rdf.Statement[]
// ): Promise<any> {
//   try {
//     return updater.update(deletions, insertions, message => {
//       return Promise.resolve(message);
//     });
//   } catch (err) {
//     return Promise.reject(new Error('Could not update the document.'));
//   }
// }

// async function load(document: $rdf.NamedNode) {
//   const reloadRequired = requiresForceReload;
//   requiresForceReload = false;
//   try {
//     return fetcher.load(document, {
//       force: reloadRequired,
//       clearPreviousData: reloadRequired
//     });
//   } catch (err) {
//     return Promise.reject(new Error('Could not fetch the document.'));
//   }
// }

// async function updateResource(
//   resourceUrl: string,
//   insertions: $rdf.Statement[],
//   deletions: $rdf.Statement[]
// ): Promise<any> {
//   const resource = $rdf.sym(resourceUrl);
//   try {
//     await load(resource);
//     await update(deletions, insertions);
//     return Promise.resolve('Resource updated!');
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }

// async function updateAppFolder(
//   webId: string,
//   folderUrl: string
// ): Promise<boolean> {
//   const user = $rdf.sym(webId);
//   const predicate = $rdf.sym(LPA('lpStorage'));
//   const folder = $rdf.sym(folderUrl);
//   const profile = user.doc();
//   try {
//     await load(profile);
//   } catch (err) {
//     return false;
//   }
//   const ins = [$rdf.st(user, predicate, folder, profile)];
//   const del = store.statementsMatching(user, predicate, null, profile);
//   try {
//     await updateResource(profile.value, ins, del);
//   } catch (err) {
//     return false;
//   }
//   // this.registerChanges(profile);
//   return true;
// }

async function login(): Promise<any> {
  let session = await auth.currentSession();
  if (!session) {
    session = await auth.login({
      idp: 'https://lpapps.co:8443',
      password: 'Looper248!',
      username: 'tester2'
    });
  }
  StorageRdfManager.updateAppFolder(
    'https://tester2.lpapps.co:8443/profile/card#me',
    'https://tester2.lpapps.co:8443/linkedpipes'
  );
}

login();
