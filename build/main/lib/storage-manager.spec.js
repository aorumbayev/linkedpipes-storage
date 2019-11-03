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
const fileConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid_1.default.v4()}`,
        type: storage_manager_1.SolidResourceType.Folder,
        contentType: 'text/plain',
        body: 'This is a test text file'
    },
    webID: constants_1.SOLID_WEBID
};
const fileConfigurationResourceRenamed = {
    resource: {
        path: fileConfigurationResource.resource.path + '_renamed',
        type: fileConfigurationResource.resource.type
    },
    webID: fileConfigurationResource.webID
};
const folderConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid_1.default.v4()}`,
        type: storage_manager_1.SolidResourceType.Folder
    },
    webID: constants_1.SOLID_WEBID
};
const folderConfigurationResourceRenamed = {
    resource: {
        path: folderConfigurationResource.resource.path + '_renamed',
        type: folderConfigurationResource.resource.type
    },
    webID: folderConfigurationResource.webID
};
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
ava_1.default.serial('folderResourceExists', resourceExists, folderConfigurationResource.resource.path, 200);
ava_1.default.serial('renameFolderResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(folderConfigurationResource, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('renameSameFolderResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(folderConfigurationResourceRenamed, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('folderResourceDoesNotExists', resourceExists, folderConfigurationResource.resource.path, 404);
ava_1.default.serial('folderResourceUpdateACL', updateACL, {
    webID: constants_1.SOLID_WEBID,
    controlModes: [storage_manager_1.AccessControlNamespace.Read, storage_manager_1.AccessControlNamespace.Write],
    resource: Object.assign(Object.assign({}, folderConfigurationResourceRenamed.resource), { isPublic: true })
}, 201);
ava_1.default.serial('deleteFolderResource', deleteResource, folderConfigurationResourceRenamed, 200);
ava_1.default.serial('folderResourceDoesNotExist', resourceExists, fileConfigurationResource.resource.path, 404);
ava_1.default.serial('createFileResource', createResource, fileConfigurationResource, 201);
ava_1.default.serial('fileResourceExists', resourceExists, fileConfigurationResource.resource.path, 200);
ava_1.default.serial('renameFileResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(fileConfigurationResource, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('renameSameFileResource', async (t) => {
    const response = await storage_manager_1.StorageFileManager.renameResource(fileConfigurationResourceRenamed, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
ava_1.default.serial('updateRenamedFileResource', async (t) => {
    const updatedText = 'This is a test text file that was changed';
    await storage_manager_1.StorageFileManager.updateResource({
        resource: {
            path: fileConfigurationResourceRenamed.resource.path,
            type: storage_manager_1.SolidResourceType.Folder,
            contentType: 'text/plain',
            body: updatedText
        },
        webID: constants_1.SOLID_WEBID
    });
    const updatedFileContent = await storage_manager_1.StorageFileManager.getResource(fileConfigurationResourceRenamed.resource.path);
    t.is(updatedFileContent, updatedText);
});
ava_1.default.serial('fileResourceDoesNotExists', resourceExists, fileConfigurationResource.resource.path, 404);
ava_1.default.serial('fileResourceUpdateACL', updateACL, {
    webID: constants_1.SOLID_WEBID,
    controlModes: [storage_manager_1.AccessControlNamespace.Read, storage_manager_1.AccessControlNamespace.Write],
    resource: Object.assign(Object.assign({}, fileConfigurationResourceRenamed.resource), { isPublic: true })
}, 201);
ava_1.default.serial('deleteFileResource', deleteResource, fileConfigurationResourceRenamed, 200);
ava_1.default.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResourceRenamed.resource.path, 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9FQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsMkNBS3FCO0FBQ3JCLHVEQUsyQjtBQUUzQixJQUFJLE9BQU8sQ0FBQztBQUVaLE1BQU0seUJBQXlCLEdBQW1CO0lBQ2hELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO1FBQzlCLFdBQVcsRUFBRSxZQUFZO1FBQ3pCLElBQUksRUFBRSwwQkFBMEI7S0FDakM7SUFDRCxLQUFLLEVBQUUsdUJBQVc7Q0FDbkIsQ0FBQztBQUVGLE1BQU0sZ0NBQWdDLEdBQW1CO0lBQ3ZELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLFVBQVU7UUFDMUQsSUFBSSxFQUFFLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxJQUFJO0tBQzlDO0lBQ0QsS0FBSyxFQUFFLHlCQUF5QixDQUFDLEtBQUs7Q0FDdkMsQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQW1CO0lBQ2xELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0tBQy9CO0lBQ0QsS0FBSyxFQUFFLHVCQUFXO0NBQ25CLENBQUM7QUFFRixNQUFNLGtDQUFrQyxHQUFtQjtJQUN6RCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVO1FBQzVELElBQUksRUFBRSwyQkFBMkIsQ0FBQyxRQUFRLENBQUMs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