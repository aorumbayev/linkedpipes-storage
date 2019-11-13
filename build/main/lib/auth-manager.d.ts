declare class AuthenticationManager {
    static getInstance(): AuthenticationManager;
    private static instance;
    private constructor();
    fetch(input: RequestInfo, options: {}): Promise<Response>;
    login(idp: string, options: {}): Promise<any>;
    trackSession(callback: Function): Promise<void>;
    currentSession(storage: any): Promise<any>;
}
declare let StorageAuthenticationManager: AuthenticationManager;
export { StorageAuthenticationManager };
