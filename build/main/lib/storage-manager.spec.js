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
ava_1.default.serial('createFolderResource', async (t) => {
    const result = await storage_manager_1.StorageFileManager.createResource(folderConfigurationResource);
    t.is(result.status, 201);
});
ava_1.default.serial('deleteFolderResource', async (t) => {
    const result = await storage_manager_1.StorageFileManager.deleteResource(folderConfigurationResource);
    t.is(result.status, 200);
});
ava_1.default.serial('createFileResource', async (t) => {
    const result = await storage_manager_1.StorageFileManager.createResource(fileConfigurationResource);
    t.is(result.status, 201);
});
ava_1.default.serial('deleteFileResource', async (t) => {
    const result = await storage_manager_1.StorageFileManager.deleteResource(fileConfigurationResource);
    t.is(result.status, 200);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9FQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsdURBSTJCO0FBRTNCLElBQUksT0FBTyxDQUFDO0FBRVosTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLGtCQUFrQixDQUFDO0FBQzFELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDO0FBQ2xELE1BQU0sV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDO0FBRTVDLE1BQU0seUJBQXlCLEdBQW1CO0lBQ2hELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0tBQy9CO0lBQ0QsS0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQW1CO0lBQ2xELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0tBQy9CO0lBQ0QsS0FBSyxFQUFFLFdBQVc7Q0FDbkIsQ0FBQztBQUVGLGFBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDckIsT0FBTyxHQUFHLE1BQU0sd0JBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN0QyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osT0FBTyxHQUFHLE1BQU0sd0JBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsR0FBRyxFQUFFLGtCQUFrQjtZQUN2QixRQUFRLEVBQUUsY0FBYztZQUN4QixRQUFRLEVBQUUsY0FBYztTQUN6QixDQUFDLENBQUM7S0FDSjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQ3BELDJCQUEyQixDQUM1QixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQ3BELDJCQUEyQixDQUM1QixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQ3BELHlCQUF5QixDQUMxQixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUgsYUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQ3BELHlCQUF5QixDQUMxQixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDIn0=