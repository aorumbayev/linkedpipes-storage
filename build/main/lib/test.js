"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable:no-ex
// import * as $rdf from 'rdflib';
const solid_auth_cli_1 = __importDefault(require("solid-auth-cli"));
// import uuid from 'uuid';
const rdf_manager_1 = require("./rdf-manager");
// const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
// const LPA = $rdf.Namespace('https://w3id.org/def/lpapps#');
// const store = $rdf.graph();
// const fetcher = new $rdf.Fetcher(store);
// const updater = new $rdf.UpdateManager(store);
// const requiresForceReload = false;
// async function update(
//   deletions: $rdf.Statement[],
//   insertions: $rdf.Statement[]
// ): Promise<any> {
//   try {
//     return updater.update(deletions, insertions, message => {
//       return Promise.resolve(message);
//     });
//   } catch (err) {
//     return Promise.reject(new Error('Could not update the document.'));
//   }
// }
// async function load(document: $rdf.NamedNode) {
//   const reloadRequired = requiresForceReload;
//   requiresForceReload = false;
//   try {
//     return fetcher.load(document, {
//       force: reloadRequired,
//       clearPreviousData: reloadRequired
//     });
//   } catch (err) {
//     return Promise.reject(new Error('Could not fetch the document.'));
//   }
// }
// async function updateResource(
//   resourceUrl: string,
//   insertions: $rdf.Statement[],
//   deletions: $rdf.Statement[]
// ): Promise<any> {
//   const resource = $rdf.sym(resourceUrl);
//   try {
//     await load(resource);
//     await update(deletions, insertions);
//     return Promise.resolve('Resource updated!');
//   } catch (err) {
//     return Promise.reject(err);
//   }
// }
// async function updateAppFolder(
//   webId: string,
//   folderUrl: string
// ): Promise<boolean> {
//   const user = $rdf.sym(webId);
//   const predicate = $rdf.sym(LPA('lpStorage'));
//   const folder = $rdf.sym(folderUrl);
//   const profile = user.doc();
//   try {
//     await load(profile);
//   } catch (err) {
//     return false;
//   }
//   const ins = [$rdf.st(user, predicate, folder, profile)];
//   const del = store.statementsMatching(user, predicate, null, profile);
//   try {
//     await updateResource(profile.value, ins, del);
//   } catch (err) {
//     return false;
//   }
//   // this.registerChanges(profile);
//   return true;
// }
async function login() {
    let session = await solid_auth_cli_1.default.currentSession();
    if (!session) {
        session = await solid_auth_cli_1.default.login({
            idp: 'https://lpapps.co:8443',
            password: 'Looper248!',
            username: 'tester2'
        });
    }
    rdf_manager_1.StorageRdfManager.updateAppFolder('https://tester2.lpapps.co:8443/profile/card#me', 'https://tester2.lpapps.co:8443/linkedpipes');
}
login();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLHVCQUF1QjtBQUN2QixrQ0FBa0M7QUFDbEMsb0VBQWtDO0FBQ2xDLDJCQUEyQjtBQUUzQiwrQ0FBa0Q7QUFFbEQsZ0VBQWdFO0FBRWhFLDhEQUE4RDtBQUU5RCw4QkFBOEI7QUFDOUIsMkNBQTJDO0FBQzNDLGlEQUFpRDtBQUNqRCxxQ0FBcUM7QUFFckMseUJBQXlCO0FBQ3pCLGlDQUFpQztBQUNqQyxpQ0FBaUM7QUFDakMsb0JBQW9CO0FBQ3BCLFVBQVU7QUFDVixnRUFBZ0U7QUFDaEUseUNBQXlDO0FBQ3pDLFVBQVU7QUFDVixvQkFBb0I7QUFDcEIsMEVBQTBFO0FBQzFFLE1BQU07QUFDTixJQUFJO0FBRUosa0RBQWtEO0FBQ2xELGdEQUFnRDtBQUNoRCxpQ0FBaUM7QUFDakMsVUFBVTtBQUNWLHNDQUFzQztBQUN0QywrQkFBK0I7QUFDL0IsMENBQTBDO0FBQzFDLFVBQVU7QUFDVixvQkFBb0I7QUFDcEIseUVBQXlFO0FBQ3pFLE1BQU07QUFDTixJQUFJO0FBRUosaUNBQWlDO0FBQ2pDLHlCQUF5QjtBQUN6QixrQ0FBa0M7QUFDbEMsZ0NBQWdDO0FBQ2hDLG9CQUFvQjtBQUNwQiw0Q0FBNEM7QUFDNUMsVUFBVTtBQUNWLDRCQUE0QjtBQUM1QiwyQ0FBMkM7QUFDM0MsbURBQW1EO0FBQ25ELG9CQUFvQjtBQUNwQixrQ0FBa0M7QUFDbEMsTUFBTTtBQUNOLElBQUk7QUFFSixrQ0FBa0M7QUFDbEMsbUJBQW1CO0FBQ25CLHNCQUFzQjtBQUN0Qix3QkFBd0I7QUFDeEIsa0NBQWtDO0FBQ2xDLGtEQUFrRDtBQUNsRCx3Q0FBd0M7QUFDeEMsZ0NBQWdDO0FBQ2hDLFVBQVU7QUFDViwyQkFBMkI7QUFDM0Isb0JBQW9CO0FBQ3BCLG9CQUFvQjtBQUNwQixNQUFNO0FBQ04sNkRBQTZEO0FBQzdELDBFQUEwRTtBQUMxRSxVQUFVO0FBQ1YscURBQXFEO0FBQ3JELG9CQUFvQjtBQUNwQixvQkFBb0I7QUFDcEIsTUFBTTtBQUNOLHNDQUFzQztBQUN0QyxpQkFBaUI7QUFDakIsSUFBSTtBQUVKLEtBQUssVUFBVSxLQUFLO0lBQ2xCLElBQUksT0FBTyxHQUFHLE1BQU0sd0JBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUMxQyxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osT0FBTyxHQUFHLE1BQU0sd0JBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsR0FBRyxFQUFFLHdCQUF3QjtZQUM3QixRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsU0FBUztTQUNwQixDQUFDLENBQUM7S0FDSjtJQUNELCtCQUFpQixDQUFDLGVBQWUsQ0FDL0IsZ0RBQWdELEVBQ2hELDRDQUE0QyxDQUM3QyxDQUFDO0FBQ0osQ0FBQztBQUVELEtBQUssRUFBRSxDQUFDIn0=