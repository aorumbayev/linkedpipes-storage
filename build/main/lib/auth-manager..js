// // tslint:disable
// import test from 'ava';
// import {
//   StorageTestAuthenticationManager,
//   StorageAuthenticationManager
// } from './auth-manager';
// import { logger } from './common';
// import {
//   SOLID_PASSWORD,
//   SOLID_PROVIDER_URL,
//   SOLID_USERNAME,
//   SOLID_WEBID
// } from './constants';
// let session;
// test('testLogin', async t => {
//   session = await StorageTestAuthenticationManager.currentSession();
//   if (!session) {
//     session = await StorageTestAuthenticationManager.login({
//       idp: SOLID_PROVIDER_URL,
//       password: SOLID_PASSWORD,
//       username: SOLID_USERNAME
//     });
//     logger.info('Authentication response: ', session.webID);
//   }
//   t.assert(session !== undefined);
// });
// test('testFetch', async t => {
//   const response = await StorageTestAuthenticationManager.fetch(SOLID_WEBID, {
//     method: 'GET',
//     Accept: 'text/turtle'
//   });
//   const secondResponse = await StorageAuthenticationManager.fetch(SOLID_WEBID, {
//     method: 'GET',
//     Accept: 'text/turtle'
//   });
//   t.assert(response.status === 200);
//   t.assert(secondResponse.status === 200);
// });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0aC1tYW5hZ2VyLi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9saWIvYXV0aC1tYW5hZ2VyLi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxvQkFBb0I7QUFDcEIsMEJBQTBCO0FBQzFCLFdBQVc7QUFDWCxzQ0FBc0M7QUFDdEMsaUNBQWlDO0FBQ2pDLDJCQUEyQjtBQUMzQixxQ0FBcUM7QUFDckMsV0FBVztBQUNYLG9CQUFvQjtBQUNwQix3QkFBd0I7QUFDeEIsb0JBQW9CO0FBQ3BCLGdCQUFnQjtBQUNoQix3QkFBd0I7QUFFeEIsZUFBZTtBQUVmLGlDQUFpQztBQUNqQyx1RUFBdUU7QUFDdkUsb0JBQW9CO0FBQ3BCLCtEQUErRDtBQUMvRCxpQ0FBaUM7QUFDakMsa0NBQWtDO0FBQ2xDLGlDQUFpQztBQUNqQyxVQUFVO0FBQ1YsK0RBQStEO0FBQy9ELE1BQU07QUFFTixxQ0FBcUM7QUFDckMsTUFBTTtBQUVOLGlDQUFpQztBQUNqQyxpRkFBaUY7QUFDakYscUJBQXFCO0FBQ3JCLDRCQUE0QjtBQUM1QixRQUFRO0FBQ1IsbUZBQW1GO0FBQ25GLHFCQUFxQjtBQUNyQiw0QkFBNEI7QUFDNUIsUUFBUTtBQUNSLHVDQUF1QztBQUN2Qyw2Q0FBNkM7QUFDN0MsTUFBTSJ9