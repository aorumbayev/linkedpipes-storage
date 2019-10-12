"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-ex
const $rdf = __importStar(require("rdflib"));
const solid_auth_client_1 = __importDefault(require("solid-auth-client"));
const storage_manager_1 = require("./storage-manager");
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
async function login(idp) {
    const session = await solid_auth_client_1.default.currentSession();
    if (!session)
        await solid_auth_client_1.default.login(idp);
}
login('https://lpapps.co:8443');
storage_manager_1.StorageFileManager.updateACL({
    webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
    controlModes: [ACL('READ'), ACL('WRITE')],
    resource: {
        type: storage_manager_1.SolidResourceType.Folder,
        path: 'https://aorumbayev.lpapps.co:8443/linkedpipes4/',
        isPublic: true
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsNkNBQStCO0FBQy9CLDBFQUFxQztBQUNyQyx1REFBMEU7QUFFMUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTdELEtBQUssVUFBVSxLQUFLLENBQUMsR0FBRztJQUN0QixNQUFNLE9BQU8sR0FBRyxNQUFNLDJCQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDNUMsSUFBSSxDQUFDLE9BQU87UUFBRSxNQUFNLDJCQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3RDLENBQUM7QUFFRCxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUVoQyxvQ0FBa0IsQ0FBQyxTQUFTLENBQUM7SUFDM0IsS0FBSyxFQUFFLG1EQUFtRDtJQUMxRCxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3pDLFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO1FBQzlCLElBQUksRUFBRSxpREFBaUQ7UUFDdkQsUUFBUSxFQUFFLElBQUk7S0FDZjtDQUNGLENBQUMsQ0FBQyJ9