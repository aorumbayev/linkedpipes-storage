import * as $rdf from 'rdflib';
import {
  StorageAuthenticationManager,
  StorageTestAuthenticationManager
} from './auth-manager';
import { ENVIRONMENT } from './constants';
import { AccessControlList } from './helpers';
// import { StorageRdfManager } from './rdf-manager';
import * as Utils from './utils';

const authClient =
  ENVIRONMENT === 'TEST'
    ? StorageTestAuthenticationManager
    : StorageAuthenticationManager;
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

enum SolidResourceType {
  Folder = '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
  File = '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
}

interface SolidResource {
  readonly type: SolidResourceType;
  readonly path: string;
  readonly title: string;
  readonly contentType?: string;
  readonly body?: string;
  readonly isPublic?: boolean;
}

class ResourceConfig {
  public readonly webID?: string;
  public readonly resource: SolidResource;

  constructor(resource: SolidResource, webID?: string) {
    this.webID = webID;
    this.resource = resource;
  }

  public fullPath(): string {
    return this.resource.path + '/' + this.resource.title;
  }

  public fullPathWithAppendix(): string {
    const folderAppendix =
      this.resource.type === SolidResourceType.Folder ? '/' : '';
    return this.resource.path + '/' + this.resource.title + folderAppendix;
  }
}

class AccessControlConfig extends ResourceConfig {
  public readonly controlModes: ReadonlyArray<$rdf.NamedNode>;

  constructor(
    resource: SolidResource,
    controlModes: ReadonlyArray<$rdf.NamedNode>,
    webID?: string
  ) {
    super(resource, webID);
    this.controlModes = controlModes;
  }

  public fullACLPath(): string {
    const aclAppendix =
      this.resource.type === SolidResourceType.Folder ? '/' : '';
    return (
      this.resource.path + '/' + this.resource.title + aclAppendix + '.acl'
    );
  }

  public fullACLTitle(): string {
    const aclAppendix =
      this.resource.type === SolidResourceType.Folder ? '/' : '';
    return this.resource.title + aclAppendix + '.acl';
  }
}

