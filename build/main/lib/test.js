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
const solid_auth_cli_1 = __importDefault(require("solid-auth-cli"));
const storage_manager_1 = require("./storage-manager");
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
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
    storage_manager_1.StorageFileManager.updateACL({
        webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
        controlModes: [ACL('READ'), ACL('WRITE')],
        resource: {
            type: storage_manager_1.SolidResourceType.Folder,
            path: 'https://aorumbayev.lpapps.co:8443/linkedpipes43/',
            isPublic: true
        }
    }).then(response => {
        console.log(response);
    });
}
login();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQSx1QkFBdUI7QUFDdkIsNkNBQStCO0FBQy9CLG9FQUFrQztBQUNsQyx1REFBMEU7QUFFMUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTdELEtBQUssVUFBVSxLQUFLO0lBQ2xCLElBQUksT0FBTyxHQUFHLE1BQU0sd0JBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQyxJQUFJLENBQUMsT0FBTztRQUNWLE9BQU8sR0FBRyxNQUFNLHdCQUFJO2FBQ2pCLEtBQUssQ0FBQztZQUNMLEdBQUcsRUFBRSx3QkFBd0I7WUFDN0IsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLFlBQVk7U0FDdkIsQ0FBQzthQUNELElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDeEIsQ0FBQyxDQUFDLENBQUM7SUFFUCxvQ0FBa0IsQ0FBQyxTQUFTLENBQUM7UUFDM0IsS0FBSyxFQUFFLG1EQUFtRDtRQUMxRCxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3pDLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxtQ0FBaUIsQ0FBQyxNQUFNO1lBQzlCLElBQUksRUFBRSxrREFBa0Q7WUFDeEQsUUFBUSxFQUFFLElBQUk7U0FDZjtLQUNGLENBQUMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUN4QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxLQUFLLEVBQUUsQ0FBQyJ9