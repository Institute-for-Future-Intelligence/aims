/*
 * @Copyright 2024. Institute for Future Intelligence, Inc.
 */

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

export const createStyleMap = () => {
  const map = new Map<MolecularViewerStyle, string>();
  map.set(MolecularViewerStyle.Cartoon, 'CA');
  map.set(MolecularViewerStyle.Trace, 'TR');
  map.set(MolecularViewerStyle.Tube, 'TU');
  map.set(MolecularViewerStyle.QuickSurface, 'QS');
  map.set(MolecularViewerStyle.ContactSurface, 'CS');
  map.set(MolecularViewerStyle.SolventAccessibleSurface, 'SA');
  map.set(MolecularViewerStyle.SolventExcludedSurface, 'SE');
  return map;
};

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
