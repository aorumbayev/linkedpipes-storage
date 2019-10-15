import * as $rdf from 'rdflib';
declare enum SolidResourceType {
    Folder = 0,
    File = 1
}
interface SolidResource {
    readonly type: SolidResourceType;
    readonly path: string;
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
    static createResource(resourceConfig: ResourceConfig): Promise<any>;
    static deleteResource(resourceConfig: ResourceConfig): Promise<any>;
    static updateResource(resourceConfig: ResourceConfig): Promise<any>;
    static createOrUpdateResource(resourceConfig: ResourceConfig): Promise<any>;
    static resourceExists(resourceURL: string): Promise<any>;
    private static createAccessControlStatement;
    private static createAccessControlList;
}
export { SolidResourceType, SolidResource, AccessControlConfig, ResourceConfig, AccessControlStatementConfig, AccessControlNamespace, FOAFNamespace, RDFNamespace, StorageFileManager };
