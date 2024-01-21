/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

export enum MolecularViewerColoring {
  Element = 'Element',
  Residue = 'Residue',
  Chain = 'Chain',
  SecondaryStructure = 'Secondary Structure',
  Hydrophobicity = 'Hydrophobicity',
  Occupancy = 'Occupancy',
  Temperature = 'Temperature',
  Sequence = 'Sequence',
  Conformation = 'Conformation',
  Molecule = 'Molecule',
}

export const COLORING_MAP = new Map(
  [
    { key: MolecularViewerColoring.Element, value: 'EL' },
    { key: MolecularViewerColoring.Residue, value: 'RT' },
    { key: MolecularViewerColoring.Chain, value: 'CH' },
    { key: MolecularViewerColoring.SecondaryStructure, value: 'SS' },
    { key: MolecularViewerColoring.Hydrophobicity, value: 'HY' },
    { key: MolecularViewerColoring.Occupancy, value: 'OC' },
    { key: MolecularViewerColoring.Temperature, value: 'TM' },
    { key: MolecularViewerColoring.Sequence, value: 'SQ' },
    { key: MolecularViewerColoring.Conformation, value: 'CF' },
    { key: MolecularViewerColoring.Molecule, value: 'MO' },
  ].map((obj) => [obj.key, obj.value]),
);

export const CHAMBER_COLORING_LABELS = [
  { value: MolecularViewerColoring.Element, label: 'molecularViewer.Element' },
  { value: MolecularViewerColoring.Residue, label: 'molecularViewer.Residue' },
  { value: MolecularViewerColoring.Chain, label: 'molecularViewer.Chain' },
  { value: MolecularViewerColoring.SecondaryStructure, label: 'molecularViewer.SecondaryStructure' },
  { value: MolecularViewerColoring.Hydrophobicity, label: 'molecularViewer.Hydrophobicity' },
  { value: MolecularViewerColoring.Occupancy, label: 'molecularViewer.Occupancy' },
  { value: MolecularViewerColoring.Temperature, label: 'molecularViewer.Temperature' },
  { value: MolecularViewerColoring.Sequence, label: 'molecularViewer.Sequence' },
  { value: MolecularViewerColoring.Conformation, label: 'molecularViewer.Conformation' },
  { value: MolecularViewerColoring.Molecule, label: 'molecularViewer.Molecule' },
];

export enum MolecularViewerStyle {
  BallAndStick = 'Ball-and-Stick',
  Wireframe = 'Wireframe',
  Stick = 'Stick',
  SpaceFilling = 'Space-Filling',
  Cartoon = 'Cartoon',
  Trace = 'Trace',
  Tube = 'Tube',
  QuickSurface = 'Quick Surface',
  ContactSurface = 'Contact Surface',
  SolventAccessibleSurface = 'Solvent Accessible Surface',
  SolventExcludedSurface = 'Solvent Excluded Surface',
}

export enum MolecularViewerMaterial {
  Diffuse = 'Diffuse',
  Soft = 'Soft',
  Glossy = 'Glossy',
  Metal = 'Metal',
  Transparent = 'Transparent',
  Glass = 'Glass',
  Backdrop = 'Backdrop',
  Toon = 'Toon',
  Flat = 'Flat',
}

export const MATERIAL_MAP = new Map(
  [
    { key: MolecularViewerMaterial.Diffuse, value: 'DF' },
    { key: MolecularViewerMaterial.Soft, value: 'SF' },
    { key: MolecularViewerMaterial.Glossy, value: 'PL' },
    { key: MolecularViewerMaterial.Metal, value: 'ML' },
    { key: MolecularViewerMaterial.Transparent, value: 'TR' },
    { key: MolecularViewerMaterial.Glass, value: 'GL' },
    { key: MolecularViewerMaterial.Backdrop, value: 'BA' },
    { key: MolecularViewerMaterial.Toon, value: 'TN' },
    { key: MolecularViewerMaterial.Flat, value: 'FL' },
  ].map((obj) => [obj.key, obj.value]),
);

