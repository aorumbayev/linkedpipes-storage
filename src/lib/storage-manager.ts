import * as $rdf from 'rdflib';
import authClient from 'solid-auth-cli';

const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

enum SolidResourceType {
  Folder,
  File
}

interface SolidResource {
  readonly type: SolidResourceType;
  readonly path: string;
  readonly contentType?: string;
  readonly body?: string;
}

interface SolidACLResource extends SolidResource {
  readonly isPublic: boolean;
}

interface ResourceConfig {
  readonly webID: string;
  readonly resource: SolidResource;
}

interface AccessControlConfig extends ResourceConfig {
  readonly controlModes: ReadonlyArray<$rdf.NamedNode>;
  readonly resource: SolidACLResource;
}

interface AccessControlStatementConfig extends AccessControlConfig {
  readonly ownerNode: $rdf.NamedNode;
  readonly userNode?: $rdf.NamedNode;
  readonly resourceNode: $rdf.NamedNode;
  readonly aclResourceNode: $rdf.NamedNode;
}

class AccessControlNamespace {
  public static readonly Control = ACL('Control');
  public static readonly Read = ACL('Read');
  public static readonly Write = ACL('Write');
  public static readonly Append = ACL('Append');
  public static readonly Authorization = ACL('Authorization');
  public static readonly accessTo = ACL('accessTo');
  public static readonly agent = ACL('agent');
  public static readonly agentClass = ACL('agentClass');
  public static readonly mode = ACL('mode');
  public static readonly defaultForNew = ACL('defaultForNew');
}

class FOAFNamespace {
  public static readonly Agent = FOAF('Agent');
}

class RDFNamespace {
  public static readonly type = RDF('type');
}

class StorageFileManager {
  public static async updateACL(
    accessControlConfig: AccessControlConfig
  ): Promise<any> {
    const accessListUrl = `${accessControlConfig.resource.path}.acl`;
    const aclRequestBody = StorageFileManager.createAccessControlList(
      accessControlConfig
    );

    return StorageFileManager.createResource({
      webID: accessControlConfig.webID,
      resource: {
        ...accessControlConfig.resource,
        path: accessListUrl,
        body: aclRequestBody
      }
    });
  }

  public static async createResource(
    resourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      const options = {
        body: resourceConfig.resource.body,
        headers: {
          'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
        },
        method: 'PUT'
      };
      return await authClient.fetch(resourceConfig.resource.path, options);
    } catch (e) {
      throw e;
    }
  }

  public static async deleteResource(
    resourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      return await authClient.fetch(resourceConfig.resource.path, {
        method: 'DELETE'
      });
    } catch (e) {
      throw e;
    }
  }

  public static async getResource(path: string): Promise<any> {
    try {
      const response = await authClient.fetch(path, {
        method: 'GET'
      });
      return await response.text();
    } catch (e) {
      throw e;
    }
  }

  public static async copyResource(
    originPath: string,
    destinationPath: string
  ): Promise<any> {
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
    } catch (e) {
      throw e;
    }
  }

  public static async renameResource(
    oldResourceConfig: ResourceConfig,
    newResourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      await StorageFileManager.copyResource(
        oldResourceConfig.resource.path,
        newResourceConfig.resource.path
      );
      if (oldResourceConfig.resource.path !== newResourceConfig.resource.path) {
        return await StorageFileManager.deleteResource(oldResourceConfig);
      } else {
        return Promise.resolve({ status: 200 });
      }
    } catch (e) {
      throw e;
    }
  }

  public static async updateResource(
    resourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      return await authClient.fetch(resourceConfig.resource.path, {
        method: 'PUT',
        headers: {
          'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
        },
        body: resourceConfig.resource.body
      });
    } catch (e) {
      throw e;
    }
  }

  public static async createOrUpdateResource(
    resourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      const result = await StorageFileManager.resourceExists(
        resourceConfig.resource.path
      );

      return result.status === 404
        ? StorageFileManager.createResource(resourceConfig)
        : StorageFileManager.updateResource(resourceConfig);
    } catch (e) {
      throw e;
    }
  }

  public static async resourceExists(resourceURL: string): Promise<any> {
    return authClient.fetch(resourceURL, {
      headers: {
        'Content-Type': 'text/turtle'
      }
    });
  }

  private static createAccessControlStatement(
    statementConfig: AccessControlStatementConfig
  ): any[] {
    const acl: any[] = [
      $rdf.st(
        statementConfig.ownerNode,
        RDFNamespace.type,
        AccessControlNamespace.Authorization,
        statementConfig.aclResourceNode
      ),
      $rdf.st(
        statementConfig.ownerNode,
        AccessControlNamespace.accessTo,
        statementConfig.resourceNode,
        statementConfig.aclResourceNode
      )
    ];
    if (statementConfig.userNode) {
      acl.push(
        $rdf.st(
          statementConfig.ownerNode,
          AccessControlNamespace.agent,
          statementConfig.userNode,
          statementConfig.aclResourceNode
        )
      );
    } else {
      acl.push(
        $rdf.st(
          statementConfig.ownerNode,
          AccessControlNamespace.agentClass,
          FOAFNamespace.Agent,
          statementConfig.aclResourceNode
        )
      );
    }
    statementConfig.controlModes.forEach(mode => {
      acl.push(
        $rdf.st(
          statementConfig.ownerNode,
          AccessControlNamespace.mode,
          mode,
          statementConfig.aclResourceNode
        )
      );
    });
    if (statementConfig.resource.type === SolidResourceType.File) {
      acl.push(
        $rdf.st(
          statementConfig.ownerNode,
          AccessControlNamespace.defaultForNew,
          statementConfig.resourceNode,
          statementConfig.aclResourceNode
        )
      );
    }
    return acl;
  }

  private static createAccessControlList(
    accessControlConfig: AccessControlConfig
  ): string {
    const resource = $rdf.sym(accessControlConfig.resource.path);
    const accessListUrl = `${accessControlConfig.resource.path}.acl`;
    const aclResourcePath = $rdf.sym(accessListUrl);
    const user = $rdf.sym(accessControlConfig.webID);
    const owner = $rdf.sym(`${accessListUrl}#owner`);

    const ownerStatementConfig: AccessControlStatementConfig = {
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
    let acl = StorageFileManager.createAccessControlStatement(
      ownerStatementConfig
    );
    if (accessControlConfig.resource.isPublic === true) {
      const publicOwnerNode = $rdf.sym(`${accessListUrl}#public`);
      const publicStatementConfig: AccessControlStatementConfig = {
        ...accessControlConfig,
        ownerNode: publicOwnerNode,
        resourceNode: resource,
        aclResourceNode: aclResourcePath
      };
      acl = acl.concat(
        StorageFileManager.createAccessControlStatement(publicStatementConfig)
      );
    }

    const finalACL = acl.join('\n').toString();

    const newStore = $rdf.graph();

    $rdf.parse(
      finalACL,
      newStore,
      accessControlConfig.resource.path,
      'text/turtle',
      undefined
    );
    const response = newStore.serialize(accessListUrl, 'text/turtle', '');
    return response;
  }
}

export {
  SolidResourceType,
  SolidResource,
  AccessControlConfig,
  ResourceConfig,
  AccessControlStatementConfig,
  AccessControlNamespace,
  FOAFNamespace,
  RDFNamespace,
  StorageFileManager
};
