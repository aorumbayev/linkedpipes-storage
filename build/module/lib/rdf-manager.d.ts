import * as rdflib from 'rdflib';
declare class RdfManager {
    static getInstance(): RdfManager;
    private static instance;
    store: any;
    fetcher: rdflib.Fetcher;
    updater: rdflib.UpdateManager;
    requiresForceReload: boolean;
    private constructor();
    update(deletions: rdflib.Statement[], insertions: rdflib.Statement[]): Promise<any>;
    load(document: rdflib.NamedNode): Promise<any>;
    updateResource(resourceUrl: string, insertions: rdflib.Statement[], deletions: rdflib.Statement[]): Promise<any>;
    updateAppFolder(webId: string, folderUrl: string): Promise<boolean>;
}
declare let StorageRdfManager: RdfManager;
export { rdflib, StorageRdfManager };
