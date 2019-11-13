const solidAuthClient = require('solid-auth-client');

/* tslint:disable */
class AuthenticationManager {
  static getInstance() {
    if (!AuthenticationManager.instance) {
      AuthenticationManager.instance = new AuthenticationManager();
    }
    return AuthenticationManager.instance;
  }
  private static instance: AuthenticationManager;
  private constructor() {
    // do something construct...
  }

  fetch(input: RequestInfo, options: {}): Promise<Response> {
    return solidAuthClient.fetch(input, options);
  }

  login(idp: string, options: {}): Promise<any> {
    return solidAuthClient.login(idp, options);
  }

  async trackSession(callback: Function): Promise<void> {
    /* eslint-disable standard/no-callback-literal */
    return solidAuthClient.trackSession(callback);
  }

  async currentSession(storage: any): Promise<any> {
    return solidAuthClient.currentSession(storage);
  }
}

let StorageAuthenticationManager = AuthenticationManager.getInstance(); // Error: constructor of 'Singleton' is private.

export { StorageAuthenticationManager };
