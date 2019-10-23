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
const webID = 'https://aorumbayev.lpapps.co:8443/profile/card#me';
const fileConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid_1.default.v4()}`,
        type: storage_manager_1.SolidResourceType.Folder
    },
    webID
};
const folderConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid_1.default.v4()}`,
        type: storage_manager_1.SolidResourceType.Folder
    },
    webID
};
ava_1.default.before(async () => {
    session = await solid_auth_cli_1.default.currentSession();
    if (!session) {
        session = await solid_auth_cli_1.default.login({
            idp: 'https://inrupt.net',
            password: 'Looper248!',
            username: 'tester1'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9FQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsdURBSTJCO0FBRTNCLElBQUksT0FBTyxDQUFDO0FBRVosTUFBTSxLQUFLLEdBQUcsbURBQW1ELENBQUM7QUFFbEUsTUFBTSx5QkFBeUIsR0FBbUI7SUFDaEQsUUFBUSxFQUFFO1FBQ1IsSUFBSSxFQUFFLDhCQUE4QixjQUFJLENBQUMsRUFBRSxFQUFFLEVBQUU7UUFDL0MsSUFBSSxFQUFFLG1DQUFpQixDQUFDLE1BQU07S0FDL0I7SUFDRCxLQUFLO0NBQ04sQ0FBQztBQUVGLE1BQU0sMkJBQTJCLEdBQW1CO0lBQ2xELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsY0FBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO0tBQy9CO0lBQ0QsS0FBSztDQUNOLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3JCLE9BQU8sR0FBRyxNQUFNLHdCQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNaLE9BQU8sR0FBRyxNQUFNLHdCQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEdBQUcsRUFBRSxvQkFBb0I7WUFDekIsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLFNBQVM7U0FDcEIsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzVDLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUNwRCwyQkFBMkIsQ0FDNUIsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQUMsc0JBQXNCLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzVDLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUNwRCwyQkFBMkIsQ0FDNUIsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUNwRCx5QkFBeUIsQ0FDMUIsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzFDLE1BQU0sTUFBTSxHQUFHLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUNwRCx5QkFBeUIsQ0FDMUIsQ0FBQztJQUNGLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztBQUMzQixDQUFDLENBQUMsQ0FBQyJ9