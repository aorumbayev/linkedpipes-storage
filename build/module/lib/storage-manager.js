import * as $rdf from 'rdflib';
import authClient from 'solid-auth-cli';
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
                    'Content-Type': 'text/turtle'
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxVQUFVLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzFFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFFN0QsSUFBSyxpQkFHSjtBQUhELFdBQUssaUJBQWlCO0lBQ3BCLDZEQUFNLENBQUE7SUFDTix5REFBSSxDQUFBO0FBQ04sQ0FBQyxFQUhJLGlCQUFpQixLQUFqQixpQkFBaUIsUUFHckI7QUE2QkQsTUFBTSxzQkFBc0I7O0FBQ0gsOEJBQU8sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekIsMkJBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsNEJBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsNkJBQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkIsb0NBQWEsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckMsK0JBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0IsNEJBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsaUNBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL0IsMkJBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsb0NBQWEsR0FBRyxHQUFHLENB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