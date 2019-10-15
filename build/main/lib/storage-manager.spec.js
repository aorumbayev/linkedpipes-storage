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
ava_1.default('createResource', async (t) => {
    const resourcePath = `https://tester1.inrupt.net/${uuid_1.default.v4()}`;
    const configurationResource = {
        resource: {
            path: resourcePath,
            type: storage_manager_1.SolidResourceType.Folder
        },
        webID
    };
    return storage_manager_1.StorageFileManager.createResource(configurationResource).then(result => {
        t.is(result.status, 201);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOENBQXVCO0FBQ3ZCLG9FQUFrQztBQUNsQyxnREFBd0I7QUFDeEIsdURBSTJCO0FBRTNCLElBQUksT0FBTyxDQUFDO0FBQ1osTUFBTSxLQUFLLEdBQUcsbURBQW1ELENBQUM7QUFFbEUsYUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNyQixPQUFPLEdBQUcsTUFBTSx3QkFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLEdBQUcsTUFBTSx3QkFBSSxDQUFDLEtBQUssQ0FBQztZQUN6QixHQUFHLEVBQUUsb0JBQW9CO1lBQ3pCLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxTQUFTO1NBQ3BCLENBQUMsQ0FBQztLQUNKO0FBQ0gsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQy9CLE1BQU0sWUFBWSxHQUFHLDhCQUE4QixjQUFJLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztJQUMvRCxNQUFNLHFCQUFxQixHQUFtQjtRQUM1QyxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsWUFBWTtZQUNsQixJQUFJLEVBQUUsbUNBQWlCLENBQUMsTUFBTTtTQUMvQjtRQUNELEtBQUs7S0FDTixDQUFDO0lBQ0YsT0FBTyxvQ0FBa0IsQ0FBQyxjQUFjLENBQUMscUJBQXFCLENBQUMsQ0FBQyxJQUFJLENBQ2xFLE1BQU0sQ0FBQyxFQUFFO1FBQ1AsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUMsQ0FDRixDQUFDO0FBQ0osQ0FBQyxDQUFDLENBQUMifQ==