class AccessControlStatementConfig extends AccessControlConfig {
  public readonly ownerNode: $rdf.NamedNode;
  public readonly userNode?: $rdf.NamedNode;
  public readonly resourceNode: $rdf.NamedNode;
  public readonly aclResourceNode: $rdf.NamedNode;
  constructor(
    resource: SolidResource,
    controlModes: ReadonlyArray<$rdf.NamedNode>,
    ownerNode: $rdf.NamedNode,
    resourceNode: $rdf.NamedNode,
    aclResourceNode: $rdf.NamedNode,
    userNode?: $rdf.NamedNode,
    webID?: string
  ) {
    super(resource, controlModes, webID);
    this.ownerNode = ownerNode;
    this.resourceNode = resourceNode;
    this.aclResourceNode = aclResourceNode;
    this.userNode = userNode;
  }
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
  public static readonly defaultForNew = ACL('default');
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
    try {
      const documentURI = accessControlConfig.fullPathWithAppendix();
      const { MODES } = AccessControlList;
      const permissions = [
        { modes: [MODES.CONTROL], agents: [accessControlConfig.webID] }
      ];
      if (accessControlConfig.resource.isPublic) {
        permissions.push({ modes: [MODES.READ], agents: undefined });
      }
      const aclInstance = new AccessControlList(
        accessControlConfig.webID,
        documentURI
      );
      return await aclInstance.createACL(permissions);
    } catch (e) {
      throw e;
    }
  }

  public static async createACL(
    resourceConfig: AccessControlConfig,
    aclBody: string
  ): Promise<any> {
    try {
      const options = {
        body: aclBody,
        headers: {
          'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
        },
        method: 'PUT'
      };

      return await authClient.fetch(resourceConfig.fullACLPath(), options);
    } catch (e) {
      throw e;
    }
  }

  public static async createResource(
    resourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      const options = {
        body: resourceConfig.resource.body,
        headers: {
          Link: resourceConfig.resource.type,
          Slug: resourceConfig.resource.title,
          'Content-Type': resourceConfig.resource.contentType || 'text/turtle'
        },
        method: 'POST'
      };

      return await authClient.fetch(resourceConfig.resource.path, options);
    } catch (e) {
      throw e;
    }
  }

  public static async deleteFolderContents(
    resourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      const { files, folders } = await StorageFileManager.getFolder(
        resourceConfig
      );

      /* tslint:disable */
      for (const file of files) {
        await StorageFileManager.deleteResource(file);
      }

      for (const folder of folders) {
        const response = await authClient.fetch(folder.fullPath(), {
          method: 'DELETE'
        });
        if (response.status === 409 || response.status === 301) {
          // Solid pod returns 409 if the item is a folder and is not empty
          // Solid pod returns 301 if is attempted to read a folder url without
          // '/' at the end (from buildFileUrl)
          await StorageFileManager.deleteFolderRecursively(folder);
        }
        /* tslint:enable */
      }
      return Promise.resolve({ status: 200 });
    } catch (e) {
      throw e;
    }
  }

  public static async deleteResource(
    resourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      if (resourceConfig.resource.type === SolidResourceType.File) {
        return authClient.fetch(resourceConfig.fullPath(), {
          method: 'DELETE'
        });
      } else {
        const response = await authClient.fetch(resourceConfig.fullPath(), {
          method: 'DELETE'
        });
        if (response.status === 409 || response.status === 301) {
          // Solid pod returns 409 if the item is a folder and is not empty
          // Solid pod returns 301 if is attempted to read a folder url without
          // '/' at the end (from buildFileUrl)
          return StorageFileManager.deleteFolderRecursively(resourceConfig);
        } else {
          return response;
        }
      }
    } catch (e) {
      throw e;
    }
  }

  public static async getResource(
    path: string,
    parameters?: object
  ): Promise<any> {
    try {
      const response = await authClient.fetch(path, {
        method: 'GET',
        ...parameters
      });
      return await response.text();
    } catch (e) {
      throw e;
    }
  }

  public static async copyFile(
    originResource: ResourceConfig,
    destinationResource: ResourceConfig
  ): Promise<any> {
    try {
      const originPath = originResource.fullPath();
      const destinationPath = destinationResource.fullPath();
      const response = await authClient.fetch(originPath, {
        method: 'GET'
      });

      const content = await response.text();
      // tslint:disable
      const contentType = response.headers['contentType'];
      // tslint:enable

      await authClient
        .fetch(destinationPath, {
          method: 'PUT',
          headers: {
            'Content-Type': contentType
          },
          body: content
        })
        .then(
          res => {
            return Promise.resolve({ status: 201, response: res });
          },
          e => {
            throw e;
          }
        );
    } catch (e) {
      throw e;
    }
  }

  public static async copyFileToFolder(
    originResource: ResourceConfig,
    folderDestinationResource: ResourceConfig
  ): Promise<any> {
    try {
      const destinationResource = new ResourceConfig(
        {
          path: folderDestinationResource.fullPath(),
          title: originResource.resource.title,
          type: SolidResourceType.File
        },
        folderDestinationResource.webID
      );
      return StorageFileManager.copyFile(originResource, destinationResource);
    } catch (e) {
      throw e;
    }
  }

  public static async copyFolder(
    originConfig: ResourceConfig,
    destinationConfig: ResourceConfig
  ): Promise<any> {
    try {
      const { files, folders } = await StorageFileManager.getFolder(
        originConfig
      );

      /* tslint:disable */
      for (const file of files) {
        await StorageFileManager.copyFileToFolder(file, destinationConfig);
      }

      for (const folder of folders) {
        const destinationFolderConfig = new ResourceConfig(
          {
            path: destinationConfig.fullPath(),
            title: folder.resource.title,
            type: SolidResourceType.Folder
          },
          destinationConfig.webID
        );
        await StorageFileManager.createResource(destinationFolderConfig);
        await StorageFileManager.copyFolder(folder, destinationFolderConfig);
        /* tslint:enable */
      }
      return Promise.resolve({ status: 200 });
    } catch (e) {
      throw e;
    }
  }

  public static async copyResource(
    resourceConfig: ResourceConfig,
    destinationConfig: ResourceConfig
  ): Promise<any> {
    try {
      if (resourceConfig.resource.type === SolidResourceType.File) {
        return StorageFileManager.copyFile(resourceConfig, destinationConfig);
      } else {
        await StorageFileManager.createResource(destinationConfig);
        return StorageFileManager.copyFolder(resourceConfig, destinationConfig);
      }
    } catch (e) {
      throw e;
    }
  }

  public static async renameResource(
    oldResourceConfig: ResourceConfig,
    newResourceConfig: ResourceConfig
  ): Promise<any> {
    try {
      if (oldResourceConfig.fullPath() !== newResourceConfig.fullPath()) {
        await StorageFileManager.copyResource(
          oldResourceConfig,
          newResourceConfig
        );
        return StorageFileManager.deleteResource(oldResourceConfig);
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
      return await authClient.fetch(resourceConfig.fullPath(), {
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
        resourceConfig.fullPath()
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

  public static async getFolder(
    folderConfig: ResourceConfig
  ): Promise<{
    readonly files: ResourceConfig[];
    readonly folders: ResourceConfig[];
  }> {
    const response = await StorageFileManager.getResource(
      folderConfig.fullPath(),
      {
        headers: { Accept: 'text/turtle' }
      }
    );
    const folderRDF = response;
    const graph = await Utils.textToGraph(
      folderRDF,
      folderConfig.fullPathWithAppendix(),
      'text/turtle'
    );
    const folderItems = Utils.extractFolderItems(graph, folderConfig);

    return folderItems;
  }

  public static readonly deleteFolderRecursively = async resourceConfig => {
    await StorageFileManager.deleteFolderContents(resourceConfig);
    return StorageFileManager.deleteResource(resourceConfig);
  };

  // private static createAccessControlStatement(
  //   statementConfig: AccessControlStatementConfig
  // ): any[] {
  //   const acl: any[] = [
  //     $rdf.st(
  //       statementConfig.ownerNode,
  //       RDFNamespace.type,
  //       AccessControlNamespace.Authorization,
  //       statementConfig.aclResourceNode
  //     ),
  //     $rdf.st(
  //       statementConfig.ownerNode,
  //       AccessControlNamespace.accessTo,
  //       statementConfig.resourceNode,
  //       statementConfig.aclResourceNode
  //     )
  //   ];
  //   if (statementConfig.userNode) {
  //     acl.push(
  //       $rdf.st(
  //         statementConfig.ownerNode,
  //         AccessControlNamespace.agent,
  //         statementConfig.userNode,
  //         statementConfig.aclResourceNode
  //       )
  //     );
  //   } else {
  //     acl.push(
  //       $rdf.st(
  //         statementConfig.ownerNode,
  //         AccessControlNamespace.agentClass,
  //         FOAFNamespace.Agent,
  //         statementConfig.aclResourceNode
  //       )
  //     );
  //   }
  //   statementConfig.controlModes.forEach(mode => {
  //     acl.push(
  //       $rdf.st(
  //         statementConfig.ownerNode,
  //         AccessControlNamespace.mode,
  //         mode,
  //         statementConfig.aclResourceNode
  //       )
  //     );
  //   });
  //   if (statementConfig.resource.type === SolidResourceType.File) {
  //     acl.push(
  //       $rdf.st(
  //         statementConfig.ownerNode,
  //         AccessControlNamespace.defaultForNew,
  //         statementConfig.resourceNode,
  //         statementConfig.aclResourceNode
  //       )
  //     );
  //   }
  //   return acl;
  // }

  //   private static createAccessControlList(
  //     accessControlConfig: AccessControlConfig
  //   ): string {
  //     const resource = $rdf.sym(accessControlConfig.fullPathWithAppendix());
  //     const accessListUrl = accessControlConfig.fullACLPath();
  //     const aclResourcePath = $rdf.sym(accessListUrl);
  //     const user = $rdf.sym(accessControlConfig.webID);
  //     const owner = $rdf.sym(`${accessListUrl}#owner`);

  //     const ownerStatementConfig: AccessControlStatementConfig = new AccessControlStatementConfig(
  //       accessControlConfig.resource,
  //       [
  //         AccessControlNamespace.Read,
  //         AccessControlNamespace.Write,
  //         AccessControlNamespace.Control
  //       ],
  //       owner,
  //       resource,
  //       aclResourcePath,
  //       user,
  //       accessControlConfig.webID
  //     );
  //     let acl = StorageFileManager.createAccessControlStatement(
  //       ownerStatementConfig
  //     );
  //     if (accessControlConfig.resource.isPublic === true) {
  //       const publicOwnerNode = $rdf.sym(`${accessListUrl}#public`);
  //       const publicStatementConfig: AccessControlStatementConfig = new AccessControlStatementConfig(
  //         accessControlConfig.resource,
  //         accessControlConfig.controlModes,
  //         publicOwnerNode,
  //         resource,
  //         aclResourcePath,
  //         undefined,
  //         accessControlConfig.webID
  //       );
  //       acl = acl.concat(
  //         StorageFileManager.createAccessControlStatement(publicStatementConfig)
  //       );
  //     }

  //     const finalACL = acl.join('\n').toString();

  //     const newStore = $rdf.graph();

  //     $rdf.parse(
  //       finalACL,
  //       newStore,
  //       accessControlConfig.fullPath(),
  //       'text/turtle',
  //       undefined
  //     );
  //     const response = newStore.serialize(accessListUrl, 'text/turtle', '');
  //     return response;
  //   }
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
