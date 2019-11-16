// // tslint:disable
// import test from 'ava';
// import uuid from 'uuid';
// import { StorageTestAuthenticationManager } from './auth-manager';
// import { logger } from './common';
// import {
//   SOLID_PASSWORD,
//   SOLID_PROVIDER_URL,
//   SOLID_USERNAME,
//   SOLID_WEBID
// } from './constants';
// import {
//   ResourceConfig,
//   SolidResourceType,
//   StorageFileManager
// } from './storage-manager';
// let session;
// const fileConfigurationResource: ResourceConfig = new ResourceConfig(
//   {
//     path: `https://lpstorage.inrupt.net`,
//     title: `${uuid.v4()}.txt`,
//     type: SolidResourceType.File,
//     contentType: 'text/plain',
//     body: 'This is a test text file'
//   },
//   SOLID_WEBID
// );
// const fileConfigurationResourceRenamed: ResourceConfig = new ResourceConfig(
//   {
//     path: fileConfigurationResource.resource.path,
//     title: fileConfigurationResource.fullPath() + `_renamed.txt`,
//     type: fileConfigurationResource.resource.type
//   },
//   fileConfigurationResource.webID
// );
// const folderConfigurationResource: ResourceConfig = new ResourceConfig(
//   {
//     path: `https://lpstorage.inrupt.net`,
//     title: uuid.v4(),
//     type: SolidResourceType.Folder
//   },
//   SOLID_WEBID
// );
// const folderConfigurationResourceRenamed: ResourceConfig = new ResourceConfig(
//   {
//     path: folderConfigurationResource.resource.path,
//     title: folderConfigurationResource.resource.title + '_renamed',
//     type: folderConfigurationResource.resource.type
//   },
//   folderConfigurationResource.webID
// );
// async function createResource(t: any, input: any, expected: any): Promise<any> {
//   const result = await StorageFileManager.createResource(input);
//   logger.info(result.text());
//   t.is(result.status, expected);
// }
// async function deleteResource(t: any, input: any, expected: any): Promise<any> {
//   const result = await StorageFileManager.deleteResource(input);
//   t.is(result.status, expected);
// }
// async function resourceExists(t: any, input: any, expected: any): Promise<any> {
//   const result = await StorageFileManager.resourceExists(input);
//   t.is(result.status, expected);
// }
// // async function updateACL(t: any, input: any, expected: any): Promise<any> {
// //   const result = await StorageFileManager.updateACL(input);
// //   t.is(result.status, expected);
// // }
// test.before(async () => {
//   session = await StorageTestAuthenticationManager.currentSession();
//   if (!session) {
//     session = await StorageTestAuthenticationManager.login({
//       idp: SOLID_PROVIDER_URL,
//       password: SOLID_PASSWORD,
//       username: SOLID_USERNAME
//     });
//     logger.info('Authentication response: ', session.webID);
//   }
// });
// test.serial(
//   'createFolderResource',
//   createResource,
//   folderConfigurationResource,
//   201
// );
// test.serial(
//   'folderResourceExists',
//   resourceExists,
//   folderConfigurationResource.fullPath(),
//   200
// );
// test.serial(
//   'createFolderResourceInFolder',
//   createResource,
//   new ResourceConfig(
//     {
//       path: folderConfigurationResource.fullPath(),
//       title: 'testFolder',
//       type: SolidResourceType.Folder
//     },
//     folderConfigurationResource.webID
//   ),
//   201
// );
// test.serial(
//   'createFileResourceInFolderResourceInFolder',
//   createResource,
//   new ResourceConfig(
//     {
//       path: folderConfigurationResource.fullPath() + '/testFolder',
//       title: 'testFile',
//       type: SolidResourceType.File
//     },
//     folderConfigurationResource.webID
//   ),
//   201
// );
// test.serial('renameFolderResource', async t => {
//   const response = await StorageFileManager.renameResource(
//     folderConfigurationResource,
//     folderConfigurationResourceRenamed
//   );
//   t.is(response.status, 200);
// });
// test.serial(
//   'folderResourceDoesNotExists',
//   resourceExists,
//   folderConfigurationResource.fullPath(),
//   404
// );
// test.serial(
//   'deleteFolderResource',
//   deleteResource,
//   folderConfigurationResourceRenamed,
//   200
// );
// test.serial(
//   'folderResourceDoesNotExist',
//   resourceExists,
//   folderConfigurationResourceRenamed.fullPath(),
//   404
// );
// test.serial(
//   'createFileResource',
//   createResource,
//   fileConfigurationResource,
//   201
// );
// test.serial(
//   'fileResourceExists',
//   resourceExists,
//   fileConfigurationResource.fullPath(),
//   200
// );
// test.serial('renameFileResource', async t => {
//   const response = await StorageFileManager.renameResource(
//     fileConfigurationResource,
//     fileConfigurationResourceRenamed
//   );
//   t.is(response.status, 200);
// });
// test.serial('renameSameFileResource', async t => {
//   const response = await StorageFileManager.renameResource(
//     fileConfigurationResourceRenamed,
//     fileConfigurationResourceRenamed
//   );
//   t.is(response.status, 200);
// });
// test.serial(
//   'fileResourceDoesNotExists',
//   resourceExists,
//   fileConfigurationResource.fullPath(),
//   404
// );
// test.serial(
//   'deleteFileResource',
//   deleteResource,
//   fileConfigurationResourceRenamed,
//   200
// );
// test.serial(
//   'fileResourceDoesNotExist',
//   resourceExists,
//   fileConfigurationResourceRenamed.fullPath(),
//   404
// );
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvc3RvcmFnZS1tYW5hZ2VyLi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsMEJBQTBCO0FBQzFCLDJCQUEyQjtBQUMzQixxRUFBcUU7QUFDckUscUNBQXFDO0FBQ3JDLFdBQVc7QUFDWCxvQkFBb0I7QUFDcEIsd0JBQXdCO0FBQ3hCLG9CQUFvQjtBQUNwQixnQkFBZ0I7QUFDaEIsd0JBQXdCO0FBQ3hCLFdBQVc7QUFDWCxvQkFBb0I7QUFDcEIsdUJBQXVCO0FBQ3ZCLHVCQUF1QjtBQUN2Qiw4QkFBOEI7QUFFOUIsZUFBZTtBQUVmLHdFQUF3RTtBQUN4RSxNQUFNO0FBQ04sNENBQTRDO0FBQzVDLGlDQUFpQztBQUNqQyxvQ0FBb0M7QUFDcEMsaUNBQWlDO0FBQ2pDLHVDQUF1QztBQUN2QyxPQUFPO0FBQ1AsZ0JBQWdCO0FBQ2hCLEtBQUs7QUFFTCwrRUFBK0U7QUFDL0UsTUFBTTtBQUNOLHFEQUFxRDtBQUNyRCxvRUFBb0U7QUFDcEUsb0RBQW9EO0FBQ3BELE9BQU87QUFDUCxvQ0FBb0M7QUFDcEMsS0FBSztBQUVMLDBFQUEwRTtBQUMxRSxNQUFNO0FBQ04sNENBQTRDO0FBQzVDLHdCQUF3QjtBQUN4QixxQ0FBcUM7QUFDckMsT0FBTztBQUNQLGdCQUFnQjtBQUNoQixLQUFLO0FBRUwsaUZBQWlGO0FBQ2pGLE1BQU07QUFDTix1REFBdUQ7QUFDdkQsc0VBQXNFO0FBQ3RFLHNEQUFzRDtBQUN0RCxPQUFPO0FBQ1Asc0NBQXNDO0FBQ3RDLEtBQUs7QUFFTCxtRkFBbUY7QUFDbkYsbUVBQW1FO0FBQ25FLGdDQUFnQztBQUNoQyxtQ0FBbUM7QUFDbkMsSUFBSTtBQUVKLG1GQUFtRjtBQUNuRixtRUFBbUU7QUFDbkUsbUNBQW1DO0FBQ25DLElBQUk7QUFFSixtRkFBbUY7QUFDbkYsbUVBQW1FO0FBQ25FLG1DQUFtQztBQUNuQyxJQUFJO0FBRUosaUZBQWlGO0FBQ2pGLGlFQUFpRTtBQUVqRSxzQ0FBc0M7QUFDdEMsT0FBTztBQUVQLDRCQUE0QjtBQUM1Qix1RUFBdUU7QUFDdkUsb0JBQW9CO0FBQ3BCLCtEQUErRDtBQUMvRCxpQ0FBaUM7QUFDakMsa0NBQWtDO0FBQ2xDLGlDQUFpQztBQUNqQyxVQUFVO0FBQ1YsK0RBQStEO0FBQy9ELE1BQU07QUFDTixNQUFNO0FBRU4sZUFBZTtBQUNmLDRCQUE0QjtBQUM1QixvQkFBb0I7QUFDcEIsaUNBQWlDO0FBQ2pDLFFBQVE7QUFDUixLQUFLO0FBRUwsZUFBZTtBQUNmLDRCQUE0QjtBQUM1QixvQkFBb0I7QUFDcEIsNENBQTRDO0FBQzVDLFFBQVE7QUFDUixLQUFLO0FBRUwsZUFBZTtBQUNmLG9DQUFvQztBQUNwQyxvQkFBb0I7QUFDcEIsd0JBQXdCO0FBQ3hCLFFBQVE7QUFDUixzREFBc0Q7QUFDdEQsNkJBQTZCO0FBQzdCLHVDQUF1QztBQUN2QyxTQUFTO0FBQ1Qsd0NBQXdDO0FBQ3hDLE9BQU87QUFDUCxRQUFRO0FBQ1IsS0FBSztBQUVMLGVBQWU7QUFDZixrREFBa0Q7QUFDbEQsb0JBQW9CO0FBQ3BCLHdCQUF3QjtBQUN4QixRQUFRO0FBQ1Isc0VBQXNFO0FBQ3RFLDJCQUEyQjtBQUMzQixxQ0FBcUM7QUFDckMsU0FBUztBQUNULHdDQUF3QztBQUN4QyxPQUFPO0FBQ1AsUUFBUTtBQUNSLEtBQUs7QUFFTCxtREFBbUQ7QUFDbkQsOERBQThEO0FBQzlELG1DQUFtQztBQUNuQyx5Q0FBeUM7QUFDekMsT0FBTztBQUNQLGdDQUFnQztBQUNoQyxNQUFNO0FBRU4sZUFBZTtBQUNmLG1DQUFtQztBQUNuQyxvQkFBb0I7QUFDcEIsNENBQTRDO0FBQzVDLFFBQVE7QUFDUixLQUFLO0FBRUwsZUFBZTtBQUNmLDRCQUE0QjtBQUM1QixvQkFBb0I7QUFDcEIsd0NBQXdDO0FBQ3hDLFFBQVE7QUFDUixLQUFLO0FBRUwsZUFBZTtBQUNmLGtDQUFrQztBQUNsQyxvQkFBb0I7QUFDcEIsbURBQW1EO0FBQ25ELFFBQVE7QUFDUixLQUFLO0FBRUwsZUFBZTtBQUNmLDBCQUEwQjtBQUMxQixvQkFBb0I7QUFDcEIsK0JBQStCO0FBQy9CLFFBQVE7QUFDUixLQUFLO0FBRUwsZUFBZTtBQUNmLDBCQUEwQjtBQUMxQixvQkFBb0I7QUFDcEIsMENBQTBDO0FBQzFDLFFBQVE7QUFDUixLQUFLO0FBRUwsaURBQWlEO0FBQ2pELDhEQUE4RDtBQUM5RCxpQ0FBaUM7QUFDakMsdUNBQXVDO0FBQ3ZDLE9BQU87QUFDUCxnQ0FBZ0M7QUFDaEMsTUFBTTtBQUVOLHFEQUFxRDtBQUNyRCw4REFBOEQ7QUFDOUQsd0NBQXdDO0FBQ3hDLHVDQUF1QztBQUN2QyxPQUFPO0FBQ1AsZ0NBQWdDO0FBQ2hDLE1BQU07QUFFTixlQUFlO0FBQ2YsaUNBQWlDO0FBQ2pDLG9CQUFvQjtBQUNwQiwwQ0FBMEM7QUFDMUMsUUFBUTtBQUNSLEtBQUs7QUFFTCxlQUFlO0FBQ2YsMEJBQTBCO0FBQzFCLG9CQUFvQjtBQUNwQixzQ0FBc0M7QUFDdEMsUUFBUTtBQUNSLEtBQUs7QUFFTCxlQUFlO0FBQ2YsZ0NBQWdDO0FBQ2hDLG9CQUFvQjtBQUNwQixpREFBaUQ7QUFDakQsUUFBUTtBQUNSLEtBQUsifQ==