/*
 * Revised from three.js library
 *
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

import { BufferGeometry, FileLoader, Float32BufferAttribute, Loader } from 'three';

class MyPDBLoader extends Loader {
  constructor(manager) {
    super(manager);
  }

  load(url, onLoad, onProgress, onError) {
    const scope = this;

    const loader = new FileLoader(scope.manager);
    loader.setPath(scope.path);
    loader.setRequestHeader(scope.requestHeader);
    loader.setWithCredentials(scope.withCredentials);
    loader.load(
      url,
      function (text) {
        try {
          onLoad(scope.parse(text));
        } catch (e) {
          if (onError) {
            onError(e);
          } else {
            console.error(e);
          }

          scope.manager.itemError(url);
        }
      },
      onProgress,
      onError,
    );
  }

  // Based on CanvasMol PDB parser

  parse(text) {
    function trim(text) {
      return text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }

    function capitalize(text) {
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    function hash(s, e) {
      return 's' + Math.min(s, e) + 'e' + Math.max(s, e);
    }

    function parseBond(start, length, satom, i) {
      const eatom = parseInt(lines[i].slice(start, start + length));

      if (eatom) {
        const h = hash(satom, eatom);

        if (_bhash[h] === undefined) {
          _bonds.push([satom - 1, eatom - 1, 1]);
          _bhash[h] = _bonds.length - 1;
        } else {
          // doesn't really work as almost all PDBs
          // have just normal bonds appearing multiple
          // times instead of being double/triple bonds
          // bonds[bhash[h]][2] += 1;
        }
      }
    }

    function buildGeometry() {
      const build = {
        geometryAtoms: new BufferGeometry(),
        geometryBonds: new BufferGeometry(),
        elementsBonds: [],
        json: {
          atoms: atoms,
        },
      };

      const geometryAtoms = build.geometryAtoms;
      const geometryBonds = build.geometryBonds;
      const verticesAtoms = [];
      const verticesBonds = [];

      // atoms
      for (let i = 0, l = atoms.length; i < l; i++) {
        const atom = atoms[i];
        verticesAtoms.push(atom[0], atom[1], atom[2]); // x, y, z
      }

      // bonds
      for (let i = 0, l = _bonds.length; i < l; i++) {
        const bond = _bonds[i];
        const start = bond[0];
        const end = bond[1];
        const startAtom = _atomMap[start];
        const endAtom = _atomMap[end];
        verticesBonds.push(startAtom[0], startAtom[1], startAtom[2]); // x, y, z for start atom
        build.elementsBonds.push(startAtom[3]); // element for start atom
        verticesBonds.push(endAtom[0], endAtom[1], endAtom[2]); // x, y, z for end atom
        build.elementsBonds.push(endAtom[3]); // element for end atom
      }

      // build geometry
      geometryAtoms.setAttribute('position', new Float32BufferAttribute(verticesAtoms, 3));
      geometryBonds.setAttribute('position', new Float32BufferAttribute(verticesBonds, 3));

      return build;
    }

    const atoms = [];
    const _bonds = [];
    const _bhash = {};
    const _atomMap = {};

    // parse
    const lines = text.split('\n');
    for (let i = 0, l = lines.length; i < l; i++) {
      if (lines[i].slice(0, 4) === 'ATOM' || lines[i].slice(0, 6) === 'HETATM') {
        const x = parseFloat(lines[i].slice(30, 37));
        const y = parseFloat(lines[i].slice(38, 45));
        const z = parseFloat(lines[i].slice(46, 53));
        const index = parseInt(lines[i].slice(6, 11)) - 1;
        let e = trim(lines[i].slice(76, 78)).toLowerCase();
        if (e === '') {
          e = trim(lines[i].slice(12, 14)).toLowerCase();
        }
        const atomData = [x, y, z, e, capitalize(e)];
        atoms.push(atomData);
        _atomMap[index] = atomData;
      } else if (lines[i].slice(0, 6) === 'CONECT') {
        const satom = parseInt(lines[i].slice(6, 11));
        parseBond(11, 5, satom, i);
        parseBond(16, 5, satom, i);
        parseBond(21, 5, satom, i);
        parseBond(26, 5, satom, i);
      }
    }

    // build and return geometry

    return buildGeometry();
  }
}

export { MyPDBLoader };
