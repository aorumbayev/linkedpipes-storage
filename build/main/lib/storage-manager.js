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
                    'Content-Type': 'text/turtle'
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
    static async updateResource(resourceConfig) {
        try {
            await StorageFileManager.deleteResource(resourceConfig);
            return await StorageFileManager.createResource(resourceConfig);
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
            acl = acl.concat(this.createAccessControlStatement(publicStatementConfig));
        }
        const finalACL = acl.join('\n').toString();
        const newStore = $rdf.graph();
        $rdf.parse(finalACL, newStore, accessControlConfig.resource.path, 'text/turtle', undefined);
        const response = newStore.serialize(accessListUrl, 'text/turtle', '');
        return response;
    }
}
exports.StorageFileManager = StorageFileManager;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsNkNBQStCO0FBQy9CLG9FQUF3QztBQUV4QyxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUU3RCxJQUFLLGlCQUdKO0FBSEQsV0FBSyxpQkFBaUI7SUFDcEIsNkRBQU0sQ0FBQTtJQUNOLHlEQUFJLENBQUE7QUFDTixDQUFDLEVBSEksaUJBQWlCLEtBQWpCLGlCQUFpQixRQUdyQjtBQTRPQyw4Q0FBaUI7QUEvTW5CLE1BQU0sc0JBQXNCOztBQW9OMUIsd0RBQXNCO0FBbk5DLDhCQUFPLEdBQUcsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pCLDJCQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25CLDRCQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLDZCQUFNLEdBQUcsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLG9DQUFhLEdBQUcsR0FBRyxDQUFDLGVBQWUsQ0FBQyxDQUFDO0FBQ3JDLCtCQUFRLEdBQUcsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0FBQzNCLDRCQUFLLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLGlDQUFVLEdBQUcsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBQy9CLDJCQUFJLEdBQUcsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ25CLG9DQUFhLEdBQUcsR0FBRyxDQUFD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