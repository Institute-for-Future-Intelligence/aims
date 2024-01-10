/*
 * @Copyright 2023. Institute for Future Intelligence, Inc.
 */

export const i18n_zh_tw = {
  translation: {
    name: {
      IFI: '未來智能研究所',
      AIMS: 'AIMS',
      Tagline: 'AIMS: 人工智慧時代的分子科學 — 未來智能研究所研發',
    },

    cookie: {
      Statement: '聲明：為了改善您的用戶體驗，AIMS採用cookie儲存少量數據。',
      Accept: '同意',
    },

    tooltip: {
      gotoIFI: '訪問未來智能研究所',
      visitAIMSHomePage: '訪問AIMS主頁',
      clickToOpenMenu: '點擊打開主菜單',
      clickToAccessAccountSettings: '點擊打開賬號設定',
    },

    word: {
      OK: '確定',
      Cancel: '取消',
      Close: '關閉',
      Version: '版本',
      VersionInitial: '版本',
      AllRightsReserved: '版權所有',
    },

    term: {
      DrugDiscovery: '藥物發現',
    },

    aboutUs: {
      ProductBroughtToYouBy: '未來智能研究所榮譽出品',
      TermsOfService: '服務條款',
      PrivacyPolicy: '隱私政策',
      Software: '軟體',
      Content: '課件',
      Research: '研究',
      Support: '服務',
      Acknowledgment: '鳴謝',
      FundingInformation:
        '本產品的研發承蒙美國國立衛生研究院和國家科學基金會慷慨資助（項目號R25GM150143和2300976）。本產品的任何觀點或結論僅代表創作者個人意見。',
      Contact: '如您需要更多資訊，請聯繫 Charles Xie (charles@intofuture.org)。我們會盡快回复。',
    },

    message: {
      CannotSignIn: '登錄失敗',
      CannotSignOut: '退出失敗',
      YourAccountWasCreated: '成功建立您的賬號。',
      CannotCreateAccount: '無法創建賬號',
      YourAccountSettingsWereSaved: '您的賬號設定已保存。',
      CannotSaveYourAccountSettings: '您的賬號設定無法保存',
      ScreenshotSaved: '截屏圖片保存在下載文檔夾裡。',
      CannotCreateNewProject: '無法創建新項目',
      CannotCreateNewProjectWithoutTitle: '沒有標題, 無法創建新項目',
      CannotOpenYourProjects: '無法打開您的項目列表',
      CannotOpenProject: '無法打開項目',
      CannotDeleteProject: '無法刪除項目',
      CannotRenameProject: '無法給項目改名',
      CannotAddMoleculeToProject: '無法把此分子加到項目裡',
      MoleculeRemovedFromProject: '分子被成功地從項目裡刪除',
      CannotRemoveMoleculeFromProject: '無法把此分子從項目裡刪除',
      CannotUpdateProject: '無法更新項目',
      CannotFetchProjectData: '無法取得項目數據',
      TitleUsedChooseDifferentOne: '此標題已經被使用, 請採用不同的標題',
    },

    molecularViewer: {
      Axes: '顯示坐標軸',
      Style: '風格',
      BallAndStick: '球和棍',
      Wireframe: '線框架',
      Stick: '棍',
      SpaceFilling: '空間填滿',
      BackgroundColor: '背景顏色',
      Shininess: '光澤度',
    },

    projectPanel: {
      Project: '項目',
      ProjectType: '類别',
      ProjectDescription: '描述',
      ProjectSettings: '項目設定',
      DisplayWindowSize: '展示視窗大小',
      ImportMolecule: '輸入分子',
      MoleculeName: '分子名稱',
      MoleculeAlreadyAdded: '專案已經有此分子',
      MoleculeNotFound: '分子没有找到',
      RemoveSelectedMolecule: '移除選取的分子',
      MakeDescriptionEditable: '編輯描述',
      MakeDescriptionNonEditable: '不編輯描述',
      DoubleClickToMakeDescriptionEditable: '雙擊此描述激活編輯功能',
      ClickToFlipSortingOrder: '點擊逆轉排序方向',
      WriteABriefDescriptionAboutThisProject: '在此寫一個項目簡要描述。',
      Properties: '性質',
      ChooseProperties: '選擇性質',
      ChooseDataColoring: '選擇數據著色',
      SameColorForAllMolecules: '所有分子一個顏色',
      OneColorForEachMolecule: '每個分子一個顏色',
      PropertiesScreenshot: '性質截圖',
      AtomCount: '原子數量',
      BondCount: '化學鍵數量',
      MolecularMass: '質量',
      PolarSurfaceArea: '極性表面積',
      PolarSurfaceAreaShort: '極性表面積',
      HydrogenBondDonorCount: '氫鍵提供原子數量',
      HydrogenBondDonorCountShort: '氫鍵提供原子數',
      HydrogenBondAcceptorCount: '氫鍵接受原子數量',
      HydrogenBondAcceptorCountShort: '氫鍵接受原子數',
      RotatableBondCount: '可旋轉鍵數量',
      RotatableBondCountShort: '可旋轉鍵數',
    },

    menu: {
      mainMenu: '主菜單',
      fileSubMenu: '文檔',
      file: {
        CreateNewFile: '創建新文檔',
        OpenLocalFile: '打開本地文檔',
        SaveAsLocalFile: '保存為本地文檔',
        SavingAbortedMustHaveValidFileName: '文檔名無效，保存失敗',
        OpenCloudFile: '打開雲端文檔',
        SaveCloudFile: '保存雲端文檔',
        SaveAsCloudFile: '保存為雲端文檔',
        SavingAbortedMustHaveValidTitle: '雲端文檔名無效，保存失敗',
        ToSaveYourWorkPleaseSignIn: '為了保存您的雲端文檔，請您先登錄。',
        TakeScreenshot: '截屏',
        UseCloudFileName: '採用雲端文件名',
      },
      editSubMenu: '編輯',
      edit: {
        Undo: '撤銷',
        Redo: '重做',
      },
      viewSubMenu: '視界',
      view: {
        ZoomIn: '放大',
        ZoomOut: '縮小',
        AutoRotate: '自動旋轉',
      },
      languageSubMenu: '語言',
      AboutUs: '關於我們',
    },

    accountSettingsPanel: {
      MyAccountSettings: '我的賬戶設定',
      MyID: '我的🆔',
      ClickToCopyMyID: '點擊此處拷貝我的ID',
      IDInClipBoard: '您現在可以粘貼ID了。',
      AllPublished: '發佈總數',
      PublishedUnderAliases: '别名發佈',
      UserCount: '用戶總數',
      SchoolID: '學校編號',
      ClassID: '班級編號',
    },

    avatarMenu: {
      AccountSettings: '賬號設定',
      PrivacyStatementTitle: '用戶隱私權保護聲明',
      PrivacyStatement:
        '登錄需要採用您的谷歌ID建立或進入您的AIMS賬戶。 我們只儲存一個隨機的字符串作為您的ID。 任何關於您的可辨識的個人信息都沒有被收集。 詳情請參考我們的',
      SignIn: '登錄',
      SignOut: '退出賬號',
      IfYouAreAStudent: '如果您是一個學生',
    },
  },
};
