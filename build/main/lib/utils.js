"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        .each(rdf_manager_1.rdflib.sym(subj), rdf_manager_1.rdflib.sym('http://www.w3.org/ns/ldp#contains'), undefined, undefined)
        .forEach(async (item) => {
        const url = item.value;
        const titleIndex = url.lastIndexOf('/');
        const resourceTitle = url.substr(titleIndex + 1);
        const resourcePartialPath = url.substr(0, titleIndex + 1);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvbGliL3V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsK0NBQXVDO0FBQ3ZDLHVEQUFzRTtBQUV0RSxTQUFTLGFBQWEsQ0FBQyxHQUFXO0lBQ2hDLE1BQU0sR0FBRyxHQUFHLEdBQUcsQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUNwQixPQUFPLEtBQUssQ0FBQztLQUNkO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxFQUFFO1FBQzlCLE9BQU8sZUFBZSxDQUFDO0tBQ3hCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1FBQ3JCLE9BQU8sV0FBVyxDQUFDO0tBQ3BCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sVUFBVSxDQUFDO0tBQ25CO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sYUFBYSxDQUFDO0tBQ3RCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25CLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ25CLE9BQU8sb0JBQW9CLENBQUM7S0FDN0I7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxVQUFVLENBQUM7S0FDbkI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7UUFDcEIsT0FBTyxZQUFZLENBQUM7S0FDckI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDckIsT0FBTyxrQkFBa0IsQ0FBQztLQUMzQjtJQUNELElBQUksR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNuQixPQUFPLHdCQUF3QixDQUFDO0tBQ2pDO0lBQ0QsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEVBQUU7UUFDbkMsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLEVBQUU7UUFDOUIsT0FBTyxPQUFPLENBQUM7S0FDaEI7SUFDRCxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtRQUMvQixPQUFPLE9BQU8sQ0FBQztLQUNoQjtJQUNELGFBQWE7SUFDYixPQUFPLGFBQWEsQ0FBQztBQUN2QixDQUFDO0FBRUQsU0FBUyxXQUFXLENBQ2xCLElBQVksRUFDWixPQUFlLEVBQ2YsY0FBc0IsRUFBRTtJQUV4QixNQUFNLGVBQWUsR0FBRyxXQUFXLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQzlELE1BQU0sS0FBSyxHQUFHLG9CQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFFN0IsMENBQTBDO0lBQzFDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7UUFDM0Isb0JBQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsZUFBZSxDQUFDLENBQUM7UUFDcEQsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2pCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQXFFUSxrQ0FBVztBQW5FcEIsS0FBSyxVQUFVLFFBQVEsQ0FDckIsS0FBNEIsRUFDNUIsT0FBZTtJQUVmLE1BQU0sVUFBVSxHQUFHLG9CQUFNLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3ZDLE1BQU0sbUJBQW1CLEdBQUcsb0JBQU0sQ0FBQyxHQUFHLENBQ3BDLGlEQUFpRCxDQUNsRCxDQUFDO0lBQ0YsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FDdEIsVUFBVSxFQUNWLG1CQUFtQixFQUNuQixTQUFTLEVBQ1QsU0FBUyxDQUNWLENBQUM7SUFDRixPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUM5QixDQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsS0FBSyxJQUFJLENBQzFELENBQUM7QUFDSixDQUFDO0FBRUQsS0FBSyxVQUFVLGtCQUFrQixDQUMvQixLQUE0QixFQUM1QixJQUFZO0lBS1osTUFBTSxLQUFLLEdBQXFCLEVBQUUsQ0FBQztJQUNuQyxNQUFNLE9BQU8sR0FBcUIsRUFBRSxDQUFDO0lBRXJDLEtBQUs7U0FDRixJQUFJLENBQ0gsb0JBQU0sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQ2hCLG9CQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxDQUFDLEVBQy9DLFNBQVMsRUFDVCxTQUFTLENBQ1Y7U0FDQSxPQUFPLENBQUMsS0FBSyxFQUFFLElBQVMsRUFBRSxFQUFFO1FBQzNCLE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7UUFFdkIsTUFBTSxVQUFVLEdBQUcsR0FBRyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QyxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNqRCxNQUFNLG1CQUFtQixHQUFHLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUUxRCxNQUFNLGdCQUFnQixHQUFHLE1BQU0sUUFBUSxDQUFDLEtBQUssRUFBRSxHQUFHLENBQUMsQ0FBQztRQUVwRCxJQUFJLGdCQUFnQixFQUFFO1lBQ3BCLE9BQU8sQ0FBQyxJQUFJLENBQ1YsSUFBSSxnQ0FBYyxDQUFDO2dCQUNqQixLQUFLLEVBQUUsYUFBYTtnQkFDcEIsSUFBSSxFQUFFLG1CQUFtQjtnQkFDekIsSUFBSSxFQUFFLG1DQUFpQixDQUFDLE1BQU07YUFDL0IsQ0FBQyxDQUNILENBQUM7U0FDSDthQUFNO1lBQ0wsS0FBSyxDQUFDLElBQUksQ0FDUixJQUFJLGdDQUFjLENBQUM7Z0JBQ2pCLEtBQUssRUFBRSxhQUFhO2dCQUNwQixJQUFJLEVBQUUsbUJBQW1CO2dCQUN6QixJQUFJLEVBQUUsbUNBQWlCLENBQUMsSUFBSTthQUM3QixDQUFDLENBQ0gsQ0FBQztTQUNIO0lBQ0gsQ0FBQyxDQUFDLENBQUM7SUFFTCxPQUFPLEVBQUUsS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDO0FBQzVCLENBQUM7QUFFcUIsZ0RBQWtCIn0=