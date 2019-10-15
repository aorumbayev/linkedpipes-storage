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
            acl = acl.concat(this.createAccessControlStatement(publicStatementConfig));
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