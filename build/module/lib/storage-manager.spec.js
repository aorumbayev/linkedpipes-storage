// tslint:disable
import test from 'ava';
import uuid from 'uuid';
import { StorageTestAuthenticationManager } from './auth-manager';
import { logger } from './common';
import { SOLID_PASSWORD, SOLID_PROVIDER_URL, SOLID_USERNAME, SOLID_WEBID } from './constants';
import { ResourceConfig, SolidResourceType, StorageFileManager } from './storage-manager';
let session;
const fileConfigurationResource = new ResourceConfig({
    path: `https://lpstorage.inrupt.net`,
    title: `${uuid.v4()}.txt`,
    type: SolidResourceType.File,
    contentType: 'text/plain',
    body: 'This is a test text file'
}, SOLID_WEBID);
const fileConfigurationResourceRenamed = new ResourceConfig({
    path: fileConfigurationResource.resource.path,
    title: fileConfigurationResource.fullPath() + `_renamed.txt`,
    type: fileConfigurationResource.resource.type
}, fileConfigurationResource.webID);
const folderConfigurationResource = new ResourceConfig({
    path: `https://lpstorage.inrupt.net`,
    title: uuid.v4(),
    type: SolidResourceType.Folder
}, SOLID_WEBID);
const folderConfigurationResourceRenamed = new ResourceConfig({
    path: folderConfigurationResource.resource.path,
    title: folderConfigurationResource.resource.title + '_renamed',
    type: folderConfigurationResource.resource.type
}, folderConfigurationResource.webID);
async function createResource(t, input, expected) {
    const result = await StorageFileManager.createResource(input);
    logger.info(result.text());
    t.is(result.status, expected);
}
async function deleteResource(t, input, expected) {
    const result = await StorageFileManager.deleteResource(input);
    t.is(result.status, expected);
}
async function resourceExists(t, input, expected) {
    const result = await StorageFileManager.resourceExists(input);
    t.is(result.status, expected);
}
// async function updateACL(t: any, input: any, expected: any): Promise<any> {
//   const result = await StorageFileManager.updateACL(input);
//   t.is(result.status, expected);
// }
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
test.serial('createFolderResource', createResource, folderConfigurationResource, 201);
test.serial('folderResourceExists', resourceExists, folderConfigurationResource.fullPath(), 200);
test.serial('createFolderResourceInFolder', createResource, new ResourceConfig({
    path: folderConfigurationResource.fullPath(),
    title: 'testFolder',
    type: SolidResourceType.Folder
}, folderConfigurationResource.webID), 201);
test.serial('createFileResourceInFolderResourceInFolder', createResource, new ResourceConfig({
    path: folderConfigurationResource.fullPath() + '/testFolder',
    title: 'testFile',
    type: SolidResourceType.File
}, folderConfigurationResource.webID), 201);
test.serial('renameFolderResource', async (t) => {
    const response = await StorageFileManager.renameResource(folderConfigurationResource, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
test.serial('folderResourceDoesNotExists', resourceExists, folderConfigurationResource.fullPath(), 404);
test.serial('deleteFolderResource', deleteResource, folderConfigurationResourceRenamed, 200);
test.serial('folderResourceDoesNotExist', resourceExists, folderConfigurationResourceRenamed.fullPath(), 404);
test.serial('createFileResource', createResource, fileConfigurationResource, 201);
test.serial('fileResourceExists', resourceExists, fileConfigurationResource.fullPath(), 200);
test.serial('renameFileResource', async (t) => {
    const response = await StorageFileManager.renameResource(fileConfigurationResource, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
test.serial('renameSameFileResource', async (t) => {
    const response = await StorageFileManager.renameResource(fileConfigurationResourceRenamed, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
test.serial('fileResourceDoesNotExists', resourceExists, fileConfigurationResource.fullPath(), 404);
test.serial('deleteFileResource', deleteResource, fileConfigurationResourceRenamed, 200);
test.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResourceRenamed.fullPath(), 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlCQUFpQjtBQUNqQixPQUFPLElBQUksTUFBTSxLQUFLLENBQUM7QUFDdkIsT0FBTyxJQUFJLE1BQU0sTUFBTSxDQUFDO0FBQ3hCLE9BQU8sRUFBRSxnQ0FBZ0MsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxVQUFVLENBQUM7QUFDbEMsT0FBTyxFQUNMLGNBQWMsRUFDZCxrQkFBa0IsRUFDbEIsY0FBYyxFQUNkLFdBQVcsRUFDWixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQ0wsY0FBYyxFQUNkLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbkIsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQixJQUFJLE9BQU8sQ0FBQztBQUVaLE1BQU0seUJBQXlCLEdBQW1CLElBQUksY0FBYyxDQUNsRTtJQUNFLElBQUksRUFBRSw4QkFBOEI7SUFDcEMsS0FBSyxFQUFFLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNO0lBQ3pCLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO0lBQzVCLFdBQVcsRUFBRSxZQUFZO0lBQ3pCLElBQUksRUFBRSwwQkFBMEI7Q0FDakMsRUFDRCxXQUFXLENBQ1osQ0FBQztBQUVGLE1BQU0sZ0NBQWdDLEdBQW1CLElBQUksY0FBYyxDQUN6RTtJQUNFLElBQUksRUFBRSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsSUFBSTtJQUM3QyxLQUFLLEVBQUUseUJBQXlCLENBQUMsUUFBUSxFQUFFLEdBQUcsY0FBYztJQUM1RCxJQUFJLEVBQUUseUJBQXlCLENBQUMsUUFBUSxDQUFDLElBQUk7Q0FDOUMsRUFDRCx5QkFBeUIsQ0FBQyxLQUFLLENBQ2hDLENBQUM7QUFFRixNQUFNLDJCQUEy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