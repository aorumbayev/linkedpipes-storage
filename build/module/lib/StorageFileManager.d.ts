import * as $rdf from 'rdflib';
declare enum SolidResourceType {
    Folder = 0,
    File = 1
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
    private static createAccessControlStatement;
    private static createAccessControlList;
    static updateACL(accessControlConfig: AccessControlConfig): any;
}
export { SolidResourceType, SolidResource, AccessControlConfig, AccessControlStatementConfig, AccessControlNamespace, FOAFNamespace, RDFNamespace, StorageFileManager };
