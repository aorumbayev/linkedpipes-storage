import { namedNode } from '@rdfjs/data-model';
import ldflex from '@solid/query-ldflex';
import { isEqual } from 'lodash';
import * as N3 from 'n3';
import * as $rdf from 'rdflib';
import {
  StorageAuthenticationManager,
  StorageTestAuthenticationManager
} from '../auth-manager';
import { ENVIRONMENT } from '../constants';
import { ACL_PREFIXES, PERMISSIONS } from './constants';

const solid =
  ENVIRONMENT === 'TEST'
    ? StorageTestAuthenticationManager
    : StorageAuthenticationManager;

interface Permissions {
  agents: null | string[];
  modes: string[];
}

export class SolidError extends Error {
  public message: string;
  public statusText: string;
  public code: number;
  public type: string;
  public status: number;

  constructor(message: string, name: string, code: number) {
    super(message);
    this.message = message;
    this.statusText = message;
    this.name = name || 'SolidError';
    this.type = this.name;
    this.code = code || 0;
    this.status = code || 0;
  }
}

export default class AccessControlList {
  public owner: any;
  public documentUri: any;
  public aclUri: any;
  public acl: any;

  constructor(owner, documentUri) {
    this.owner = owner;
    this.documentUri = documentUri;
    this.aclUri = `${this.documentUri}.acl`;
    this.acl = null;
  }

  set setAcl(acl) {
    this.acl = acl;
  }

  static get MODES(): any {
    return PERMISSIONS;
  }

  /**
   * @function createsQuad Creates a simple quad object
   * @param {string} subject Subject of the quad
   * @param {string} predicate Predicate of the quad
   * @param {string} object Object of the quad
   */
  public createQuad = (subject, predicate, object) => ({
    subject,
    predicate,
    object
  });

  /**
   * @function createQuadList Creates a N3 quad list to later be parsed as Turtle
   * @param {Array<string>} modes Array of modes
   * @param {Array<string> | null} agents Array of webId or null if for everyone
   */
  public createQuadList = (modes: string[], agents: string[] | null) => {
    const { acl, foaf, rdf } = ACL_PREFIXES;
    const subject = `${this.aclUri}#${modes.join('')}`;
    const documentUri = this.documentUri;
    const originalPredicates = [
      this.createQuad(subject, `${rdf}type`, namedNode(`${acl}Authorization`)),
      this.createQuad(subject, `${acl}accessTo`, namedNode(documentUri)),
      this.createQuad(subject, `${acl}default`, namedNode(documentUri))
    ];
    let predicates = [];
    if (agents) {
      const agentsArray = Array.isArray(agents) ? agents : [agents];
      const agentsQuads = agentsArray.map(agent =>
        this.createQuad(subject, `${acl}agent`, namedNode(agent))
      );
      predicates = [...originalPredicates, ...agentsQuads];
    } else {
      const publicQuad = this.createQuad(
        subject,
        `${acl}agentClass`,
        namedNode(`${foaf}Agent`)
      );
      predicates = [...originalPredicates, publicQuad];
    }

    const quadList = modes.reduce(
      (array, mode) => [
        ...array,
        this.createQuad(subject, `${acl}mode`, namedNode(`${acl}${mode}`))
      ],
      predicates
    );

    return quadList;
  };

  /**
   * @function createPermissionsTurtle Creates a turtle with specific permissions
   * @param {Array<Permissions> | null} permissions Array of permissions to be added to the turtle string
   * @return {string } A Turtle looking string with all of the necessary permissions
   */
  public createPermissionsTurtle = (permissions: Permissions[]) => {
    const { DataFactory } = N3;
    const prefixes = { ...ACL_PREFIXES, '': `${this.aclUri}#`, me: this.owner };
    const { namedNode, quad } = DataFactory;
    const writer = new N3.Writer({ prefixes });
    const quadPermissions = permissions.map(({ modes, agents }) =>
      this.createQuadList(modes, agents)
    );
    const quads = quadPermissions
      .map(quadItem => {
        const itemQuads = quadItem.map(({ subject, predicate, object }) =>
          quad(namedNode(subject), namedNode(predicate), object)
        );
        return itemQuads;
      })
      .reduce((array, item) => [...array, ...item], []);

    quads.forEach(quadItem => writer.addQuad(quadItem));
    let turtle;
    writer.end((error, result) => {
      if (!error) {
        turtle = result;
      }
    });

    const newStore = $rdf.graph();

    $rdf.parse(turtle, newStore, this.aclUri, 'text/turtle', undefined);
    const response = newStore.serialize(this.aclUri, 'text/turtle', '');
    return response;
  };

