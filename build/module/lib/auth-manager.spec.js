// tslint:disable
import test from 'ava';
import { StorageTestAuthenticationManager, StorageAuthenticationManager } from './auth-manager';
import { logger } from './common';
import { SOLID_PASSWORD, SOLID_PROVIDER_URL, SOLID_USERNAME, SOLID_WEBID } from './constants';
let session;
test('testLogin', async (t) => {
    session = await StorageTestAuthenticationManager.currentSession();
    if (!session) {
        session = await StorageTestAuthenticationManager.login({
            idp: SOLID_PROVIDER_URL,
            password: SOLID_PASSWORD,
            username: SOLID_USERNAME
        });
        logger.info('Authentication response: ', session.webID);
    }
    t.assert(session !== undefined);
});
test('testFetch', async (t) => {
    const response = await StorageTestAuthenticationManager.fetch(SOLID_WEBID, {
        method: 'GET',
        Accept: 'text/turtle'
    });
    const secondResponse = await StorageAuthenticationManager.fetch(SOLID_WEBID, {
        method: 'GET',
        Accept: 'text/turtle'
    });
    t.assert(response.status === 200);
    t.assert(secondResponse.status === 200);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2F1dGgtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLGlCQUFpQjtBQUNqQixPQUFPLElBQUksTUFBTSxLQUFLLENBQUM7QUFDdkIsT0FBTyxFQUNMLGdDQUFnQyxFQUNoQyw0QkFBNEIsRUFDN0IsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ2xDLE9BQU8sRUFDTCxjQUFjLEVBQ2Qsa0JBQWtCLEVBQ2xCLGNBQWMsRUFDZCxXQUFXLEVBQ1osTUFBTSxhQUFhLENBQUM7QUFFckIsSUFBSSxPQUFPLENBQUM7QUFFWixJQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUMxQixPQUFPLEdBQUcsTUFBTSxnQ0FBZ0MsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUNsRSxJQUFJLENBQUMsT0FBTyxFQUFFO1FBQ1osT0FBTyxHQUFHLE1BQU0sZ0NBQWdDLENBQUMsS0FBSyxDQUFDO1lBQ3JELEdBQUcsRUFBRSxrQkFBa0I7WUFDdkIsUUFBUSxFQUFFLGNBQWM7WUFDeEIsUUFBUSxFQUFFLGNBQWM7U0FDekIsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxDQUFDLElBQUksQ0FBQywyQkFBMkIsRUFBRSxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDekQ7SUFFRCxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sS0FBSyxTQUFTLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUMsQ0FBQztBQUVILElBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzFCLE1BQU0sUUFBUSxHQUFHLE1BQU0sZ0NBQWdDLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUN6RSxNQUFNLEVBQUUsS0FBSztRQUNiLE1BQU0sRUFBRSxhQUFhO0tBQ3RCLENBQUMsQ0FBQztJQUNILE1BQU0sY0FBYyxHQUFHLE1BQU0sNEJBQTRCLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRTtRQUMzRSxNQUFNLEVBQUUsS0FBSztRQUNiLE1BQU0sRUFBRSxhQUFhO0tBQ3RCLENBQUMsQ0FBQztJQUNILENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDMUMsQ0FBQyxDQUFDLENBQUMifQ==