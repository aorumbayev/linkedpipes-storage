import deepCopy from 'ts-deepcopy';
import { rdflib } from './rdf-manager';
import { ResourceConfig, SolidResourceType } from './storage-manager';

function guessFileType(url: string): string {
  const ext = url.replace(/.*\./, '');
  if (ext.match(/\/$/)) {
    return 'dir';
  }
  if (ext.match(/(md|markdown)/)) {
    return 'text/markdown';
  }
  if (ext.match(/html/)) {
    return 'text/html';
  }
  if (ext.match(/xml/)) {
    return 'text/xml';
  }
  if (ext.match(/ttl/)) {
    return 'text/turtle';
  }
  if (ext.match(/n3/)) {
    return 'text/n3';
  }
  if (ext.match(/rq/)) {
    return 'application/sparql';
  }
  if (ext.match(/css/)) {
    return 'text/css';
  }
  if (ext.match(/txt/)) {
    return 'text/plain';
  }
  if (ext.match(/json/)) {
    return 'application/json';
  }
  if (ext.match(/js/)) {
    return 'application/javascript';
  }
  if (ext.match(/(png|gif|jpeg|tif)/)) {
    return 'image';
  }
  if (ext.match(/(mp3|aif|ogg)/)) {
    return 'audio';
  }
  if (ext.match(/(avi|mp4|mpeg)/)) {
    return 'video';
  }
  /* default */
  return 'text/turtle';
}

function textToGraph(
  text: string,
  baseUrl: string,
  contentType: string = ''
): Promise<rdflib.IndexedFormula> {
  const textContentType = contentType || guessFileType(baseUrl);
  const graph = rdflib.graph();

  // eslint-disable-next-line no-unused-vars
  return new Promise(resolve => {
    rdflib.parse(text, graph, baseUrl, textContentType);
    resolve(graph);
  });
}

async function isFolder(
  graph: rdflib.IndexedFormula,
  baseUrl: string
): Promise<boolean> {
  const folderNode = rdflib.sym(baseUrl);
  const isAnInstanceOfClass = rdflib.sym(
    'http://www.w3.org/1999/02/22-rdf-syntax-ns#type'
  );
  const types = graph.each(
    folderNode,
    isAnInstanceOfClass,
    undefined,
    undefined
  );
  return Object.values(types).some(
    ({ value }) => value.match('ldp#BasicContainer') !== null
  );
}

async function extractFolderItems(
  graph: rdflib.IndexedFormula,
  subj: ResourceConfig
): Promise<{
  readonly files: ResourceConfig[];
  readonly folders: ResourceConfig[];
}> {
  const files: ResourceConfig[] = [];
  const folders: ResourceConfig[] = [];

  graph
    .each(
      rdflib.sym(subj.fullPathWithAppendix()),
      rdflib.sym('http://www.w3.org/ns/ldp#contains'),
      undefined,
      undefined
    )
    .forEach(async (item: any) => {
      const url = item.value;
      let processedUrl = item.value;
      if (url.substr(-1) === '/') {
        processedUrl = url.substr(0, url.length - 1);
      }
      const titleIndex = processedUrl.lastIndexOf('/');
      const resourceTitle = processedUrl.substr(titleIndex + 1);
      const resourcePartialPath = processedUrl
        .substr(0, titleIndex + 1)
        .replace(/\/$/, '');

      const resourceIsFolder = await isFolder(graph, url);

      if (resourceIsFolder) {
        folders.push(
          new ResourceConfig({
            title: resourceTitle,
            path: resourcePartialPath,
            type: SolidResourceType.Folder
          })
        );
      } else {
        files.push(
          new ResourceConfig({
            title: resourceTitle,
            path: resourcePartialPath,
            type: SolidResourceType.File
          })
        );
      }
    });

  return { files, folders };
}

export { textToGraph, extractFolderItems, deepCopy };
