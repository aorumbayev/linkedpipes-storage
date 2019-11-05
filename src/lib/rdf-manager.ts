import * as rdflib from 'rdflib';

const store = rdflib.graph();
const fetcher = new rdflib.Fetcher(store);
const updater = new rdflib.UpdateManager(store);

export { store, fetcher, updater, rdflib };
