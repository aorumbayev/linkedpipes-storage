import * as $rdf from 'rdflib';
import { StorageAuthenticationManager as authClient } from './auth-manager';
import { fetcher } from './rdf-manager';
import * as Utils from './utils';
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
            return await fetcher.recursiveCopy(originPath, destinationPath, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxFQUFFLDRCQUE0QixJQUFJLFVBQVUsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzVFLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDeEMsT0FBTyxLQUFLLEtBQUssTUFBTSxTQUFTLENBQUM7QUFFakMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzFFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFFN0QsSUFBSyxpQkFHSjtBQUhELFdBQUssaUJBQWlCO0lBQ3BCLHVGQUFnRSxDQUFBO0lBQ2hFLCtFQUF3RCxDQUFBO0FBQzFELENBQUMsRUFISSxpQkFBaUIsS0FBakIsaUJBQWlCLFFBR3JCO0FBV0QsTUFBTSxjQUFjO0lBSWxCLFlBQVksUUFBdUIsRUFBRSxLQUFjO1FBQ2pELElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO0lBQzNCLENBQUM7SUFFTSxRQUFRO1FBQ2IsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDeEQsQ0FBQztJQUVNLG9CQUFvQjtRQUN6QixNQUFNLGNBQWMsR0FDbEIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEtBQUssaUJBQWlCLENBQUMsTUFBTSxDQUFDLENBQUMs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