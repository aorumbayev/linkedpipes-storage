// tslint:disable:no-ex
import * as $rdf from 'rdflib';
import auth from 'solid-auth-cli';
import { StorageFileManager, SolidResourceType } from './storage-manager';
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
async function login() {
    var session = await auth.currentSession();
    if (!session)
        session = await auth
            .login({
            idp: 'https://lpapps.co:8443',
            username: 'aorumbayev',
            password: 'Looper248!'
        })
            .then(response => {
            console.log(response);
        });
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1QkFBdUI7QUFDdkIsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFMUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTdELEtBQUssVUFBVSxLQUFLO0lBQ2xCLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFDLElBQUksQ0FBQyxPQUFPO1FBQ1YsT0FBTyxHQUFHLE1BQU0sSUFBSTthQUNqQixLQUFLLENBQUM7WUFDTCxHQUFHLEVBQUUsd0JBQXdCO1lBQzdCLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxZQUFZO1NBQ3ZCLENBQUM7YUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRVAsa0JBQWtCLENBQUMsU0FBUyxDQUFDO1FBQzNCLEtBQUssRUFBRSxtREFBbUQ7UUFDMUQsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUN6QyxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtZQUM5QixJQUFJLEVBQUUsa0RBQWtEO1lBQ3hELFFBQVEsRUFBRSxJQUFJO1NBQ2Y7S0FDRixDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFO1FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDeEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDO0FBRUQsS0FBSyxFQUFFLENBQUMifQ==