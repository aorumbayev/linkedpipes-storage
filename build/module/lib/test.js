// tslint:disable:no-ex
import * as $rdf from 'rdflib';
import auth from 'solid-auth-client';
import { StorageFileManager, SolidResourceType } from './storage-manager';
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
async function login() {
    let session = await auth.currentSession();
    let popupUri = 'https://solid.community/common/popup.html';
    if (!session)
        session = await auth.popupLogin({ popupUri });
    StorageFileManager.updateACL({
        webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
        controlModes: [ACL('READ'), ACL('WRITE')],
        resource: {
            type: SolidResourceType.Folder,
            path: 'https://aorumbayev.lpapps.co:8443/linkedpipes43/',
            isPublic: true
        }
    }).then(response => {
        console.log(response);
    });
}
login();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1QkFBdUI7QUFDdkIsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxJQUFJLE1BQU0sbUJBQW1CLENBQUM7QUFDckMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFMUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTdELEtBQUssVUFBVSxLQUFLO0lBQ2xCLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFDLElBQUksUUFBUSxHQUFHLDJDQUEyQyxDQUFDO0lBQzNELElBQUksQ0FBQyxPQUFPO1FBQUUsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUM7SUFFNUQsa0JBQWtCLENBQUMsU0FBUyxDQUFDO1FBQzNCLEtBQUssRUFBRSxtREFBbUQ7UUFDMUQsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtZQUM5QixJQUFJLEVBQUUsa0RBQWtEO1lBQ3hELFFBQVEsRUFBRSxJQUFJO1NBQ2Y7S0FDRixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsS0FBSyxFQUFFLENBQUMifQ==