import * as $rdf from 'rdflib';
import testClient from 'solid-auth-cli';
import devClient from 'solid-auth-client';
import { ENVIRONMENT } from './constants';
const authClient = ENVIRONMENT === 'TEST' ? testClient : devClient;
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');
var SolidResourceType;
(function (SolidResourceType) {
    SolidResourceType[SolidResourceType["Folder"] = 0] = "Folder";
    SolidResourceType[SolidResourceType["File"] = 1] = "File";
})(SolidResourceType || (SolidResourceType = {}));
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
        const accessListUrl = `${accessControlConfig.resource.path}.acl`;
        const aclRequestBody = StorageFileManager.createAccessControlList(accessControlConfig);
        return StorageFileManager.createResource({
            webID: accessControlConfig.webID,
            resource: {
                ...accessControlConfig.resource,
                path: accessListUrl,
                body: aclRequestBody
            }
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
        const ownerStatementConfig = {
            ...accessControlConfig,
            controlModes: [
                AccessControlNamespace.Read,
                AccessControlNamespace.Write,
                AccessControlNamespace.Append,
                AccessControlNamespace.Control
            ],
            ownerNode: owner,
            userNode: user,
            resourceNode: resource,
            aclResourceNode: aclResourcePath
        };
        let acl = StorageFileManager.createAccessControlStatement(ownerStatementConfig);
        if (accessControlConfig.resource.isPublic === true) {
            const publicOwnerNode = $rdf.sym(`${accessListUrl}#public`);
            const publicStatementConfig = {
                ...accessControlConfig,
                ownerNode: publicOwnerNode,
                resourceNode: resource,
                aclResourceNode: aclResourcePath
            };
            acl = acl.concat(StorageFileManager.createAccessControlStatement(publicStatementConfig));
        }
        const finalACL = acl.join('\n').toString();
        const newStore = $rdf.graph();
        $rdf.parse(finalACL, newStore, accessControlConfig.resource.path, 'text/turtle', undefined);
        const response = newStore.serialize(accessListUrl, 'text/turtle', '');
        return response;
    }
}
export { SolidResourceType, AccessControlNamespace, FOAFNamespace, RDFNamespace, StorageFileManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxVQUFVLE1BQU0sZ0JBQWdCLENBQUM7QUFDeEMsT0FBTyxTQUFTLE1BQU0sbUJBQW1CLENBQUM7QUFDMUMsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGFBQWEsQ0FBQztBQUMxQyxNQUFNLFVBQVUsR0FBRyxXQUFXLEtBQUssTUFBTSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztBQUVuRSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7QUFDMUUsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw0QkFBNEIsQ0FBQyxDQUFDO0FBQzFELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0NBQWdDLENBQUMsQ0FBQztBQUU3RCxJQUFLLGlCQUdKO0FBSEQsV0FBSyxpQkFBaUI7SUFDcEIsNkRBQU0sQ0FBQTtJQUNOLHlEQUFJLENBQUE7QUFDTixDQUFDLEVBSEksaUJBQWlCLEtBQWpCLGlCQUFpQixRQUdyQjtBQThCRCxNQUFNLHNCQUFzQjs7QUFDSCw4QkFBTyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN6QiwyQkFBSSxHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQiw0QkFBSyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyQiw2QkFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUN2QixvQ0FBYSxHQUFHLEdBQUcsQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUNyQywrQkFBUSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUMs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