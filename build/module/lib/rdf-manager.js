import * as rdflib from 'rdflib';
const LPA = rdflib.Namespace('https://w3id.org/def/lpapps#');
/* tslint:disable */
class RdfManager {
    constructor() {
        /* tslint:disable */
        this.requiresForceReload = false;
        this.requiresForceReload = false;
        this.store = rdflib.graph();
        this.fetcher = new rdflib.Fetcher(this.store);
        this.updater = new rdflib.UpdateManager(this.store);
    }
    static getInstance() {
        if (!RdfManager.instance) {
            RdfManager.instance = new RdfManager();
            // ... any one time initialization goes here ...
        }
        return RdfManager.instance;
    }
    async update(deletions, insertions) {
        try {
            return this.updater.update(deletions, insertions, (uri, ok, message) => {
                console.log('uri:' + uri + '\n' + 'status:' + ok + '\n' + 'message:' + message);
                return Promise.resolve(message);
            });
        }
        catch (err) {
            return Promise.reject(new Error('Could not update the document.'));
        }
    }
    async load(document) {
        const reloadRequired = this.requiresForceReload;
        this.requiresForceReload = false;
        try {
            return this.fetcher.load(document, {
                force: reloadRequired,
                clearPreviousData: reloadRequired
            });
        }
        catch (err) {
            return Promise.reject(new Error('Could not fetch the document.'));
        }
    }
    async updateResource(resourceUrl, insertions, deletions) {
        const resource = rdflib.sym(resourceUrl);
        try {
            let response1 = await this.load(resource);
            let response2 = await this.update(deletions, insertions);
            return Promise.resolve('Resource updated!' + response1 + response2);
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    async updateAppFolder(webId, folderUrl) {
        try {
            const user = rdflib.sym(webId);
            const predicate = rdflib.sym(LPA('lpStorage'));
            const folder = rdflib.sym(folderUrl);
            const profile = user.doc();
            try {
                await this.load(profile);
            }
            catch (err) {
                return false;
            }
            const ins = [rdflib.st(user, predicate, folder, profile)];
            const del = this.store.statementsMatching(user, predicate, null, profile);
            await this.updateResource(profile.value, ins, del);
            return true;
        }
        catch (err) {
            return false;
        }
    }
}
// Usage
let StorageRdfManager = RdfManager.getInstance(); // do something with the instance...
export { rdflib, StorageRdfManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmRmLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JkZi1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sS0FBSyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBRWpDLE1BQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUM3RCxvQkFBb0I7QUFDcEIsTUFBTSxVQUFVO0lBY2Q7UUFGQSxvQkFBb0I7UUFDYix3QkFBbUIsR0FBRyxLQUFLLENBQUM7UUFFakMsSUFBSSxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQztRQUNqQyxJQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDOUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLE1BQU0sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFsQkQsTUFBTSxDQUFDLFdBQVc7UUFDaEIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLEVBQUU7WUFDeEIsVUFBVSxDQUFDLFFBQVEsR0FBRyxJQUFJLFVBQVUsRUFBRSxDQUFDO1lBQ3ZDLGdEQUFnRDtTQUNqRDtRQUNELE9BQU8sVUFBVSxDQUFDLFFBQVEsQ0FBQztJQUM3QixDQUFDO0lBY00sS0FBSyxDQUFDLE1BQU0sQ0FDakIsU0FBNkIsRUFDN0IsVUFBOEI7UUFFOUIsSUFBSTtZQUNGLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsU0FBUyxFQUFFLFVBQVUsRUFBRSxDQUFDLEdBQUcsRUFBRSxFQUFFLEVBQUUsT0FBTyxFQUFFLEVBQUU7Z0JBQ3JFLE9BQU8sQ0FBQyxHQUFHLENBQ1QsTUFBTSxHQUFHLEdBQUcs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