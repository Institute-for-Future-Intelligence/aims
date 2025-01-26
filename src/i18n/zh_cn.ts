/*
 * @Copyright 2023-2025. Institute for Future Intelligence, Inc.
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
      clickToOpenMenu: '点击打开主菜单',
      clickToAccessAccountSettings: '点击打开账号设定',
      atomCount: '分子的原子总数。',
      bondCount: '分子的共价键总数。',
      molecularMass: '分子的总质量，即其所有原子的质量总和。',
      logP: '分配系数的对数。分配系数是指一定温度下，物质A在两种互不相溶的溶剂中达到分配平衡时在两相中的浓度之比。分配系数可用于表示该物质对两种溶剂的亲和性的差异。',
      hydrogenBondDonorCount: '分子的氢键提供者数量。氢键提供者是在一个氢键中出氢原子的那一方。',
      hydrogenBondAcceptorCount: '分子的氢键接受者数量。氢键接受者是在一个氢键中不出氢原子的那一方。',
      rotatableBondCount:
        '分子的可旋转共价键数量。可旋转共价键是非环形的单键，其中一方原子和非氢原子成键。它的旋转可改变分子形状。',
      polarSurfaceArea: '分子的所有极性原子表面积之和。',
      heavyAtomCount: '分子的重原子总数。所有非氢原子都是重原子。',
      complexity: '从组分和结构计算的分子复杂程度。',
      density: '物质单位体积的质量。',
      boilingPoint: '在特定大气压下物质开始从液体变成气体的温度。',
      meltingPoint: '在特定大气压下物质开始从固体变成液体的温度。',
      smilesFormat: '简化分子线性输入规范（SMILES）是一种用字符串标识分子结构的标准。\n以下是根据此标准搜索的结果。',
      inchiFormat:
        '国际化合物标识（InChI）是由国际纯粹与应用化学联合会制定的用以标识分子结构的字符串。\n以下是根据此标准的搜索结果。',
    },

    url: {
      atomCount: 'https://zh.wikipedia.org/wiki/原子',
      bondCount: 'https://zh.wikipedia.org/wiki/共价键',
      molecularMass: 'https://zh.wikipedia.org/wiki/分子量',
      logP: 'https://zh.wikipedia.org/wiki/分配系数',
      hydrogenBondDonorCount: 'https://zh.wikipedia.org/wiki/氢键',
      hydrogenBondAcceptorCount: 'https://zh.wikipedia.org/wiki/氢键',
      polarSurfaceArea: 'https://zh.wikipedia.org/wiki/极性',
      density: 'https://zh.wikipedia.org/wiki/密度',
      boilingPoint: 'https://zh.wikipedia.org/wiki/沸点',
      meltingPoint: 'https://zh.wikipedia.org/wiki/熔点',
    },

    word: {
      Press: '按',
      Mode: '模式',
      MoreInformation: '更多信息',
      Mute: '勿扰',
      Formula: '公式',
      AtomsLowerCasePlural: '原子',
      Save: '保存',
      Results: '结果',
      Import: '输入',
      Total: '总数',
      Heat: '加热',
      Cool: '冷却',
      Relative: '相对',
      Dimensionless: '无量纲',
      KeyboardKey: '键',
      None: '无',
      Size: '大小',
      Small: '小',
      Large: '大',
      Name: '名字',
      Codename: '代号',
      Time: '时间',
      Energy: '能量',
      KineticEnergy: '动能',
      PotentialEnergy: '势能',
      TotalEnergy: '总能',
      Type: '类别',
      Open: '打开',
      Rename: '改名',
      Delete: '删除',
      Cut: '剪切',
      Copy: '拷贝',
      Paste: '粘贴',
      Warning: '警告',
      Caution: '小心',
      Title: '标题',
      Description: '描述',
      MaximumCharacters: '最多字符数',
      Unknown: '未知',
      Maximum: '最大',
      Minimum: '最小',
      Yes: '是',
      No: '不',
      OK: '确定',
      Cancel: '取消',
      Close: '关闭',
      Version: '版本',
      VersionInitial: '版本',
      AllRightsReserved: '版权所有',
      Anonymous: '无名氏',
    },

    term: {
      DrugDiscovery: '药物发现',
      QSARModeling: '定量构效关系模型(QSAR/QSPR)',
      MolecularModeling: '分子模拟',
      CommonMolecules: '普通分子',
      HydrocarbonMolecules: '烃分子',
      Biomolecules: '生物分子',
      DrugMolecules: '药物分子',
      Monatomic: '单原子',
      Crystal: '晶体',
      Any: '任何',
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
        '本产品的研发承蒙美国国立卫生研究院慷慨资助（项目号R25GM150143）。本产品的任何观点或结论仅代表创作者个人意见。Dylan Bulseco，Kent Crippen和William Furiosi在本产品研发过程中提供重要帮助，在此一并感谢。',
      Contact: '如您需要更多信息，请联系 Charles Xie (charles@intofuture.org)。我们会尽快回复。',
      Translators: '翻译',
    },

    message: {
      DoNotShowAgain: '别再显示',
      NewVersionAvailable: '有新版本',
      DoYouWantToRemoveAllMoleculesFromGallery: '你确定要删除项目里的所有分子吗？',
      TooManyAtomsMayCauseSimulationToRunSlowly: '加入太多原子会让模拟变得很慢',
      CannotSignIn: '登录失败',
      CannotSignOut: '退出失败',
      SigningOutAnonymousAccount: '你确定退出吗？一旦退出，此匿名账号将不可恢复。',
      SigningInAnonymousAccount:
        '你确定匿名登录吗？一旦退出，匿名账号将无法恢复。匿名登录主要是为无法实名登录的用户提供临时方便。',
      YourAccountWasCreated: '成功建立您的账号。',
      CannotCreateAccount: '无法创建账号',
      YourAccountSettingsWereSaved: '您的账号设定已保存。',
      CannotSaveYourAccountSettings: '您的账号设定无法保存',
      ScreenshotSaved: '截屏图片保存在下载文件夹里。',
      CannotCreateNewProject: '无法创建新项目',
      CannotCreateNewProjectWithoutTitle: '没有标题, 无法创建新项目',
      CannotOpenYourProjects: '无法打开您的项目列表',
      CannotOpenProject: '无法打开项目',
      CannotSaveProject: '无法保存项目',
      CannotSaveProjectWithoutTitle: '没有标题, 无法保存项目',
      CannotDeleteProject: '无法删除项目',
      CannotRenameProject: '无法给项目改名',
      CannotAddMoleculeToProject: '无法把此分子加到项目里',
      CannotAddMoleculeToProjectOwnedByOthers: '不能把此分子加到别人的项目里',
      MoleculeRemovedFromProject: '分子被成功地从项目里删除',
      CannotRemoveMoleculeFromProject: '无法把此分子从项目里删除',
      CannotUpdateProject: '无法更新项目',
      CannotFetchProjectData: '无法取得项目数据',
      TitleUsedChooseDifferentOne: '此标题已经被使用, 请采用不同的标题',
      DoYouWantToSaveChanges: '您要保存当前项目吗？',
      ThisCannotBeUndone: '这个操作一旦执行就不能撤销。',
      ToSaveYourWorkPleaseSignIn: '为了保存您的项目，请先登录。',
      NoSimilarMoleculesWereFound: '没找到类似的分子。',
      TurnOnXYZPlanesForDroppingMolecule: '被拖分子只能被释放到X-Y，Y-Z或X-Z平面上。请先打开至少一个。',
      NoPlaneToPaste: '没有可粘贴的平面',
    },

    molecularViewer: {
      Fog: '有雾',
      Axes: '显示坐标轴',
      Container: '显示容器',
      Mechanics: '力学',
      Trajectory: '显示运动轨迹',
      VanDerWaalsBonds: '显示范德华键',
      AngularBonds: '显示夹角共价键',
      TorsionalBonds: '显示扭转共价键',
      MomentumVectors: '显示动量矢量',
      ForceVectors: '显示力矢量',
      EnergyGraph: '显示能量图',
      GlobalStyle: '全局风格',
      ProteinStyle: '蛋白质风格',
      LigandStyle: '配体风格',
      Style: '风格',
      Color: '颜色',
      BallAndStick: '球和棍',
      Wireframe: '线框架',
      AtomIndex: '原子指数',
      Stick: '棍',
      SpaceFilling: '空间填满',
      Cartoon: '卡通图',
      Trace: '勾画图',
      Tube: '管状图',
      QuickSurface: '快速表面',
      ContactSurface: '接触表面',
      SolventAccessibleSurface: '溶剂可接触表面',
      SolventExcludedSurface: '溶剂不可接触表面',
      Material: '材质',
      DiffuseMaterial: '散射',
      SoftMaterial: '柔软',
      GlossyMaterial: '光泽',
      MetalMaterial: '金属',
      TranslucentMaterial: '半透明',
      GlassMaterial: '玻璃',
      BackdropMaterial: '背景',
      ToonMaterial: '卡通',
      FlatMaterial: '平均',
      BackgroundColor: '背景颜色',
      Shininess: '光泽度',
      Element: '元素',
      Residue: '残基',
      Chain: '链',
      SecondaryStructure: '二级结构',
      Hydrophobicity: '憎水性',
      Occupancy: '占有率',
      Temperature: '温度',
      Sequence: '序列',
      Conformation: '构象',
      Molecule: '分子',
      TakeScreenshot: '截屏',
      TranslateMolecule: '平移',
      RotateMolecule: '旋转',
      AboutXAxis: '绕X轴',
      AboutYAxis: '绕Y轴',
      AboutZAxis: '绕Z轴',
      EulerAngle: '欧拉角',
      Order: '顺序',
      ViewDirection: '观察方向',
      PositiveXDirection: '正X轴方向',
      NegativeXDirection: '负X轴方向',
      PositiveYDirection: '正Y轴方向',
      NegativeYDirection: '负Y轴方向',
      PositiveZDirection: '正Z轴方向',
      NegativeZDirection: '负Z轴方向',
    },

    spaceship: {
      Spaceship: '飞船',
      SpaceshipDisplay: '飞船显示',
      OutsideView: '外景',
      InsideView: '内景',
      ResetOrientation: '重置方向',
      PositionControls: '位置控制',
      MoveForwardPressW: '前进\n按W键',
      MoveBackwardPressS: '后退\n按S键',
      MoveLeftPressA: '左移\n按A键',
      MoveRightPressD: '右移\n按D键',
      MoveUpPressZ: '上移\n按Z键',
      MoveDownPressX: '下移\n按X键',
      PitchUpPressArrowUp: '向上倾斜\n按向上箭头键',
      PitchDownPressArrowDown: '向下倾斜\n按向下箭头键',
      YawLeftPressArrowLeft: '向左偏航\n按向左箭头键',
      YawRightPressArrowRight: '向右偏航\n按向右箭头键',
      RollLeftPressQ: '向左滚动\n按Q键',
      RollRightPressE: '向右滚动\n按E键',
      Thrust: '推力',
      ChangeThrustPower: '改变推力功率',
      TeleportXCoordinate: '即时传送的X坐标',
      TeleportYCoordinate: '即时传送的Y坐标',
      TeleportZCoordinate: '即时传送的Z坐标',
    },

    experiment: {
      WholeApp: '截屏整个应用',
      ReactionChamber: '反应室',
      FixAtom: '固定',
      Restraint: '弹性约束',
      DampingCoefficient: '阻尼系数',
      AtomicCoordinates: '坐标',
      AtomicMass: '质量',
      AtomicRadius: '半径',
      CohesiveEnergy: '凝聚能',
      ElectricCharge: '电荷',
      Model: '模型',
      Display: '显示',
      MolecularDynamics: '分子动力学',
      StartSimulation: '运行',
      PauseSimulation: '暂停',
      ResetSimulation: '重置',
      ExperimentSettings: '实验设定',
      Boundary: '边界',
      ContainerLx: '容器Lx',
      ContainerLy: '容器Ly',
      ContainerLz: '容器Lz',
      DisplaySettings: '显示设定',
      VdwBondCutoffRelative: '范德华键的长度阈值',
      MomentumScaleFactor: '动量矢量的比例因子',
      ForceScaleFactor: '力量的比例因子',
      KineticEnergyScaleFactor: '动能的比例因子',
      TimeStep: '时间步长',
      Steps: '步',
      Intervals: '间隔',
      RefreshingInterval: '刷新间隔',
      CollectionInterval: '采集间隔',
      Femtosecond: '飞秒',
      ConstantTemperature: '恒温',
      Temperature: '温度',
      Pressure: '压力',
      Protein: '蛋白质',
      Ligand: '配体',
      Molecules: '分子',
      SelectorCommands: '选择指令',
      Information: '信息',
      Content: '内容',
      MovingStep: '平移步长',
      RotationStep: '旋转步长',
      MoveInPositiveXDirection: '沿着X轴正方向平移试验分子',
      MoveInNegativeXDirection: '沿着X轴负方向平移试验分子',
      MoveInPositiveYDirection: '沿着Y轴正方向平移试验分子',
      MoveInNegativeYDirection: '沿着Y轴负方向平移试验分子',
      MoveInPositiveZDirection: '沿着Z轴正方向平移试验分子',
      MoveInNegativeZDirection: '沿着Z轴负方向平移试验分子',
      RotateAroundXClockwise: '绕着X轴沿顺时针方向旋转试验分子',
      RotateAroundXCounterclockwise: '绕着X轴沿逆时针方向旋转试验分子',
      RotateAroundYClockwise: '绕着Y轴沿顺时针方向旋转试验分子',
      RotateAroundYCounterclockwise: '绕着Y轴沿逆时针方向旋转试验分子',
      RotateAroundZClockwise: '绕着Z轴沿顺时针方向旋转试验分子',
      RotateAroundZCounterclockwise: '绕着Z轴沿逆时针方向旋转试验分子',
      ShowXYPlane: '显示X-Y平面',
      ShowYZPlane: '显示Y-Z平面',
      ShowXZPlane: '显示X-Z平面',
      DeleteAllAtoms: '删除所有原子',
      DoYouReallyWantToDeleteAllAtoms: '您确定删除所有原子吗',
    },

    projectListPanel: {
      CopyTitle: '拷贝标题',
      TitleCopiedToClipBoard: '标题拷贝到剪贴板',
      SearchByTitle: '按标题搜索',
      MyProjects: '我的项目',
      GenerateProjectLink: '生成项目链接',
      ProjectLinkGeneratedInClipBoard: '项目链接生成到剪贴板',
      DoYouReallyWantToDeleteProject: '您确定删除项目',
      IfSharedOrPublishedRenamingProjectBreaksExistingLinks: '如果此项目已被分享或发布, 改名会使已有链接失效',
    },

    projectPanel: {
      NoMolecule: '还没有添加分子',
      Project: '项目',
      ProjectType: '类别',
      ProjectTitle: '项目标题',
      ProjectDescription: '描述',
      ProjectSettings: '项目设定',
      GallerySettings: '图库设定',
      DisplayWindowSize: '展示窗口大小',
      OutputSelectedMoleculeToTest: '把选中的分子加到实验中',
      ToggleDragAndDropMoleculeMode: '按下此按钮然后拖放一个分子到右边反应室的X-Y，Y-Z，或X-Z平面上。',
      NumberOfColumns: '列数',
      FindMoleculesMostSimilarToSelectedOneToImportIntoGallery: '查找最类似选中分子的其它分子输入到图库',
      MostSimilarMolecules: '最类似于',
      Descriptor: '描述符',
      LevenshteinDistance: '莱文斯坦距离',
      SelectMoleculeToImportIntoGallery: '选择分子输入到图库',
      SelectMolecule: '选择分子',
      TypeToSearch: '在上面文字框打字可搜索分子',
      MoleculeType: '分子类别',
      MolecularName: '分子名称',
      MoleculeAlreadyAdded: '项目已经有此分子',
      MoleculeNotFound: '分子没有找到',
      RemoveSelectedMoleculeFromGallery: '从图库移除选中的分子',
      RemoveAllMoleculesFromGallery: '从图库移除所有的分子',
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
      GraphScreenshot: '图形截屏',
      AutoscaleGraph: '自动设定界限',
      ChemicalElements: '化学元素',
      ChemicalComposition: '化学成分',
      AtomCount: '原子数量',
      TotalNumberOfAtomsInModel: '模型的原子总数。若超过200，模拟可能会变得很慢。作为提醒，此时数字会变红。',
      BondCount: '共价键数量',
      RadialBondCount: '径向共价键数量',
      AngularBondCount: '夹角共价键数量',
      TorsionalBondCount: '扭转共价键数量',
      ResidueCount: '残基数量',
      ChainCount: '链数量',
      StructureCount: '结构数量',
      MoleculeCount: '分子数量',
      MolecularMass: '质量',
      PolarSurfaceArea: '极性表面积',
      PolarSurfaceAreaShort: '极性表面积',
      HydrogenBondDonorCount: '氢键提供者数量',
      HydrogenBondDonorCountShort: '氢键提供者',
      HydrogenBondAcceptorCount: '氢键接受者数量',
      HydrogenBondAcceptorCountShort: '氢键接受者',
      RotatableBondCount: '可旋转键数量',
      RotatableBondCountShort: '可旋转键数',
      HeavyAtomCount: '重原子数量',
      HeavyAtomCountShort: '重原子',
      Complexity: '复杂性',
      Density: '密度',
      BoilingPoint: '沸点',
      MeltingPoint: '熔点',
      LabelType: '标签类别',
      MolecularFormula: '分子式',
      GraphType: '图形类别',
      ParallelCoordinates: '平行坐标图',
      Relationship: '关系',
      ScatterPlot: '散点图',
      CoordinateSystemSettings: '坐标系设定',
      SelectXAxis: '选择X轴',
      SelectYAxis: '选择Y轴',
      XFormula: '函数f(x)',
      YFormula: '函数f(y)',
      MinimumX: '最小X',
      MaximumX: '最大X',
      MinimumY: '最小Y',
      MaximumY: '最大Y',
      NumericValues: '数值',
      ExportCsv: '输出CSV',
      ScatterPlotSettings: '散点图设定',
      GridLines: '格线',
      HorizontalLines: '水平线',
      VerticalLines: '竖直线',
      SymbolSize: '符号大小',
      LineWidth: '线宽',
      SortScatterPlotData: '数据排序',
      SortDataByXValue: '按X值',
      SortDataByYValue: '按Y值',
      RegressionAnalysis: '回归分析',
      RegressionModel: '回归模型',
      RawData: '原始数据',
      PolynomialRegressionDegree: '多项式回归度',
      ClickToIncludeMolecule: '按这里把此分子加入下图分析',
      ClickToExcludeMolecule: '按这里把此分子从下图分析排除',
    },

    menu: {
      mainMenu: '主菜单',
      projectSubMenu: '项目',
      project: {
        CreateNewProject: '创建新项目',
        OpenProject: '打开项目',
        SaveProject: '保存项目',
        SaveProjectAs: '另存项目为',
      },
      editSubMenu: '编辑',
      edit: {
        Undo: '撤销',
        Redo: '重做',
        Undone: '已撤销',
      },
      viewSubMenu: '视界',
      view: {
        NavigationView: '导航模式',
        ShowGallery: '显示图库',
        ResetView: '重置视角',
        ZoomIn: '放大',
        ZoomOut: '缩小',
        AutoRotate: '自动旋转',
      },
      accessoriesSubMenu: '配件',
      accessories: {
        Instruction: '操作说明',
      },
      examplesSubMenu: '例子',
      examples: {
        chemistrySubMenu: '化学',
        chemistry: {
          MonatomicMolecules: '单原子分子',
          DiatomicMolecules: '双原子分子',
          TriatomicMolecules: '三原子分子',
          LinearAlkanes: '链烷烃',
          Cycloalkanes: '环烷烃',
          Acenes: '并苯',
          Bu2EneIsomers: '2-丁烯的顺反异构',
          CisTransIsomerismOfFattyAcids: '油酸的顺反异构',
        },
        biologySubMenu: '生物',
        biology: {
          ProteinAlphaHelix: '蛋白质α螺旋',
          DNADoubleHelix: 'DNA双螺旋',
        },
        materialsScienceSubMenu: '材料科学',
        materialsScience: {
          GoldCrystal: '黄金晶体',
          SilverCrystal: '白银晶体',
          IronCrystal: '铁晶体',
          SaltCrystal: '食盐晶体',
          DiamondCrystal: '钻石晶体',
          Graphite: '石墨',
          Graphenes: '石墨烯',
          Zeolite: '沸石',
        },
        nanotechnologySubMenu: '纳米技术',
        nanotechnology: {
          Buckyballs: '足球烯',
          CarbonNanotube: '碳纳米管',
        },
        biotechnologySubMenu: '生物技术',
        biotechnology: {
          HIV1ProteaseInhibitor: '一型艾滋病毒蛋白酶抑制剂',
        },
      },
      languageSubMenu: '语言',
      AboutUs: '关于我们',
    },

    instructionPanel: {
      Rotate: '旋转',
      DragMouse: '拖动鼠标',
      Zoom: '缩放',
      MouseWheelOrKeys: '鼠标滚轮或者Ctrl+[和Ctrl+]',
      MouseWheelOrKeysMac: '鼠标滚轮或者⌘+[和⌘+]',
      Pan: '平移',
      HoldCtrlDragMouse: '按下Ctrl键并拖动鼠标',
      HoldMetaDragMouse: '按下⌘键并拖动鼠标',
      NavigationMode: '导航模式',
      EnableNavigation: '進入导航模式',
      DisableNavigation: '退出导航模式',
      MoveForwardBack: '前后移动',
      MoveForwardBackInstruction: '按W/S键',
      MoveLeftRight: '左右移动',
      MoveLeftRightInstruction: '按A/D键',
      MoveUpDown: '上下移动',
      MoveUpDownInstruction: '按Z/X键',
      RollLeftRight: '左右横滚',
      RollLeftRightInstruction: '按Q/E键',
      Turn: '拐弯',
      TurnInstruction: '按方向键',
      ResetView: '重置视角',
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
      SignInAsMe: '实名登录',
      SignInAnonymously: '匿名登录',
      SignOut: '退出账号',
      IfYouAreAStudent: '如果您是一个学生',
    },
  },
};
