"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rdflib = __importStar(require("rdflib"));
exports.rdflib = rdflib;
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
exports.StorageRdfManager = StorageRdfManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmRmLW1hbmFnZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3JkZi1tYW5hZ2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBLCtDQUFpQztBQWlHeEIsd0JBQU07QUEvRmYsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0FBQzdELG9CQUFvQjtBQUNwQixNQUFNLFVBQVU7SUFjZDtRQUZBLG9CQUFvQjtRQUNiLHdCQUFtQixHQUFHLEtBQUssQ0FBQztRQUVqQyxJQUFJLENBQUMsbUJBQW1CLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQzVCLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksTUFBTSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQWxCRCxNQUFNLENBQUMsV0FBVztRQUNoQixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRTtZQUN4QixVQUFVLENBQUMsUUFBUSxHQUFHLElBQUksVUFBVSxFQUFFLENBQUM7WUFDdkMsZ0RBQWdEO1NBQ2pEO1FBQ0QsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDO0lBQzdCLENBQUM7SUFjTSxLQUFLLENBQUMsTUFBTSxDQUNqQixTQUE2QixFQUM3QixVQUE4QjtRQUU5QixJQUFJO1lBQ0YsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsVUFBVSxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRTtnQkFDckUsT0FBTyxDQUFDLEdBQUcsQ0FDVCxNQUFNLEdBQUcsR0FBRyxH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