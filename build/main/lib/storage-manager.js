"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const $rdf = __importStar(require("rdflib"));
const auth_manager_1 = require("./auth-manager");
const rdf_manager_1 = require("./rdf-manager");
const Utils = __importStar(require("./utils"));
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
            return await auth_manager_1.StorageAuthenticationManager.fetch(resourceConfig.fullACLPath(), options);
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
            return await auth_manager_1.StorageAuthenticationManager.fetch(resourceConfig.resource.path, options);
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
                return auth_manager_1.StorageAuthenticationManager.fetch(resourceConfig.fullPath(), {
                    method: 'DELETE'
                });
            }
            else {
                const response = await auth_manager_1.StorageAuthenticationManager.fetch(resourceConfig.fullPath(), {
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
            const response = await auth_manager_1.StorageAuthenticationManager.fetch(path, Object.assign({ method: 'GET' }, parameters));
            return await response.text();
        }
        catch (e) {
            throw e;
        }
    }
    static async copyFile(originPath, destinationPath) {
        try {
            const response = await auth_manager_1.StorageAuthenticationManager.fetch(originPath, {
                method: 'GET'
            });
            const content = await response.text();
            // tslint:disable
            const contentType = response.headers['contentType'];
            // tslint:enable
            await auth_manager_1.StorageAuthenticationManager
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
            return await rdf_manager_1.fetcher.recursiveCopy(originPath, destinationPath, {
                copyACL: true,
                fetch: auth_manager_1.StorageAuthenticationManager.fetch
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
            return await auth_manager_1.StorageAuthenticationManager.fetch(resourceConfig.fullPath(), {
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
        return auth_manager_1.StorageAuthenticationManager.fetch(resourceURL, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLGlEQUE0RTtBQUM1RSwrQ0FBd0M7QUFDeEMsK0NBQWlDO0FBRWpDLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUMxRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTdELElBQUssaUJBR0o7QUFIRCxXQUFLLGlCQUFpQjtJQUNwQix1RkFBZ0UsQ0FBQTtJQUNoRSwrRUFBd0QsQ0FBQTtBQUMxRCxDQUFDLEVBSEksaUJBQWlCLEtBQWpCLGlCQUFpQixRQUdyQjtBQStlQyw4Q0FBaUI7QUFwZW5CLE1BQU0sY0FBYztJQUlsQixZQUFZLFFBQXVCLEVBQUUsS0FBYztRQUNqRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUNuQixJQUFJLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztJQUMzQixDQUFDO0lBRU0sUUFBUTtRQUNiLE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsR0FBRyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ3hELENBQUM7SUFFTSxvQkFBb0I7UUFDekIsTUFBTSxjQUFjLEdBQ2xCLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxLQUFLLGlCQUFpQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDN0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxD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