// // tslint:disable:no-ex
// // import * as $rdf from 'rdflib';
// import auth from 'solid-auth-cli';
// // import uuid from 'uuid';
// import {
//   ResourceConfig,
//   SolidResourceType,
//   StorageFileManager
// } from './storage-manager';
// // const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
// // const LPA = $rdf.Namespace('https://w3id.org/def/lpapps#');
// // const store = $rdf.graph();
// // const fetcher = new $rdf.Fetcher(store);
// // const updater = new $rdf.UpdateManager(store);
// // const requiresForceReload = false;
// // async function update(
// //   deletions: $rdf.Statement[],
// //   insertions: $rdf.Statement[]
// // ): Promise<any> {
// //   try {
// //     return updater.update(deletions, insertions, message => {
// //       return Promise.resolve(message);
// //     });
// //   } catch (err) {
// //     return Promise.reject(new Error('Could not update the document.'));
// //   }
// // }
// // async function load(document: $rdf.NamedNode) {
// //   const reloadRequired = requiresForceReload;
// //   requiresForceReload = false;
// //   try {
// //     return fetcher.load(document, {
// //       force: reloadRequired,
// //       clearPreviousData: reloadRequired
// //     });
// //   } catch (err) {
// //     return Promise.reject(new Error('Could not fetch the document.'));
// //   }
// // }
// // async function updateResource(
// //   resourceUrl: string,
// //   insertions: $rdf.Statement[],
// //   deletions: $rdf.Statement[]
// // ): Promise<any> {
// //   const resource = $rdf.sym(resourceUrl);
// //   try {
// //     await load(resource);
// //     await update(deletions, insertions);
// //     return Promise.resolve('Resource updated!');
// //   } catch (err) {
// //     return Promise.reject(err);
// //   }
// // }
// // async function updateAppFolder(
// //   webId: string,
// //   folderUrl: string
// // ): Promise<boolean> {
// //   const user = $rdf.sym(webId);
// //   const predicate = $rdf.sym(LPA('lpStorage'));
// //   const folder = $rdf.sym(folderUrl);
// //   const profile = user.doc();
// //   try {
// //     await load(profile);
// //   } catch (err) {
// //     return false;
// //   }
// //   const ins = [$rdf.st(user, predicate, folder, profile)];
// //   const del = store.statementsMatching(user, predicate, null, profile);
// //   try {
// //     await updateResource(profile.value, ins, del);
// //   } catch (err) {
// //     return false;
// //   }
// //   // this.registerChanges(profile);
// //   return true;
// // }
// async function login() {
//   let session = await auth.currentSession();
//   if (!session) {
//     session = await auth.login({
//       idp: 'https://lpapps.co:8443',
//       password: 'Looper248!',
//       username: 'tester2'
//     });
//   }
//   const folderConfigurationResource: ResourceConfig = {
//     resource: {
//       path: `https://tester2.lpapps.co:8443/testfolder7`,
//       type: SolidResourceType.Folder
//     },
//     webID: 'https://tester2.lpapps.co:8443/profile/card#me'
//   };
//   const folderConfigurationResource1: ResourceConfig = {
//     resource: {
//       path: `https://tester2.lpapps.co:8443/testfolder91`,
//       type: SolidResourceType.Folder
//     },
//     webID: 'https://tester2.lpapps.co:8443/profile/card#me'
//   };
//   const response = await StorageFileManager.copyResource(
//     folderConfigurationResource,
//     folderConfigurationResource1.resource.path
//   );
// }
// login();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSwwQkFBMEI7QUFDMUIscUNBQXFDO0FBQ3JDLHFDQUFxQztBQUNyQyw4QkFBOEI7QUFDOUIsV0FBVztBQUNYLG9CQUFvQjtBQUNwQix1QkFBdUI7QUFDdkIsdUJBQXVCO0FBQ3ZCLDhCQUE4QjtBQUU5QixtRUFBbUU7QUFFbkUsaUVBQWlFO0FBRWpFLGlDQUFpQztBQUNqQyw4Q0FBOEM7QUFDOUMsb0RBQW9EO0FBQ3BELHdDQUF3QztBQUV4Qyw0QkFBNEI7QUFDNUIsb0NBQW9DO0FBQ3BDLG9DQUFvQztBQUNwQyx1QkFBdUI7QUFDdkIsYUFBYTtBQUNiLG1FQUFtRTtBQUNuRSw0Q0FBNEM7QUFDNUMsYUFBYTtBQUNiLHVCQUF1QjtBQUN2Qiw2RUFBNkU7QUFDN0UsU0FBUztBQUNULE9BQU87QUFFUCxxREFBcUQ7QUFDckQsbURBQW1EO0FBQ25ELG9DQUFvQztBQUNwQyxhQUFhO0FBQ2IseUNBQXlDO0FBQ3pDLGtDQUFrQztBQUNsQyw2Q0FBNkM7QUFDN0MsYUFBYTtBQUNiLHVCQUF1QjtBQUN2Qiw0RUFBNEU7QUFDNUUsU0FBUztBQUNULE9BQU87QUFFUCxvQ0FBb0M7QUFDcEMsNEJBQTRCO0FBQzVCLHFDQUFxQztBQUNyQyxtQ0FBbUM7QUFDbkMsdUJBQXVCO0FBQ3ZCLCtDQUErQztBQUMvQyxhQUFhO0FBQ2IsK0JBQStCO0FBQy9CLDhDQUE4QztBQUM5QyxzREFBc0Q7QUFDdEQsdUJBQXVCO0FBQ3ZCLHFDQUFxQztBQUNyQyxTQUFTO0FBQ1QsT0FBTztBQUVQLHFDQUFxQztBQUNyQyxzQkFBc0I7QUFDdEIseUJBQXlCO0FBQ3pCLDJCQUEyQjtBQUMzQixxQ0FBcUM7QUFDckMscURBQXFEO0FBQ3JELDJDQUEyQztBQUMzQyxtQ0FBbUM7QUFDbkMsYUFBYTtBQUNiLDhCQUE4QjtBQUM5Qix1QkFBdUI7QUFDdkIsdUJBQXVCO0FBQ3ZCLFNBQVM7QUFDVCxnRUFBZ0U7QUFDaEUsNkVBQTZFO0FBQzdFLGFBQWE7QUFDYix3REFBd0Q7QUFDeEQsdUJBQXVCO0FBQ3ZCLHVCQUF1QjtBQUN2QixTQUFTO0FBQ1QseUNBQXlDO0FBQ3pDLG9CQUFvQjtBQUNwQixPQUFPO0FBRVAsMkJBQTJCO0FBQzNCLCtDQUErQztBQUMvQyxvQkFBb0I7QUFDcEIsbUNBQW1DO0FBQ25DLHVDQUF1QztBQUN2QyxnQ0FBZ0M7QUFDaEMsNEJBQTRCO0FBQzVCLFVBQVU7QUFDVixNQUFNO0FBQ04sMERBQTBEO0FBQzFELGtCQUFrQjtBQUNsQiw0REFBNEQ7QUFDNUQsdUNBQXVDO0FBQ3ZDLFNBQVM7QUFDVCw4REFBOEQ7QUFDOUQsT0FBTztBQUVQLDJEQUEyRDtBQUMzRCxrQkFBa0I7QUFDbEIsNkRBQTZEO0FBQzdELHVDQUF1QztBQUN2QyxTQUFTO0FBQ1QsOERBQThEO0FBQzlELE9BQU87QUFFUCw0REFBNEQ7QUFDNUQsbUNBQW1DO0FBQ25DLGlEQUFpRDtBQUNqRCxPQUFPO0FBQ1AsSUFBSTtBQUVKLFdBQVcifQ==