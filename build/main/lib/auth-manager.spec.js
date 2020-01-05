"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// tslint:disable
const ava_1 = __importDefault(require("ava"));
const auth_manager_1 = require("./auth-manager");
const common_1 = require("./common");
const constants_1 = require("./constants");
let session;
ava_1.default('testLogin', async (t) => {
    session = await auth_manager_1.StorageTestAuthenticationManager.currentSession();
    if (!session) {
        session = await auth_manager_1.StorageTestAuthenticationManager.login({
            idp: constants_1.SOLID_PROVIDER_URL,
            password: constants_1.SOLID_PASSWORD,
            username: constants_1.SOLID_USERNAME
        });
        common_1.logger.info('Authentication response: ', session.webID);
    }
    t.assert(session !== undefined);
});
ava_1.default('testFetch', async (t) => {
    const response = await auth_manager_1.StorageTestAuthenticationManager.fetch(constants_1.SOLID_WEBID, {
        method: 'GET',
        Accept: 'text/turtle'
    });
    const secondResponse = await auth_manager_1.StorageAuthenticationManager.fetch(constants_1.SOLID_WEBID, {
        method: 'GET',
        Accept: 'text/turtle'
    });
    t.assert(response.status === 200);
    t.assert(secondResponse.status === 200);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1tYW5hZ2VyLnNwZWMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL2F1dGgtbWFuYWdlci5zcGVjLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsaUJBQWlCO0FBQ2pCLDhDQUF1QjtBQUN2QixpREFHd0I7QUFDeEIscUNBQWtDO0FBQ2xDLDJDQUtxQjtBQUVyQixJQUFJLE9BQU8sQ0FBQztBQUVaLGFBQUksQ0FBQyxXQUFXLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFBQyxFQUFFO0lBQzFCLE9BQU8sR0FBRyxNQUFNLCtDQUFnQyxDQUFDLGNBQWMsRUFBRSxDQUFDO0lBQ2xFLElBQUksQ0FBQyxPQUFPLEVBQUU7UUFDWixPQUFPLEdBQUcsTUFBTSwrQ0FBZ0MsQ0FBQyxLQUFLLENBQUM7WUFDckQsR0FBRyxFQUFFLDhCQUFrQjtZQUN2QixRQUFRLEVBQUUsMEJBQWM7WUFDeEIsUUFBUSxFQUFFLDBCQUFjO1NBQ3pCLENBQUMsQ0FBQztRQUNILGVBQU0sQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQ3pEO0lBRUQsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLEtBQUssU0FBUyxDQUFDLENBQUM7QUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxhQUFJLENBQUMsV0FBVyxFQUFFLEtBQUssRUFBQyxDQUFDLEVBQUMsRUFBRTtJQUMxQixNQUFNLFFBQVEsR0FBRyxNQUFNLCtDQUFnQyxDQUFDLEtBQUssQ0FBQyx1QkFBVyxFQUFFO1FBQ3pFLE1BQU0sRUFBRSxLQUFLO1FBQ2IsTUFBTSxFQUFFLGFBQWE7S0FDdEIsQ0FBQyxDQUFDO0lBQ0gsTUFBTSxjQUFjLEdBQUcsTUFBTSwyQ0FBNEIsQ0FBQyxLQUFLLENBQUMsdUJBQVcsRUFBRTtRQUMzRSxNQUFNLEVBQUUsS0FBSztRQUNiLE1BQU0sRUFBRSxhQUFhO0tBQ3RCLENBQUMsQ0FBQztJQUNILENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQztJQUNsQyxDQUFDLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDMUMsQ0FBQyxDQUFDLENBQUMifQ==