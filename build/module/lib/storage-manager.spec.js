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
        type: SolidResourceType.Folder
    },
    webID: SOLID_WEBID
};
const folderConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid.v4()}`,
        type: SolidResourceType.Folder
    },
    webID: SOLID_WEBID
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
test.serial('folderResourceUpdateACL', updateACL, {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
        ...folderConfigurationResource.resource,
        isPublic: true
    }
}, 201);
test.serial('deleteFolderResource', deleteResource, folderConfigurationResource, 200);
test.serial('folderResourceDoesNotExist', resourceExists, fileConfigurationResource.resource.path, 404);
test.serial('createFileResource', createResource, fileConfigurationResource, 201);
test.serial('fileResourceExists', resourceExists, fileConfigurationResource.resource.path, 200);
test.serial('fileResourceUpdateACL', updateACL, {
    webID: SOLID_WEBID,
    controlModes: [AccessControlNamespace.Read, AccessControlNamespace.Write],
    resource: {
        ...fileConfigurationResource.resource,
        isPublic: true
    }
}, 201);
test.serial('deleteFileResource', deleteResource, fileConfigurationResource, 200);
test.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResource.resource.path, 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUNMLHNCQUFzQixFQUV0QixpQkFBaUIsRUFDakIsa0JBQWtCLEVBQ25CLE1BQU0sbUJBQW1CLENBQUM7QUFFM0IsSUFBSSxPQUFPLENBQUM7QUFFWixNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLENBQUM7QUFDMUQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDbEQsTUFBTSxjQUFjLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUM7QUFDbEQsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUM7QUFFNUMsTUFBTSx5QkFBeUIsR0FBbUI7SUFDaEQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLDhCQUE4QixJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsSUFBSSxFQUFFLGlCQUFpQixDQUFDLE1BQU07S0FDL0I7SUFDRCxLQUFLLEVBQUUsV0FBVztDQUNuQixDQUFDO0FBRUYsTUFBTSwyQkFBMkIsR0FBbUI7SUFDbEQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLDhCQUE4QixJQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsSUFBSSxFQUFFLGlCQUFpQixDQUFDLE1BQU07S0FDL0I7SUFDRCxLQUFLLEVBQUUsV0FBVztDQUNuQixDQUFDO0FBRUYsS0FBSyxVQUFVLGNBQWMsQ0FBQyxDQUFNLEVBQUUsS0FBVSxFQUFFLFFBQWE7SUFD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