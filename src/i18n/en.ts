/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

export const i18n_en = {
  translation: {
    name: {
      IFI: 'Institute for Future Intelligence',
      AIMS: 'AIMS',
      Tagline: 'Artificial Intelligence for Molecular Sciences — Institute for Future Intelligence',
    },

    cookie: {
      Statement: 'By clicking Accept, you agree to our use of cookies to improve your experience with AIMS.',
      Accept: 'Accept',
    },

    tooltip: {
      gotoIFI: 'Go to Institute for Future Intelligence',
      visitAIMSHomePage: 'Visit AIMS Homepage',
      clickToOpenMenu: 'Click to open main menu',
      clickToAccessAccountSettings: 'Click to access account settings',
    },

    word: {
      Maximum: 'Maximum',
      Minimum: 'Minimum',
      OK: 'OK',
      Cancel: 'Cancel',
      Close: 'Close',
      Version: 'Version',
      VersionInitial: 'V',
      AllRightsReserved: 'All Rights Reserved',
    },

    term: {
      DrugDiscovery: 'Drug Discovery',
    },

    aboutUs: {
      ProductBroughtToYouBy: 'This product is brought to you by',
      TermsOfService: 'Terms of Service',
      PrivacyPolicy: 'Privacy Policy',
      Software: 'Software',
      Content: 'Content',
      Research: 'Research',
      Support: 'Support',
      Acknowledgment: 'Acknowledgment',
      FundingInformation:
        'The National Institutes of Health (NIH) and the National Science Foundation (NSF) generously provide funding for the research and development of this product through grants R25GM150143 and 2300976. Any opinions, findings, and conclusions or recommendations expressed in this product, however, are those of the authors and do not necessarily reflect the views of NIH and NSF.',
      Contact: 'For more information, please contact Charles Xie (charles@intofuture.org).',
    },

    message: {
      CannotSignIn: 'Cannot sign in',
      CannotSignOut: 'Cannot sign out',
      YourAccountWasCreated: 'Your account was created.',
      CannotCreateAccount: 'Cannot create an account',
      YourAccountSettingsWereSaved: 'Your account settings were saved.',
      CannotSaveYourAccountSettings: 'Cannot save your account settings',
      ScreenshotSaved: 'A screenshot was saved.',
      CannotCreateNewProject: 'Cannot create a new project',
      CannotCreateNewProjectWithoutTitle: 'Cannot create a new project without a title',
      CannotOpenYourProjects: 'Cannot open your projects',
      CannotOpenProject: 'Cannot open the project',
      CannotDeleteProject: 'Cannot delete the project',
      CannotRenameProject: 'Cannot rename the project',
      CannotAddMoleculeToProject: 'Cannot add this molecule to the project',
      MoleculeRemovedFromProject: 'The molecule was successfully removed from the project',
      CannotRemoveMoleculeFromProject: 'Cannot remove this molecule from the project',
      CannotUpdateProject: 'Cannot update the project',
      CannotFetchProjectData: 'Cannot fetch project data',
      TitleUsedChooseDifferentOne: 'This title has been used. Choose a different one',
    },

    molecularViewer: {
      Axes: 'Axes',
      Style: 'Style',
      BallAndStick: 'Ball-and-Stick',
      Wireframe: 'Wireframe',
      Stick: 'Stick',
      SpaceFilling: 'Space-Filling',
      Tube: 'Tube',
      ContactSurface: 'Contact Surface',
      BackgroundColor: 'Background Color',
      Shininess: 'Shininess',
      TakeScreenshot: 'Take Screenshot',
    },

    projectPanel: {
      Project: 'Project',
      ProjectType: 'Type',
      ProjectDescription: 'Description',
      ProjectSettings: 'Project Settings',
      DisplayWindowSize: 'Display Window Size',
      ImportMolecule: 'Import a molecule',
      MoleculeName: 'Molecule Name',
      MoleculeAlreadyAdded: 'Molecule already added',
      MoleculeNotFound: 'Molecule not found',
      RemoveSelectedMolecule: 'Remove selected molecule',
      MakeDescriptionEditable: 'Make this description editable',
      MakeDescriptionNonEditable: 'Make this description non-editable',
      DoubleClickToMakeDescriptionEditable: 'Double-click to make this description editable',
      ClickToFlipSortingOrder: 'Click to flip the sorting order',
      WriteABriefDescriptionAboutThisProject: 'Write a brief description about this project.',
      Properties: 'Properties',
      ChooseProperties: 'Choose properties',
      ChooseDataColoring: 'Choose data coloring',
      SameColorForAllMolecules: 'Same color for all molecules',
      OneColorForEachMolecule: 'One color for each molecule',
      PropertiesScreenshot: 'Take a screenshot of the properties',
      AtomCount: 'Atom Count',
      BondCount: 'Bond Count',
      MolecularMass: 'Mass',
      PolarSurfaceArea: 'Polar Surface Area',
      PolarSurfaceAreaShort: 'Polar Surface',
      HydrogenBondDonorCount: 'Hydrogen Bond Donor Count',
      HydrogenBondDonorCountShort: 'HB Donors',
      HydrogenBondAcceptorCount: 'Hydrogen Bond Acceptor Count',
      HydrogenBondAcceptorCountShort: 'HB Acceptors',
      RotatableBondCount: 'Rotatable Bond Count',
      RotatableBondCountShort: 'Rotatable Bonds',
    },

    menu: {
      mainMenu: 'Main Menu',
      projectSubMenu: 'Project',
      project: {
        CreateNewProject: 'Create New Project',
        OpenLocalProject: 'Open Local Project',
        SaveAsLocalProject: 'Save as Local Project',
        SavingAbortedMustHaveValidProjectName: 'Saving aborted! You must have a valid project name',
        OpenCloudProject: 'Open Cloud Project',
        SaveCloudProject: 'Save Cloud Project',
        SaveAsCloudProject: 'Save as Cloud Project',
        SavingAbortedMustHaveValidTitle: 'Saving aborted! You must have a valid title for a cloud project',
        ToSaveYourWorkOnCloudPleaseSignIn: 'To save your work on the cloud, please sign in.',
      },
      editSubMenu: 'Edit',
      edit: {
        Undo: 'Undo',
        Redo: 'Redo',
      },
      viewSubMenu: 'View',
      view: {
        ResetView: 'Reset View',
        ZoomIn: 'Zoom In',
        ZoomOut: 'Zoom Out',
        AutoRotate: 'Auto Rotate',
      },
      languageSubMenu: 'Language',
      AboutUs: 'About Us',
    },

    accountSettingsPanel: {
      MyAccountSettings: 'My Account Settings',
      MyID: 'My 🆔',
      ClickToCopyMyID: 'Click to copy my ID',
      IDInClipBoard: 'Your ID was copied and is ready to paste.',
      AllPublished: 'All Published',
      PublishedUnderAliases: 'Aliases',
      UserCount: 'User Count',
      SchoolID: 'School ID',
      ClassID: 'Class ID',
    },

    avatarMenu: {
      AccountSettings: 'Account Settings',
      PrivacyStatementTitle: 'User Privacy Protection Statement',
      PrivacyStatement:
        'When you sign in, your Google ID is used to create and access your AIMS account. Only a random alphanumeric string is stored in our database as a reference. No personally identifiable data such as your name or email is ever gathered. For more information, see our ',
      SignIn: 'Sign In',
      SignOut: 'Sign Out',
      IfYouAreAStudent: 'If you are a student',
    },
  },
};
