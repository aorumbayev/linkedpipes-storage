"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
exports.StorageAuthenticationManager = StorageAuthenticationManager;
let StorageTestAuthenticationManager = TestAuthenticationManager.getInstance();
exports.StorageTestAuthenticationManager = StorageTestAuthenticationManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9hdXRoLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxNQUFNLGVBQWUsR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztBQUNsRCxNQUFNLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO0FBRXJELG9CQUFvQjtBQUNwQixNQUFNLHFCQUFxQjtJQVF6QjtRQUNFLDRCQUE0QjtJQUM5QixDQUFDO0lBVEQsTUFBTSxDQUFDLFdBQVc7UUFDaEIsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFFBQVEsRUFBRTtZQUNuQyxxQkFBcUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSxxQkFBcUIsRUFBRSxDQUFDO1NBQzlEO1FBQ0QsT0FBTyxxQkFBcUIsQ0FBQyxRQUFRLENBQUM7SUFDeEMsQ0FBQztJQU1ELEtBQUssQ0FBQyxLQUFrQixFQUFFLE9BQVc7UUFDbkMsT0FBTyxlQUFlLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxPQUFPLENBQUMsQ0FBQztJQUMvQyxDQUFDO0lBRUQsS0FBSyxDQUFDLEdBQVcsRUFBRSxPQUFXO1FBQzVCLE9BQU8sZUFBZSxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELEtBQUssQ0FBQyxZQUFZLENBQUMsUUFBa0I7UUFDbkMsaURBQWlEO1FBQ2pELE9BQU8sZUFBZSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxPQUFZO1FBQy9CLE9BQU8sZUFBZSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNqRCxDQUFDO0NBQ0Y7QUFFRCxNQUFNLHlCQUF5QjtJQVE3QjtRQUNFLDRCQUE0QjtJQUM5QixDQUFDO0lBVEQsTUFBTSxDQUFDLFdBQVc7UUFDaEIsSUFBSSxDQUFDLHlCQUF5QixDQUFDLFFBQVEsRUFBRTtZQUN2Qyx5QkFBeUIsQ0FBQyxRQUFRLEdBQUcsSUFBSSx5QkFBeUIsRUFBRSxDQUFDO1NBQ3RFO1FBQ0QsT0FBTyx5QkFBeUIsQ0FBQyxRQUFRLENBQUM7SUFDNUMsQ0FBQztJQU1ELEtBQUssQ0FBQyxLQUFrQixFQUFFLE9BQVc7UUFDbkMsT0FBTyxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFFRCxLQUFLLENBQUMsT0FBVztRQUNmLE9BQU8sa0JBQWtCLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYztRQUNsQixPQUFPLGtCQUFrQixDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQzdDLENBQUM7Q0FDRjtBQUVELElBQUksNEJBQTRCLEdBQUcscUJBQXFCLENBQUMsV0FBVyxFQUFFLENBQUM7QUFHOUQsb0VBQTRCO0FBRnJDLElBQUksZ0NBQWdDLEdBQUcseUJBQXlCLENBQUMsV0FBVyxFQUFFLENBQUM7QUFFeEMsNEVBQWdDIn0=