  /**
   * @function createACL Creates a file or container with a specific set of acls. Assigns READ, WRITE and CONTROL permissions to the owner by default
   * @param {Array<Permissions> | null} permissions Array of permissions to be added in the acl file
   */
  public createACL = async (permissions = null) => {
    try {
      if (permissions) {
        const permissionList = [
          {
            agents: this.owner,
            modes: [PERMISSIONS.READ, PERMISSIONS.WRITE, PERMISSIONS.CONTROL]
          },
          ...permissions
        ];
        const body = this.createPermissionsTurtle(permissionList);
        return this.createSolidResource(this.aclUri, { body });
      }
    } catch (error) {
      throw error;
    }
    return undefined;
  };

  /**
   * @function void Helper function to create a file
   * @param {string} url Url where the solid file has to be created
   * @param {Object} options Options to add as part of the native fetch options object
   */
  public createSolidResource = async (url: string, options: object = {}) =>
    solid.fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'text/turtle'
      },
      ...options
    });

  /**
   * @function getParentACL Recursively tries to retrieve the acl file from the parent containers if there is not a direct one
   * @param {string} url Url of the parent container
   * @getParentACL {Object || null} Parent acl fetched file
   */
  public getParentACL = async (url: string) => {
    const newURL = new URL(url);
    const { pathname } = newURL;
    const hasParent = pathname.length > 1;
    if (!hasParent) {
      return null;
    }
    const isContainer = pathname.endsWith('/');
    let newPathname = isContainer
      ? pathname.slice(0, pathname.length - 1)
      : pathname;
    newPathname = `${newPathname.slice(0, newPathname.lastIndexOf('/'))}/`;
    const parentURI = `${newURL.origin}${newPathname}`;
    const result = await solid.fetch(`${parentURI}.acl`);
    if (result.status === 404) {
      return this.getParentACL(parentURI);
    }
    if (result.status === 200) {
      return result;
    }

    return null;
  };

  /**
   * @function getACLFile Retrieves the acl file from the network
   * @returns {Object} Acl fetched file
   */
  public getACLFile = async () => {
    try {
      const result = await solid.fetch(this.aclUri);
      if (result.status === 403) {
        throw new Error(result.statusText || 'Not authorized');
      }
      if (result.status === 404) {
        return this.getParentACL(this.documentUri);
      }
      return result;
    } catch (e) {
      throw e;
    }
  };

  /**
   * @function getSubjects Creates an object based on a ldflex proxy document
   * @param {Proxy} document The base ldflex proxy document from where the data will be extracted
   * @returns {Array<Permissions>} A custom object to visualize the acls of a document or container in a Pod
   */
  public getSubjects = async document => {
    let subjects = [];
    for await (const subject of document.subjects) {
      let agents = [];
      let modes = [];
      for await (const agent of subject['acl:agent']) {
        agents = [...agents, agent.value];
      }
      for await (const mode of subject['acl:mode']) {
        const modeName = mode.value ? mode.value.split('#')[1] : '';
        modes = [...modes, modeName];
      }
      const agentClass = await subject['acl:agentClass'];
      if (agents.length > 0) {
        subjects = [...subjects, { subject, agents, modes }];
      }
      if (agentClass) {
        subjects = [...subjects, { subject, agents: null, modes }];
      }
    }
    return subjects;
  };

  /**
   * @function getPermissions Retrieves the acl file as an array of Permissions objects
   * @returns {Array<Permissions>} An array of permissions
   */
  public getPermissions = async () => {
    try {
      if (!this.acl) {
        const file = await this.getACLFile();
        if (!file) {
          throw new SolidError(
            'ACL File was not found for the resource',
            'Permission Errors',
            404
          );
        }
        const doc = await ldflex[file.url];
        const permissions = this.getSubjects(doc);
        this.setAcl = permissions;
        return permissions;
      }
      return this.acl;
    } catch (e) {
      throw e;
    }
  };

  /**
   * @function deleteACL Deletes the entire acl file, leaving the default acls from the parent container
   * @return {Boolean} Returns if deletion was successful
   */
  public deleteACL = async () => {
    const result = await solid.fetch(this.aclUri, { method: 'DELETE' });
    return result.ok;
  };

  /**
   * @function isSameMode checks if two sorted arrays of modes are equal
   * @param {Array<string>} modes1 An array of mode names to be compared
   * @param {Array<string>} modes2 An array of mode names to be compared
   * @returns {Boolean} The result of comparing two array to see if are equals
   */
  public isSameMode = (modes1, modes2) => isEqual(modes1.sort(), modes2.sort());

  /**
   * @function createMode creates a new mode in the acl file
   * @param {Permissions} permissions Permissions with the necessary modes and agents
   */
  public createMode = async ({ modes, agents }) => {
    try {
      const { acl, foaf } = ACL_PREFIXES;
      const subject = `${this.aclUri}#${modes.join('')}`;
      await ldflex[subject].type.add(namedNode(`${acl}Authorization`));
      const path = namedNode(this.documentUri);
      await ldflex[subject]['acl:accessTo'].add(path);
      await ldflex[subject]['acl:default'].add(path);
      /* If agents is null then it will be added to the default permission (acl:agentClass) for 'everyone' */
      if (agents) {
        for await (const agent of agents) {
          await ldflex[subject]['acl:agent'].add(namedNode(agent));
        }
      } else {
        await ldflex[subject]['acl:agentClass'].add(namedNode(`${foaf}Agent`));
      }

      for await (const mode of modes) {
        await ldflex[subject]['acl:mode'].add(namedNode(`${acl}${mode}`));
      }
      return { modes, agents };
    } catch (e) {
      throw e;
    }
  };

  /**
   * @function addPermissionsToMode removes a specific agent from a specific mode in the acl file
   * @param {Permissions} mode An existing mode (subject) in the acl file
   * @param {string} agent WebId of the user the mode will be assigned to
   */
  public addPermissionsToMode = async (mode, agent) => {
    const { subject } = mode;
    await ldflex[subject]['acl:agent'].add(namedNode(agent));
  };

  // /**
  //  * @function removePermissionsFromMode removes a specific agent from a specific mode in the acl file
  //  * @param {Permissions} mode An existing mode (subject) in the acl file
  //  * @param {string} agent WebId of the user to remove from an existing mode
  //  */
  // public removePermissionsFromMode = async (
  //   mode: Permissions,
  //   agent: string
  // ) => {
  //   const { subject } = mode;
  //   await ldflex[subject]['acl:agent'].delete(namedNode(agent));
  // };

  /**
   * @function assignPermissions Assigns permissions to specific agents, creates a new mode if it does not exist
   * @param {Array<Permissions> | null | string} permissionss An array of permissions to be assigned
   */
  public assignPermissions = async permissions => {
    const aclPermissions = await this.getPermissions();
    for await (const permission of permissions) {
      const { modes, agents } = permission;
      const modeExists = aclPermissions.filter(per =>
        this.isSameMode(per.modes, modes)
      );
      if (modeExists.length > 0) {
        const mode = modeExists[0];
        const agentsExists = agents.filter(
          agent => !mode.agents.includes(agent)
        );
        for await (const agent of agentsExists) {
          await this.addPermissionsToMode(mode, agent);
        }
      } else {
        return this.createMode(permission);
      }
    }
    return undefined;
  };

  //   /**
  //    * @function removePermissions Removes specific permissions to specific agents if exists
  //    * @param {Array<Permissions> | null | string} permissionss An array of permissions to be removed
  //    */
  //   public removePermissions = async permissions => {
  //     try {
  //       const aclPermissions = await this.getPermissions();
  //       for await (const permission of permissions) {
  //         const { modes, agents } = permission;
  //         const modeExists = aclPermissions.filter(per =>
  //           this.isSameMode(per.modes, modes)
  //         );
  //         if (modeExists.length > 0) {
  //           const mode = modeExists[0];
  //           const agentsExists = mode.agents.filter(agent =>
  //             agents.includes(agent)
  //           );
  //           for await (const agent of agentsExists) {
  //             await this.removePermissionsFromMode(mode, agent);
  //           }
  //         }
  //       }
  //     } catch (e) {
  //       throw e;
  //     }
  //   };
}
