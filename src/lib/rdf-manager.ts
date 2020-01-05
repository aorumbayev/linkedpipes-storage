/* istanbul ignore file */
import * as rdflib from 'rdflib';

const LPA = rdflib.Namespace('https://w3id.org/def/lpapps#');
/* tslint:disable */
/**
 * The RdfManager class encapsulating some LPA specific logic and general
 * rdflib library
 */
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

  /**
   * A method to update an current rdflib graph instance
   * @param deletions rdflib statements to delete
   * @param insertions rdflib statements to insert
   */
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

  /**
   * A method to load and parse an RDF lib into rdflib graph
   * @param document NamedNode to load
   */
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

  /**
   * Updates rdf file
   * @param resourceUrl Resource to url
   * @param insertions Rdflib insertions to perform
   * @param deletions Rdflib deletions to perform
   */
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

  /**
   * Method sets reference to folder with linkedpipes applications
   * configurations for particlar webId
   * @param webId WebId of the user
   * @param folderUrl Path to the lpa folder in pod
   */
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
