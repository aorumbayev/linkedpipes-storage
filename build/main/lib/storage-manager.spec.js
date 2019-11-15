"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const uuid_1 = __importDefault(require("uuid"));
const auth_manager_1 = require("./auth-manager");
const common_1 = require("./common");
const constants_1 = require("./constants");
const storage_manager_1 = require("./storage-manager");
let session;
const fileConfigurationResource = new storage_manager_1.ResourceConfig({
    path: `https://tester2.lpapps.co:8443`,
    title: `${uuid_1.default.v4()}.txt`,
    type: storage_manager_1.SolidResourceType.File,
    contentType: 'text/plain',
    body: 'This is a test text file'
}, constants_1.SOLID_WEBID);
const fileConfigurationResourceRenamed = new storage_manager_1.ResourceConfig({
    path: fileConfigurationResource.resource.path,
    title: `${uuid_1.default.v4()}_renamed.txt`,
    type: fileConfigurationResource.resource.type
}, fileConfigurationResource.webID);
const folderConfigurationResource = new storage_manager_1.ResourceConfig({
    path: `https://tester2.lpapps.co:8443`,
    title: uuid_1.default.v4(),
    type: storage_manager_1.SolidResourceType.Folder
}, constants_1.SOLID_WEBID);
const folderConfigurationResourceRenamed = new storage_manager_1.ResourceConfig({
    path: folderConfigurationResource.resource.path,
    title: uuid_1.default.v4() + '_renamed',
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
async function updateACL(t, input, expected) {
    const result = await storage_manager_1.StorageFileManager.updateACL(input);
    t.is(result.status, expected);
}
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
ava_1.default.serial('renameFolderResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(folderConfigurationResource, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('renameSameFolderResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(folderConfigurationResourceRenamed, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('folderResourceDoesNotExists', resourceExists, folderConfigurationResource.fullPath(), 404);
ava_1.default.serial('folderResourceUpdateACL', updateACL, new storage_manager_1.AccessControlConfig(Object.assign(Object.assign({}, folderConfigurationResourceRenamed.resource), { isPublic: true }), [storage_manager_1.AccessControlNamespace.Read, storage_manager_1.AccessControlNamespace.Write], constants_1.SOLID_WEBID), 201);
ava_1.default.serial('deleteFolderResource', deleteResource, folderConfigurationResourceRenamed, 200);
ava_1.default.serial('folderResourceDoesNotExist', resourceExists, fileConfigurationResource.fullPath(), 404);
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
ava_1.default.serial('fileResourceUpdateACL', updateACL, new storage_manager_1.AccessControlConfig(Object.assign(Object.assign({}, fileConfigurationResourceRenamed.resource), { isPublic: true }), [storage_manager_1.AccessControlNamespace.Read, storage_manager_1.AccessControlNamespace.Write], constants_1.SOLID_WEBID), 201);
ava_1.default.serial('deleteFileResource', deleteResource, fileConfigurationResourceRenamed, 200);
ava_1.default.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResourceRenamed.fullPath(), 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLGdEQUF3QjtBQUN4QixpREFBa0U7QUFDbEUscUNBQWtDO0FBQ2xDLDJDQUtxQjtBQUNyQix1REFNMkI7QUFFM0IsSUFBSSxPQUFPLENBQUM7QUFFWixNQUFNLHlCQUF5QixHQUFtQixJQUFJLGdDQUFjLENBQ2xFO0lBQ0UsSUFBSSxFQUFFLGdDQUFnQztJQUN0QyxLQUFLLEVBQUUsR0FBRyxjQUFJLENBQUMsRUFBRSxFQUFFLE1BQU07SUFDekIsSUFBSSxFQUFFLG1DQUFpQixDQUFDLElBQUk7SUFDNUIsV0FBVyxFQUFFLFlBQVk7SUFDekIsSUFBSSxFQUFFLDBCQUEwQjtDQUNqQyxFQUNELHVCQUFXLENBQ1osQ0FBQztBQUVGLE1BQU0sZ0NBQWdDLEdBQW1CLElBQUksZ0NBQWMsQ0FDekU7SUFDRSxJQUFJLEVBQUUseUJBQXlCLENBQUMsUUFBUSxDQUFDLElBQUk7SUFDN0MsS0FBSyxFQUFFLEdBQUcsY0FBSSxDQUFDLEVBQUUsRUFBRSxjQUFjO0lBQ2pDLElBQUksRUFBRSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsSUFBSTtDQUM5QyxFQUNELHlCQUF5QixDQUFDLEtBQUssQ0FDaEMsQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQW1CLElBQUksZ0NBQWMsQ0FDcEU7SUFDRSxJQUFJLEVBQUUsZ0NBQWdDO0lBQ3RDLEtBQUssRUFBRSxjQUFJLENBQUMsRUFBRSxFQUFFO0lBQ2hCLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0NBQy9CLEVBQ0QsdUJBQVcsQ0FDWixDQUFDO0FBRUYsTUFBTSxrQ0FBa0MsR0FBbUIsSUFBSSxnQ0FBYyxDQUMzRTtJQUNFLElBQUksRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMs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