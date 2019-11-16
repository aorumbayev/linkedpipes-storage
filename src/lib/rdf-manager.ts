import * as rdflib from 'rdflib';

const LPA = rdflib.Namespace('https://w3id.org/def/lpapps#');
/* tslint:disable */
class RdfManager {
  static getInstance() {
    if (!RdfManager.instance) {
      RdfManager.instance = new RdfManager();
      // ... any one time initialization goes here ...
    }
    return RdfManager.instance;
  }
  private static instance: RdfManager;
  store: any;
  fetcher: rdflib.Fetcher;
  updater: rdflib.UpdateManager;
  /* tslint:disable */
  public requiresForceReload = false;
  private constructor() {
    this.requiresForceReload = false;
    this.store = rdflib.graph();
    this.fetcher = new rdflib.Fetcher(this.store);
    this.updater = new rdflib.UpdateManager(this.store);
  }

  public async update(
    deletions: rdflib.Statement[],
    insertions: rdflib.Statement[]
  ): Promise<any> {
    try {
      return this.updater.update(deletions, insertions, (uri, ok, message) => {
        console.log(
          'uri:' + uri + '\n' + 'status:' + ok + '\n' + 'message:' + message
        );
        return Promise.resolve(message);
      });
    } catch (err) {
      return Promise.reject(new Error('Could not update the document.'));
    }
  }

  public async load(document: rdflib.NamedNode): Promise<any> {
    const reloadRequired = this.requiresForceReload;
    this.requiresForceReload = false;
    try {
      return this.fetcher.load(document, {
        force: reloadRequired,
        clearPreviousData: reloadRequired
      });
    } catch (err) {
      return Promise.reject(new Error('Could not fetch the document.'));
    }
  }

  public async updateResource(
    resourceUrl: string,
    insertions: rdflib.Statement[],
    deletions: rdflib.Statement[]
  ): Promise<any> {
    const resource = rdflib.sym(resourceUrl);
    try {
      let response1 = await this.load(resource);
      let response2 = await this.update(deletions, insertions);
      return Promise.resolve('Resource updated!' + response1 + response2);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  public async updateAppFolder(
    webId: string,
    folderUrl: string
  ): Promise<boolean> {
    try {
      const user = rdflib.sym(webId);
      const predicate = rdflib.sym(LPA('lpStorage'));
      const folder = rdflib.sym(folderUrl);
      const profile = user.doc();
      try {
        await this.load(profile);
      } catch (err) {
        return false;
      }
      const ins = [rdflib.st(user, predicate, folder, profile)];
      const del = this.store.statementsMatching(user, predicate, null, profile);
      await this.updateResource(profile.value, ins, del);
      return true;
    } catch (err) {
      return false;
    }
  }
}

// Usage

let StorageRdfManager = RdfManager.getInstance(); // do something with the instance...

export { rdflib, StorageRdfManager };
