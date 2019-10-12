import * as $rdf from 'rdflib';
import authClient from 'solid-auth-client';

const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

enum SolidResourceType {
  Folder,
  File
}

interface SolidResource {
  type: SolidResourceType;
  path: string;
  isPublic: boolean;
}

interface AccessControlConfig {
  webID: string;
  controlModes: Array<$rdf.NamedNode>;
  resource: SolidResource;
}

interface AccessControlStatementConfig extends AccessControlConfig {
  ownerNode: $rdf.NamedNode;
  userNode?: $rdf.NamedNode;
  resourceNode: $rdf.NamedNode;
  aclResourceNode: $rdf.NamedNode;
}

class AccessControlNamespace {
  static readonly Control = ACL('Control');
  static readonly Read = ACL('Read');
  static readonly Write = ACL('Write');
  static readonly Append = ACL('Append');
  static readonly Authorization = ACL('Authorization');
  static readonly accessTo = ACL('accessTo');
  static readonly agent = ACL('agent');
  static readonly agentClass = ACL('agentClass');
  static readonly mode = ACL('mode');
  static readonly defaultForNew = ACL('defaultForNew');
}

class FOAFNamespace {
  static readonly Agent = FOAF('Agent');
}

class RDFNamespace {
  static readonly type = RDF('type');
}

class StorageFileManager {
  private static createAccessControlStatement(
    statementConfig: AccessControlStatementConfig
  ) {
    const acl = [
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
  ) {
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
    let acl = this.createAccessControlStatement(ownerStatementConfig);
    if (accessControlConfig.resource.isPublic === true) {
      const publicOwnerNode = $rdf.sym(`${accessListUrl}#public`);
      const publicStatementConfig: AccessControlStatementConfig = {
        ...accessControlConfig,
        ownerNode: publicOwnerNode,
        resourceNode: resource,
        aclResourceNode: aclResourcePath
      };
      acl = acl.concat(
        this.createAccessControlStatement(publicStatementConfig)
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

  static updateACL(accessControlConfig: AccessControlConfig) {
    const request: authClient.RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'
      },
      body: StorageFileManager.createAccessControlList(accessControlConfig)
    };

    return authClient.fetch(accessControlConfig.resource.path, request);
  }
}

export {
  SolidResourceType,
  SolidResource,
  AccessControlConfig,
  AccessControlStatementConfig,
  AccessControlNamespace,
  FOAFNamespace,
  RDFNamespace,
  StorageFileManager
};
