import {
  StorageAuthenticationManager,
  StorageTestAuthenticationManager
} from './auth-manager';
import { ENVIRONMENT } from './constants';
import { AccessControlList } from './helpers';
import { rdflib as $rdf } from './rdf-manager';
// import { StorageRdfManager } from './rdf-manager';
import * as Utils from './utils';

const authClient =
  ENVIRONMENT === 'TEST'
    ? StorageTestAuthenticationManager
    : StorageAuthenticationManager;
const RDF = $rdf.Namespace('http://www.w3.org/1999/02/22-rdf-syntax-ns#');
const FOAF = $rdf.Namespace('http://xmlns.com/foaf/0.1/');
const ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#');

/**
 * Enum representing different solid resource types
 */
enum SolidResourceType {
  Folder = '<http://www.w3.org/ns/ldp#BasicContainer>; rel="type"',
  File = '<http://www.w3.org/ns/ldp#Resource>; rel="type"'
}

/**
 * Interface representing the SolidResource
 */
interface SolidResource {
  readonly type: SolidResourceType;
  readonly path: string;
  readonly title: string;
  readonly contentType?: string;
  readonly body?: string;
  readonly isPublic?: boolean;
}

/**
 * Class representing the solid resoruce configuration description
 */
class ResourceConfig {
  public readonly webID?: string;
  public readonly resource: SolidResource;

  constructor(resource: SolidResource, webID?: string) {
    this.webID = webID;
    this.resource = resource;
  }

  /**
   * Assembles the full path to resource based on path and title
   */
  public fullPath(): string {
    return this.resource.path + '/' + this.resource.title;
  }

  /**
   * Assembles the full path and appends the appendix if resource is a folder
   */
  public fullPathWithAppendix(): string {
    const folderAppendix =
      this.resource.type === SolidResourceType.Folder ? '/' : '';
    return this.resource.path + '/' + this.resource.title + folderAppendix;
  }
}

/**
 * Interface representing Privileges of the resource
 */
interface Privileges {
  agents: null | string[];
  modes: string[];
}

/**
 * Subclass of ResourceConfig for ACL files
 */
class AccessControlConfig extends ResourceConfig {
  public readonly privileges: Privileges[];

  constructor(
    resource: SolidResource,
    privileges: Privileges[],
    webID?: string
  ) {
    super(resource, webID);
    this.privileges = privileges;
  }

  /**
   * Assembles full path to acl file
   */
  public fullACLPath(): string {
    const aclAppendix =
      this.resource.type === SolidResourceType.Folder ? '/' : '';
    return (
      this.resource.path + '/' + this.resource.title + aclAppendix + '.acl'
    );
  }

  /**
   * Assembles full title acl resource
   */
  public fullACLTitle(): string {
    const aclAppendix =
      this.resource.type === SolidResourceType.Folder ? '/' : '';
    return this.resource.title + aclAppendix + '.acl';
  }
}

// LEGACY CODE for v4 NSS editions, was replaced by implementation from
// inrupt solid react components package for v5 NSS releases.
// ======================================================
//

// class AccessControlStatementConfig extends AccessControlConfig {
//   public readonly ownerNode: $rdf.NamedNode;
//   public readonly userNode?: $rdf.NamedNode;
//   public readonly resourceNode: $rdf.NamedNode;
//   public readonly aclResourceNode: $rdf.NamedNode;
//   constructor(
//     resource: SolidResource,
//     privileges: Privileges[],
//     ownerNode: $rdf.NamedNode,
//     resourceNode: $rdf.NamedNode,
//     aclResourceNode: $rdf.NamedNode,
//     userNode?: $rdf.NamedNode,
//     webID?: string
//   ) {
//     super(resource, privileges, webID);
//     this.ownerNode = ownerNode;
//     this.resourceNode = resourceNode;
//     this.aclResourceNode = aclResourceNode;
//     this.userNode = userNode;
//   }
// }

// class AccessControlNamespace {
//   public static readonly Control = ACL('Control');
//   public static readonly Read = ACL('Read');
//   public static readonly Write = ACL('Write');
//   public static readonly Append = ACL('Append');
//   public static readonly Authorization = ACL('Authorization');
//   public static readonly accessTo = ACL('accessTo');
//   public static readonly agent = ACL('agent');
//   public static readonly agentClass = ACL('agentClass');
//   public static readonly mode = ACL('mode');
//   public static readonly defaultForNew = ACL('default');
// }

// END OF LEGACY CODE
// ======================================================
//

/**
 * FOAF namespace helper class
 */
class FOAFNamespace {
  public static readonly Agent = FOAF('Agent');
}

/**
 * RDF namespace helper class
 */
class RDFNamespace {
  public static readonly type = RDF('type');
}

/**
 * StorageFileManager class responsible for CRUD opearations and ACL files
 */
class StorageFileManager {
  /**
   * Updated or creates the acl file based on provided configuration
   * @param accessControlConfig configuration desribing the acl to be updated
   */
  public static async updateACL(
    accessControlConfig: AccessControlConfig
  ): Promise<any> {
    try {
      const documentURI = accessControlConfig.fullPathWithAppendix();
      const { MODES } = AccessControlList;
      const permissions = [
        ...accessControlConfig.privileges,
        {
          modes: [MODES.READ, MODES.WRITE, MODES.CONTROL],
          agents: [accessControlConfig.webID]
        }
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

  /**
   * Creates solid resource based on configuration
   * @param resourceConfig Configuration of resource to be created
   */
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

  /**
   * Deletes folder contents
   * @param resourceConfig Configuration of resource to be created
   */
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

  /**
   * Generic resource deletion method
   * @param resourceConfig Configuration of resource to be deleted
   */
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

  /**
   * Method to load the resource at specific path
   * @param path Path to resource
   * @param parameters Additional parameters for fetch request
   */
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

  /**
   * Copies resource from one path to another
   * @param originResource Configuration of original resource
   * @param destinationResource Configuration of resource to be copied into
   */
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

  /**
   * Copies individual resource into a folder
   * @param originResource Configuration of original path
   * @param folderDestinationResource Configuration of destination folder
   */
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

  /**
   * Copies folder from original to destination configuration
   * @param originConfig Original configuration
   * @param destinationConfig Destination configuration
   */
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

  /**
   * Generic copy resource method
   * @param resourceConfig Original resource
   * @param destinationConfig Destination resource
   */
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

  /**
   * Updates resource based on configuration
   * @param oldResourceConfig Old resource
   * @param newResourceConfig New resource
   */
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

  /**
   * Updates resource
   * @param resourceConfig Original resource config
   */
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

  /**
   * Creates or updates the resource configuration
   * @param resourceConfig Resource configuration
   */
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

  /**
   * Checks if resource exist at particular path
   * @param resourceURL Original resource url
   */
  public static async resourceExists(resourceURL: string): Promise<any> {
    return authClient.fetch(resourceURL, {
      headers: {
        'Content-Type': 'text/turtle'
      }
    });
  }

  /**
   * Returns the folder and its content
   * @param folderConfig Configuration of the folder
   */
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

  /**
   * Generic method triggering recursive folder content deletion
   */
  public static readonly deleteFolderRecursively = async resourceConfig => {
    await StorageFileManager.deleteFolderContents(resourceConfig);
    return StorageFileManager.deleteResource(resourceConfig);
  };
}

export {
  SolidResourceType,
  SolidResource,
  AccessControlConfig,
  ResourceConfig,
  FOAFNamespace,
  RDFNamespace,
  StorageFileManager
};
