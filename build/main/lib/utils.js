"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_deepcopy_1 = __importDefault(require("ts-deepcopy"));
exports.deepCopy = ts_deepcopy_1.default;
const rdf_manager_1 = require("./rdf-manager");
const storage_manager_1 = require("./storage-manager");
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
    const graph = rdf_manager_1.rdflib.graph();
    // eslint-disable-next-line no-unused-vars
    return new Promise(resolve => {
        rdf_manager_1.rdflib.parse(text, graph, baseUrl, textContentType);
        resolve(graph);
    });
}
exports.textToGraph = textToGraph;
async function isFolder(graph, baseUrl) {
    const folderNode = rdf_manager_1.rdflib.sym(baseUrl);
    const isAnInstanceOfClass = rdf_manager_1.rdflib.sym('http://www.w3.org/1999/02/22-rdf-syntax-ns#type');
    const types = graph.each(folderNode, isAnInstanceOfClass, undefined, undefined);
    return Object.values(types).some(({ value }) => value.match('ldp#BasicContainer') !== null);
}
async function extractFolderItems(graph, subj) {
    const files = [];
    const folders = [];
    graph
        .each(rdf_manager_1.rdflib.sym(subj.fullPathWithAppendix()), rdf_manager_1.rdflib.sym('http://www.w3.org/ns/ldp#contains'), undefined, undefined)
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
            folders.push(new storage_manager_1.ResourceConfig({
                title: resourceTitle,
                path: resourcePartialPath,
                type: storage_manager_1.SolidResourceType.Folder
            }));
        }
        else {
            files.push(new storage_manager_1.ResourceConfig({
                title: resourceTitle,
                path: resourcePartialPath,
                type: storage_manager_1.SolidResourceType.File
            }));
        }
    });
    return { files, folders };
}
exports.extractFolderItems = extractFolderItems;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsOERBQW1DO0FBMklPLG1CQTNJbkMscUJBQVEsQ0EySW1DO0FBMUlsRCwrQ0FBdUM7QUFDdkMsdURBQXNFO0FBRXRFLFNBQVMsYUFBYSxDQUFDLEdBQVc7SUFDaEMsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDcEMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sS0FBSyxDQUFDO0tBQ2Q7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxlQUFlLENBQUM7S0FDeEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDckIsT0FBTyxXQUFXLENBQUM7S0FDcEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxhQUFhLENBQUM7S0FDdEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsT0FBTyxTQUFTLENBQUM7S0FDbEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDbkIsT0FBTyxvQkFBb0IsQ0FBQztLQUM3QjtJQUNELElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQixPQUFPLFVBQVUsQ0FBQztLQUNuQjtJQUNELElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNw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