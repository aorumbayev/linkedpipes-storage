import * as $rdf from 'rdflib';
declare enum SolidResourceType {
    Folder = "<http://www.w3.org/ns/ldp#BasicContainer>; rel=\"type\"",
    File = "<http://www.w3.org/ns/ldp#Resource>; rel=\"type\""
}
interface SolidResource {
    readonly type: SolidResourceType;
    readonly path: string;
    readonly title: string;
    readonly contentType?: string;
    readonly body?: string;
    readonly isPublic?: boolean;
}
declare class ResourceConfig {
    readonly webID?: string;
    readonly resource: SolidResource;
    constructor(resource: SolidResource, webID?: string);
    fullPath(): string;
    fullPathWithAppendix(): string;
}
declare class AccessControlConfig extends ResourceConfig {
    readonly controlModes: ReadonlyArray<$rdf.NamedNode>;
    constructor(resource: SolidResource, controlModes: ReadonlyArray<$rdf.NamedNode>, webID?: string);
    fullACLPath(): string;
    fullACLTitle(): string;
}
declare class AccessControlStatementConfig extends AccessControlConfig {
    readonly ownerNode: $rdf.NamedNode;
    readonly userNode?: $rdf.NamedNode;
    readonly resourceNode: $rdf.NamedNode;
    readonly aclResourceNode: $rdf.NamedNode;
    constructor(resource: SolidResource, controlModes: ReadonlyArray<$rdf.NamedNode>, ownerNode: $rdf.NamedNode, resourceNode: $rdf.NamedNode, aclResourceNode: $rdf.NamedNode, userNode?: $rdf.NamedNode, webID?: string);
}
declare class AccessControlNamespace {
    static readonly Control: any;
    static readonly Read: any;
    static readonly Write: any;
    static readonly Append: any;
    static readonly Authorization: any;
    static readonly accessTo: any;
    static readonly agent: any;
    static readonly agentClass: any;
    static readonly mode: any;
    static readonly defaultForNew: any;
}
declare class FOAFNamespace {
    static readonly Agent: any;
}
declare class RDFNamespace {
    static readonly type: any;
}
declare class StorageFileManager {
    static updateACL(accessControlConfig: AccessControlConfig): Promise<any>;
    static createACL(resourceConfig: AccessControlConfig, aclBody: string): Promise<any>;
    static createResource(resourceConfig: ResourceConfig): Promise<any>;
    static deleteFolderContents(resourceConfig: ResourceConfig): Promise<any>;
    static deleteResource(resourceConfig: ResourceConfig): Promise<any>;
    static getResource(path: string, parameters?: object): Promise<any>;
    static copyFile(originResource: ResourceConfig, destinationResource: ResourceConfig): Promise<any>;
    static copyFileToFolder(originResource: ResourceConfig, folderDestinationResource: ResourceConfig): Promise<any>;
    static copyFolder(originConfig: ResourceConfig, destinationConfig: ResourceConfig): Promise<any>;
    static copyResource(resourceConfig: ResourceConfig, destinationConfig: ResourceConfig): Promise<any>;
    static renameResource(oldResourceConfig: ResourceConfig, newResourceConfig: ResourceConfig): Promise<any>;
    static updateResource(resourceConfig: ResourceConfig): Promise<any>;
    static createOrUpdateResource(resourceConfig: ResourceConfig): Promise<any>;
    static resourceExists(resourceURL: string): Promise<any>;
    static getFolder(folderConfig: ResourceConfig): Promise<{
        readonly files: ResourceConfig[];
        readonly folders: ResourceConfig[];
    }>;
    static readonly deleteFolderRecursively: (resourceConfig: any) => Promise<any>;
    private static createAccessControlStatement;
    private static createAccessControlList;
}
export { SolidResourceType, SolidResource, AccessControlConfig, ResourceConfig, AccessControlStatementConfig, AccessControlNamespace, FOAFNamespace, RDFNamespace, StorageFileManager };
