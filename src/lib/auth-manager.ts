/* istanbul ignore file */
const solidAuthClient = require('solid-auth-client');
const solidAuthClientCLI = require('solid-auth-cli');

/* tslint:disable */
/**
 * AuthenticationManager class responsible for authentication of users by WebID
 */
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

  /**
   * Forwards fetch requests to solidAuthClient
   * @param input RequestInfo object forwared to solidAuthClient library
   * @param options Additional options passed into fetch HTTP request
   */
  fetch(input: RequestInfo, options: {} = {}): Promise<Response> {
    return solidAuthClient.fetch(input, options);
  }

  /**
   * Forwards login requests to solidAuthCLient
   * @param idp The string representing solid provider
   * @param options Additional properties passed into login
   */
  login(idp: string, options: {}): Promise<any> {
    return solidAuthClient.login(idp, options);
  }

  /**
   * Notifies the listener about login and logout states of the session
   * @param callback Callback to invoke every time session status is updated
   */
  async trackSession(callback: Function): Promise<void> {
    /* eslint-disable standard/no-callback-literal */
    return solidAuthClient.trackSession(callback);
  }

  /**
   * Returns current sessions
   * @param storage Reference to browser storage holding the session
   */
  async currentSession(storage: any): Promise<any> {
    return solidAuthClient.currentSession(storage);
  }
}

/**
 * Test class used only for unit testing, main difference is the ability to
 * authenticate programmatically.
 */
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

  fetch(input: RequestInfo, options: {} = {}): Promise<Response> {
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

export {
  solidAuthClient,
  StorageAuthenticationManager,
  StorageTestAuthenticationManager
};
