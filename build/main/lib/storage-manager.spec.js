"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
const ava_1 = __importDefault(require("ava"));
const uuid_1 = __importDefault(require("uuid"));
const auth_manager_1 = require("./auth-manager");
const common_1 = require("./common");
const constants_1 = require("./constants");
const storage_manager_1 = require("./storage-manager");
let session;
const fileConfigurationResource = new storage_manager_1.ResourceConfig({
    path: `https://lpstorage.inrupt.net`,
    title: `${uuid_1.default.v4()}.txt`,
    type: storage_manager_1.SolidResourceType.File,
    contentType: 'text/plain',
    body: 'This is a test text file'
}, constants_1.SOLID_WEBID);
const fileConfigurationResourceRenamed = new storage_manager_1.ResourceConfig({
    path: fileConfigurationResource.resource.path,
    title: fileConfigurationResource.fullPath() + `_renamed.txt`,
    type: fileConfigurationResource.resource.type
}, fileConfigurationResource.webID);
const folderConfigurationResource = new storage_manager_1.ResourceConfig({
    path: `https://lpstorage.inrupt.net`,
    title: uuid_1.default.v4(),
    type: storage_manager_1.SolidResourceType.Folder
}, constants_1.SOLID_WEBID);
const folderConfigurationResourceRenamed = new storage_manager_1.ResourceConfig({
    path: folderConfigurationResource.resource.path,
    title: folderConfigurationResource.resource.title + '_renamed',
    type: folderConfigurationResource.resource.type
}, folderConfigurationResource.webID);
async function createResource(t, input, expected) {
    const result = await storage_manager_1.StorageFileManager.createResource(input);
    common_1.logger.info(result.text());
    t.is(result.status, expected);
}
async function deleteResource(t, input, expected) {
    const result = await storage_manager_1.StorageFileManager.deleteResource(input);
    t.is(result.status, expected);
}
async function resourceExists(t, input, expected) {
    const result = await storage_manager_1.StorageFileManager.resourceExists(input);
    t.is(result.status, expected);
}
// async function updateACL(t: any, input: any, expected: any): Promise<any> {
//   const result = await StorageFileManager.updateACL(input);
//   t.is(result.status, expected);
// }
ava_1.default.before(async () => {
    session = await auth_manager_1.StorageTestAuthenticationManager.currentSession();
    if (!session) {
        session = await auth_manager_1.StorageTestAuthenticationManager.login({
            idp: constants_1.SOLID_PROVIDER_URL,
            password: constants_1.SOLID_PASSWORD,
            username: constants_1.SOLID_USERNAME
        });
        common_1.logger.info('Authentication response: ', session.webID);
    }
});
ava_1.default.serial('createFolderResource', createResource, folderConfigurationResource, 201);
ava_1.default.serial('folderResourceExists', resourceExists, folderConfigurationResource.fullPath(), 200);
ava_1.default.serial('createFolderResourceInFolder', createResource, new storage_manager_1.ResourceConfig({
    path: folderConfigurationResource.fullPath(),
    title: 'testFolder',
    type: storage_manager_1.SolidResourceType.Folder
}, folderConfigurationResource.webID), 201);
ava_1.default.serial('createFileResourceInFolderResourceInFolder', createResource, new storage_manager_1.ResourceConfig({
    path: folderConfigurationResource.fullPath() + '/testFolder',
    title: 'testFile',
    type: storage_manager_1.SolidResourceType.File
}, folderConfigurationResource.webID), 201);
ava_1.default.serial('renameFolderResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(folderConfigurationResource, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('folderResourceDoesNotExists', resourceExists, folderConfigurationResource.fullPath(), 404);
ava_1.default.serial('deleteFolderResource', deleteResource, folderConfigurationResourceRenamed, 200);
ava_1.default.serial('folderResourceDoesNotExist', resourceExists, folderConfigurationResourceRenamed.fullPath(), 404);
ava_1.default.serial('createFileResource', createResource, fileConfigurationResource, 201);
ava_1.default.serial('fileResourceExists', resourceExists, fileConfigurationResource.fullPath(), 200);
ava_1.default.serial('renameFileResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(fileConfigurationResource, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('renameSameFileResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(fileConfigurationResourceRenamed, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('fileResourceDoesNotExists', resourceExists, fileConfigurationResource.fullPath(), 404);
ava_1.default.serial('deleteFileResource', deleteResource, fileConfigurationResourceRenamed, 200);
ava_1.default.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResourceRenamed.fullPath(), 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaUJBQWlCO0FBQ2pCLDhDQUF1QjtBQUN2QixnREFBd0I7QUFDeEIsaURBQWtFO0FBQ2xFLHFDQUFrQztBQUNsQywyQ0FLcUI7QUFDckIsdURBSTJCO0FBRTNCLElBQUksT0FBTyxDQUFDO0FBRVosTUFBTSx5QkFBeUIsR0FBbUIsSUFBSSxnQ0FBYyxDQUNsRTtJQUNFLElBQUksRUFBRSw4QkFBOEI7SUFDcEMsS0FBSyxFQUFFLEdBQUcsY0FBSSxDQUFDLEVBQUUsRUFBRSxNQUFNO0lBQ3pCLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxJQUFJO0lBQzVCLFdBQVcsRUFBRSxZQUFZO0lBQ3pCLElBQUksRUFBRSwwQkFBMEI7Q0FDakMsRUFDRCx1QkFBVyxDQUNaLENBQUM7QUFFRixNQUFNLGdDQUFnQyxHQUFtQixJQUFJLGdDQUFjLENBQ3pFO0lBQ0UsSUFBSSxFQUFFLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxJQUFJO0lBQzdDLEtBQUssRUFBRSx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsR0FBRyxjQUFjO0lBQzVELElBQUksRUFBRSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsSUFBSTtDQUM5QyxFQUNELHlCQUF5QixDQUFDLEtBQUssQ0FDaEMsQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQW1CLElBQUksZ0NBQWMsQ0FDcEU7SUFDRSxJQUFJLEVBQUUsOEJBQThCO0lBQ3BDLEtBQUssRUFBRSxjQUFJLENBQUMsRUFBRSxFQUFFO0lBQ2hCLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0NBQy9CLEVBQ0QsdUJBQVcsQ0FDWixDQUFDO0FBRUYsTUFBTSxrQ0FBa0MsR0FBbUIsSUFBSSxnQ0FBYyxDQUMzRTtJQUNFLElBQUksRUFBRSwyQkFBMkIs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