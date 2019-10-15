// // tslint:disable:no-ex
// import auth from 'solid-auth-cli';
// import { SolidResourceType, StorageFileManager } from './storage-manager';

// // const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

// async function login() {
//   let session = await auth.currentSession();
//   if (!session) {
//     session = await auth.login({
//       idp: 'https://lpapps.co:8443',
//       password: 'Looper248!',
//       username: 'aorumbayev'
//     });
//   }

//   StorageFileManager.createOrUpdateResource({
//     webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
//     resource: {
//       type: SolidResourceType.Folder,
//       path: 'https://aorumbayev.lpapps.co:8443/linkedpipes111'
//     }
//   }).then(response => {
//     console.log(response);
//   });
// }

// login();
