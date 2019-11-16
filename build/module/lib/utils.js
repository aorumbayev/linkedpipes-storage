import deepCopy from 'ts-deepcopy';
import { rdflib } from './rdf-manager';
import { ResourceConfig, SolidResourceType } from './storage-manager';
function guessFileType(url) {
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
function textToGraph(text, baseUrl, contentType = '') {
    const textContentType = contentType || guessFileType(baseUrl);
    const graph = rdflib.graph();
    // eslint-disable-next-line no-unused-vars
    return new Promise(resolve => {
        rdflib.parse(text, graph, baseUrl, textContentType);
        resolve(graph);
    });
}
async function isFolder(graph, baseUrl) {
    const folderNode = rdflib.sym(baseUrl);
    const isAnInstanceOfClass = rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    const types = graph.each(folderNode, isAnInstanceOfClass, undefined, undefined);
    return Object.values(types).some(({ value }) => value.match('ldp#BasicContainer') !== null);
}
async function extractFolderItems(graph, subj) {
    const files = [];
    const folders = [];
    graph
        .each(rdflib.sym(subj.fullPathWithAppendix()), rdflib.sym('http://www.w3.org/ns/ldp#contains'), undefined, undefined)
        .forEach(async (item) => {
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
            folders.push(new ResourceConfig({
                title: resourceTitle,
                path: resourcePartialPath,
                type: SolidResourceType.Folder
            }));
        }
        else {
            files.push(new ResourceConfig({
                title: resourceTitle,
                path: resourcePartialPath,
                type: SolidResourceType.File
            }));
        }
    });
    return { files, folders };
}
export { textToGraph, extractFolderItems, deepCopy };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sUUFBUSxNQUFNLGFBQWEsQ0FBQztBQUNuQyxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZDLE9BQU8sRUFBRSxjQUFjLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUV0RSxTQUFTLGFBQWEsQ0FBQyxHQUFXO0lBQ2hDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1FBQzlCLE9BQU8sZUFBZSxDQUFDO0tBQ3hCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3JCLE9BQU8sV0FBVyxDQUFDO0tBQ3BCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sYUFBYSxDQUFDO0tBQ3RCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25CLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25CLE9BQU8sb0JBQW9CLENBQUM7S0FDN0I7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxVQUFVLENBQUM7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