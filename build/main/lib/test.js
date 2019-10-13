"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-ex
const solid_auth_cli_1 = __importDefault(require("solid-auth-cli"));
const storage_manager_1 = require("./storage-manager");
// const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
async function login() {
    var session = await solid_auth_cli_1.default.currentSession();
    if (!session)
        session = await solid_auth_cli_1.default
            .login({
            idp: 'https://lpapps.co:8443',
            username: 'aorumbayev',
            password: 'Looper248!'
        })
            .then(response => {
            console.log(response);
        });
    storage_manager_1.StorageFileManager.createOrUpdateResource({
        webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
        resource: {
            type: storage_manager_1.SolidResourceType.Folder,
            path: 'https://aorumbayev.lpapps.co:8443/linkedpipes111'
        }
    }).then(response => {
        console.log(response);
    });
}
login();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVCQUF1QjtBQUN2QixvRUFBa0M7QUFDbEMsdURBQTBFO0FBRTFFLGdFQUFnRTtBQUVoRSxLQUFLLFVBQVUsS0FBSztJQUNsQixJQUFJLE9BQU8sR0FBRyxNQUFNLHdCQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDMUMsSUFBSSxDQUFDLE9BQU87UUFDVixPQUFPLEdBQUcsTUFBTSx3QkFBSTthQUNqQixLQUFLLENBQUM7WUFDTCxHQUFHLEVBQUUsd0JBQXdCO1lBQzdCLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxZQUFZO1NBQ3ZCLENBQUM7YUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRVAsb0NBQWtCLENBQUMsc0JBQXNCLENBQUM7UUFDeEMsS0FBSyxFQUFFLG1EQUFtRDtRQUMxRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsbUNBQWlCLENBQUMsTUFBTTtZQUM5QixJQUFJLEVBQUUsa0RBQWtEO1NBQ3pEO0tBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELEtBQUssRUFBRSxDQUFDIn0=