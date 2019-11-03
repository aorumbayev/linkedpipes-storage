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
const solid_auth_client_1 = __importDefault(require("solid-auth-client"));
const constants_1 = require("./constants");
const authClient = constants_1.ENVIRONMENT === 'TEST' ? solid_auth_cli_1.default : solid_auth_client_1.default;
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
var SolidResourceType;
(function (SolidResourceType) {
    SolidResourceType[SolidResourceType["Folder"] = 0] = "Folder";
    SolidResourceType[SolidResourceType["File"] = 1] = "File";
})(SolidResourceType || (SolidResourceType = {}));
exports.SolidResourceType = SolidResourceType;
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
        const accessListUrl = `${accessControlConfig.resource.path}.acl`;
        const aclRequestBody = StorageFileManager.createAccessControlList(accessControlConfig);
        return StorageFileManager.createResource({
            webID: accessControlConfig.webID,
            resource: Object.assign(Object.assign({}, accessControlConfig.resource), { path: accessListUrl, body: aclRequestBody })
        });
    }
    static async createResource(resourceConfig) {
        try {
            const options = {
                body: resourceConfig.resource.body,
                headers: {
                    'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
                },
                method: 'PUT'
            };
            return await authClient.fetch(resourceConfig.resource.path, options);
        }
        catch (e) {
            throw e;
        }
    }
    static async deleteResource(resourceConfig) {
        try {
            return await authClient.fetch(resourceConfig.resource.path, {
                method: 'DELETE'
            });
        }
        catch (e) {
            throw e;
        }
    }
    static async getResource(path) {
        try {
            const response = await authClient.fetch(path, {
                method: 'GET'
            });
            return await response.text();
        }
        catch (e) {
            throw e;
        }
    }
    static async copyResource(originPath, destinationPath) {
        try {
            const response = await authClient.fetch(originPath, {
                method: 'GET'
            });
            const content = await response.text();
            return await authClient.fetch(destinationPath, {
                method: 'PUT',
                headers: {
                    'Content-Type': response.headers.contentType
                },
                body: content
            });
        }
        catch (e) {
            throw e;
        }
    }
    static async renameResource(oldResourceConfig, newResourceConfig) {
        try {
            await StorageFileManager.copyResource(oldResourceConfig.resource.path, newResourceConfig.resource.path);
            if (oldResourceConfig.resource.path !== newResourceConfig.resource.path) {
                return await StorageFileManager.deleteResource(oldResourceConfig);
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
            return await authClient.fetch(resourceConfig.resource.path, {
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
            const result = await StorageFileManager.resourceExists(resourceConfig.resource.path);
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
        const resource = $rdf.sym(accessControlConfig.resource.path);
        const accessListUrl = `${accessControlConfig.resource.path}.acl`;
        const aclResourcePath = $rdf.sym(accessListUrl);
        const user = $rdf.sym(accessControlConfig.webID);
        const owner = $rdf.sym(`${accessListUrl}#owner`);
        const ownerStatementConfig = Object.assign(Object.assign({}, accessControlConfig), { controlModes: [
                AccessControlNamespace.Read,
                AccessControlNamespace.Write,
                AccessControlNamespace.Append,
                AccessControlNamespace.Control
            ], ownerNode: owner, userNode: user, resourceNode: resource, aclResourceNode: aclResourcePath });
        let acl = StorageFileManager.createAccessControlStatement(ownerStatementConfig);
        if (accessControlConfig.resource.isPublic === true) {
            const publicOwnerNode = $rdf.sym(`${accessListUrl}#public`);
            const publicStatementConfig = Object.assign(Object.assign({}, accessControlConfig), { ownerNode: publicOwnerNode, resourceNode: resource, aclResourceNode: aclResourcePath });
            acl = acl.concat(StorageFileManager.createAccessControlStatement(publicStatementConfig));
        }
        const finalACL = acl.join('\n').toString();
        const newStore = $rdf.graph();
        $rdf.parse(finalACL, newStore, accessControlConfig.resource.path, 'text/turtle', undefined);
        const response = newStore.serialize(accessListUrl, 'text/turtle', '');
        return response;
    }
}
exports.StorageFileManager = StorageFileManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLG9FQUF3QztBQUN4QywwRUFBMEM7QUFDMUMsMkNBQTBDO0FBQzFDLE1BQU0sVUFBVSxHQUFHLHVCQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyx3QkFBVSxDQUFDLENBQUMsQ0FBQywyQkFBUyxDQUFDO0FBRW5FLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsNkNBQTZDLENBQUMsQ0FBQztBQUMxRSxNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDRCQUE0QixDQUFDLENBQUM7QUFDMUQsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFDO0FBRTdELElBQUssaUJBR0o7QUFIRCxXQUFLLGlCQUFpQjtJQUNwQiw2REFBTSxDQUFBO0lBQ04seURBQUksQ0FBQTtBQUNOLENBQUMsRUFISSxpQkFBaUIsS0FBakIsaUJBQWlCLFFBR3JCO0FBa1RDLDhDQUFpQjtBQXBSbkIsTUFBTSxzQkFBc0I7O0FBeVIxQix3REFBc0I7QUF4UkMsOEJBQU8sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekIsMkJBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsNEJBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsNkJBQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkIsb0NBQWEsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckMsK0JBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0IsNEJBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7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