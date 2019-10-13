// tslint:disable:no-ex
import auth from 'solid-auth-cli';
import { StorageFileManager, SolidResourceType } from './storage-manager';
// const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
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
    StorageFileManager.createOrUpdateResource({
        webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
        resource: {
            type: SolidResourceType.Folder,
            path: 'https://aorumbayev.lpapps.co:8443/linkedpipes111'
        }
    }).then(response => {
        console.log(response);
    });
}
login();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1QkFBdUI7QUFDdkIsT0FBTyxJQUFJLE1BQU0sZ0JBQWdCLENBQUM7QUFDbEMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFMUUsZ0VBQWdFO0FBRWhFLEtBQUssVUFBVSxLQUFLO0lBQ2xCLElBQUksT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzFDLElBQUksQ0FBQyxPQUFPO1FBQ1YsT0FBTyxHQUFHLE1BQU0sSUFBSTthQUNqQixLQUFLLENBQUM7WUFDTCxHQUFHLEVBQUUsd0JBQXdCO1lBQzdCLFFBQVEsRUFBRSxZQUFZO1lBQ3RCLFFBQVEsRUFBRSxZQUFZO1NBQ3ZCLENBQUM7YUFDRCxJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUU7WUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDO0lBRVAsa0JBQWtCLENBQUMsc0JBQXNCLENBQUM7UUFDeEMsS0FBSyxFQUFFLG1EQUFtRDtRQUMxRCxRQUFRLEVBQUU7WUFDUixJQUFJLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtZQUM5QixJQUFJLEVBQUUsa0RBQWtEO1NBQ3pEO0tBQ0YsQ0FBQyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRTtRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3hCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUVELEtBQUssRUFBRSxDQUFDIn0=