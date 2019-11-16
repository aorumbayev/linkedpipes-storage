"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ava_1 = __importDefault(require("ava"));
const psl_1 = __importDefault(require("psl"));
const uuid_1 = __importDefault(require("uuid"));
const auth_manager_1 = require("./auth-manager");
const common_1 = require("./common");
const constants_1 = require("./constants");
const rdf_manager_1 = require("./rdf-manager");
const storage_manager_1 = require("./storage-manager");
// tslint:disable
let session;
function extractHostname(url) {
    var hostname;
    //find & remove protocol (http, ftp, etc.) and get hostname
    if (url.indexOf('//') > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }
    //find & remove port number
    hostname = hostname.split(':')[0];
    //find & remove "?"
    hostname = hostname.split('?')[0];
    return hostname;
}
const folderConfigurationResource = new storage_manager_1.ResourceConfig({
    path: 'https://' +
        constants_1.SOLID_USERNAME.toLowerCase() +
        '.' +
        psl_1.default.get(extractHostname(constants_1.SOLID_PROVIDER_URL)),
    title: uuid_1.default.v4(),
    type: storage_manager_1.SolidResourceType.Folder
}, constants_1.SOLID_WEBID);
ava_1.default.before(async () => {
    session = await auth_manager_1.StorageTestAuthenticationManager.currentSession();
    if (!session) {
        session = await auth_manager_1.StorageTestAuthenticationManager.login({
            idp: constants_1.SOLID_PROVIDER_URL,
            password: constants_1.SOLID_PASSWORD,
            username: constants_1.SOLID_USERNAME
        });
        common_1.logger.info('Authentication response: ', session.webID);
    }
    await storage_manager_1.StorageFileManager.createResource(folderConfigurationResource);
});
ava_1.default.serial('testUpdateAppFolder', async (t) => {
    await rdf_manager_1.StorageRdfManager.updateAppFolder(constants_1.SOLID_WEBID, folderConfigurationResource.fullPath());
    const fileContent = await storage_manager_1.StorageFileManager.getResource(constants_1.SOLID_WEBID, undefined);
    t.assert(fileContent.includes(folderConfigurationResource.resource.title));
});
ava_1.default.after(async () => {
    await storage_manager_1.StorageFileManager.deleteResource(folderConfigurationResource);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmRmLW1hbmFnZXIuc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvcmRmLW1hbmFnZXIuc3BlYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDhDQUF1QjtBQUN2Qiw4Q0FBc0I7QUFDdEIsZ0RBQXdCO0FBQ3hCLGlEQUFrRTtBQUNsRSxxQ0FBa0M7QUFDbEMsMkNBS3FCO0FBQ3JCLCtDQUFrRDtBQUNsRCx1REFJMkI7QUFFM0IsaUJBQWlCO0FBRWpCLElBQUksT0FBTyxDQUFDO0FBRVosU0FBUyxlQUFlLENBQUMsR0FBRztJQUMxQixJQUFJLFFBQVEsQ0FBQztJQUNiLDJEQUEyRDtJQUUzRCxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDMUIsUUFBUSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDOUI7U0FBTTtRQUNMLFFBQVEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsMkJBQTJCO0lBQzNCLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2xDLG1CQUFtQjtJQUNuQixRQUFRLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVsQyxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDO0FBRUQsTUFBTSwyQkFBMkIsR0FBbUIsSUFBSSxnQ0FBYyxDQUNwRTtJQUNFLElBQUksRUFDRixVQUFVO1FBQ1YsMEJBQWMsQ0FBQyxXQUFXLEVBQUU7UUFDNUIsR0FBRztRQUNILGFBQUcsQ0FBQyxHQUFHLENBQUMsZUFBZSxDQUFDLDhCQUFrQixDQUFDLENBQUM7SUFDOUMsS0FBSyxFQUFFLGNBQUksQ0FBQyxFQUFFLEVBQUU7SUFDaEIsSUFBSSxFQUFFLG1DQUFpQixDQUFDLE1BQU07Q0FDL0IsRUFDRCx1QkFBVyxDQUNaLENBQUM7QUFFRixhQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3JCLE9BQU8sR0FBRyxNQUFNLCtDQUFnQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2xFLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLEdBQUcsTUFBTSwrQ0FBZ0MsQ0FBQyxLQUFLLENBQUM7WUFDckQsR0FBRyxFQUFFLDhCQUFrQjtZQUN2QixRQUFRLEVBQUUsMEJBQWM7WUFDeEIsUUFBUSxFQUFFLDBCQUFjO1NBQ3pCLENBQUMsQ0FBQztRQUNILGVBQU0sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pEO0lBQ0QsTUFBTSxvQ0FBa0IsQ0FBQyxjQUFjLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUN2RSxDQUFDLENBQUMsQ0FBQztBQUVILGFBQUksQ0FBQyxNQUFNLENBQUMscUJBQXFCLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzNDLE1BQU0sK0JBQWlCLENBQUMsZUFBZSxDQUNyQyx1QkFBVyxFQUNYLDJCQUEyQixDQUFDLFFBQVEsRUFBRSxDQUN2QyxDQUFDO0lBQ0YsTUFBTSxXQUFXLEdBQUcsTUFBTSxvQ0FBa0IsQ0FBQyxXQUFXLENBQ3RELHVCQUFXLEVBQ1gsU0FBUyxDQUNWLENBQUM7SUFDRixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsMkJBQTJCLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7QUFDN0UsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxFQUFFO0lBQ3BCLE1BQU0sb0NBQWtCLENBQUMsY0FBYyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFDdkUsQ0FBQyxDQUFDLENBQUMifQ==