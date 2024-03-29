import deepCopy from 'ts-deepcopy';
import { rdflib } from './rdf-manager';
import { ResourceConfig } from './storage-manager';
declare function textToGraph(text: string, baseUrl: string, contentType?: string): Promise<rdflib.IndexedFormula>;
declare function extractFolderItems(graph: rdflib.IndexedFormula, subj: ResourceConfig): Promise<{
    readonly files: ResourceConfig[];
    readonly folders: ResourceConfig[];
}>;
export { textToGraph, extractFolderItems, deepCopy };
