import test from 'ava';
import auth from 'solid-auth-cli';
import uuid from 'uuid';
import { SolidResourceType, StorageFileManager } from './storage-manager';
let session;
const webID = 'https://aorumbayev.lpapps.co:8443/profile/card#me';
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
test('createResource', async (t) => {
    const resourcePath = `https://tester1.inrupt.net/${uuid.v4()}`;
    const configurationResource = {
        resource: {
            path: resourcePath,
            type: SolidResourceType.Folder
        },
        webID
    };
    return StorageFileManager.createResource(configurationResource).then(result => {
        t.is(result.status, 201);
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3N0b3JhZ2UtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sSUFBSSxNQUFNLEtBQUssQ0FBQztBQUN2QixPQUFPLElBQUksTUFBTSxnQkFBZ0IsQ0FBQztBQUNsQyxPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxFQUVMLGlCQUFpQixFQUNqQixrQkFBa0IsRUFDbkIsTUFBTSxtQkFBbUIsQ0FBQztBQUUzQixJQUFJLE9BQU8sQ0FBQztBQUNaLE1BQU0sS0FBSyxHQUFHLG1EQUFtRCxDQUFDO0FBRWxFLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDckIsT0FBTyxHQUFHLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ3RDLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLEdBQUcsTUFBTSxJQUFJLENBQUMsS0FBSyxDQUFDO1lBQ3pCLEdBQUcsRUFBRSxvQkFBb0I7WUFDekIsUUFBUSxFQUFFLFlBQVk7WUFDdEIsUUFBUSxFQUFFLFNBQVM7U0FDcEIsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxLQUFLLEVBQUMsQ0FBQyxFQUFDLEVBQUU7SUFDL0IsTUFBTSxZQUFZLEdBQUcsOEJBQThCLElBQUksQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQy9ELE1BQU0scUJBQXFCLEdBQW1CO1FBQzVDLFFBQVEsRUFBRTtZQUNSLElBQUksRUFBRSxZQUFZO1lBQ2xCLElBQUksRUFBRSxpQkFBaUIsQ0FBQyxNQUFNO1NBQy9CO1FBQ0QsS0FBSztLQUNOLENBQUM7SUFDRixPQUFPLGtCQUFrQixDQUFDLGNBQWMsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLElBQUksQ0FDbEUsTUFBTSxDQUFDLEVBQUU7UUFDUCxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDM0IsQ0FBQyxDQUNGLENBQUM7QUFDSixDQUFDLENBQUMsQ0FBQyJ9