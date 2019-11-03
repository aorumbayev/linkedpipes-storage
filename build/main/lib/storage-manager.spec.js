"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const solid_auth_cli_1 = __importDefault(require("solid-auth-cli"));
const uuid_1 = __importDefault(require("uuid"));
const storage_manager_1 = require("./storage-manager");
let session;
const SOLID_PROVIDER_URL = process.env.SOLID_PROVIDER_URL;
const SOLID_PASSWORD = process.env.SOLID_PASSWORD;
const SOLID_USERNAME = process.env.SOLID_USERNAME;
const SOLID_WEBID = process.env.SOLID_WEBID;
const fileConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid_1.default.v4()}`,
        type: storage_manager_1.SolidResourceType.Folder,
        contentType: 'text/plain',
        body: 'This is a test text file'
    },
    webID: SOLID_WEBID
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
    webID: SOLID_WEBID
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
            idp: SOLID_PROVIDER_URL,
            password: SOLID_PASSWORD,
            username: SOLID_USERNAME
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
    webID: SOLID_WEBID,
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
        webID: SOLID_WEBID
    });
    const updatedFileContent = await storage_manager_1.StorageFileManager.getResource(fileConfigurationResourceRenamed.resource.path);
    t.is(updatedFileContent, updatedText);
});
ava_1.default.serial('fileResourceDoesNotExists', resourceExists, fileConfigurationResource.resource.path, 404);
ava_1.default.serial('fileResourceUpdateACL', updateACL, {
    webID: SOLID_WEBID,
    controlModes: [storage_manager_1.AccessControlNamespace.Read, storage_manager_1.AccessControlNamespace.Write],
    resource: Object.assign(Object.assign({}, fileConfigurationResourceRenamed.resource), { isPublic: true })
}, 201);
ava_1.default.serial('deleteFileResource', deleteResource, fileConfigurationResourceRenamed, 200);
ava_1.default.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResourceRenamed.resource.path, 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9FQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsdURBSzJCO0FBRTNCLElBQUksT0FBTyxDQUFDO0FBRVosTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBQzFELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBRTVDLE1BQU0seUJBQXlCLEdBQW1CO0lBQ2hELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO1FBQzlCLFdBQVcsRUFBRSxZQUFZO1FBQ3pCLElBQUksRUFBRSwwQkFBMEI7S0FDakM7SUFDRCxLQUFLLEVBQUUsV0FBVztDQUNuQixDQUFDO0FBRUYsTUFBTSxnQ0FBZ0MsR0FBbUI7SUFDdkQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVTtRQUMxRCxJQUFJLEVBQUUseUJBQXlCLENBQUMsUUFBUSxDQUFDLElBQUk7S0FDOUM7SUFDRCxLQUFLLEVBQUUseUJBQXlCLENBQUMsS0FBSztDQUN2QyxDQUFDO0FBRUYsTUFBTSwyQkFBMkIsR0FBbUI7SUFDbEQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLDhCQUE4QixjQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsSUFBSSxFQUFFLG1DQUFpQixDQUFDLE1BQU07S0FDL0I7SUFDRCxLQUFLLEVBQUUsV0FBVztDQUNuQixDQUFDO0FBRUYsTUFBTSxrQ0FBa0MsR0FBbUI7SUFDekQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLDJCQUEyQixDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVTtRQUM1RCxJQUFJLEVBQUUsMkJBQTJCLENBQUMsUUFBUSxDQUFDLElBQUk7S0FDaEQ7SUFDRCxLQUFLLEVBQUUsMkJBQTJCLENBQUMsS0FBSztDQUN6QyxDQUFDO0FBRUYsS0FBSyxVQUFVLGNBQWMsQ0FBQyxDQUFNLEVBQUUsS0FBVSxFQUFFLFFBQWE7SUFDN0QsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDOUQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxLQUFLLFVBQVUsY0FBYyxDQUFDLENBQU0sRUFBRSxLQUFVLEVBQUUsUUFBYTtJQUM3RCxNQUFNLE1BQU0sR0FBRyxNQUFNLG9DQUFrQixDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5RCxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUVELEtBQUssVUFBVSxjQUFjLENBQUMsQ0FBTSxFQUFFLEtBQVUsRUFBRSxRQUFhO0lBQzdELE1BQU0sTUFBTSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNoQyxDQUFDO0FBRUQsS0FBSyxVQUFVLFNBQVMsQ0FBQyxDQUFNLEVBQUUsS0FBVSxFQUFFLFFBQWE7SUFDeEQsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDekQsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0FBQ2hDLENBQUM7QUFFRCxhQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3JCLE9BQU8sR0FBRyxNQUFNLHdCQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNaLE9BQU8sR0FBRyxNQUFNLHdCQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEdBQUcsRUFBRSxrQkFBa0I7WUFDdkIsUUFBUSxFQUFFLGNBQWM7WUFDeEIsUUFBUSxFQUFFLGNBQWM7U0FDekIsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQ1Qsc0JBQXNCLEVBQ3RCLGNBQWMsRUFDZCwyQkFBMkIsRUFDM0IsR0FBRyxDQUNKLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUNULHNCQUFzQixFQUN0QixjQUFjLEVBQ2QsMkJBQTJCLENBQUMsUUFBUSxDQUFDLElBQUksRUFDekMsR0FBRyxDQUNKLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUFDLHNCQUFzQixFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUM1QyxNQUFNLFFBQVEsR0FBRyxNQUFNLG9DQUFrQixDQUFDLGNBQWMsQ0FDdEQsMkJBQTJCLEVBQzNCLGtDQUFrQyxDQUNuQyxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FBQywwQkFBMEIsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDaEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQ3RELGtDQUFrQyxFQUNsQyxrQ0FBa0MsQ0FDbkMsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQ1QsNkJBQTZCLEVBQzdCLGNBQWMsRUFDZCwyQkFBMkIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUN6QyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQ1QseUJBQXlCLEVBQ3pCLFNBQVMsRUFDVDtJQUNFLEtBQUssRUFBRSxXQUFXO0lBQ2xCLFlBQVksRUFBRSxDQUFDLHdDQUFzQixDQUFDLElBQUksRUFBRSx3Q0FBc0IsQ0FBQyxLQUFLLENBQUM7SUFDekUsUUFBUSxrQ0FDSCxrQ0FBa0MsQ0FBQyxRQUFRLEtBQzlDLFFBQVEsRUFBRSxJQUFJLEdBQ2Y7Q0FDRixFQUNELEdBQUcsQ0FDSixDQUFDO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FDVCxzQkFBc0IsRUFDdEIsY0FBYyxFQUNkLGtDQUFrQyxFQUNsQyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQ1QsNEJBQTRCLEVBQzVCLGNBQWMsRUFDZCx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUN2QyxHQUFHLENBQ0osQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQ1Qsb0JBQW9CLEVBQ3BCLGNBQWMsRUFDZCx5QkFBeUIsRUFDekIsR0FBRyxDQUNKLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUNULG9CQUFvQixFQUNwQixjQUFjLEVBQ2QseUJBQXlCLENBQUMsUUFBUSxDQUFDLElBQUksRUFDdkMsR0FBRyxDQUNKLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUFDLG9CQUFvQixFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUMxQyxNQUFNLFFBQVEsR0FBRyxNQUFNLG9DQUFrQixDQUFDLGNBQWMsQ0FDdEQseUJBQXlCLEVBQ3pCLGdDQUFnQyxDQUNqQyxDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzdCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FBQyx3QkFBd0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDOUMsTUFBTSxRQUFRLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQ3RELGdDQUFnQyxFQUNoQyxnQ0FBZ0MsQ0FDakMsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQUMsMkJBQTJCLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQ2pELE1BQU0sV0FBVyxHQUFHLDJDQUEyQyxDQUFDO0lBQ2hFLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUFDO1FBQ3RDLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxnQ0FBZ0MsQ0FBQyxRQUFRLENBQUMsSUFBSTtZQUNwRCxJQUFJLEVBQUUsbUNBQWlCLENBQUMsTUFBTTtZQUM5QixXQUFXLEVBQUUsWUFBWTtZQUN6QixJQUFJLEVBQUUsV0FBVztTQUNsQjtRQUNELEtBQUssRUFBRSxXQUFXO0tBQ25CLENBQUMsQ0FBQztJQUNILE1BQU0sa0JBQWtCLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxXQUFXLENBQzdELGdDQUFnQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQy9DLENBQUM7SUFDRixDQUFDLENBQUMsRUFBRSxDQUFDLGtCQUFrQixFQUFFLFdBQVcsQ0FBQyxDQUFDO0FBQ3hDLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FDVCwyQkFBMkIsRUFDM0IsY0FBYyxFQUNkLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQ3ZDLEdBQUcsQ0FDSixDQUFDO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FDVCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNUO0lBQ0UsS0FBSyxFQUFFLFdBQVc7SUFDbEIsWUFBWSxFQUFFLENBQUMsd0NBQXNCLENBQUMsSUFBSSxFQUFFLHdDQUFzQixDQUFDLEtBQUssQ0FBQztJQUN6RSxRQUFRLGtDQUNILGdDQUFnQyxDQUFDLFFBQVEsS0FDNUMsUUFBUSxFQUFFLElBQUksR0FDZjtDQUNGLEVBQ0QsR0FBRyxDQUNKLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUNULG9CQUFvQixFQUNwQixjQUFjLEVBQ2QsZ0NBQWdDLEVBQ2hDLEdBQUcsQ0FDSixDQUFDO0FBRUYsYUFBSSxDQUFDLE1BQU0sQ0FDVCwwQkFBMEIsRUFDMUIsY0FBYyxFQUNkLGdDQUFnQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQzlDLEdBQUcsQ0FDSixDQUFDIn0=