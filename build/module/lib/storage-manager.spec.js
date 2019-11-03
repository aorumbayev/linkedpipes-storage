import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import { AccessControlNamespace, SolidResourceType, StorageFileManager } from './storage-manager';
let session;
const SOLID_PROVIDER_URL = process.env.SOLID_PROVIDER_URL;
const SOLID_PASSWORD = process.env.SOLID_PASSWORD;
const SOLID_USERNAME = process.env.SOLID_USERNAME;
const SOLID_WEBID = process.env.SOLID_WEBID;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUNMLHNCQUFzQixFQUV0QixpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ25CLE1BQU0sbUJBQW1CLENBQUM7QUFFM0IsSUFBSSxPQUFPLENBQUM7QUFFWixNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7QUFDMUQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDbEQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDbEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFFNUMsTUFBTSx5QkFBeUIsR0FBbUI7SUFDaEQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLDhCQUE4QixJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsSUFBSSxFQUFFLGlCQUFpQixDQUFDLE1BQU07UUFDOUIsV0FBVyxFQUFFLFlBQVk7UUFDekIsSUFBSSxFQUFFLDBCQUEwQjtLQUNqQztJQUNELEtBQUssRUFBRSxXQUFXO0NBQ25CLENBQUM7QUFFRixNQUFNLGdDQUFnQyxHQUFtQjtJQUN2RCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUseUJBQXlCLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxVQUFVO1FBQzFELElBQUksRUFBRSx5QkFBeUIsQ0FBQyxRQUFRLENBQUMsSUFBSTtLQUM5QztJQUNELEtBQUssRUFBRSx5QkFBeUIsQ0FB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