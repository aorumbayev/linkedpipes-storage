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
        let acl = this.createAccessControlStatement(ownerStatementConfig);
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
    static async updateACL(accessControlConfig) {
        const accessListUrl = `${accessControlConfig.resource.path}.acl`;
        const aclRequestBody = StorageFileManager.createAccessControlList(accessControlConfig);
        return await StorageFileManager.createResource({
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
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/turtle'
                },
                body: resourceConfig.resource.body
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
        return await authClient.fetch(resourceURL, {
            headers: {
                'Content-Type': 'text/turtle'
            }
        });
    }
}
export { SolidResourceType, AccessControlNamespace, FOAFNamespace, RDFNamespace, StorageFileManager };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RvcmFnZS1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vc3JjL2xpYi9zdG9yYWdlLW1hbmFnZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLElBQUksTUFBTSxRQUFRLENBQUM7QUFDL0IsT0FBTyxVQUFVLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFDO0FBQzFFLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsNEJBQTRCLENBQUMsQ0FBQztBQUMxRCxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLGdDQUFnQyxDQUFDLENBQUM7QUFFN0QsSUFBSyxpQkFHSjtBQUhELFdBQUssaUJBQWlCO0lBQ3BCLDZEQUFNLENBQUE7SUFDTix5REFBSSxDQUFBO0FBQ04sQ0FBQyxFQUhJLGlCQUFpQixLQUFqQixpQkFBaUIsUUFHckI7QUE2QkQsTUFBTSxzQkFBc0I7O0FBQ1YsOEJBQU8sR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDekIsMkJBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsNEJBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsNkJBQU0sR0FBRyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDdkIsb0NBQWEsR0FBRyxHQUFHLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDckMsK0JBQVEsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7QUFDM0IsNEJBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDckIsaUNBQVUsR0FBRyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7QUFDL0IsMkJBQUksR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDbkIsb0NBQWEsR0FBRyxHQUFHLENB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