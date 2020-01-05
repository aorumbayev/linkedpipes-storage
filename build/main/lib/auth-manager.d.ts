declare class AuthenticationManager {
    static getInstance(): AuthenticationManager;
    private static instance;
    private constructor();
    fetch(input: RequestInfo, options: {}): Promise<Response>;
    login(idp: string, options: {}): Promise<any>;
    trackSession(callback: Function): Promise<void>;
    currentSession(storage: any): Promise<any>;
}
declare class TestAuthenticationManager {
    static getInstance(): TestAuthenticationManager;
    private static instance;
    private constructor();
    fetch(input: RequestInfo, options: {}): Promise<Response>;
    login(options: {}): Promise<any>;
    currentSession(): Promise<any>;
}
declare let StorageAuthenticationManager: AuthenticationManager;
declare let StorageTestAuthenticationManager: TestAuthenticationManager;
export { StorageAuthenticationManager, StorageTestAuthenticationManager };
