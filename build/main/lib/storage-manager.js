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