const solidAuthClient = require('solid-auth-cli');
const solidAuthClientCLI = require('solid-auth-cli');
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
class TestAuthenticationManager {
    constructor() {
        // do something construct...
    }
    static getInstance() {
        if (!TestAuthenticationManager.instance) {
            TestAuthenticationManager.instance = new TestAuthenticationManager();
        }
        return TestAuthenticationManager.instance;
    }
    fetch(input, options) {
        return solidAuthClientCLI.fetch(input, options);
    }
    login(options) {
        return solidAuthClientCLI.login(options);
    }
    async currentSession() {
        return solidAuthClientCLI.currentSession();
    }
}
let StorageAuthenticationManager = AuthenticationManager.getInstance();
let StorageTestAuthenticationManager = TestAuthenticationManager.getInstance();
export { StorageAuthenticationManager, StorageTestAuthenticationManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9hdXRoLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsTUFBTSxlQUFlLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUM7QUFDbEQsTUFBTSxrQkFBa0IsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUVyRCxvQkFBb0I7QUFDcEIsTUFBTSxxQkFBcUI7SUFRekI7UUFDRSw0QkFBNEI7SUFDOUIsQ0FBQztJQVRELE1BQU0sQ0FBQyxXQUFXO1FBQ2hCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUU7WUFDbkMscUJBQXFCLENBQUMsUUFBUSxHQUFHLElBQUkscUJBQXFCLEVBQUUsQ0FBQztTQUM5RDtRQUNELE9BQU8scUJBQXFCLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFNRCxLQUFLLENBQUMsS0FBa0IsRUFBRSxPQUFXO1FBQ25DLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFXLEVBQUUsT0FBVztRQUM1QixPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQWtCO1FBQ25DLGlEQUFpRDtRQUNqRCxPQUFPLGVBQWUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBWTtRQUMvQixPQUFPLGVBQWUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNGO0FBRUQsTUFBTSx5QkFBeUI7SUFRN0I7UUFDRSw0QkFBNEI7SUFDOUIsQ0FBQztJQVRELE1BQU0sQ0FBQyxXQUFXO1FBQ2hCLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUU7WUFDdkMseUJBQXlCLENBQUMsUUFBUSxHQUFHLElBQUkseUJBQXlCLEVBQUUsQ0FBQztTQUN0RTtRQUNELE9BQU8seUJBQXlCLENBQUMsUUFBUSxDQUFDO0lBQzVDLENBQUM7SUFNRCxLQUFLLENBQUMsS0FBa0IsRUFBRSxPQUFXO1FBQ25DLE9BQU8sa0JBQWtCLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUNsRCxDQUFDO0lBRUQsS0FBSyxDQUFDLE9BQVc7UUFDZixPQUFPLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWM7UUFDbEIsT0FBTyxrQkFBa0IsQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUM3QyxDQUFDO0NBQ0Y7QUFFRCxJQUFJLDRCQUE0QixHQUFHLHFCQUFxQixDQUFDLFdBQVcsRUFBRSxDQUFDO0FBQ3ZFLElBQUksZ0NBQWdDLEdBQUcseUJBQXlCLENBQUMsV0FBVyxFQUFFLENBQUM7QUFFL0UsT0FBTyxFQUFFLDRCQUE0QixFQUFFLGdDQUFnQyxFQUFFLENBQUMifQ==