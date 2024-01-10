/*
 * @Copyright 2023. Institute for Future Intelligence, Inc.
 */

export const i18n_zh_cn = {
  translation: {
    name: {
      IFI: '未来智能研究所',
      AIMS: 'AIMS',
      Tagline: 'AIMS: 人工智能时代的分子科学 — 未来智能研究所研发',
    },

    cookie: {
      Statement: '声明：为了改善您的用户体验，AIMS采用cookie储存少量数据。',
      Accept: '同意',
    },

    tooltip: {
      gotoIFI: '访问未来智能研究所',
      visitAIMSHomePage: '访问AIMS主页',
      clickToOpenMenu: '点击打开主菜单',
      clickToAccessAccountSettings: '点击打开账号设定',
    },

    word: {
      OK: '确定',
      Cancel: '取消',
      Close: '关闭',
      Version: '版本',
      VersionInitial: '版本',
      AllRightsReserved: '版权所有',
    },

    term: {
      DrugDiscovery: '药物发现',
    },

    aboutUs: {
      ProductBroughtToYouBy: '未来智能研究所荣誉出品',
      TermsOfService: '服务条款',
      PrivacyPolicy: '隐私政策',
      Software: '软件',
      Content: '课件',
      Research: '研究',
      Support: '服务',
      Acknowledgment: '鸣谢',
      FundingInformation:
        '本产品的研发承蒙美国国立卫生研究院和国家科学基金会慷慨资助（项目号R25GM150143和2300976）。本产品的任何观点或结论仅代表创作者个人意见。',
      Contact: '如您需要更多信息，请联系 Charles Xie (charles@intofuture.org)。我们会尽快回复。',
      Translators: '翻译',
    },

    message: {
      CannotSignIn: '登录失败',
      CannotSignOut: '退出失败',
      YourAccountWasCreated: '成功建立您的账号。',
      CannotCreateAccount: '无法创建账号',
      YourAccountSettingsWereSaved: '您的账号设定已保存。',
      CannotSaveYourAccountSettings: '您的账号设定无法保存',
      ScreenshotSaved: '截屏图片保存在下载文件夹里。',
      CannotCreateNewProject: '无法创建新项目',
      CannotCreateNewProjectWithoutTitle: '没有标题, 无法创建新项目',
      CannotOpenYourProjects: '无法打开您的项目列表',
      CannotOpenProject: '无法打开项目',
      CannotDeleteProject: '无法删除项目',
      CannotRenameProject: '无法给项目改名',
      CannotAddMoleculeToProject: '无法把此分子加到项目里',
      MoleculeRemovedFromProject: '分子被成功地从项目里删除',
      CannotRemoveMoleculeFromProject: '无法把此分子从项目里删除',
      CannotUpdateProject: '无法更新项目',
      CannotFetchProjectData: '无法取得项目数据',
      TitleUsedChooseDifferentOne: '此标题已经被使用, 请采用不同的标题',
    },

    molecularViewer: {
      Axes: '显示坐标轴',
      Style: '风格',
      BallAndStick: '球和棍',
      Wireframe: '线框架',
      Stick: '棍',
      SpaceFilling: '空间填满',
      BackgroundColor: '背景颜色',
      Shininess: '光泽度',
    },

    projectPanel: {
      Project: '项目',
      ProjectType: '类别',
      ProjectDescription: '描述',
      ProjectSettings: '项目设定',
      DisplayWindowSize: '展示窗口大小',
      ImportMolecule: '输入分子',
      MoleculeName: '分子名称',
      MoleculeAlreadyAdded: '项目已经有此分子',
      MoleculeNotFound: '分子没有找到',
      RemoveSelectedMolecule: '移除选中的分子',
      MakeDescriptionEditable: '编辑描述',
      MakeDescriptionNonEditable: '不编辑描述',
      DoubleClickToMakeDescriptionEditable: '双击此描述激活编辑功能',
      ClickToFlipSortingOrder: '点击逆转排序方向',
      WriteABriefDescriptionAboutThisProject: '在此处写一个项目简要描述。',
      Properties: '性质',
      ChooseProperties: '选择性质',
      ChooseDataColoring: '选择数据着色',
      SameColorForAllMolecules: '所有分子一个颜色',
      OneColorForEachMolecule: '每个分子一个颜色',
      PropertiesScreenshot: '性质截图',
      AtomCount: '原子数量',
      BondCount: '化学键数量',
      MolecularMass: '质量',
      PolarSurfaceArea: '极性表面积',
      PolarSurfaceAreaShort: '极性表面积',
      HydrogenBondDonorCount: '氢键提供原子数量',
      HydrogenBondDonorCountShort: '氢键提供原子数',
      HydrogenBondAcceptorCount: '氢键接受原子数量',
      HydrogenBondAcceptorCountShort: '氢键接受原子数',
      RotatableBondCount: '可旋转键数量',
      RotatableBondCountShort: '可旋转键数',
    },

    menu: {
      mainMenu: '主菜单',
      fileSubMenu: '文件',
      file: {
        CreateNewFile: '创建新文件',
        OpenLocalFile: '打开本地文件',
        SaveAsLocalFile: '保存为本地文件',
        SavingAbortedMustHaveValidFileName: '文件名无效，保存失败',
        OpenCloudFile: '打开云端文件',
        SaveCloudFile: '保存云端文件',
        SaveAsCloudFile: '保存为云端文件',
        SavingAbortedMustHaveValidTitle: '云端文件名无效，保存失败',
        ToSaveYourWorkPleaseSignIn: '为了保存您的云端文件，请您先登录。',
        TakeScreenshot: '截屏',
        UseCloudFileName: '采用云端文件名',
      },
      editSubMenu: '编辑',
      edit: {
        Undo: '撤销',
        Redo: '重做',
      },
      viewSubMenu: '视界',
      view: {
        ZoomIn: '放大',
        ZoomOut: '缩小',
        AutoRotate: '自动旋转',
      },
      languageSubMenu: '语言',
      AboutUs: '关于我们',
    },

    accountSettingsPanel: {
      MyAccountSettings: '我的账户设定',
      MyID: '我的🆔',
      ClickToCopyMyID: '点击此处拷贝我的ID',
      IDInClipBoard: '您现在可以粘贴ID了。',
      AllPublished: '发布总数',
      PublishedUnderAliases: '别名发布',
      UserCount: '用户总数',
      SchoolID: '学校编号',
      ClassID: '班级编号',
    },

    avatarMenu: {
      AccountSettings: '账号设定',
      PrivacyStatementTitle: '用户隐私保护声明',
      PrivacyStatement:
        '登录需要采用您的谷歌ID建立或进入您的AIMS账户。 我们只储存一个随机的字符串作为您的ID。 任何关于您的可辨识的个人信息都没有被收集。 详情请参考我们的',
      SignIn: '登录',
      SignOut: '退出账号',
      IfYouAreAStudent: '如果您是一个学生',
    },
  },
};
