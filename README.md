<p align="center"><img  width=25%  src="https://i.ibb.co/c2dNgFH/logo.png" border="0" /></p>
<p align="center"><img width=45% src="https://i.ibb.co/kX8GSYn/logo-text.png" alt="linkedpipes-logo" border="0" /></p>

<p align="center">
    <a href="https://travis-ci.com/aorumbayev/linkedpipes-storage"><img src="https://travis-ci.com/aorumbayev/linkedpipes-storage.svg?branch=dev" alt="Travis status" /></a>
    <a href="https://codecov.io/gh/aorumbayev/linkedpipes-storage"> <img src="https://codecov.io/gh/aorumbayev/linkedpipes-storage/branch/dev/graph/badge.svg" /> </a>
    <a href="https://aorumbayev.github.io/linkedpipes-storage/"><img src="https://img.shields.io/badge/Documentation-TypeDoc-Blue.svg" alt="Apiary" /></a>
</p>

## About

An implementation of LinkedPipes Applications Storage.
The package adds functionality to interact with [SOLID PODs](https://solid.inrupt.com/get-a-solid-pod) and is intented to be used with [LinkedPipes Applications Platform](https://github.com/linkedpipes/applications). However, some generic abstractions can be expanded for more generic use-cases.

## Prerequisited

- [Yarn 1.19.1](https://yarnpkg.com)
- [Node.js >v10.15.x](https://nodejs.org/en/)

Aside from local prerequisited, the software is intented to be used along with a web server implementing [SOLID project requirements](https://github.com/solid/solid-spec). The framework was actively tested with an instance of [node-solid-server](https://github.com/solid/node-solid-server).

## Installation

Using `yarn`:

```bash
yarn add linkedpipes-storage
```

Using `npm`:

```bash
npm install linkedpipes-storage
```

## Quick start

The generic examples below demonstrate the usage of `StorageFileManager` abstraction. For more detailed examples and TypeScript documentation refer [here](https://aorumbayev.github.io/linkedpipes-storage/).

### 1. Creating `ResourceConfig`

The `ResourceConfig` is a class describing your resource inside SOLID POD. In this example let's define a single resource configuration class instance for a folder to be created in a POD:

```JavaScript
import { ResourceConfig, SolidResourceType } from './storage-manager';

const folderConfigurationResource: ResourceConfig = new ResourceConfig(
  {
    path: `https://{your_username}.inrupt.net`,
    title: `${your_title}.txt`,
    type: SolidResourceType.Folder
  },
  {your_web_id}
);
```

### 2. Creating, editing, deleting resource

After defining the `ResourceConfig` instance, let's create one:

```JavaScript
import { StorageFileManager } from './storage-manager';

const result = await StorageFileManager.createResource(fileConfigurationResource);
```

#### Renaming folder

```JavaScript
const folderConfigurationResourceRenamed: ResourceConfig = new ResourceConfig(
  {
    path: fileConfigurationResource.resource.path,
    title: fileConfigurationResource.resource.title + '_renamed',
    type: fileConfigurationResource.resource.type
  },
  fileConfigurationResource.webID
); // Defines a sample renamed resource

const result = await StorageFileManager.renameResource(folderConfigurationResource, folderConfigurationResourceRenamed);
```

### Deleting folder

```JavaScript
const result = await StorageFileManager.deleteResource(folderConfigurationResourceRenamed);
```

## Testing

Testing is performed using [ava.js](https://github.com/avajs/ava) and [istanbul.js](https://istanbul.js.org) frameworks.

Executing tests is performed as follows:

```bash
yarn test
```
