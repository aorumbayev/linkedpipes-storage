import * as $rdf from 'rdflib';
import { StorageAuthenticationManager, StorageTestAuthenticationManager } from './auth-manager';
import { ENVIRONMENT } from './constants';
import { StorageRdfManager } from './rdf-manager';
import * as Utils from './utils';
const authClient = ENVIRONMENT === 'TEST'
    ? StorageTestAuthenticationManager
    : StorageAuthenticationManager;
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
var SolidResourceType;
(function (SolidResourceType) {
    SolidResourceType["Folder"] = "<http://www.w3.org/ns/ldp#BasicContainer>; rel=\"type\"";
    SolidResourceType["File"] = "<http://www.w3.org/ns/ldp#Resource>; rel=\"type\"";
})(SolidResourceType || (SolidResourceType = {}));
class ResourceConfig {
    constructor(resource, webID) {
        this.webID = webID;
        this.resource = resource;
    }
    fullPath() {
        return this.resource.path + '/' + this.resource.title;
    }
    fullPathWithAppendix() {
        const folderAppendix = this.resource.type === SolidResourceType.Folder ? '/' : '';
        return this.resource.path + '/' + this.resource.title + folderAppendix;
    }
}
class AccessControlConfig extends ResourceConfig {
    constructor(resource, controlModes, webID) {
        super(resource, webID);
        this.controlModes = controlModes;
    }
    fullACLPath() {
        const aclAppendix = this.resource.type === SolidResourceType.Folder ? '/' : '';
        return (this.resource.path + '/' + this.resource.title + aclAppendix + '.acl');
    }
    fullACLTitle() {
        const aclAppendix = this.resource.type === SolidResourceType.Folder ? '/' : '';
        return this.resource.title + aclAppendix + '.acl';
    }
}
class AccessControlStatementConfig extends AccessControlConfig {
    constructor(resource, controlModes, ownerNode, resourceNode, aclResourceNode, userNode, webID) {
        super(resource, controlModes, webID);
        this.ownerNode = ownerNode;
        this.resourceNode = resourceNode;
        this.aclResourceNode = aclResourceNode;
        this.userNode = userNode;
    }
}
class AccessControlNamespace {
}
AccessControlNamespace.Control = ACL('Control');
AccessControlNamespace.Read = ACL('Read');
AccessControlNamespace.Write = ACL('Write');
AccessControlNamespace.Append = ACL('Append');
AccessControlNamespace.Authorization = ACL('Authorization');
AccessControlNamespace.accessTo = ACL('accessTo');
AccessControlNamespace.agent = ACL('agent');
AccessControlNamespace.agentClass = ACL('agentClass');
AccessControlNamespace.mode = ACL('mode');
AccessControlNamespace.defaultForNew = ACL('defaultForNew');
class FOAFNamespace {
}
FOAFNamespace.Agent = FOAF('Agent');
class RDFNamespace {
}
RDFNamespace.type = RDF('type');
class StorageFileManager {
    static async updateACL(accessControlConfig) {
        try {
            const aclRequestBody = StorageFileManager.createAccessControlList(accessControlConfig);
            return StorageFileManager.createACL(accessControlConfig, aclRequestBody);
        }
        catch (e) {
            throw e;
        }
    }
    static async createACL(resourceConfig, aclBody) {
        try {
            const options = {
                body: aclBody,
                headers: {
                    'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
                },
                method: 'PUT'
            };
            return await authClient.fetch(resourceConfig.fullACLPath(), options);
        }
        catch (e) {
            throw e;
        }
    }
    static async createResource(resourceConfig) {
        try {
            const options = {
                body: resourceConfig.resource.body,
                headers: {
                    Link: resourceConfig.resource.type,
                    Slug: resourceConfig.resource.title,
                    'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
                },
                method: 'POST'
            };
            return await authClient.fetch(resourceConfig.resource.path, options);
        }
        catch (e) {
            throw e;
        }
    }
    static async deleteFolderContents(resourceConfig) {
        try {
            const { files, folders } = await StorageFileManager.getFolder(resourceConfig);
            const promises = [];
            files.forEach(file => promises.push(StorageFileManager.deleteResource(file)));
            folders.forEach(folder => promises.push(StorageFileManager.deleteFolderRecursively(folder)));
            await Promise.all(promises);
            return Promise.resolve({ status: 200 });
        }
        catch (e) {
            throw e;
        }
    }
    static async deleteResource(resourceConfig) {
        try {
            if (resourceConfig.resource.type === SolidResourceType.File) {
                return authClient.fetch(resourceConfig.fullPath(), {
                    method: 'DELETE'
                });
            }
            else {
                const response = await authClient.fetch(resourceConfig.fullPath(), {
                    method: 'DELETE'
                });
                if (response.status === 409 || response.status === 301) {
                    // Solid pod returns 409 if the item is a folder and is not empty
                    // Solid pod returns 301 if is attempted to read a folder url without
                    // '/' at the end (from buildFileUrl)
                    return StorageFileManager.deleteFolderRecursively(resourceConfig);
                }
                else {
                    return response;
                }
            }
        }
        catch (e) {
            throw e;
        }
    }
    static async getResource(path, parameters) {
        try {
            const response = await authClient.fetch(path, {
                method: 'GET',
                ...parameters
            });
            return await response.text();
        }
        catch (e) {
            throw e;
        }
    }
    static async copyFile(originPath, destinationPath) {
        try {
            const response = await authClient.fetch(originPath, {
                method: 'GET'
            });
            const content = await response.text();
            // tslint:disable
            const contentType = response.headers['contentType'];
            // tslint:enable
            await authClient
                .fetch(destinationPath, {
                method: 'PUT',
                headers: {
                    'Content-Type': contentType
                },
                body: content
            })
                .then(res => {
                return Promise.resolve({ status: 201, response: res });
            }, e => {
                throw e;
            });
        }
        catch (e) {
            throw e;
        }
    }
    static async copyFolder(originPath, destinationPath) {
        try {
            return await StorageRdfManager.fetcher.recursiveCopy(originPath, destinationPath, {
                copyACL: true,
                fetch: authClient.fetch
            });
        }
        catch (e) {
            throw e;
        }
    }
    static async copyResource(resourceConfig, destinationConfig) {
        try {
            if (resourceConfig.resource.type === SolidResourceType.File) {
                return StorageFileManager.copyFile(resourceConfig.fullPath(), destinationConfig.fullPath());
            }
            else {
                return StorageFileManager.copyFolder(resourceConfig.fullPath(), destinationConfig.fullPath());
            }
        }
        catch (e) {
            throw e;
        }
    }
    static async renameResource(oldResourceConfig, newResourceConfig) {
        try {
            if (oldResourceConfig.fullPath() !== newResourceConfig.fullPath()) {
                await StorageFileManager.copyResource(oldResourceConfig, newResourceConfig);
                return StorageFileManager.deleteResource(oldResourceConfig);
            }
            else {
                return Promise.resolve({ status: 200 });
            }
        }
        catch (e) {
            throw e;
        }
    }
    static async updateResource(resourceConfig) {
        try {
            return await authClient.fetch(resourceConfig.fullPath(), {
                method: 'PUT',
                headers: {
                    'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
                },
                body: resourceConfig.resource.body
            });
        }
        catch (e) {
            throw e;
        }
    }
    static async createOrUpdateResource(resourceConfig) {
        try {
            const result = await StorageFileManager.resourceExists(resourceConfig.fullPath());
            return result.status === 404
                ? StorageFileManager.createResource(resourceConfig)
                : StorageFileManager.updateResource(resourceConfig);
        }
        catch (e) {
            throw e;
        }
    }
    static async resourceExists(resourceURL) {
        return authClient.fetch(resourceURL, {
            headers: {
                'Content-Type': 'text/turtle'
            }
        });
    }
    static async getFolder(folderConfig) {
        const response = await StorageFileManager.getResource(folderConfig.fullPath(), {
            headers: { Accept: 'text/turtle' }
        });
        const folderRDF = await response.text();
        const graph = await Utils.textToGraph(folderRDF, folderConfig.fullPath(), 'text/turtle');
        const folderItems = Utils.extractFolderItems(graph, folderConfig.fullPath());
        return folderItems;
    }
    static createAccessControlStatement(statementConfig) {
        const acl = [
            $rdf.st(statementConfig.ownerNode, RDFNamespace.type, AccessControlNamespace.Authorization, statementConfig.aclResourceNode),
            $rdf.st(statementConfig.ownerNode, AccessControlNamespace.accessTo, statementConfig.resourceNode, statementConfig.aclResourceNode)
        ];
        if (statementConfig.userNode) {
            acl.push($rdf.st(statementConfig.ownerNode, AccessControlNamespace.agent, statementConfig.userNode, statementConfig.aclResourceNode));
        }
        else {
            acl.push($rdf.st(statementConfig.ownerNode, AccessControlNamespace.agentClass, FOAFNamespace.Agent, statementConfig.aclResourceNode));
        }
        statementConfig.controlModes.forEach(mode => {
            acl.push($rdf.st(statementConfig.ownerNode, AccessControlNamespace.mode, mode, statementConfig.aclResourceNode));
        });
        if (statementConfig.resource.type === SolidResourceType.File) {
            acl.push($rdf.st(statementConfig.ownerNode, AccessControlNamespace.defaultForNew, statementConfig.resourceNode, statementConfig.aclResourceNode));
        }
        return acl;
    }
    static createAccessControlList(accessControlConfig) {
        const resource = $rdf.sym(accessControlConfig.fullPathWithAppendix());
        const accessListUrl = accessControlConfig.fullACLPath();
        const aclResourcePath = $rdf.sym(accessListUrl);
        const user = $rdf.sym(accessControlConfig.webID);
        const owner = $rdf.sym(`${accessListUrl}#owner`);
        const ownerStatementConfig = new AccessControlStatementConfig(accessControlConfig.resource, [
            AccessControlNamespace.Read,
            AccessControlNamespace.Write,
            AccessControlNamespace.Append,
            AccessControlNamespace.Control
        ], owner, resource, aclResourcePath, user, accessControlConfig.webID);
        let acl = StorageFileManager.createAccessControlStatement(ownerStatementConfig);
        if (accessControlConfig.resource.isPublic === true) {
            const publicOwnerNode = $rdf.sym(`${accessListUrl}#public`);
            const publicStatementConfig = new AccessControlStatementConfig(accessControlConfig.resource, accessControlConfig.controlModes, publicOwnerNode, resource, aclResourcePath, undefined, accessControlConfig.webID);
            acl = acl.concat(StorageFileManager.createAccessControlStatement(publicStatementConfig));
        }
        const finalACL = acl.join('\n').toString();
        const newStore = $rdf.graph();
        $rdf.parse(finalACL, newStore, accessControlConfig.fullPath(), 'text/turtle', undefined);
        const response = newStore.serialize(accessListUrl, 'text/turtle', '');
        return response;
    }
}
StorageFileManager.deleteFolderRecursively = async (resourceConfig) => {
    await StorageFileManager.deleteFolderContents(resourceConfig);
    return StorageFileManager.deleteResource(resourceConfig);
};
export { SolidResourceType, AccessControlConfig, ResourceConfig, AccessControlStatementConfig, AccessControlNamespace, FOAFNamespace, RDFNamespace, StorageFileManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUNMLDRCQUE0QixFQUM1QixnQ0FBZ0MsRUFDakMsTUFBTSxnQkFBZ0IsQ0FBQztBQUN4QixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNsRCxPQUFPLEtBQUssS0FBSyxNQUFNLFNBQVMsQ0FBQztBQUVqQyxNQUFNLFVBQVUsR0FDZCxXQUFXLEtBQUssTUFBTTtJQUNwQixDQUFDLENBQUMsZ0NBQWdDO0lBQ2xDLENBQUMsQ0FBQyw0QkFBNEIsQ0FBQztBQUNuQyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUU3RCxJQUFLLGlCQUdKO0FBSEQsV0FBSyxpQkFBaUI7SUFDcEIsdUZBQWdFLENBQUE7SUFDaEUsK0VBQXdELENBQUE7QUFDMUQsQ0FBQyxFQUhJLGlCQUFpQixLQUFqQixpQkFBaUIsUUFHckI7QUFXRCxNQUFNLGNBQWM7SUFJbEIsWUFBWSxRQUF1QixFQUFFLEtBQWM7UUFDakQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVNLFFBQVE7UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FB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