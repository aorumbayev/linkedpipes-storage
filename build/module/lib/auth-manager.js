const solidAuthClient = require('solid-auth-client');
/* tslint:disable */
class AuthenticationManager {
    constructor() {
        // do something construct...
    }
    static getInstance() {
        if (!AuthenticationManager.instance) {
            AuthenticationManager.instance = new AuthenticationManager();
        }
        return AuthenticationManager.instance;
    }
    fetch(input, options) {
        return solidAuthClient.fetch(input, options);
    }
    login(idp, options) {
        return solidAuthClient.login(idp, options);
    }
    async trackSession(callback) {
        /* eslint-disable standard/no-callback-literal */
        return solidAuthClient.trackSession(callback);
    }
    async currentSession(storage) {
        return solidAuthClient.currentSession(storage);
    }
}
let StorageAuthenticationManager = AuthenticationManager.getInstance(); // Error: constructor of 'Singleton' is private.
export { StorageAuthenticationManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9hdXRoLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFFckQsb0JBQW9CO0FBQ3BCLE1BQU0scUJBQXFCO0lBUXpCO1FBQ0UsNEJBQTRCO0lBQzlCLENBQUM7SUFURCxNQUFNLENBQUMsV0FBVztRQUNoQixJQUFJLENBQUMscUJBQXFCLENBQUMsUUFBUSxFQUFFO1lBQ25DLHFCQUFxQixDQUFDLFFBQVEsR0FBRyxJQUFJLHFCQUFxQixFQUFFLENBQUM7U0FDOUQ7UUFDRCxPQUFPLHFCQUFxQixDQUFDLFFBQVEsQ0FBQztJQUN4QyxDQUFDO0lBTUQsS0FBSyxDQUFDLEtBQWtCLEVBQUUsT0FBVztRQUNuQyxPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxLQUFLLENBQUMsR0FBVyxFQUFFLE9BQVc7UUFDNUIsT0FBTyxlQUFlLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxPQUFPLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBRUQsS0FBSyxDQUFDLFlBQVksQ0FBQyxRQUFrQjtRQUNuQyxpREFBaUQ7UUFDakQsT0FBTyxlQUFlLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUFDLE9BQVk7UUFDL0IsT0FBTyxlQUFlLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRjtBQUVELElBQUksNEJBQTRCLEdBQUcscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUMsQ0FBQyxnREFBZ0Q7QUFFeEgsT0FBTyxFQUFFLDRCQUE0QixFQUFFLENBQUMifQ==