"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const solid_auth_cli_1 = __importDefault(require("solid-auth-cli"));
const uuid_1 = __importDefault(require("uuid"));
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
    session = await solid_auth_cli_1.default.currentSession();
    if (!session) {
        session = await solid_auth_cli_1.default.login({
            idp: constants_1.SOLID_PROVIDER_URL,
            password: constants_1.SOLID_PASSWORD,
            username: constants_1.SOLID_USERNAME
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9FQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsMkNBS3FCO0FBQ3JCLHVEQU0yQjtBQUUzQixJQUFJLE9BQU8sQ0FBQztBQUVaLE1BQU0seUJBQXlCLEdBQW1CLElBQUksZ0NBQWMsQ0FDbEU7SUFDRSxJQUFJLEVBQUUsZ0NBQWdDO0lBQ3RDLEtBQUssRUFBRSxHQUFHLGNBQUksQ0FBQyxFQUFFLEVBQUUsTUFBTTtJQUN6QixJQUFJLEVBQUUsbUNBQWlCLENBQUMsSUFBSTtJQUM1QixXQUFXLEVBQUUsWUFBWTtJQUN6QixJQUFJLEVBQUUsMEJBQTBCO0NBQ2pDLEVBQ0QsdUJBQVcsQ0FDWixDQUFDO0FBRUYsTUFBTSxnQ0FBZ0MsR0FBbUIsSUFBSSxnQ0FBYyxDQUN6RTtJQUNFLElBQUksRUFBRSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsSUFBSTtJQUM3QyxLQUFLLEVBQUUsR0FBRyxjQUFJLENBQUMsRUFBRSxFQUFFLGNBQWM7SUFDakMsSUFBSSxFQUFFLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxJQUFJO0NBQzlDLEVBQ0QseUJBQXlCLENBQUMsS0FBSyxDQUNoQyxDQUFDO0FBRUYsTUFBTSwyQkFBMkIsR0FBbUIsSUFBSSxnQ0FBYyxDQUNwRTtJQUNFLElBQUksRUFBRSxnQ0FBZ0M7SUFDdEMsS0FBSyxFQUFFLGNBQUksQ0FBQyxFQUFFLEVBQUU7SUFDaEIsSUFBSSxFQUFFLG1DQUFpQixDQUFDLE1BQU07Q0FDL0IsRUFDRCx1QkFBVyxDQUNaLENBQUM7QUFFRixNQUFNLGtDQUFrQyxHQUFtQixJQUFJLGdDQUFjLENBQzNFO0lBQ0UsSUFBSSxFQUFFLDJCQUEyQixDQUFDLFFBQVEsQ0FBQyxJQUFJO0lBQy9DLEtBQUssRUFBRSxjQUFJLENBQUMsRUFBRSxFQUFFLEdBQUcsVUFBVTtJQUM3QixJQUFJLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxDQUFDLElBQUk7Q0FDaEQsRUFDRCwyQkFBMkIsQ0FBQyxLQUFLLENBQ2xDLENBQUM7QUFFRixLQUFLLFVBQVUsY0FBYyxDQUFDLENBQU0sRUFBRSxLQUFVLEVBQUUsUUFBYTtJQUM3RCxNQUFNLE1BQU0sR0FBRyxNQUFNLG9DQUFrQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVELEtBQUssVUFBVSxjQUFjLENBQUMsQ0FBTSxFQUFFLEtBQVUsRUFBRSxRQUFhO0lBQzdELE1BQU0sTUFBTSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQsS0FBSyxVQUFVLGNBQWMsQ0FBQyxDQUFNLEVBQUUsS0FBVSxFQUFFLFFBQWE7SUFDN0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxLQUFLLFVBQVUsU0FBUyxDQUFDLENBQU0sRUFBRSxLQUFVLEVBQUUsUUFBYTtJQUN4RCxNQUFNLE1BQU0sR0FBRyxNQUFNLG9DQUFrQixDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUV6RCxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVELGFBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDckIsT0FBTyxHQUFHLE1BQU0sd0JBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osT0FBTyxHQUFHLE1BQU0sd0JBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsR0FBRyxFQUFFLDhCQUFrQjtZQUN2QixRQUFRLEVBQUUsMEJBQWM7WUFDeEIsUUFBUSxFQUFFLDBCQUFjO1NBQ3pCLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsTUFBTSxDQUNULHNCQUFzQixFQUN0QixjQUFjLEVBQ2QsMkJBQTJCLEVBQzNCLEdBQUcsQ0FDSixDQUFDO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FDVCxzQkFBc0IsRUFDdEIsY0FBYyxFQUNkLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxFQUN0QyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzVDLE1BQU0sUUFBUSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUN0RCwyQkFBMkIsRUFDM0Isa0NBQWtDLENBQ25DLENBQUM7SUFDRixDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsTUFBTSxDQUFDLDBCQUEwQixFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUNoRCxNQUFNLFFBQVEsR0FBRyxNQUFNLG9DQUFrQixDQUFDLGNBQWMsQ0FDdEQsa0NBQWtDLEVBQ2xDLGtDQUFrQyxDQUNuQyxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FDVCw2QkFBNkIsRUFDN0IsY0FBYyxFQUNkLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxFQUN0QyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQ1QseUJBQXlCLEVBQ3pCLFNBQVMsRUFDVCxJQUFJLHFDQUFtQixpQ0FFaEIsa0NBQWtDLENBQUMsUUFBUSxLQUM5QyxRQUFRLEVBQUUsSUFBSSxLQUVoQixDQUFDLHdDQUFzQixDQUFDLElBQUksRUFBRSx3Q0FBc0IsQ0FBQyxLQUFLLENBQUMsRUFDM0QsdUJBQVcsQ0FDWixFQUNELEdBQUcsQ0FDSixDQUFDO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FDVCxzQkFBc0IsRUFDdEIsY0FBYyxFQUNkLGtDQUFrQyxFQUNsQyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQ1QsNEJBQTRCLEVBQzVCLGNBQWMsRUFDZCx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsRUFDcEMsR0FBRyxDQUNKLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUNULG9CQUFvQixFQUNwQixjQUFjLEVBQ2QseUJBQXlCLEVBQ3pCLEdBQUcsQ0FDSixDQUFDO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FDVCxvQkFBb0IsRUFDcEIsY0FBYyxFQUNkLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxFQUNwQyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzFDLE1BQU0sUUFBUSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUN0RCx5QkFBeUIsRUFDekIsZ0NBQWdDLENBQ2pDLENBQUM7SUFDRixDQUFDLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7QUFDN0IsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsTUFBTSxDQUFDLHdCQUF3QixFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUM5QyxNQUFNLFFBQVEsR0FBRyxNQUFNLG9DQUFrQixDQUFDLGNBQWMsQ0FDdEQsZ0NBQWdDLEVBQ2hDLGdDQUFnQyxDQUNqQyxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FDVCwyQkFBMkIsRUFDM0IsY0FBYyxFQUNkLHlCQUF5QixDQUFDLFFBQVEsRUFBRSxFQUNwQyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQ1QsdUJBQXVCLEVBQ3ZCLFNBQVMsRUFDVCxJQUFJLHFDQUFtQixpQ0FFaEIsZ0NBQWdDLENBQUMsUUFBUSxLQUM1QyxRQUFRLEVBQUUsSUFBSSxLQUVoQixDQUFDLHdDQUFzQixDQUFDLElBQUksRUFBRSx3Q0FBc0IsQ0FBQyxLQUFLLENBQUMsRUFDM0QsdUJBQVcsQ0FDWixFQUNELEdBQUcsQ0FDSixDQUFDO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FDVCxvQkFBb0IsRUFDcEIsY0FBYyxFQUNkLGdDQUFnQyxFQUNoQyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQ1QsMEJBQTBCLEVBQzFCLGNBQWMsRUFDZCxnQ0FBZ0MsQ0FBQyxRQUFRLEVBQUUsRUFDM0MsR0FBRyxDQUNKLENBQUMifQ==