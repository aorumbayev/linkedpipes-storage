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
        .each(rdflib.sym(subj), rdflib.sym('http://www.w3.org/ns/ldp#contains'), undefined, undefined)
        .forEach(async (item) => {
        const url = item.value;
        const titleIndex = url.lastIndexOf('/');
        const resourceTitle = url.substr(titleIndex + 1);
        const resourcePartialPath = url.substr(0, titleIndex + 1);
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
export { textToGraph, extractFolderItems };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDdkMsT0FBTyxFQUFFLGNBQWMsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBRXRFLFNBQVMsYUFBYSxDQUFDLEdBQVc7SUFDaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxlQUFlLENBQUM7S0FDeEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDckIsT0FBTyxXQUFXLENBQUM7S0FDcEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxhQUFhLENBQUM7S0FDdEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsT0FBTyxvQkFBb0IsQ0FBQztLQUM3QjtJQUNELElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQixPQUFPLFVBQVUsQ0FBQztLQUNuQjtJQUNELElBQUksR0FBRyxDQUFDLEtBQUss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