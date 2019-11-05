"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const $rdf = __importStar(require("rdflib"));
const solid_auth_cli_1 = __importDefault(require("solid-auth-cli"));
const constants_1 = require("./constants");
const rdf_manager_1 = require("./rdf-manager");
const Utils = __importStar(require("./utils"));
const authClient = constants_1.ENVIRONMENT === 'TEST' ? solid_auth_cli_1.default : solid_auth_cli_1.default;
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
var SolidResourceType;
(function (SolidResourceType) {
    SolidResourceType["Folder"] = "<http://www.w3.org/ns/ldp#BasicContainer>; rel=\"type\"";
    SolidResourceType["File"] = "<http://www.w3.org/ns/ldp#Resource>; rel=\"type\"";
})(SolidResourceType || (SolidResourceType = {}));
exports.SolidResourceType = SolidResourceType;
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
exports.ResourceConfig = ResourceConfig;
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
exports.AccessControlConfig = AccessControlConfig;
class AccessControlStatementConfig extends AccessControlConfig {
    constructor(resource, controlModes, ownerNode, resourceNode, aclResourceNode, userNode, webID) {
        super(resource, controlModes, webID);
        this.ownerNode = ownerNode;
        this.resourceNode = resourceNode;
        this.aclResourceNode = aclResourceNode;
        this.userNode = userNode;
    }
}
exports.AccessControlStatementConfig = AccessControlStatementConfig;
class AccessControlNamespace {
}
exports.AccessControlNamespace = AccessControlNamespace;
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
exports.FOAFNamespace = FOAFNamespace;
FOAFNamespace.Agent = FOAF('Agent');
class RDFNamespace {
}
exports.RDFNamespace = RDFNamespace;
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
            const response = await authClient.fetch(path, Object.assign({ method: 'GET' }, parameters));
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
            await authClient
                .fetch(destinationPath, {
                method: 'PUT',
                headers: {
                    'Content-Type': response.headers.contentType
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
            return await rdf_manager_1.fetcher.recursiveCopy(originPath, destinationPath, {
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
exports.StorageFileManager = StorageFileManager;
StorageFileManager.deleteFolderRecursively = async (resourceConfig) => {
    await StorageFileManager.deleteFolderContents(resourceConfig);
    return StorageFileManager.deleteResource(resourceConfig);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLG9FQUF3QztBQUN4QywyQ0FBMEM7QUFDMUMsK0NBQXdDO0FBQ3hDLCtDQUFpQztBQUNqQyxNQUFNLFVBQVUsR0FBRyx1QkFBVyxLQUFLLE1BQU0sQ0FBQyxDQUFDLENBQUMsd0JBQVUsQ0FBQyxDQUFDLENBQUMsd0JBQVUsQ0FBQztBQUVwRSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUU3RCxJQUFLLGlCQUdKO0FBSEQsV0FBSyxpQkFBaUI7SUFDcEIsdUZBQWdFLENBQUE7SUFDaEUsK0VBQXdELENBQUE7QUFDMUQsQ0FBQyxFQUhJLGlCQUFpQixLQUFqQixpQkFBaUIsUUFHckI7QUE0ZUMsOENBQWlCO0FBamVuQixNQUFNLGNBQWM7SUFJbEIsWUFBWSxRQUF1QixFQUFFLEtBQWM7UUFDakQsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7SUFDM0IsQ0FBQztJQUVNLFFBQVE7UUFDYixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztJQUN4RCxDQUFDO0lBRU0sb0JBQW9CO1FBQ3pCLE1BQU0sY0FBYyxHQUNsQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksS0FBSyxpQkFBaUIsQ0FBQyxNQUFNLENB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