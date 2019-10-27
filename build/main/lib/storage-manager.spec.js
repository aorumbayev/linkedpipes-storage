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
        type: storage_manager_1.SolidResourceType.Folder
    },
    webID: SOLID_WEBID
};
const folderConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid_1.default.v4()}`,
        type: storage_manager_1.SolidResourceType.Folder
    },
    webID: SOLID_WEBID
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
ava_1.default.serial('folderResourceUpdateACL', updateACL, {
    webID: SOLID_WEBID,
    controlModes: [storage_manager_1.AccessControlNamespace.Read, storage_manager_1.AccessControlNamespace.Write],
    resource: Object.assign(Object.assign({}, folderConfigurationResource.resource), { isPublic: true })
}, 201);
ava_1.default.serial('deleteFolderResource', deleteResource, folderConfigurationResource, 200);
ava_1.default.serial('folderResourceDoesNotExist', resourceExists, fileConfigurationResource.resource.path, 404);
ava_1.default.serial('createFileResource', createResource, fileConfigurationResource, 201);
ava_1.default.serial('fileResourceExists', resourceExists, fileConfigurationResource.resource.path, 200);
ava_1.default.serial('fileResourceUpdateACL', updateACL, {
    webID: SOLID_WEBID,
    controlModes: [storage_manager_1.AccessControlNamespace.Read, storage_manager_1.AccessControlNamespace.Write],
    resource: Object.assign(Object.assign({}, fileConfigurationResource.resource), { isPublic: true })
}, 201);
ava_1.default.serial('deleteFileResource', deleteResource, fileConfigurationResource, 200);
ava_1.default.serial('fileResourceDoesNotExist', resourceExists, fileConfigurationResource.resource.path, 404);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9FQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsdURBSzJCO0FBRTNCLElBQUksT0FBTyxDQUFDO0FBRVosTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBQzFELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBRTVDLE1BQU0seUJBQXlCLEdBQW1CO0lBQ2hELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0tBQy9CO0lBQ0QsS0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQW1CO0lBQ2xELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0tBQy9CO0lBQ0QsS0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQztBQUVGLEtBQUssVUFBVSxjQUFjLENBQUMsQ0FBTSxFQUFFLEtBQVUsRUFBRSxRQUFhO0lBQzdELE1BQU0sTUFBTSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQzlELENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxRQUFR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