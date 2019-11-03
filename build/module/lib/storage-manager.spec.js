import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import { SOLID_PASSWORD, SOLID_PROVIDER_URL, SOLID_USERNAME, SOLID_WEBID } from './constants';
import { AccessControlNamespace, SolidResourceType, StorageFileManager } from './storage-manager';
let session;
const fileConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid.v4()}`,
        type: SolidResourceType.Folder,
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
        path: `https://tester1.inrupt.net/${uuid.v4()}`,
        type: SolidResourceType.Folder
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
    const result = await StorageFileManager.createResource(input);
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
async function updateACL(t, input, expected) {
    const result = await StorageFileManager.updateACL(input);
    t.is(result.status, expected);
}
test.before(async () => {
    session = await auth.currentSession();
    if (!session) {
        session = await auth.login({
            idp: SOLID_PROVIDER_URL,
            password: SOLID_PASSWORD,
            username: SOLID_USERNAME
        });
    }
});
test.serial('createFolderResource', createResource, folderConfigurationResource, 201);
test.serial('folderResourceExists', resourceExists, folderConfigurationResource.resource.path, 200);
test.serial('renameFolderResource', async (t) => {
    const response = await StorageFileManager.renameResource(folderConfigurationResource, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
test.serial('renameSameFolderResource', async (t) => {
    const response = await StorageFileManager.renameResource(folderConfigurationResourceRenamed, folderConfigurationResourceRenamed);
    t.is(response.status, 200);
});
test.serial('folderResourceDoesNotExists', resourceExists, folderConfigurationResource.resource.path, 404);
test.serial('folderResourceUpdateACL', updateACL, {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
        ...folderConfigurationResourceRenamed.resource,
        isPublic: true
    }
}, 201);
test.serial('deleteFolderResource', deleteResource, folderConfigurationResourceRenamed, 200);
test.serial('folderResourceDoesNotExist', resourceExists, fileConfigurationResource.resource.path, 404);
test.serial('createFileResource', createResource, fileConfigurationResource, 201);
test.serial('fileResourceExists', resourceExists, fileConfigurationResource.resource.path, 200);
test.serial('renameFileResource', async (t) => {
    const response = await StorageFileManager.renameResource(fileConfigurationResource, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
test.serial('renameSameFileResource', async (t) => {
    const response = await StorageFileManager.renameResource(fileConfigurationResourceRenamed, fileConfigurationResourceRenamed);
    t.is(response.status, 200);
});
test.serial('updateRenamedFileResource', async (t) => {
    const updatedText = 'This is a test text file that was changed';
    await StorageFileManager.updateResource({
        resource: {
            path: fileConfigurationResourceRenamed.resource.path,
            type: SolidResourceType.Folder,
            contentType: 'text/plain',
            body: updatedText
        },
        webID: SOLID_WEBID
    });
    const updatedFileContent = await StorageFileManager.getResource(fileConfigurationResourceRenamed.resource.path);
    t.is(updatedFileContent, updatedText);
});
test.serial('fileResourceDoesNotExists', resourceExists, fileConfigurationResource.resource.path, 404);
test.serial('fileResourceUpdateACL', updateACL, {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
        ...fileConfigurationResourceRenamed.resource,
        isPublic: true
    }
}, 201);
test.serial('deleteFileResource', deleteResource, fileConfigurationResourceRenamed, 200);
test.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResourceRenamed.resource.path, 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUNMLGNBQWMsRUFDZCxrQkFBa0IsRUFDbEIsY0FBYyxFQUNkLFdBQVcsRUFDWixNQUFNLGFBQWEsQ0FBQztBQUNyQixPQUFPLEVBQ0wsc0JBQXNCLEVBRXRCLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbkIsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQixJQUFJLE9BQU8sQ0FBQztBQUVaLE1BQU0seUJBQXlCLEdBQW1CO0lBQ2hELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxNQUFNO1FBQzlCLFdBQVcsRUFBRSxZQUFZO1FBQ3pCLElBQUksRUFBRSwwQkFBMEI7S0FDakM7SUFDRCxLQUFLLEVBQUUsV0FBVztDQUNuQixDQUFDO0FBRUYsTUFBTSxnQ0FBZ0MsR0FBbUI7SUFDdkQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLHlCQUF5QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsVUFBVTtRQUMxRCxJQUFJLEVBQUUseUJBQXlCLENBQUMsUUFBUSxDQUFDLElBQUk7S0FDOUM7SUFDRCxLQUFLLEVBQUUseUJBQXlCLENBQUMsS0FBSztDQUN2QyxDQUFDO0FBRUYsTUFBTSwyQkFBMkIsR0FBbUI7SUFDbEQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLDhCQUE4QixJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsSUFBSSxFQUFFLGlCQUFpQixDQUFDLE1B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