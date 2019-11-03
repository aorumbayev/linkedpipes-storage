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
            return await solid_auth_cli_1.default.fetch(resourceConfig.resource.path, options);
        }
        catch (e) {
            throw e;
        }
    }
    static async deleteResource(resourceConfig) {
        try {
            return await solid_auth_cli_1.default.fetch(resourceConfig.resource.path, {
                method: 'DELETE'
            });
        }
        catch (e) {
            throw e;
        }
    }
    static async getResource(path) {
        try {
            const response = await solid_auth_cli_1.default.fetch(path, {
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
            const response = await solid_auth_cli_1.default.fetch(originPath, {
                method: 'GET'
            });
            const content = await response.text();
            return await solid_auth_cli_1.default.fetch(destinationPath, {
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
            return await solid_auth_cli_1.default.fetch(resourceConfig.resource.path, {
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
        return solid_auth_cli_1.default.fetch(resourceURL, {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLG9FQUF3QztBQUV4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUU3RCxJQUFLLGlCQUdKO0FBSEQsV0FBSyxpQkFBaUI7SUFDcEIsNkRBQU0sQ0FBQTtJQUNOLHlEQUFJLENBQUE7QUFDTixDQUFDLEVBSEksaUJBQWlCLEtBQWpCLGlCQUFpQixRQUdyQjtBQWtUQyw4Q0FBaUI7QUFwUm5CLE1BQU0sc0JBQXNCOztBQXlSMUIsd0RBQXNCO0FBeFJDLDhCQUFPLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pCLDJCQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25CLDRCQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLDZCQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLG9DQUFhLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLCtCQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNCLDRCQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLGlDQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQy9CLDJCQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25CLG9DQUFhLEdBQUcsR0FBRyxDQUFD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