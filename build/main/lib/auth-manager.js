"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.StorageAuthenticationManager = StorageAuthenticationManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9hdXRoLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUMsQ0FBQztBQUVyRCxvQkFBb0I7QUFDcEIsTUFBTSxxQkFBcUI7SUFRekI7UUFDRSw0QkFBNEI7SUFDOUIsQ0FBQztJQVRELE1BQU0sQ0FBQyxXQUFXO1FBQ2hCLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxRQUFRLEVBQUU7WUFDbkMscUJBQXFCLENBQUMsUUFBUSxHQUFHLElBQUkscUJBQXFCLEVBQUUsQ0FBQztTQUM5RDtRQUNELE9BQU8scUJBQXFCLENBQUMsUUFBUSxDQUFDO0lBQ3hDLENBQUM7SUFNRCxLQUFLLENBQUMsS0FBa0IsRUFBRSxPQUFXO1FBQ25DLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDL0MsQ0FBQztJQUVELEtBQUssQ0FBQyxHQUFXLEVBQUUsT0FBVztRQUM1QixPQUFPLGVBQWUsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCxLQUFLLENBQUMsWUFBWSxDQUFDLFFBQWtCO1FBQ25DLGlEQUFpRDtRQUNqRCxPQUFPLGVBQWUsQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQUMsT0FBWTtRQUMvQixPQUFPLGVBQWUsQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDakQsQ0FBQztDQUNGO0FBRUQsSUFBSSw0QkFBNEIsR0FBRyxxQkFBcUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLGdEQUFnRDtBQUUvRyxvRUFBNEIifQ==