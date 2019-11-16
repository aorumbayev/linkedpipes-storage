const solidAuthClient = require('solid-auth-cli');
const solidAuthClientCLI = require('solid-auth-cli');

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

class TestAuthenticationManager {
  static getInstance() {
    if (!TestAuthenticationManager.instance) {
      TestAuthenticationManager.instance = new TestAuthenticationManager();
    }
    return TestAuthenticationManager.instance;
  }
  private static instance: TestAuthenticationManager;
  private constructor() {
    // do something construct...
  }

  fetch(input: RequestInfo, options: {}): Promise<Response> {
    return solidAuthClientCLI.fetch(input, options);
  }

  login(options: {}): Promise<any> {
    return solidAuthClientCLI.login(options);
  }

  async currentSession(): Promise<any> {
    return solidAuthClientCLI.currentSession();
  }
}

let StorageAuthenticationManager = AuthenticationManager.getInstance();
let StorageTestAuthenticationManager = TestAuthenticationManager.getInstance();

export { StorageAuthenticationManager, StorageTestAuthenticationManager };