export const MATERIAL_LABELS = [
  { value: MolecularViewerMaterial.Diffuse, label: 'molecularViewer.DiffuseMaterial' },
  { value: MolecularViewerMaterial.Soft, label: 'molecularViewer.SoftMaterial' },
  { value: MolecularViewerMaterial.Glossy, label: 'molecularViewer.GlossyMaterial' },
  { value: MolecularViewerMaterial.Metal, label: 'molecularViewer.MetalMaterial' },
  // { value: MolecularViewerMaterial.Transparent, label: 'molecularViewer.TransparentMaterial' },
  // { value: MolecularViewerMaterial.Glass, label: 'molecularViewer.GlassMaterial' },
  { value: MolecularViewerMaterial.Backdrop, label: 'molecularViewer.BackdropMaterial' },
  { value: MolecularViewerMaterial.Toon, label: 'molecularViewer.ToonMaterial' },
  { value: MolecularViewerMaterial.Flat, label: 'molecularViewer.FlatMaterial' },
];

export const STYLE_MAP = new Map(
  [
    { key: MolecularViewerStyle.BallAndStick, value: 'BS' },
    { key: MolecularViewerStyle.Wireframe, value: 'LN' },
    { key: MolecularViewerStyle.Stick, value: 'LC' },
    { key: MolecularViewerStyle.SpaceFilling, value: 'VW' },
    { key: MolecularViewerStyle.Cartoon, value: 'CA' },
    { key: MolecularViewerStyle.Trace, value: 'TR' },
    { key: MolecularViewerStyle.Tube, value: 'TU' },
    { key: MolecularViewerStyle.QuickSurface, value: 'QS' },
    { key: MolecularViewerStyle.ContactSurface, value: 'CS' },
    { key: MolecularViewerStyle.SolventAccessibleSurface, value: 'SA' },
    { key: MolecularViewerStyle.SolventExcludedSurface, value: 'SE' },
  ].map((obj) => [obj.key, obj.value]),
);

export const CHAMBER_STYLE_LABELS = [
  { value: MolecularViewerStyle.BallAndStick, label: 'molecularViewer.BallAndStick' },
  { value: MolecularViewerStyle.Wireframe, label: 'molecularViewer.Wireframe' },
  { value: MolecularViewerStyle.Stick, label: 'molecularViewer.Stick' },
  { value: MolecularViewerStyle.SpaceFilling, label: 'molecularViewer.SpaceFilling' },
  { value: MolecularViewerStyle.Cartoon, label: 'molecularViewer.Cartoon' },
  { value: MolecularViewerStyle.Trace, label: 'molecularViewer.Trace' },
  { value: MolecularViewerStyle.Tube, label: 'molecularViewer.Tube' },
  { value: MolecularViewerStyle.QuickSurface, label: 'molecularViewer.QuickSurface' },
  { value: MolecularViewerStyle.ContactSurface, label: 'molecularViewer.ContactSurface' },
  { value: MolecularViewerStyle.SolventAccessibleSurface, label: 'molecularViewer.SolventAccessibleSurface' },
  { value: MolecularViewerStyle.SolventExcludedSurface, label: 'molecularViewer.SolventExcludedSurface' },
];

export const GALLERY_STYLE_LABELS = [
  { value: MolecularViewerStyle.BallAndStick, label: 'molecularViewer.BallAndStick' },
  { value: MolecularViewerStyle.Wireframe, label: 'molecularViewer.Wireframe' },
  { value: MolecularViewerStyle.Stick, label: 'molecularViewer.Stick' },
  { value: MolecularViewerStyle.SpaceFilling, label: 'molecularViewer.SpaceFilling' },
  { value: MolecularViewerStyle.QuickSurface, label: 'molecularViewer.QuickSurface' },
  { value: MolecularViewerStyle.ContactSurface, label: 'molecularViewer.ContactSurface' },
  { value: MolecularViewerStyle.SolventAccessibleSurface, label: 'molecularViewer.SolventAccessibleSurface' },
  { value: MolecularViewerStyle.SolventExcludedSurface, label: 'molecularViewer.SolventExcludedSurface' },
];
