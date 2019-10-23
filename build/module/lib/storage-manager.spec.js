import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import { SolidResourceType, StorageFileManager } from './storage-manager';
let session;
const webID = 'https://aorumbayev.lpapps.co:8443/profile/card#me';
const fileConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid.v4()}`,
        type: SolidResourceType.Folder
    },
    webID
};
const folderConfigurationResource = {
    resource: {
        path: `https://tester1.inrupt.net/${uuid.v4()}`,
        type: SolidResourceType.Folder
    },
    webID
};
test.before(async () => {
    session = await auth.currentSession();
    if (!session) {
        session = await auth.login({
            idp: 'https://inrupt.net',
            password: 'Looper248!',
            username: 'tester1'
        });
    }
});
test.serial('createFolderResource', async (t) => {
    const result = await StorageFileManager.createResource(folderConfigurationResource);
    t.is(result.status, 201);
});
test.serial('deleteFolderResource', async (t) => {
    const result = await StorageFileManager.deleteResource(folderConfigurationResource);
    t.is(result.status, 200);
});
test.serial('createFileResource', async (t) => {
    const result = await StorageFileManager.createResource(fileConfigurationResource);
    t.is(result.status, 201);
});
test.serial('deleteFileResource', async (t) => {
    const result = await StorageFileManager.deleteResource(fileConfigurationResource);
    t.is(result.status, 200);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUVMLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbkIsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQixJQUFJLE9BQU8sQ0FBQztBQUVaLE1BQU0sS0FBSyxHQUFHLG1EQUFtRCxDQUFDO0FBRWxFLE1BQU0seUJBQXlCLEdBQW1CO0lBQ2hELFFBQVEsRUFBRTtRQUNSLElBQUksRUFBRSw4QkFBOEIsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFO1FBQy9DLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxNQUFNO0tBQy9CO0lBQ0QsS0FBSztDQUNOLENBQUM7QUFFRixNQUFNLDJCQUEyQixHQUFtQjtJQUNsRCxRQUFRLEVBQUU7UUFDUixJQUFJLEVBQUUsOEJBQThCLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRTtRQUMvQyxJQUFJLEVBQUUsaUJBQWlCLENBQUMsTUFBTTtLQUMvQjtJQUNELEtBQUs7Q0FDTixDQUFDO0FBRUYsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLElBQUksRUFBRTtJQUNyQixPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsY0FBYyxFQUFFLENBQUM7SUFDdEMsSUFBSSxDQUFDLE9BQU8sRUFBRTtRQUNaLE9BQU8sR0FBRyxNQUFNLElBQUksQ0FBQyxLQUFLLENBQUM7WUFDekIsR0FBRyxFQUFFLG9CQUFvQjtZQUN6QixRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsU0FBUztTQUNwQixDQUFDLENBQUM7S0FDSjtBQUNILENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxjQUFjLENBQ3BELDJCQUEyQixDQUM1QixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxzQkFBc0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDNUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxjQUFjLENBQ3BELDJCQUEyQixDQUM1QixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxjQUFjLENBQ3BELHlCQUF5QixDQUMxQixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDO0FBRUgsSUFBSSxDQUFDLE1BQU0sQ0FBQyxvQkFBb0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDMUMsTUFBTSxNQUFNLEdBQUcsTUFBTSxrQkFBa0IsQ0FBQyxjQUFjLENBQ3BELHlCQUF5QixDQUMxQixDQUFDO0lBQ0YsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQyxDQUFDIn0=