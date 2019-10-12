// tslint:disable:no-ex
import * as $rdf from 'rdflib';
import auth from 'solid-auth-client';
import { StorageFileManager, SolidResourceType } from './storage-manager';
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
async function login(idp) {
    const session = await auth.currentSession();
    if (!session)
        await auth.login(idp);
}
login('https://lpapps.co:8443');
StorageFileManager.updateACL({
    webID: 'https://aorumbayev.lpapps.co:8443/profile/card#me',
    controlModes: [ACL('READ'), ACL('WRITE')],
    resource: {
        type: SolidResourceType.Folder,
        path: 'https://aorumbayev.lpapps.co:8443/linkedpipes4/',
        isPublic: true
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvdGVzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSx1QkFBdUI7QUFDdkIsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxJQUFJLE1BQU0sbUJBQW1CLENBQUM7QUFDckMsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGlCQUFpQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFFMUUsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTdELEtBQUssVUFBVSxLQUFLLENBQUMsR0FBRztJQUN0QixNQUFNLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM1QyxJQUFJLENBQUMsT0FBTztRQUFFLE1BQU0sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUN0QyxDQUFDO0FBRUQsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUM7QUFFaEMsa0JBQWtCLENBQUMsU0FBUyxDQUFDO0lBQzNCLEtBQUssRUFBRSxtREFBbUQ7SUFDMUQsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN6QyxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtRQUM5QixJQUFJLEVBQUUsaURBQWlEO1FBQ3ZELFFBQVEsRUFBRSxJQUFJO0tBQ2Y7Q0FDRixDQUFDLENBQUMifQ==