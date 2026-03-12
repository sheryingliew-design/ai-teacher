import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Settings, Download, Upload, Sparkles, 
  Users, BookOpen, Calendar, Edit2, Save, X, Check, Loader2,
  FileSpreadsheet, MessageCircle, FileUp, Wand2, ArrowRight,
  Camera, ImagePlus, Globe, Building, Key, Lock, Unlock, Shield, Palette,
  UserMinus, FileX, MessageSquare, UserPlus, ArrowUp, ArrowDown, Layers,
  RotateCcw, LogOut, Receipt, Send, Copy, Search, AlertTriangle, Info
} from 'lucide-react';

declare global {
  var __app_id: string | undefined;
  var __firebase_config: any;
  var __initial_auth_token: string | undefined;
  interface Window {
    XLSX: any;
  }
}

// --- FIREBASE CLOUD SYNC CONFIGURATION ---
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';

// --- API CONFIGURATION ---
const apiKey = ""; 

let app, auth, db, analytics;
const appId = typeof __app_id !== 'undefined' ? __app_id : 'notimonkey-live-sync';

try {
  const firebaseConfig = {
    apiKey: "AIzaSyDF2woLu-mkCRMnc4ga6eHybEmm4TB8upI",
    authDomain: "notimonkeys-ai.firebaseapp.com",
    projectId: "notimonkeys-ai",
    storageBucket: "notimonkeys-ai.firebasestorage.app",
    messagingSenderId: "952329521412",
    appId: "1:952329521412:web:40ffd59ae6e7d281cda851",
    measurementId: "G-GE0ZQQWV1K"
  };
  
  app = initializeApp(firebaseConfig);
  
  try {
    analytics = getAnalytics(app);
  } catch (analyticsError) {
    console.warn("Firebase Analytics could not be initialized:", analyticsError);
  }
  
  auth = getAuth(app);
  db = getFirestore(app);
} catch (e) {
  console.error("Firebase init failed:", e);
}

// --- BILINGUAL DICTIONARY ---
const dict = {
  en: {
    appTitle: "NotiMonkey AI Sync",
    classes: "Classes",
    lessons: "Lessons",
    allStudents: "All Students",
    recycleBin: "Recycle Bin",
    deletedClasses: "Deleted Classes",
    deletedLessons: "Deleted Lessons",
    deletedStudents: "Deleted Students",
    restore: "Restore",
    permanentDelete: "Perm. Delete",
    scanImage: "Scan Image Roster",
    importList: "Import Excel/CSV",
    studentsInClass: "Students in class",
    addStudent: "Add Student",
    addExisting: "Add Existing",
    searchStudent: "Search student by name or username...",
    noAvailableStudents: "No other students in this branch to add.",
    selectAll: "Select All",
    addSelected: "Add Selected",
    selected: "selected",
    msgTemplate: "Msg Template",
    manageColumns: "Manage Columns",
    smartFill: "Smart Fill Template",
    autoFillAi: "Auto-Fill All AI",
    noStudents: "No students found.",
    addManually: "Add Manually",
    importExcel: "Import Excel",
    noLesson: "No lesson created yet.",
    createLesson: "Create Lesson",
    lessonInheritHint: "This new lesson will automatically inherit all students and table columns from this Class.",
    monthDate: "Month / Date",
    name: "Name",
    gender: "Gender",
    contact: "Contact",
    actions: "Actions",
    manageGridColumns: "Manage Grid Columns",
    addNewColumn: "Add New Column",
    saveAsNewTemplate: "Save as New Template",
    done: "Done",
    createClass: "Create New Class",
    className: "Class Name",
    selectTemplate: "Select Template",
    cancel: "Cancel",
    save: "Save",
    templateName: "Template Name (e.g. Science Class)",
    saveTemplateBtn: "Save Template",
    editStudent: "Edit Student Info",
    addStudentTitle: "Add New Student",
    addExistingTitle: "Add Existing Students",
    fullName: "Full Name",
    username: "Username",
    password: "Password",
    whatsappNum: "WhatsApp Number",
    saveStudent: "Save Student",
    generating: "AI thinking...",
    scanImport: "Scan & Import",
    analyzing: "Analyzing Image...",
    branches: "Branches",
    createBranch: "Create Branch",
    branchName: "Branch Name",
    branchPassword: "Branch Password (Required)",
    enterBranchPassword: "Enter password to access branch",
    unlock: "Unlock",
    incorrectPassword: "Incorrect password!",
    selectAiLang: "Select AI Language",
    generate: "Generate",
    importSuccess: "students imported successfully!",
    importEmpty: "File is empty or invalid.",
    renameClass: "Rename Class",
    renameLesson: "Rename Lesson",
    newName: "New Name",
    newDate: "New Date / Name",
    superAdmin: "Super Admin",
    adminDashboard: "Admin Dashboard",
    branchPasswords: "Branch Passwords",
    adminPassword: "Admin Password",
    tableTheme: "Table Color Theme",
    selectTheme: "Pick a Color Style",
    welcomeSelectBranch: "Welcome! Please select a branch",
    noBranchesYet: "No branches created yet.",
    enterLessonDate: "Lesson Date (e.g. 05-Feb)",
    onlyAdminDeleteBranch: "Only Super Admin can delete a branch!",
    selectBranchFirst: "Please select or create a branch first!",
    globalUpdateSuccess: "Student updated across all classes!",
    sendLogin: "Send Login Info",
    sendAbsent: "Send Absent Reminder",
    sendHW: "Send Missing HW Reminder",
    sendComment: "Send Teacher Comment",
    templateLogin: "Login Info Template",
    templateAbsent: "Absent Template",
    templateHW: "Missing HW Template",
    templateComment: "Teacher Comment Template",
    singleLesson: "Single",
    bulkCreate: "Bulk Create",
    startDate: "Start Date",
    daysOfWeek: "Days of Week",
    totalLessons: "Total Lessons",
    skipDates: "Skip Dates (YYYY-MM-DD)",
    warningPermDelete: "WARNING: Cannot be undone! Are you sure?",
    exitBranch: "Exit Branch",
    paymentReminder: "Payment Reminders",
    uploadPaymentReport: "Upload Excel Report",
    billingEmpty: "Upload an Excel/CSV payment report to generate smart WhatsApp reminders.",
    billingCardTotal: "Total Due",
    sendReminder: "Send Reminder",
    templateBilling: "Billing Template",
    copyAttendance: "Copy Attendance",
    exportReport: "Export Report"
  },
  zh: {
    appTitle: "NotiMonkey 云端协作版",
    classes: "班级",
    lessons: "课程",
    allStudents: "所有学生 (总表)",
    recycleBin: "回收站",
    deletedClasses: "已删班级",
    deletedLessons: "已删课程",
    deletedStudents: "已删学生",
    restore: "恢复",
    permanentDelete: "彻底删除",
    scanImage: "扫描图片名单",
    importList: "导入 Excel/CSV",
    studentsInClass: "名学生",
    addStudent: "添加学生",
    addExisting: "添加现有学生",
    searchStudent: "输入名字或账号搜索...",
    noAvailableStudents: "分行内目前没有其他可添加的学生。",
    selectAll: "全选",
    addSelected: "批量添加选中",
    selected: "已选",
    msgTemplate: "消息模板",
    manageColumns: "管理列/模板",
    smartFill: "智能填充表格",
    autoFillAi: "AI一键评语",
    noStudents: "目前没有任何学生数据。",
    addManually: "手动添加",
    importExcel: "导入 Excel",
    noLesson: "尚未创建课程日期。",
    createLesson: "创建课程",
    lessonInheritHint: "新建的课程将自动继承该班级内的所有学生名单与表格记录列模板，无需重复添加。",
    monthDate: "月份 / 日期",
    name: "姓名",
    gender: "性别",
    contact: "联系电话",
    actions: "操作",
    manageGridColumns: "管理记录列与模板",
    addNewColumn: "添加新列",
    saveAsNewTemplate: "存为新模板",
    done: "完成",
    createClass: "创建新班级",
    className: "班级名称",
    selectTemplate: "选择模板",
    cancel: "取消",
    save: "保存",
    templateName: "新模板名称 (例如: 科学班)",
    saveTemplateBtn: "保存模板",
    editStudent: "编辑学生信息",
    addStudentTitle: "添加新学生",
    addExistingTitle: "从分行总库中拉取现有学生",
    fullName: "全名",
    username: "账号 (Username)",
    password: "密码 (Password)",
    whatsappNum: "WhatsApp 号码",
    saveStudent: "保存学生",
    generating: "AI 思考中...",
    scanImport: "扫描并导入",
    analyzing: "分析图片中...",
    branches: "分行",
    createBranch: "创建分行",
    branchName: "分行名称",
    branchPassword: "分行登录密码 (必填)",
    enterBranchPassword: "输入密码以访问该分行",
    unlock: "解锁进入",
    incorrectPassword: "密码错误！",
    selectAiLang: "选择 AI 评语语言",
    generate: "生成",
    importSuccess: "名学生已成功导入！",
    importEmpty: "文件为空或格式无效。",
    renameClass: "重命名班级",
    renameLesson: "修改课程日期/名称",
    newName: "新名称",
    newDate: "新日期或名称",
    superAdmin: "超级管理",
    adminDashboard: "管理后台",
    branchPasswords: "分行密码列表",
    adminPassword: "管理员密码",
    tableTheme: "表格主题颜色",
    selectTheme: "挑选您喜欢的颜色风格",
    welcomeSelectBranch: "欢迎！请选择或创建一个分行",
    noBranchesYet: "暂未创建任何分行",
    enterLessonDate: "课程日期 (例如: 05-Feb)",
    onlyAdminDeleteBranch: "只有超级管理员可以删除分行！",
    selectBranchFirst: "请先选择或创建一个分行！",
    globalUpdateSuccess: "该学生在所有班级的资料已同步更新！",
    sendLogin: "发送登录账号",
    sendAbsent: "发送缺席提醒",
    sendHW: "发送欠交功课提醒",
    sendComment: "发送老师评语",
    templateLogin: "登录信息模板",
    templateAbsent: "缺席提醒模板",
    templateHW: "欠交功课模板",
    templateComment: "老师评语模板",
    singleLesson: "单次建课",
    bulkCreate: "批量排课",
    startDate: "开始日期",
    daysOfWeek: "上课星期",
    totalLessons: "总课数",
    skipDates: "跳过日期 (如假期, 格式: YYYY-MM-DD)",
    warningPermDelete: "警告：彻底删除后无法恢复！确定吗？",
    exitBranch: "退出分行",
    paymentReminder: "追账小能手 (催交学费)",
    uploadPaymentReport: "导入学费报表 (Excel)",
    billingEmpty: "导入您的系统学费报表，我们会自动帮您合并兄弟姐妹的欠费，一键发送 WhatsApp 追账！",
    billingCardTotal: "总欠款",
    sendReminder: "发送催费提醒",
    templateBilling: "学费催收模板",
    copyAttendance: "复制签到名单",
    exportReport: "导出报表"
  }
};

// --- DEFAULT MULTI-TEMPLATES ---
const defaultTemplatesSet = {
  login: {
    en: "Dear parents,\nWe're glad to announce that we're going to launch our app.\nHere's the log in information for your child, {{name}}.\n\n*Link:* https://notimonkeys.com/student\n*Username:* {{username}}\n*Password:* {{password}}\n\nFeel free to WhatsApp us if you have any questions. Looking forward to seeing your child in our next lesson!",
    zh: "亲爱的家长，\n我们很高兴地宣布我们的应用程序即将上线。\n以下是您的孩子 {{name}} 的登录信息。\n\n*链接:* https://notimonkeys.com/student\n*账号:* {{username}}\n*密码:* {{password}}\n\n如果您有任何疑问，欢迎随时通过 WhatsApp 联系我们。期待在下一堂课见到您的孩子！"
  },
  absent: {
    en: "Dear parents,\nWe noticed that {{name}} is absent from class today. Please let us know if everything is okay and remind them to join us next time!",
    zh: "亲爱的家长，\n我们注意到 {{name}} 今天缺席了课程。希望一切安好，请提醒孩子记得参加下一次的课程哦！如有需要请联系我们！"
  },
  homework: {
    en: "Dear parents,\nA gentle reminder that {{name}} hasn't submitted the recent homework. Kindly assist to check and remind them to complete it. Thank you!",
    zh: "亲爱的家长，\n温馨提醒 {{name}} 尚未提交近期的功课。麻烦您协助检查并提醒孩子完成，非常感谢您的配合！"
  },
  comment: {
    en: "Dear parents,\nHere is the recent teacher comment for {{name}}:\n\n{{comment}}\n\nFeel free to contact us if you need more details about your child's progress.",
    zh: "亲爱的家长，\n以下是老师对 {{name}} 的近期课堂评语：\n\n{{comment}}\n\n如果您想了解更多关于孩子的学习进度，欢迎随时联系我们。"
  },
  billing: {
    en: "*Kind Reminder*\n\n{REMINDER_LIST}\n*Total Amount: RM {TOTAL_AMOUNT}*\n\nDear Parents,\nJust a gentle reminder to please make your child’s tuition payment for {MONTHS} soon so we can continue their learning smoothly.\n\n*Payment Details*\nBANK DETAILS\n\nPlease kindly send us the receipt after payment.\nThank you!",
    zh: "*学费温馨提醒*\n\n{REMINDER_LIST}\n*总计: RM {TOTAL_AMOUNT}*\n\n亲爱的家长您好,\n温馨提醒您，孩子的【{MONTHS}】学费已到缴费时间咯～\n为了让课程安排顺利进行，请您尽快完成缴费，非常感谢您的配合与支持\n\n*付款资讯*\nBANK DETAILS\n\n完成付款后，请发送转账单据给我们\n谢谢！"
  },
  attendance: {
    en: "Parents, please update {DATE} attendance. Thanks.\n\n✅ or ❎ to update\n\n{STUDENT_LIST}",
    zh: "各位家长，请更新 {DATE} 的考勤。谢谢。\n\n✅ 或 ❎ 来更新\n\n{STUDENT_LIST}"
  }
};

const normalizeTemplates = (branchTemplates: any) => {
  const normalized: any = { ...defaultTemplatesSet };
  if (!branchTemplates) return normalized;
  
  for (const key in defaultTemplatesSet) {
    if (branchTemplates[key]) {
      if (typeof branchTemplates[key] === 'string') {
        normalized[key] = { en: branchTemplates[key], zh: '' };
      } else {
        normalized[key] = { ...(defaultTemplatesSet as any)[key], ...branchTemplates[key] };
      }
    }
  }
  return normalized;
};

const getTemplateString = (tplObj: any) => {
  if (!tplObj) return '';
  if (typeof tplObj === 'string') return tplObj;
  const parts = [];
  if (tplObj.en) parts.push(tplObj.en);
  if (tplObj.zh) parts.push(tplObj.zh);
  return parts.join('\n\n');
};

// --- COLOR THEMES ---
const THEMES = {
  candy: { 
    name: "🍭 糖果粉紫 (Candy Pink)", 
    head: "bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-500", 
    row1: "bg-white", 
    row2: "bg-pink-50/40", 
    border: "border-pink-200", 
    text: "text-fuchsia-800",
    inputFocus: "focus:border-fuchsia-400 focus:ring-fuchsia-200 placeholder-pink-300"
  },
  ocean: { 
    name: "🌊 蔚蓝海岸 (Ocean Blue)", 
    head: "bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500", 
    row1: "bg-white", 
    row2: "bg-blue-50/40", 
    border: "border-blue-200", 
    text: "text-blue-800",
    inputFocus: "focus:border-blue-400 focus:ring-blue-200 placeholder-blue-300"
  },
  forest: { 
    name: "🌲 森林薄荷 (Forest Green)", 
    head: "bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-500", 
    row1: "bg-white", 
    row2: "bg-emerald-50/40", 
    border: "border-emerald-200", 
    text: "text-teal-800",
    inputFocus: "focus:border-teal-400 focus:ring-teal-200 placeholder-teal-300"
  },
  sunset: { 
    name: "🌅 日落蜜橘 (Sunset Orange)", 
    head: "bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400", 
    row1: "bg-white", 
    row2: "bg-orange-50/40", 
    border: "border-orange-200", 
    text: "text-orange-800",
    inputFocus: "focus:border-orange-400 focus:ring-orange-200 placeholder-orange-300"
  },
  rainbow: { 
    name: "🌈 梦幻彩虹 (Rainbow Magic)", 
    head: "bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-400", 
    row1: "bg-white", 
    row2: "bg-gray-50/60", 
    border: "border-gray-200", 
    text: "text-gray-800",
    inputFocus: "focus:border-purple-400 focus:ring-purple-200 placeholder-gray-300"
  }
};

const tuitionColumns = [
  { id: 'attendance', name: 'Attendance 出席', type: 'select', options: 'On time 准时,Late 迟到,Absent 缺席' },
  { id: 'classwork', name: 'Classwork 课堂练习', type: 'text' },
  { id: 'homework', name: 'Homework 功课', type: 'text' },
  { id: 'last_hw', name: 'Last week HW 功课状态', type: 'select', options: 'Complete 完成,Incomplete 未完成' },
  { id: 'tidiness', name: 'Handwriting 字体整洁', type: 'select', options: 'Excellent 极佳,Good 良好,Average 普通,Needs Improvement 需改进' },
  { id: 'engagement', name: 'Engagement 课堂参与度', type: 'select', options: '1,2,3,4,5' },
  { id: 'strength', name: 'Strength 强项', type: 'select', options: 'Fast learner 学习快,Persists in trying 坚持尝试,Admits mistakes 勇于认错,Works independently 独立完成' },
  { id: 'improve', name: 'Improve 需改进', type: 'select', options: 'Careless mistakes 粗心大意,Needs more focus 需要更专注,Too quiet 过于安静' },
  { id: 'points', name: 'Points 积分', type: 'text' },
  { id: 'teacher_comment', name: 'Teacher Comment 老师评语', type: 'textarea' },
  { id: 'rating', name: 'Rating 评价', type: 'select', options: '1,2,3,4,5' }
];

const daycareColumns = [
  { id: 'attendance', name: 'Attendance 出席', type: 'select', options: 'Present 出席,Absent 缺席,Sick 病假' },
  { id: 'school_hw', name: 'School HW Done? 学校功课', type: 'select', options: 'Yes 已完成,Partially 部分完成,No 未完成' },
  { id: 'spelling', name: 'Spelling Prep 听写准备', type: 'select', options: '100%,80%,Needs Practice 需多复习' },
  { id: 'meal', name: 'Meal Status 用餐状况', type: 'select', options: 'Good 良好,Slow 慢条斯理,Picky Eater 挑食' },
  { id: 'nap', name: 'Nap Status 午休状况', type: 'select', options: 'Slept well 熟睡,Restless 翻来覆去,Did not sleep 没睡' },
  { id: 'behavior', name: 'Behavior 行为表现', type: 'select', options: 'Good 乖巧,Talkative 爱说话,Helpful 乐于助人,Needs Focus 不专心' },
  { id: 'points', name: 'Points 积分', type: 'text' },
  { id: 'teacher_comment', name: 'Teacher Comment 老师评语', type: 'textarea' },
  { id: 'rating', name: 'Rating 评价', type: 'select', options: '1,2,3,4,5' }
];

const defaultTemplates = [
  { id: 'tpl_tuition', name: 'Tuition Class (补习班)', columns: tuitionColumns },
  { id: 'tpl_daycare', name: 'Daycare (安亲班)', columns: daycareColumns }
];

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoadingDB, setIsLoadingDB] = useState(true);
  const [lang, setLang] = useState('en'); 
  const t = (key) => dict[lang][key] || key;

  const [activeView, setActiveView] = useState('class'); // 'class', 'students', 'trash', 'billing'

  const [branches, setBranches] = useState([]);
  const [activeBranchId, setActiveBranchId] = useState('');
  
  const [classes, setClasses] = useState([]);
  const [activeClassId, setActiveClassId] = useState('');
  const [savedTemplates, setSavedTemplates] = useState(defaultTemplates);
  const [classColumns, setClassColumns] = useState({});
  const [students, setStudents] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [activeLessonId, setActiveLessonId] = useState('');
  const [records, setRecords] = useState({});
  const [billingRecords, setBillingRecords] = useState([]);

  // UI States
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [generatingIds, setGeneratingIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState("");
  const [isXlsxLoaded, setIsXlsxLoaded] = useState(false);
  const [isImageImportModalOpen, setIsImageImportModalOpen] = useState(false);
  const [scanTargetClassId, setScanTargetClassId] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [isScanningImage, setIsScanningImage] = useState(false);
  const [isAddClassModalOpen, setIsAddClassModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState('tpl_tuition');
  const [selectedColumnTemplateId, setSelectedColumnTemplateId] = useState("");
  
  // LESSON CREATION STATES
  const [isAddingLesson, setIsAddingLesson] = useState(false);
  const [lessonCreationMode, setLessonCreationMode] = useState('single'); 
  const [newLessonDate, setNewLessonDate] = useState("");
  const [bulkConfig, setBulkConfig] = useState({
    startDate: '',
    days: [], 
    total: 4,
    skip: ''
  });
  
  // Renaming Prompts
  const [renameClassPrompt, setRenameClassPrompt] = useState({ isOpen: false, classId: null, newName: '' });
  const [renameLessonPrompt, setRenameLessonPrompt] = useState({ isOpen: false, lessonId: null, newDate: '' });

  const [isSmartFillModalOpen, setIsSmartFillModalOpen] = useState(false);
  const [smartFillStep, setSmartFillStep] = useState(1);
  const [templateFile, setTemplateFile] = useState(null);
  const [templateData, setTemplateData] = useState([]);
  const [useLocalFallback, setUseLocalFallback] = useState(false);
  const [templateHeaders, setTemplateHeaders] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [editingTemplateType, setEditingTemplateType] = useState('login');
  const [editingTemplates, setEditingTemplates] = useState(defaultTemplatesSet);

  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState({ id: '', name: '', username: '', password: '', gender: 'Unknown', contact: '', originalUsername: '', isBranchLevelEdit: false });
  
  // ADD EXISTING STUDENT (MULTI-SELECT)
  const [isAddExistingModalOpen, setIsAddExistingModalOpen] = useState(false);
  const [existingSearch, setExistingSearch] = useState("");
  const [selectedExistingStudents, setSelectedExistingStudents] = useState(new Set());

  const [isAddBranchModalOpen, setIsAddBranchModalOpen] = useState(false);
  const [newBranchName, setNewBranchName] = useState("");
  const [newBranchPassword, setNewBranchPassword] = useState("");
  const [unlockBranchPrompt, setUnlockBranchPrompt] = useState({ isOpen: false, targetBranch: null, passwordInput: '', error: '' });
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminLoginPrompt, setAdminLoginPrompt] = useState({ isOpen: false, passwordInput: '', error: '' });
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [aiLangModal, setAiLangModal] = useState({ isOpen: false, targetId: null });
  const [selectedAiLangs, setSelectedAiLangs] = useState(['English']); 
  const [confirmAction, setConfirmAction] = useState({ isOpen: false, text: '', onConfirm: null });
  const [newClassType, setNewClassType] = useState<'tuition' | 'daycare'>('tuition');
  const [newStudentData, setNewStudentData] = useState({ name: '', username: '', password: '', gender: 'Male', contact: '' });

  const handleCreateBranch = () => {
    if (!newBranchName.trim()) {
       showToast(lang === 'zh' ? "请输入分行名称！" : "Please enter a branch name!");
       return;
    }
    if (!newBranchPassword.trim()) {
       showToast(lang === 'zh' ? "请输入分行密码！" : "Please enter a branch password!");
       return;
    }
    const newBranchId = `b_${Date.now()}`;
    const newBranch = { id: newBranchId, name: newBranchName.trim(), password: newBranchPassword.trim(), templates: normalizeTemplates({}), createdAt: Date.now() };
    syncSet('branches', newBranchId, newBranch);
    setActiveBranchId(newBranchId);
    setNewBranchName(''); setNewBranchPassword(''); setIsAddBranchModalOpen(false);
    showToast(lang === 'zh' ? "分行创建成功！" : "Branch created successfully!");
  };

  const handleAddClass = () => {
    if (!newClassName.trim()) return;
    const id = `cls_${Date.now()}`;
    const newClass = { id, name: newClassName, type: newClassType, branchId: activeBranchId, students: [], createdAt: Date.now() };
    syncSet('classes', id, newClass);
    
    const currentBranch = branches.find(b => b.id === activeBranchId);
    const defaultCols = currentBranch?.defaultColumns || (newClassType === 'daycare' ? daycareColumns : tuitionColumns);
    syncSet('classColumns', id, { id, columns: defaultCols });
    
    setNewClassName("");
    setIsAddClassModalOpen(false);
  };

  const handleSaveStudent = () => {
    if (!newStudentData.name.trim()) return;
    const id = `std_${Date.now()}`;
    const newStudent = { ...newStudentData, id, branchId: activeBranchId, createdAt: Date.now() };
    syncSet('students', id, newStudent);
    
    if (activeClassId) {
      const activeClass = classes.find((c: any) => c.id === activeClassId);
      if (activeClass) {
        syncSet('classes', activeClassId, {
          ...activeClass,
          students: [...(activeClass.students || []), id]
        });
      }
    }
    
    setNewStudentData({ name: '', username: '', password: '', gender: 'Male', contact: '' });
    setIsStudentModalOpen(false);
  };

  const handleUpdateColumn = (colId: string, field: string, value: any) => {
    const cols = classColumns[activeClassId] || [];
    const updatedCols = cols.map((c: any) => c.id === colId ? { ...c, [field]: value } : c);
    syncSet('classColumns', activeClassId, { columns: updatedCols });
  };

  const handleRemoveColumn = (colId: string) => {
    const cols = classColumns[activeClassId] || [];
    const updatedCols = cols.filter((c: any) => c.id !== colId);
    syncSet('classColumns', activeClassId, { columns: updatedCols });
  };

  const handleAddColumn = () => {
    const cols = classColumns[activeClassId] || [];
    const newCol = { id: `col_${Date.now()}`, name: 'New Column', type: 'text' };
    syncSet('classColumns', activeClassId, { columns: [...cols, newCol] });
  };

  const handleSaveTemplates = () => {
    if (activeBranch) {
      const updatedBranch = { ...activeBranch, templates: editingTemplates };
      syncSet('branches', activeBranch.id, updatedBranch);
      showToast(lang === 'zh' ? '消息模板已保存' : 'Message templates saved');
    }
    setIsTemplateModalOpen(false);
  };

  // --- DERIVED DATA ---
  const activeBranch = branches.find(b => b.id === activeBranchId);
  
  // SOFT DELETE FILTERS
  const branchClassesAll = classes.filter(c => c.branchId === activeBranchId);
  const branchClasses = branchClassesAll
    .filter(c => !c.isDeleted)
    .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' }));
  const deletedClasses = branchClassesAll.filter(c => c.isDeleted);
  
  const activeClass = branchClasses.find(c => c.id === activeClassId);
  const activeColumns = classColumns[activeClassId] || tuitionColumns;
  
  const classStudentsAll = students.filter(s => s.classId === activeClassId);
  const classStudents = classStudentsAll.filter(s => !s.isDeleted);
  
  const classLessonsAll = lessons.filter(l => l.classId === activeClassId);
  const classLessons = classLessonsAll.filter(l => !l.isDeleted);
  const activeLesson = classLessons.find(l => l.id === activeLessonId);
  
  const activeThemeId = activeClass?.theme && THEMES[activeClass.theme] ? activeClass.theme : 'candy';
  const currentTheme = THEMES[activeThemeId];

  // Derive Unique Global Students
  const branchStudentsAllRaw = students.filter(s => s.branchId === activeBranchId || (classes.find(c => c.id === s.classId)?.branchId === activeBranchId));
  const uniqueBranchStudentsMap = new Map();
  branchStudentsAllRaw.filter(s => !s.isDeleted).forEach(s => {
      const key = s.username || s.id;
      if (!uniqueBranchStudentsMap.has(key)) {
          uniqueBranchStudentsMap.set(key, { ...s, joinedClasses: [s.classId] });
      } else {
          const existing = uniqueBranchStudentsMap.get(key);
          if (!existing.joinedClasses.includes(s.classId)) {
              existing.joinedClasses.push(s.classId);
          }
      }
  });
  const globalBranchStudents = Array.from(uniqueBranchStudentsMap.values());
  const deletedStudents = branchStudentsAllRaw.filter(s => s.isDeleted);
  
  const deletedLessons = lessons.filter(l => {
      const cls = classes.find(c => c.id === l.classId);
      return cls && cls.branchId === activeBranchId && l.isDeleted;
  });

  const availableStudentsToAdd = globalBranchStudents.filter(
    gs => !classStudents.some(cs => cs.username === gs.username)
  );
  const filteredAvailableStudents = availableStudentsToAdd.filter(s => 
    (s.name || '').toLowerCase().includes(existingSearch.toLowerCase()) || 
    (s.username || '').toLowerCase().includes(existingSearch.toLowerCase())
  );

  // --- HELPER FUNCTIONS ---
  const handleRecordChange = (studentId, colId, value) => {
    if (!activeLessonId) return;
    const key = `${studentId}_${activeLessonId}`;
    const newRec = { ...(records[key] || {}), [colId]: value };
    setRecords(prev => ({ ...prev, [key]: newRec })); 
    syncSet('records', key, newRec);
  };

  const renderCellInput = (col, studentId, value) => {
    const disabled = !activeLessonId;
    const inputClasses = `w-full bg-white border border-white shadow-[inset_0_1px_3px_rgba(0,0,0,0.08)] focus:bg-white ${currentTheme?.inputFocus || ''} rounded-lg p-2 text-sm outline-none transition-all ${currentTheme?.text || ''} font-medium ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}`;
    
    if (col.type === 'select') {
      const options = (col.options || "").split(',');
      const listId = `list_${col.id}_${studentId}`;
      return (
        <div className="relative w-full">
          <input
            list={listId}
            className={inputClasses}
            value={value || ""}
            onChange={(e) => handleRecordChange(studentId, col.id, e.target.value)}
            placeholder={lang === 'zh' ? "✏️ 点击选择或输入..." : "✏️ Select or type..."}
            disabled={disabled}
          />
          <datalist id={listId}>
            {options.filter(o => o.trim()).map((opt, idx) => (
              <option key={`${opt.trim()}_${idx}`} value={opt.trim()} />
            ))}
          </datalist>
        </div>
      );
    }
    if (col.type === 'textarea') {
      return (
        <textarea
          className={`${inputClasses} min-w-[200px] h-20 resize-y leading-relaxed`}
          value={value || ""}
          onChange={(e) => handleRecordChange(studentId, col.id, e.target.value)}
          placeholder={lang === 'zh' ? "✏️ 点击输入评语..." : "✏️ Type comments here..."}
          disabled={disabled}
        />
      );
    }
    return (
      <input
        type="text"
        className={`${inputClasses} min-w-[150px]`}
        value={value || ""}
        onChange={(e) => handleRecordChange(studentId, col.id, e.target.value)}
        placeholder={lang === 'zh' ? "✏️ 点击输入..." : "✏️ Type here..."}
        disabled={disabled}
      />
    );
  };

  // --- FIREBASE SYNC ---
  useEffect(() => {
    if (!auth) return;
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (e: any) { 
        console.error("Auth error", e);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const loadLocalData = () => {
      try {
        const collections = ['branches', 'classes', 'students', 'lessons'];
        collections.forEach(coll => {
          const localData = JSON.parse(localStorage.getItem(`notimonkey_${coll}`) || '{}');
          const items = Object.values(localData);
          if (coll === 'branches') setBranches(items as any);
          if (coll === 'classes') setClasses(items as any);
          if (coll === 'students') setStudents(items as any);
          if (coll === 'lessons') setLessons(items as any);
        });
        
        const localColsRaw = JSON.parse(localStorage.getItem(`notimonkey_classColumns`) || '{}');
        const localCols = {};
        Object.keys(localColsRaw).forEach(k => localCols[k] = localColsRaw[k].columns);
        setClassColumns(localCols);
        
        const localRecs = JSON.parse(localStorage.getItem(`notimonkey_records`) || '{}');
        setRecords(localRecs);
        
        const localTpls = JSON.parse(localStorage.getItem(`notimonkey_templates`) || '{}');
        setSavedTemplates([...defaultTemplates, ...Object.values(localTpls)] as any);
      } catch (e) {
        console.error('Failed to load local data', e);
      }
      setIsLoadingDB(false);
    };

    if (!db || !user) {
      loadLocalData();
      return;
    }
    
    let hasLoadedLocal = false;
    const handleSnapshotError = (err, coll) => {
      if (err.code === 'permission-denied') {
        if (!hasLoadedLocal) {
          hasLoadedLocal = true;
          setUseLocalFallback(true);
          loadLocalData();
        }
      } else {
        console.warn(`Snapshot error for ${coll}:`, err.message);
      }
    };

    const unsubs = [];
    const collections = ['branches', 'classes', 'students', 'lessons'];
    collections.forEach(coll => {
      unsubs.push(onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', coll), snap => {
        const items = []; snap.forEach(d => items.push(d.data()));
        if (coll === 'branches') setBranches(items);
        if (coll === 'classes') setClasses(items);
        if (coll === 'students') setStudents(items);
        if (coll === 'lessons') setLessons(items);
      }, err => handleSnapshotError(err, coll)));
    });
    unsubs.push(onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'classColumns'), snap => {
        const cols = {}; snap.forEach(d => cols[d.id] = d.data().columns);
        setClassColumns(cols);
    }, err => handleSnapshotError(err, 'classColumns')));
    unsubs.push(onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'records'), snap => {
        const recs = {}; snap.forEach(d => recs[d.id] = d.data());
        setRecords(recs);
    }, err => handleSnapshotError(err, 'records')));
    unsubs.push(onSnapshot(collection(db, 'artifacts', appId, 'public', 'data', 'templates'), snap => {
        const tpls = []; snap.forEach(d => tpls.push(d.data()));
        setSavedTemplates([...defaultTemplates, ...tpls]);
    }, err => handleSnapshotError(err, 'templates')));
    setTimeout(() => setIsLoadingDB(false), 1000);
    return () => unsubs.forEach(u => u());
  }, [user]);

  const localSyncSet = (coll, id, data) => {
    try {
      const localData = JSON.parse(localStorage.getItem(`notimonkey_${coll}`) || '{}');
      localData[id] = data;
      localStorage.setItem(`notimonkey_${coll}`, JSON.stringify(localData));
      
      // Update React state locally
      const items = Object.values(localData);
      if (coll === 'branches') setBranches(items as any);
      if (coll === 'classes') setClasses(items as any);
      if (coll === 'students') setStudents(items as any);
      if (coll === 'lessons') setLessons(items as any);
      if (coll === 'classColumns') {
        const cols = {};
        Object.keys(localData).forEach(k => cols[k] = localData[k].columns);
        setClassColumns(cols);
      }
      if (coll === 'records') setRecords(localData);
      if (coll === 'templates') setSavedTemplates([...defaultTemplates, ...items] as any);
    } catch (e) { console.error('Local storage error', e); }
  };

  const localSyncDel = (coll, id) => {
    try {
      const localData = JSON.parse(localStorage.getItem(`notimonkey_${coll}`) || '{}');
      delete localData[id];
      localStorage.setItem(`notimonkey_${coll}`, JSON.stringify(localData));
      
      // Update React state locally
      const items = Object.values(localData);
      if (coll === 'branches') setBranches(items as any);
      if (coll === 'classes') setClasses(items as any);
      if (coll === 'students') setStudents(items as any);
      if (coll === 'lessons') setLessons(items as any);
      if (coll === 'classColumns') {
        const cols = {};
        Object.keys(localData).forEach(k => cols[k] = localData[k].columns);
        setClassColumns(cols);
      }
      if (coll === 'records') setRecords(localData);
      if (coll === 'templates') setSavedTemplates([...defaultTemplates, ...items] as any);
    } catch (e) { console.error('Local storage error', e); }
  };

  const syncSet = async (coll, id, data) => {
    if(!db || !user || useLocalFallback) {
      localSyncSet(coll, id, data);
      return;
    }
    setDoc(doc(db, 'artifacts', appId, 'public', 'data', coll, id), data).catch(err => {
      if (err.code === 'permission-denied') {
        setUseLocalFallback(true);
        localSyncSet(coll, id, data);
      } else {
        console.error(err);
      }
    });
  };
  const syncDel = async (coll, id) => {
    if(!db || !user || useLocalFallback) {
      localSyncDel(coll, id);
      return;
    }
    deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', coll, id)).catch(err => {
      if (err.code === 'permission-denied') {
        setUseLocalFallback(true);
        localSyncDel(coll, id);
      } else {
        console.error(err);
      }
    });
  };

  // --- SELECTION SYNCS ---
  useEffect(() => {
    const bClasses = classes
      .filter(c => c.branchId === activeBranchId && !c.isDeleted)
      .sort((a, b) => (a.name || '').localeCompare(b.name || '', undefined, { numeric: true, sensitivity: 'base' }));

    if (bClasses.length > 0 && !bClasses.find(c => c.id === activeClassId)) {
      setActiveClassId(bClasses[0].id);
    } else if (bClasses.length === 0) {
      setActiveClassId('');
    }
  }, [activeBranchId, classes]);

  useEffect(() => {
    if (activeClassId) {
      const cLessons = lessons.filter(l => l.classId === activeClassId && !l.isDeleted);
      if (cLessons.length > 0 && !cLessons.find(l => l.id === activeLessonId)) {
        setActiveLessonId(cLessons[0].id);
      } else if (cLessons.length === 0) {
        setActiveLessonId('');
      }
    } else {
      setActiveLessonId('');
    }
  }, [activeClassId, lessons]);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.XLSX) {
      setIsXlsxLoaded(true);
      return;
    }
    const checkInterval = setInterval(() => {
      if (window.XLSX) {
        setIsXlsxLoaded(true);
        clearInterval(checkInterval);
      }
    }, 500);

    if (!document.querySelector('script[src*="xlsx.full.min.js"]')) {
      const script = document.createElement('script');
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
      script.onload = () => setIsXlsxLoaded(true);
      document.head.appendChild(script);
    }
    return () => clearInterval(checkInterval);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3500);
  };

  // --- ACTIONS ---
  const setActiveColumns = (newCols) => {
    setClassColumns(prev => ({ ...prev, [activeClassId]: newCols }));
    syncSet('classColumns', activeClassId, { id: activeClassId, columns: newCols });
  };

  const handleSaveAsNewTemplate = () => {
    if (!newTemplateName.trim()) {
      showToast(lang === 'zh' ? "请输入模板名称" : "Please enter a template name");
      return;
    }
    const newTemplate = { id: `tpl_custom_${Date.now()}`, name: newTemplateName.trim(), columns: [...activeColumns] };
    setSavedTemplates(prev => [...prev, newTemplate]);
    syncSet('templates', newTemplate.id, newTemplate);
    setNewTemplateName("");
    showToast(lang === 'zh' ? "模板已保存！" : "Template saved successfully!");
  };

  const handleBranchClick = (branch) => {
    if (branch.id === activeBranchId) return;
    if (isSuperAdmin) {
      setActiveBranchId(branch.id);
      showToast(lang === 'zh' ? '管理员免密进入' : 'Super Admin bypassed password.');
      return;
    }
    if (!branch.password) {
      setActiveBranchId(branch.id);
      showToast(lang === 'zh' ? '此分行未设置密码，已直接进入' : 'No password set for this branch, entered directly.');
    } else {
      setUnlockBranchPrompt({ isOpen: true, targetBranch: branch, passwordInput: '', error: '' });
    }
  };

  const handleUnlockBranch = () => {
    if (unlockBranchPrompt.targetBranch.password === unlockBranchPrompt.passwordInput) {
      setActiveBranchId(unlockBranchPrompt.targetBranch.id);
      setUnlockBranchPrompt({ isOpen: false, targetBranch: null, passwordInput: '', error: '' });
    } else {
      setUnlockBranchPrompt(prev => ({ ...prev, error: t('incorrectPassword') }));
    }
  };

  const handleDeleteBranch = (id, e) => {
    if(e) e.stopPropagation();
    if (!isSuperAdmin) { showToast(t('onlyAdminDeleteBranch')); return; }
    setConfirmAction({
      isOpen: true,
      text: lang === 'zh' ? "确定要删除此分行及包含的所有班级吗？" : "Are you sure you want to delete this branch and all its classes?",
      onConfirm: () => {
        setBranches(prev => prev.filter(b => b.id !== id));
        syncDel('branches', id);
        if (activeBranchId === id) setActiveBranchId(''); 
        setConfirmAction({ isOpen: false, text: '', onConfirm: null });
      }
    });
  };

  const handleCreateClass = () => {
    if (newClassName.trim() && activeBranchId) {
      const newClassId = `c_${Date.now()}`;
      const tpl = savedTemplates.find(t => t.id === selectedTemplateId) || savedTemplates[0];
      const newClass = { id: newClassId, branchId: activeBranchId, name: newClassName.trim(), theme: 'candy', isDeleted: false };
      syncSet('classes', newClassId, newClass);
      syncSet('classColumns', newClassId, { id: newClassId, columns: tpl.columns });
      setActiveClassId(newClassId);
      setActiveView('class');
      setNewClassName(''); setIsAddClassModalOpen(false);
    }
  };

  const handleUpdateTheme = (themeId) => {
    if(!activeClass) return;
    const updatedClass = { ...activeClass, theme: themeId };
    setClasses(prev => prev.map(c => c.id === activeClassId ? updatedClass : c));
    syncSet('classes', activeClassId, updatedClass);
    setIsThemeModalOpen(false);
  };

  const handleRenameClassSubmit = () => {
    if (renameClassPrompt.newName.trim()) {
      const updatedClass = { ...classes.find(c=>c.id === renameClassPrompt.classId), name: renameClassPrompt.newName.trim() };
      setClasses(prev => prev.map(c => c.id === renameClassPrompt.classId ? updatedClass : c));
      syncSet('classes', renameClassPrompt.classId, updatedClass);
      setRenameClassPrompt({ isOpen: false, classId: null, newName: '' });
    }
  };

  const handleDeleteClass = (id, e) => {
    e.stopPropagation();
    setConfirmAction({
      isOpen: true,
      text: lang === 'zh' ? "确定要删除此班级吗？(可在回收站找回)" : "Are you sure you want to delete this class? (Can be restored)",
      onConfirm: () => { 
        const cls = classes.find(c => c.id === id);
        syncSet('classes', id, { ...cls, isDeleted: true }); 
        if (activeClassId === id) setActiveClassId('');
        setConfirmAction({ isOpen: false, text: '', onConfirm: null }); 
      }
    });
  };

  // --- ADD LESSON LOGIC (SINGLE & BULK) ---
  const handleAddLesson = () => {
    if (lessonCreationMode === 'single') {
      if (newLessonDate.trim()) {
        const newLessonId = `l_${Date.now()}`;
        const newLesson = { id: newLessonId, classId: activeClassId, date: newLessonDate.trim(), month: newLessonDate.trim().substring(3) || 'Current', isDeleted: false };
        syncSet('lessons', newLessonId, newLesson);
        setActiveLessonId(newLessonId);
        setNewLessonDate(''); setIsAddingLesson(false);
        showToast(lang === 'zh' ? '成功创建课程！' : 'Lesson created successfully!');
      } else {
        showToast(lang === 'zh' ? '请输入课程日期！' : 'Please enter a lesson date!');
      }
    } else {
      if (!bulkConfig.startDate) { showToast(lang === 'zh' ? "请选择开始日期" : "Please select a start date."); return; }
      if (bulkConfig.days.length === 0) { showToast(lang === 'zh' ? "请至少选择一个上课星期" : "Please select at least one day of the week."); return; }
      if (bulkConfig.total <= 0) { showToast(lang === 'zh' ? "总课数必须大于0" : "Total lessons must be greater than 0."); return; }

      let current = new Date(bulkConfig.startDate);
      let added = 0;
      let skipArray = bulkConfig.skip.split(',').map(d => d.trim()).filter(Boolean);
      let newLessons = [];
      let loopGuard = 0;

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

      while (added < bulkConfig.total && loopGuard < 365) {
          loopGuard++;
          let day = current.getDay();
          
          let yyyy = current.getFullYear();
          let mm = String(current.getMonth() + 1).padStart(2, '0');
          let dd = String(current.getDate()).padStart(2, '0');
          let dateStr = `${yyyy}-${mm}-${dd}`; 

          if (bulkConfig.days.includes(day) && !skipArray.includes(dateStr)) {
              let displayMonth = `${monthNames[current.getMonth()]}-${yyyy}`;
              let displayDate = `${dd}-${displayMonth}`;

              newLessons.push({
                  id: `l_${Date.now()}_${added}`,
                  classId: activeClassId,
                  date: displayDate,
                  month: displayMonth,
                  isDeleted: false
              });
              added++;
          }
          current.setDate(current.getDate() + 1);
      }

      if (newLessons.length > 0) {
        newLessons.forEach(l => syncSet('lessons', l.id, l));
        setActiveLessonId(newLessons[0].id);
        showToast(lang === 'zh' ? `成功批量排好 ${newLessons.length} 堂课！` : `Successfully scheduled ${newLessons.length} lessons!`);
      }
      setIsAddingLesson(false);
    }
  };

  const toggleBulkDay = (dayInt) => {
    setBulkConfig(prev => {
      const newDays = [...prev.days];
      if (newDays.includes(dayInt)) return { ...prev, days: newDays.filter(d => d !== dayInt) };
      return { ...prev, days: [...newDays, dayInt] };
    });
  };

  const handleRenameLessonSubmit = () => {
    if (renameLessonPrompt.newDate.trim()) {
      const updatedLesson = { 
        ...lessons.find(l => l.id === renameLessonPrompt.lessonId), 
        date: renameLessonPrompt.newDate.trim(), 
        month: renameLessonPrompt.newDate.trim().substring(3) || 'Current' 
      };
      setLessons(prev => prev.map(l => l.id === renameLessonPrompt.lessonId ? updatedLesson : l));
      syncSet('lessons', renameLessonPrompt.lessonId, updatedLesson);
      setRenameLessonPrompt({ isOpen: false, lessonId: null, newDate: '' });
    }
  };

  const handleDeleteLesson = (id, e) => {
    e.stopPropagation();
    setConfirmAction({
      isOpen: true,
      text: lang === 'zh' ? "确定要删除此课程吗？(可在回收站找回)" : "Are you sure you want to delete this lesson? (Can be restored)",
      onConfirm: () => {
        const lesson = lessons.find(l => l.id === id);
        syncSet('lessons', id, { ...lesson, isDeleted: true });
        if (activeLessonId === id) setActiveLessonId('');
        setConfirmAction({ isOpen: false, text: '', onConfirm: null });
      }
    });
  };

  const handleAdminLogin = () => {
    if (adminLoginPrompt.passwordInput === '920521015892') {
      setIsSuperAdmin(true); setAdminLoginPrompt({ isOpen: false, passwordInput: '', error: '' });
      setAdminDashboardOpen(true);
    } else setAdminLoginPrompt(prev => ({ ...prev, error: t('incorrectPassword') }));
  };

  const openStudentModal = (student = null, isBranchLevelEdit = false) => {
    if (student) setEditingStudent({ ...student, originalUsername: student.username, isBranchLevelEdit });
    else setEditingStudent({ id: '', name: '', username: '', password: '', gender: 'Unknown', contact: '', originalUsername: '', isBranchLevelEdit: false });
    setIsStudentModalOpen(true);
  };

  const saveStudent = () => {
    if (!editingStudent.name.trim()) {
      showToast(lang === 'zh' ? "姓名为必填项" : "Student Name is required.");
      return;
    }
    if (editingStudent.isBranchLevelEdit) {
      const targets = branchStudentsAllRaw.filter(s => s.username === editingStudent.originalUsername || s.username === editingStudent.username || s.id === editingStudent.id);
      const updatedStudentsList = [...students];
      targets.forEach(target => {
         const newS = { ...target, name: editingStudent.name, username: editingStudent.username, password: editingStudent.password, gender: editingStudent.gender, contact: editingStudent.contact, branchId: activeBranchId };
         const idx = updatedStudentsList.findIndex(x => x.id === target.id);
         if (idx !== -1) updatedStudentsList[idx] = newS;
         syncSet('students', target.id, newS);
      });
      setStudents(updatedStudentsList);
      showToast(t('globalUpdateSuccess'));
    } else {
      let studentObj = { ...editingStudent };
      if (!studentObj.id) {
        studentObj.id = `s_${Date.now()}`; studentObj.classId = activeClassId; studentObj.branchId = activeBranchId;
        studentObj.username = studentObj.username || studentObj.name.split(' ')[0].toLowerCase() + Math.floor(Math.random() * 100);
        studentObj.password = studentObj.password || Math.random().toString(36).slice(-6).toUpperCase();
        studentObj.isDeleted = false;
        setStudents(prev => [...prev, studentObj]);
        showToast(lang === 'zh' ? "已添加" : "Student added.");
      } else {
        setStudents(prev => prev.map(s => s.id === studentObj.id ? studentObj : s));
        showToast(lang === 'zh' ? "已更新" : "Student updated.");
      }
      syncSet('students', studentObj.id, studentObj);
    }
    setIsStudentModalOpen(false);
  };

  // MULTI-SELECT EXISTING STUDENTS LOGIC
  const toggleExistingStudent = (username) => {
    setSelectedExistingStudents(prev => {
      const next = new Set(prev);
      if (next.has(username)) next.delete(username);
      else next.add(username);
      return next;
    });
  };

  const handleSelectAllExisting = () => {
    if (selectedExistingStudents.size === filteredAvailableStudents.length && filteredAvailableStudents.length > 0) {
      setSelectedExistingStudents(new Set()); 
    } else {
      setSelectedExistingStudents(new Set(filteredAvailableStudents.map(s => s.username)));
    }
  };

  const handleAddSelectedExistingStudents = () => {
    if (selectedExistingStudents.size === 0) return;
    const studentsToAdd = availableStudentsToAdd.filter(s => selectedExistingStudents.has(s.username));
    
    const newStudents = studentsToAdd.map(existing => ({
        ...existing, 
        id: `s_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
        classId: activeClassId,
        isDeleted: false
    }));

    setStudents(prev => [...prev, ...newStudents]);
    newStudents.forEach(s => syncSet('students', s.id, s));
    
    showToast(lang === 'zh' ? `已批量加入 ${newStudents.length} 名学生` : `Added ${newStudents.length} students`);
    setIsAddExistingModalOpen(false);
    setSelectedExistingStudents(new Set());
    setExistingSearch("");
  };

  const handleDeleteStudent = (id, isBranchLevelDelete = false) => {
    const s = students.find(x => x.id === id);
    setConfirmAction({
      isOpen: true, text: isBranchLevelDelete ? (lang === 'zh' ? "将从分行的所有班级中删除该学生，确定？(可在回收站找回)" : "Delete this student globally from all classes in this branch? (Can be restored)") : (lang === 'zh' ? "确定移除该学生？(可在回收站找回)" : "Are you sure you want to remove this student? (Can be restored)"),
      onConfirm: () => {
        if (isBranchLevelDelete && s) {
           const targets = students.filter(x => x.username === s.username && x.branchId === activeBranchId);
           targets.forEach(t => syncSet('students', t.id, { ...t, isDeleted: true }));
        } else {
           syncSet('students', id, { ...s, isDeleted: true });
        }
        setConfirmAction({ isOpen: false, text: '', onConfirm: null });
      }
    });
  };
  
  // --- RECYCLE BIN (SOFT DELETE) FUNCTIONS ---
  const handleRestore = (type, item) => {
    syncSet(type, item.id, { ...item, isDeleted: false });
    showToast(lang === 'zh' ? '已恢复！' : 'Restored successfully!');
  };

  const handleHardDelete = (type, id) => {
    setConfirmAction({
      isOpen: true,
      text: t('warningPermDelete'),
      onConfirm: () => {
        syncDel(type, id);
        setConfirmAction({ isOpen: false, text: '', onConfirm: null });
        showToast(lang === 'zh' ? '已彻底删除！' : 'Permanently deleted!');
      }
    });
  };

  // --- AI COMMENT FUNCTIONS ---
  async function fetchWithBackoff(url, options, maxRetries = 5) {
    let retries = 0;
    while (retries < maxRetries) {
      try {
        const response = await fetch(url, options);
        if (!response.ok) {
          if (response.status === 429 || response.status >= 500) throw new Error(`HTTP error! status: ${response.status}`);
          return await response.json(); 
        }
        return await response.json();
      } catch (error) {
        retries++;
        if (retries >= maxRetries) throw error;
        const delay = Math.pow(2, retries - 1) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  const generateAiComment = async (studentId, targetLanguages) => {
    if (!activeLessonId) return;
    setGeneratingIds(prev => new Set(prev).add(studentId));
    const student = students.find(s => s.id === studentId);
    const key = `${studentId}_${activeLessonId}`;
    const studentRecord = records[key] || {};
    try {
      let contextStr = `Student Name: ${student.name}, Gender: ${student.gender}.\n`;
      activeColumns.forEach(col => {
        if (col.id !== 'teacher_comment' && studentRecord[col.id]) contextStr += `${col.name}: ${studentRecord[col.id]}.\n`;
      });
      const userQuery = `Write a personalized teacher report card comment for this student based on the following class performance data:\n\n${contextStr}`;
      const langs = Array.isArray(targetLanguages) ? targetLanguages : [targetLanguages];
      const langInstruction = `Provide the comment in ALL of the following languages: ${langs.join(' and ')}. Output them consecutively. Do NOT output markdown formatting like bold text or headers, keep it as plain text. Do NOT add any empty lines between paragraphs or languages.`;
      const systemPrompt = `You are an observant and encouraging teacher. Generate a personalized, constructive 2-3 sentence comment for the student's daily report. - Acknowledge their specific strengths based on the data. - If there are areas to improve, mention them gently and constructively. - Use their name and correct gender pronouns. - ${langInstruction}`;
      
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing. Please configure it in the environment.");
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userQuery,
        config: {
          systemInstruction: systemPrompt,
        }
      });
      
      const generatedText = response.text;
      if (generatedText) {
        const cleanedText = generatedText.replace(/\n\s*\n/g, '\n').trim();
        handleRecordChange(studentId, 'teacher_comment', cleanedText);
      } else { throw new Error("No text returned from API"); }
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      if (error.message?.includes('429') || error.message?.includes('quota')) {
        showToast(lang === 'zh' ? `API 额度超限，请稍后再试` : `Quota exceeded. Please wait a moment.`);
      } else {
        showToast(lang === 'zh' ? `生成失败: ${error.message}` : `Failed to generate: ${error.message}`);
      }
    } finally {
      setGeneratingIds(prev => { const newSet = new Set(prev); newSet.delete(studentId); return newSet; });
    }
  };

  const generateAllComments = async (targetLanguages) => {
    for (const student of classStudents) {
      await generateAiComment(student.id, targetLanguages);
      // Increased delay to 4.5 seconds to avoid hitting the 15 RPM free tier limit
      await new Promise(r => setTimeout(r, 4500));
    }
    showToast(lang === 'zh' ? "AI 生成完毕！" : "All AI comments generated!");
  };

  const handleWhatsApp = (student, type = 'login') => {
    if (!student.contact) { showToast("No contact number!"); return; }
    const tpls = normalizeTemplates(activeBranch?.templates);
    let rawMsgObj = tpls[type] || tpls.login;
    let rawMsg = getTemplateString(rawMsgObj);
    let msg = rawMsg.replace(/{{name}}/gi, student.name).replace(/{{username}}/gi, student.username || 'Not Provided').replace(/{{password}}/gi, student.password || 'Not Provided');
    if (type === 'comment') {
      const rec = records[`${student.id}_${activeLessonId}`];
      const comment = rec?.teacher_comment || '(No comment / 暂无评语)';
      msg = msg.replace(/{{comment}}/gi, comment);
    }
    const encodedMessage = encodeURIComponent(msg);
    let phone = student.contact.replace(/\D/g, ''); 
    if(phone && !phone.startsWith('6')) {
       phone = phone.startsWith('0') ? '6' + phone : '60' + phone;
    }
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  // --- COPY ATTENDANCE LOGIC ---
  const handleCopyAttendance = () => {
    if (!activeLessonId) {
      showToast(lang === 'zh' ? '请先选择一堂课' : 'Please select a lesson first');
      return;
    }

    const tpls = normalizeTemplates(activeBranch?.templates);
    let baseMsgObj = tpls.attendance || defaultTemplatesSet.attendance;
    let baseMsg = getTemplateString(baseMsgObj);
    
    // Replace {DATE}
    baseMsg = baseMsg.replace(/\{DATE\}/gi, activeLesson?.date || '');

    // Generate {STUDENT_LIST}
    let studentListStr = "";
    classStudents.forEach((student, index) => {
       const rec = records[`${student.id}_${activeLessonId}`] || {};
       const attendanceVal = (rec.attendance || '').toLowerCase();
       let mark = '';
       if (attendanceVal.includes('present') || attendanceVal.includes('on time') || attendanceVal.includes('准时') || attendanceVal.includes('出席')) {
           mark = '✅';
       } else if (attendanceVal.includes('absent') || attendanceVal.includes('缺席')) {
           mark = '❎';
       } else if (attendanceVal.includes('late') || attendanceVal.includes('迟到')) {
           mark = '🕒';
       } else if (attendanceVal.includes('sick') || attendanceVal.includes('病假')) {
           mark = '🤒';
       }

       studentListStr += `${index + 1}) ${student.name} ${mark}\n`;
    });

    baseMsg = baseMsg.replace(/\{STUDENT_LIST\}/gi, studentListStr.trim());

    // Copy to clipboard
    const textArea = document.createElement("textarea");
    textArea.value = baseMsg;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(lang === 'zh' ? '已复制考勤名单到剪贴板！📋' : 'Attendance list copied to clipboard! 📋');
    } catch (err) {
      console.error('Failed to copy', err);
      showToast('Failed to copy');
    }
    document.body.removeChild(textArea);
  };

  // --- EXPORT REPORT LOGIC ---
  const handleExportReport = () => {
    if (classStudents.length === 0) {
      showToast(lang === 'zh' ? "没有学生数据可导出" : "No student data to export.");
      return;
    }
    if (!isXlsxLoaded || !window.XLSX) {
      showToast(lang === 'zh' ? "引擎加载中，请稍候" : "Excel engine loading...");
      return;
    }

    const exportData = classStudents.map(student => {
      const row = {
        "Student Name": student.name,
        "Username": student.username || "",
        "Gender": student.gender === 'Female' ? (lang==='zh'?'女':'Female') : student.gender === 'Male' ? (lang==='zh'?'男':'Male') : student.gender,
        "Contact": student.contact || ""
      };
      
      const rec = records[`${student.id}_${activeLessonId}`] || {};
      activeColumns.forEach(col => {
        row[col.name] = rec[col.id] || "";
      });
      
      return row;
    });

    try {
      const ws = window.XLSX.utils.json_to_sheet(exportData);
      const wb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(wb, ws, "Report");
      
      const lessonDateStr = activeLesson ? `_${activeLesson.date}` : '';
      window.XLSX.writeFile(wb, `${activeClass?.name || 'Class'}${lessonDateStr}_Report.xlsx`);
      showToast(lang === 'zh' ? "✅ 报表已成功导出！" : "✅ Report exported successfully!");
    } catch (err) {
      console.error("Export failed:", err);
      showToast(lang === 'zh' ? "导出失败" : "Export failed.");
    }
  };

  // --- BILLING / PAYMENT REMINDER SYSTEM ---
  const handleBillingFileUpload = (e) => {
    if (!activeBranchId) { 
      showToast(t('selectBranchFirst')); 
      return; 
    }
    const file = e.target.files[0];
    if (!file) return;
    if (!isXlsxLoaded || !window.XLSX) {
      showToast(lang === 'zh' ? "系统引擎加载中，请稍候..." : "System engine loading...");
      e.target.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result as ArrayBuffer);
        const workbook = window.XLSX.read(data, {type: 'array'});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", raw: false });
        processBillingData(rawData);
      } catch (err) {
        console.error(err); showToast(lang === 'zh' ? "文件读取错误" : "Error reading file.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = ''; 
  };

  const processBillingData = (rows) => {
    const validRows = rows.filter(row => row.some(cell => String(cell).trim() !== ""));
    if (validRows.length === 0) { showToast(t('importEmpty')); return; }

    let headerIdx = -1;
    for (let i = 0; i < validRows.length; i++) {
      const rowString = validRows[i].map(c => String(c).toLowerCase()).join(' ');
      if (rowString.includes("amount") || rowString.includes("status") || rowString.includes("rm") || rowString.includes("金额") || rowString.includes("状态") || rowString.includes("total") || rowString.includes("fee")) {
        headerIdx = i; break;
      }
    }

    if (headerIdx === -1) { 
       showToast(lang === 'zh' ? "找不到报表标题行(需包含金额/状态列)" : "Cannot find header row (Amount/Status missing)"); 
       return; 
    }

    const headers = validRows[headerIdx].map(h => String(h).trim().toLowerCase());
    let nameIdx = headers.findIndex(h => h.includes("student's name") || h.includes("student name") || h.includes("学生姓名"));
    if (nameIdx === -1) nameIdx = headers.findIndex(h => h.includes("姓名") || (h.includes("name") && !h.includes("branch")));
    
    const contactIdx = headers.findIndex(h => h.includes("contact") || h.includes("phone") || h.includes("联系") || h.includes("mobile") || h.includes("whatsapp") || h.includes("电话"));
    
    let monthIdx = headers.findIndex(h => h === "month" || h === "月份" || h === "monthly statement" || h === "statement month");
    if (monthIdx === -1) monthIdx = headers.findIndex(h => (h.includes("month") || h.includes("月份")) && !h.includes("date") && !h.includes("日期"));
    if (monthIdx === -1) monthIdx = headers.findIndex(h => h.includes("statement") && !h.includes("date") && !h.includes("日期"));
    if (monthIdx === -1) monthIdx = headers.findIndex(h => h.includes("date") || h.includes("日期"));

    let amountIdx = headers.findIndex(h => h.includes("amount") || h.includes("金额") || h.includes("total") || h.includes("总计"));
    if (amountIdx === -1) amountIdx = headers.findIndex(h => h.includes("rm") || h.includes("fee") || h.includes("费用"));

    let statusIdx = headers.findIndex(h => h.includes("status") || h.includes("状态"));
    if (statusIdx === -1) statusIdx = headers.findIndex(h => h.includes("payment") || h.includes("付款"));

    const itemIdx = headers.findIndex(h => h === "items" || h === "item" || h.includes("项目") || h.includes("课程") || h.includes("class") || h.includes("班级"));

    if (nameIdx === -1 || contactIdx === -1 || amountIdx === -1 || statusIdx === -1) {
        showToast(lang === 'zh' ? `报表缺少必要列 (名字:${nameIdx}, 电话:${contactIdx}, 金额:${amountIdx}, 状态:${statusIdx})` : `Missing required columns in report (Name:${nameIdx}, Phone:${contactIdx}, Amount:${amountIdx}, Status:${statusIdx})`);
        return;
    }

    const groups: Record<string, any> = {};
    for (let i = headerIdx + 1; i < validRows.length; i++) {
        const row = validRows[i];
        if (!row || row.length === 0) continue;

        const status = String(row[statusIdx] || '').toLowerCase();
        if (!status.includes('unpaid') && !status.includes('未付') && !status.includes('欠') && !status.includes('pending')) continue;

        let contact = String(row[contactIdx] || '').replace(/\D/g, '');
        if (!contact) continue; 
        if (contact.startsWith('0')) contact = '6' + contact;
        else if (!contact.startsWith('60')) contact = '60' + contact;

        const name = String(row[nameIdx] || 'Unknown').trim();
        let month = String(row[monthIdx] || 'Current').trim();
        
        // Convert DD-MM-YYYY or DD/MM/YYYY or YYYY-MM-DD to Month YYYY
        let dateMatch = month.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
        if (dateMatch) {
            const m = parseInt(dateMatch[2], 10);
            const y = dateMatch[3];
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            if (m >= 1 && m <= 12) {
                month = `${monthNames[m - 1]} ${y}`;
            }
        } else {
            dateMatch = month.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
            if (dateMatch) {
                const y = dateMatch[1];
                const m = parseInt(dateMatch[2], 10);
                const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                if (m >= 1 && m <= 12) {
                    month = `${monthNames[m - 1]} ${y}`;
                }
            }
        }

        const amount = parseFloat(String(row[amountIdx] || '0').replace(/[^0-9.-]+/g, '')) || 0;
        
        const itemStrRaw = itemIdx >= 0 ? String(row[itemIdx] || '').trim() : '';
        const itemStr = itemStrRaw.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

        if (!groups[contact]) groups[contact] = { contact, total: 0, details: {} };
        if (!groups[contact].details[name]) groups[contact].details[name] = [];

        groups[contact].details[name].push({ month, amount, itemStr });
        groups[contact].total += amount;
    }

    const formatted = Object.values(groups).sort((a,b) => b.total - a.total);
    setBillingRecords(formatted);
    showToast(lang === 'zh' ? `成功分析并合并了 ${formatted.length} 位家长的欠款记录！` : `Successfully parsed & grouped ${formatted.length} parent records!`);
  };

  const handleSendBillingWhatsApp = (group: any) => {
    const tpls = normalizeTemplates(activeBranch?.templates);
    let msgObj = tpls.billing || defaultTemplatesSet.billing;
    let msg = getTemplateString(msgObj);

    let reminderListStr = "";
    let monthsSet = new Set();
    Object.entries(group.details).forEach(([studentName, records]) => {
       reminderListStr += `*${studentName}*\n`;
       (records as any[]).forEach(rec => {
           let classInfo = rec.itemStr ? `\n  [${rec.itemStr}]` : '';
           reminderListStr += `- ${rec.month}: RM ${rec.amount.toFixed(2)}${classInfo}\n`;
           monthsSet.add(rec.month);
       });
       reminderListStr += '\n';
    });

    const monthsStr = Array.from(monthsSet).join(', ');

    msg = msg.replace(/\{\{REMINDER_LIST\}\}/gi, reminderListStr.trim()).replace(/\{REMINDER_LIST\}/gi, reminderListStr.trim());
    msg = msg.replace(/\{\{TOTAL_AMOUNT\}\}/gi, group.total.toFixed(2)).replace(/\{TOTAL_AMOUNT\}/gi, group.total.toFixed(2));
    msg = msg.replace(/\{\{MONTHS\}\}/gi, monthsStr).replace(/\{MONTHS\}/gi, monthsStr);

    const encodedMessage = encodeURIComponent(msg);
    window.open(`https://wa.me/${group.contact}?text=${encodedMessage}`, '_blank');
  };

  // --- REFACTORED EXCEL IMPORT (GENERAL) ---
  const handleFileUpload = (e) => {
    if (!activeBranchId) { 
      showToast(t('selectBranchFirst')); 
      setIsImportModalOpen(false); 
      return; 
    }
    const file = e.target.files[0];
    if (!file) return;
    if (!isXlsxLoaded || !window.XLSX) {
      showToast(lang === 'zh' ? "引擎加载中，请稍候" : "Excel engine loading...");
      e.target.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result as ArrayBuffer);
        const workbook = window.XLSX.read(data, {type: 'array'});
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        processImportedData(rawData);
      } catch (err) {
        console.error(err); showToast(lang === 'zh' ? "文件读取错误" : "Error reading file.");
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = ''; 
  };

  const processImportedData = (rows) => {
    const validRows = rows.filter(row => row.some(cell => String(cell).trim() !== ""));
    if (validRows.length === 0) { showToast(t('importEmpty')); return; }
    
    let headerIdx = -1;
    for (let i = 0; i < validRows.length; i++) {
      const rowString = validRows[i].map(c => String(c).toLowerCase()).join(' ');
      const filledCells = validRows[i].filter(c => String(c).trim() !== "");
      
      // Check if this row looks like a real header row
      const hasName = rowString.includes("name") || rowString.includes("姓名") || rowString.includes("username") || rowString.includes("student");
      const hasOtherHeaders = rowString.includes("phone") || rowString.includes("contact") || rowString.includes("联系") || rowString.includes("class") || rowString.includes("班级") || rowString.includes("id") || rowString.includes("items") || rowString.includes("项目");
      
      if (filledCells.length >= 3 && hasName && hasOtherHeaders) {
        headerIdx = i; break;
      } else if (filledCells.length >= 2 && hasName && i < 5 && headerIdx === -1) {
        // Fallback for very simple files, but only check first 5 rows to avoid false positives
        headerIdx = i;
      }
    }
    
    let targetClassId = activeClassId;
    if (!targetClassId && activeBranchId) {
      targetClassId = `c_auto_${Date.now()}`;
      const newClass = { id: targetClassId, branchId: activeBranchId, name: lang === 'zh' ? "导入的班级" : "Imported Class", theme: 'candy', isDeleted: false };
      setClasses(prev => [...prev, newClass]);
      setClassColumns(prev => ({...prev, [targetClassId]: [...tuitionColumns]}));
      syncSet('classes', targetClassId, newClass);
      const currentBranch = branches.find(b => b.id === activeBranchId);
      const defaultCols = currentBranch?.defaultColumns || tuitionColumns;
      syncSet('classColumns', targetClassId, { id: targetClassId, columns: defaultCols });
      setActiveClassId(targetClassId);
      setActiveView('class');
    }

    let newImportCount = 0;
    let skippedCount = 0;

    const existingClassNames = new Map(branchClassesAll.map(c => [c.name, c.id]));
    let classCounter = branchClassesAll.length + 1;
    
    // We only check against EXISTING database students to prevent duplicates across uploads
    // NOTE: This now checks user+class instead of just user, so a user CAN be in 2 classes.
    const existingEnrollments = new Set(students.filter(s => !s.isDeleted).map(s => `${(s.username || '').toLowerCase()}_${s.classId}`));
    
    const newAddedClasses = [];
    const newParsedStudents = [];

    const findExistingUsername = (name) => {
        const n = name.toLowerCase().replace(/\s+/g, '');
        // First check in the batch we are currently adding
        const foundNew = newParsedStudents.find(s => s.name.toLowerCase().replace(/\s+/g, '') === n);
        if (foundNew) return foundNew.username;
        // Then check in the database
        const foundGlobal = branchStudentsAllRaw.find(s => s.name.toLowerCase().replace(/\s+/g, '') === n);
        if (foundGlobal) return foundGlobal.username;
        return null;
    };

    if (headerIdx === -1) {
      validRows.forEach((row, index) => {
        const parts = row.map(c => String(c).trim());
        if (parts.length >= 1 && parts[0]) {
          const rawName = parts[0];
          const username = findExistingUsername(rawName) || (rawName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000));

          const s = { 
             id: `s_manual_${Date.now()}_${index}`, 
             classId: targetClassId, 
             branchId: activeBranchId,
             name: rawName, 
             gender: parts[1] || 'Unknown', 
             username: username, 
             password: Math.random().toString(36).slice(-6).toUpperCase(), 
             contact: '',
             isDeleted: false
          };
          newParsedStudents.push(s);
          syncSet('students', s.id, s);
          newImportCount++;
        }
      });
    } else {
      const headers = validRows[headerIdx].map(h => String(h).trim().toLowerCase());
      
      const nameIdx = headers.findIndex(h => h.includes("student's name") || h.includes("学生姓名") || h.includes("姓名") || (h.includes("name") && !h.includes("class") && !h.includes("user") && !h.includes("branch") && !h.includes("parent")));
      const userIdx = headers.findIndex(h => h.includes("student's id") || h.includes("学号") || h.includes("username") || h.includes("user name") || h.includes("账号") || h === "user" || h.includes("login") || (h.includes("id") && !h.includes("payment") && !h.includes("branch")));
      const classIdx = headers.findIndex(h => h.includes("class") || h.includes("班级") || h.includes("items") || h.includes("项目") || h.includes("课程"));
      const contactIdx = headers.findIndex(h => h.includes("contact") || h.includes("phone") || h.includes("联系") || h.includes("mobile") || h.includes("whatsapp"));
      const genderIdx = headers.findIndex(h => h.includes("gender") || h.includes("性别"));
      const dobIdx = headers.findIndex(h => h.includes("dob") || h.includes("birth") || h.includes("生日"));

      for (let i = headerIdx + 1; i < validRows.length; i++) {
        const row = validRows[i];
        if (!row || row.length === 0) continue;
        
        const rawName = nameIdx >= 0 && row[nameIdx] !== undefined && String(row[nameIdx]).trim() !== "" ? String(row[nameIdx]).trim() : `Student ${i}`;
        if (!rawName) continue;
        
        let username = userIdx >= 0 && row[userIdx] !== undefined && String(row[userIdx]).trim() !== "" ? String(row[userIdx]).trim() : "";
        if (!username) {
            username = findExistingUsername(rawName) || (rawName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000));
        }
        
        const rawClassStr = classIdx >= 0 && row[classIdx] ? String(row[classIdx]).trim() : (activeClass?.name || (lang === 'zh' ? "未分配班级" : "Unassigned Class"));
        
        // Splits multiple classes inside one cell (e.g. separated by \n, comma, semicolon, or stuck together like ]THUR)
        let processedStr = rawClassStr
            .replace(/\n|,|;/g, '|SPLIT|')
            .replace(/\]\s*(?=[A-Za-z0-9\u4e00-\u9fa5])/g, ']|SPLIT|');
            
        let initialSplit = processedStr.split('|SPLIT|').map(c => c.trim()).filter(Boolean);
        let classNamesArray = initialSplit.length > 0 ? initialSplit : [activeClass?.name || (lang === 'zh' ? "未分配班级" : "Unassigned Class")];

        const contactRaw = contactIdx >= 0 && row[contactIdx] ? String(row[contactIdx]).trim() : "";
        const gender = genderIdx >= 0 && row[genderIdx] ? String(row[genderIdx]).trim() : "Unknown";
        const dob = dobIdx >= 0 && row[dobIdx] ? String(row[dobIdx]).trim() : "";

        let finalContact = contactRaw.replace(/\D/g, '');
        if (finalContact) { 
           if (!finalContact.startsWith('6')) { 
              finalContact = finalContact.startsWith('0') ? '6' + finalContact : '60' + finalContact; 
           } 
        }

        classNamesArray.forEach(className => {
            let classId = existingClassNames.get(className);
            if (!classId) {
                classId = `c_auto_${Date.now()}_${classCounter++}`;
                existingClassNames.set(className, classId);
                const newC = { id: classId, branchId: activeBranchId, name: className, theme: 'candy', isDeleted: false };
                newAddedClasses.push(newC);
                syncSet('classes', classId, newC);
                const currentBranch = branches.find(b => b.id === activeBranchId);
                const defaultCols = currentBranch?.defaultColumns || tuitionColumns;
                syncSet('classColumns', classId, { id: classId, columns: defaultCols });
            }

            // CRITICAL FIX: To prevent dropping students who are in multiple classes in the same excel upload
            const enrollmentKey = `${username.toLowerCase()}_${classId}`;
            const isAlreadyInNewParsed = newParsedStudents.some(s => s.username.toLowerCase() === username.toLowerCase() && s.classId === classId);

            // If the student is NOT already enrolled in THIS SPECIFIC CLASS, add them!
            if (!existingEnrollments.has(enrollmentKey) && !isAlreadyInNewParsed) {
                const newS = { 
                    id: `s_auto_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, 
                    classId: classId, 
                    branchId: activeBranchId,
                    name: rawName, 
                    username: username, 
                    gender: gender, 
                    contact: finalContact, 
                    password: dob ? dob : Math.random().toString(36).slice(-6).toUpperCase(),
                    isDeleted: false
                };
                newParsedStudents.push(newS);
                syncSet('students', newS.id, newS);
                existingEnrollments.add(enrollmentKey);
                newImportCount++;
            } else {
                skippedCount++;
            }
        });
      }
    }

    if (newAddedClasses.length > 0) {
      setClasses(prev => [...prev, ...newAddedClasses]);
      const newColsObj = {};
      newAddedClasses.forEach(c => newColsObj[c.id] = [...tuitionColumns]);
      setClassColumns(prev => ({...prev, ...newColsObj}));
      setActiveClassId(newAddedClasses[0].id);
      setActiveView('class');
    }
    
    if (newParsedStudents.length > 0) {
      setStudents(prev => [...prev, ...newParsedStudents]);
    }
    
    if (newImportCount > 0) {
      showToast(lang === 'zh' ? `成功导入 ${newImportCount} 名学生！(跳过 ${skippedCount} 个重复记录)` : `Imported ${newImportCount} students! (Skipped ${skippedCount} class duplicates)`);
    } else if (skippedCount > 0) {
      showToast(lang === 'zh' ? `没有新名单导入，学生已在班级内。` : `No new imports. Students already in class.`);
    } else { showToast(t('importEmpty')); }
    setIsImportModalOpen(false);
  };

  const handleImageFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      processImageImport(file);
    }
    e.target.value = '';
  };

  const processImageImport = async (fileToProcess) => {
    const targetId = scanTargetClassId || activeClassId || (branchClasses[0]?.id);
    if (!targetId) {
       showToast(lang === 'zh' ? '请先创建一个班级！' : 'Please create a class first!');
       return;
    }
    if (!activeBranchId) { showToast(t('selectBranchFirst')); setIsImageImportModalOpen(false); return; }
    const file = fileToProcess || imageFile;
    if (!file) return;
    setIsScanningImage(true);
    try {
      const base64Data = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
      });
      const prompt = `Analyze this class roster image. Extract the table data into a structured JSON format. Do not return any markdown or extra text, just the raw JSON object matching this schema exactly: { "lessonDate": "Extract the date of the lesson (format strictly as DD-MMM, e.g. 05-Feb). If no date is found, leave it empty string", "students": [ { "name": "Student's Name", "gender": "Male or Female", "attendance": "On time, Late, or Absent", "classwork": "text from cell", "homework": "text from cell", "last_hw": "Complete or Incomplete", "tidiness": "text from cell", "engagement": "number/5", "strength": "text from cell", "improve": "text from cell", "points": "text from cell", "teacher_comment": "text from cell", "rating": "1,2,3,4 or 5" } ] }`;
      
      if (!process.env.GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is missing. Please configure it in the environment.");
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data as string
              }
            },
            { text: prompt }
          ]
        },
        config: {
          responseMimeType: "application/json"
        }
      });
      
      const textResult = response.text;
      if (!textResult) throw new Error("No data returned from AI.");
      
      let cleanText = textResult;
      if (cleanText.includes('```')) cleanText = cleanText.replace(/```json/gi, '').replace(/```/g, '').trim();

      const data = JSON.parse(cleanText);
      
      let lDate = String(data.lessonDate || '').trim();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      if (!lDate || lDate === 'null' || lDate === 'undefined') {
          const today = new Date();
          lDate = `${String(today.getDate()).padStart(2, '0')}-${monthNames[today.getMonth()]}`;
      }
      let lMonth = 'Current';
      if (lDate.includes('-')) {
          const parts = lDate.split('-');
          if (parts.length > 1) lMonth = parts[1];
      }

      const cLessons = lessons.filter(l => l.classId === targetId && !l.isDeleted);
      const existingLesson = cLessons.find(l => l.date.toLowerCase() === lDate.toLowerCase());
      let finalLessonId = existingLesson ? existingLesson.id : `l_img_${Date.now()}`;

      if (!existingLesson) {
          const newLesson = { id: finalLessonId, classId: targetId, date: lDate, month: lMonth, isDeleted: false };
          setLessons(prev => [...prev, newLesson]);
          syncSet('lessons', finalLessonId, newLesson);
      }
      
      const newRecordsMap = { ...records };
      let newImportCount = 0;
      const newParsedStudents = [];
      const currentClassStudents = students.filter(s => s.classId === targetId && !s.isDeleted);

      (data.students || []).forEach((stu, idx) => {
        if (!stu.name) return; 
        const safeName = String(stu.name).trim();

        let existingStu = currentClassStudents.find(s => (s.name || '').toLowerCase().replace(/\s+/g, '') === safeName.toLowerCase().replace(/\s+/g, ''));
        let studentId = existingStu ? existingStu.id : `s_img_${Date.now()}_${idx}`;

        if (!existingStu) {
          const safeUsername = safeName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 100);
          const newS = { id: studentId, classId: targetId, branchId: activeBranchId, name: safeName, username: safeUsername, password: Math.random().toString(36).slice(-6).toUpperCase(), gender: String(stu.gender || 'Unknown'), contact: '', isDeleted: false };
          newParsedStudents.push(newS);
          syncSet('students', studentId, newS);
          newImportCount++;
        }

        const recData = { attendance: String(stu.attendance || ''), classwork: String(stu.classwork || ''), homework: String(stu.homework || ''), last_hw: String(stu.last_hw || ''), tidiness: String(stu.tidiness || ''), engagement: String(stu.engagement || ''), strength: String(stu.strength || ''), improve: String(stu.improve || ''), points: String(stu.points || ''), teacher_comment: String(stu.teacher_comment || ''), rating: String(stu.rating || '') };
        newRecordsMap[`${studentId}_${finalLessonId}`] = recData;
        syncSet('records', `${studentId}_${finalLessonId}`, recData);
      });

      if (newParsedStudents.length > 0) {
          setStudents(prev => [...prev, ...newParsedStudents]);
      }
      setRecords(newRecordsMap);
      setActiveClassId(targetId);
      setActiveLessonId(finalLessonId);
      setActiveView('class');
      
      showToast(lang === 'zh' ? `成功记录 ${data.students.length} 名学生，其中新增 ${newImportCount} 人！` : `Recorded ${data.students.length} students (${newImportCount} new)!`);
      setIsImageImportModalOpen(false); setImageFile(null); setScanTargetClassId('');
    } catch (err: any) { 
      console.error(err); 
      showToast(lang === 'zh' ? `处理失败: ${err.message}` : `Failed to parse AI output: ${err.message}`); 
    } finally { 
      setIsScanningImage(false); 
    }
  };

  const handleTemplateUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!isXlsxLoaded || !window.XLSX) {
      showToast(lang === 'zh' ? "引擎加载中" : "Excel engine loading...");
      e.target.value = ''; return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result as ArrayBuffer);
        const workbook = window.XLSX.read(data, {type: 'array'});
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        // Read strictly without modifying or deleting any empty headers
        const rawDataForHeader = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
        let headerRowIndex = 0;
        for (let i = 0; i < rawDataForHeader.length; i++) {
            const validCells = rawDataForHeader[i].filter(cell => String(cell).trim() !== "");
            if (validCells.length >= 2) { headerRowIndex = i; break; }
        }

        const jsonRaw = window.XLSX.utils.sheet_to_json(sheet, { range: headerRowIndex, defval: "" });
        if (jsonRaw.length === 0) return;

        // Extract raw headers straight from the JSON object keys (including __EMPTY ones)
        const headers = Object.keys(jsonRaw[0]);
        
        setTemplateHeaders(headers); 
        setTemplateData(jsonRaw); 
        setTemplateFile({ name: file.name, workbook, sheetName });

        const initialMapping = {};
        const internalOptions = [...activeColumns, {id: 'name', name: 'Name'}, {id: 'username', name: 'Username'}];
        
        headers.forEach(h => {
          const lowerH = h.toLowerCase();
          // DO NOT auto-map if it's an empty or generic column
          if(lowerH.includes('__empty') || lowerH === '-' || lowerH.trim() === '') {
              initialMapping[h] = "";
          } else {
              const match = internalOptions.find(c => lowerH.includes(c.name.split(' ')[0].toLowerCase()) || lowerH.includes(c.id.toLowerCase()));
              initialMapping[h] = match ? match.id : "";
          }
        });

        setColumnMapping(initialMapping); setSmartFillStep(2);
      } catch (err) {}
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const processSmartFillExport = () => {
    const matchStudent = (templateNameOrUser) => {
      const t = String(templateNameOrUser).toLowerCase().trim();
      if (!t) return null;
      // 1. Exact match username
      let match = classStudents.find(s => (s.username || '').toLowerCase() === t);
      if (match) return match;
      // 2. Exact match name
      match = classStudents.find(s => s.name.toLowerCase() === t);
      if (match) return match;
      // 3. Partial match name
      match = classStudents.find(s => t.includes(s.name.toLowerCase()) || s.name.toLowerCase().includes(t));
      if (match) return match;
      // 4. Word-by-word match
      const tWords = t.split(/\s+/).filter(w => w.length > 2);
      return classStudents.find(s => {
         const sWords = s.name.toLowerCase().split(/\s+/).filter(w => w.length > 2);
         return sWords.some(w => tWords.includes(w));
      });
    };

    let missingStudentsCount = 0;

    const newData = templateData.map(row => {
      const newRow = {}; 
      
      let matchedStudent = null;
      // ONLY use explicit keys mapped by user (Username or Name) to find the student
      for (const [header, mappedId] of Object.entries(columnMapping)) {
          if ((mappedId === 'username' || mappedId === 'name') && row[header]) {
              matchedStudent = matchStudent(row[header]);
              if (matchedStudent) break; // found it
          }
      }

      if (!matchedStudent) {
          const identityKeys = templateHeaders.filter(k => k.toLowerCase().includes('name') || k.toLowerCase().includes('姓名') || k.toLowerCase().includes('user'));
          for (let k of identityKeys) {
             if (row[k]) {
                 matchedStudent = matchStudent(row[k]);
                 if (matchedStudent) break;
             }
          }
      }

      // If we still can't find the student but the row has valid data (not just empty strings)
      const hasValidData = Object.values(row).some(v => String(v).trim() !== "");
      if (!matchedStudent && hasValidData) {
          missingStudentsCount++;
      }

      // Build the new row exactly matching ALL original headers
      templateHeaders.forEach(h => {
         const mappedColId = columnMapping[h];
         
         if (!mappedColId || mappedColId === "") {
             // Leave Blank / Ignore: KEEP original data exactly as is
             newRow[h] = row[h];
         } else if (matchedStudent) {
             const record = records[`${matchedStudent.id}_${activeLessonId}`] || {};
             
             // STRICT RULE: If the user mapped this column as 'Name' or 'Username'
             // it acts ONLY as a search key. We NEVER overwrite it. We keep the Excel's original value.
             if (mappedColId === 'name' || mappedColId === 'username') {
                 newRow[h] = row[h]; 
             } else {
                 // For all other data columns, we fill in the data from the system, falling back to original if blank
                 newRow[h] = record[mappedColId] !== undefined && record[mappedColId] !== "" ? record[mappedColId] : row[h]; 
             }
         } else {
             // Student not found -> Keep original data to not ruin the layout
             newRow[h] = row[h];
         }
      });
      return newRow;
    });

    try {
      // Force headers to be the exact original template headers
      const newSheet = window.XLSX.utils.json_to_sheet(newData, { header: templateHeaders });
      const newWb = window.XLSX.utils.book_new();
      window.XLSX.utils.book_append_sheet(newWb, newSheet, templateFile.sheetName);
      window.XLSX.writeFile(newWb, `SmartFilled_${templateFile.name.replace(/\.[^/.]+$/, "")}.xlsx`);
      
      if (missingStudentsCount > 0) {
          setToastMessage(`⚠️ 导出成功！但有 ${missingStudentsCount} 行记录无法匹配到班级里的学生，被保留原样。`);
      } else {
          setToastMessage(lang === 'zh' ? "✅ 表格已智能填满并下载！" : "Smart Fill exported successfully!");
      }
      setTimeout(() => setToastMessage(""), 3000);
      
      setIsSmartFillModalOpen(false); setSmartFillStep(1);
    } catch (err) {
        setToastMessage("Export failed.");
        setTimeout(() => setToastMessage(""), 3000);
    }
  };

  if (isLoadingDB) {
    return <div className="flex h-screen items-center justify-center bg-gray-50"><Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" /></div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-800 overflow-hidden selection:bg-pink-200">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col shadow-lg z-20 relative shrink-0">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-400 via-yellow-400 via-green-400 via-blue-400 to-purple-500"></div>
        <div className="p-5 border-b border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://i.postimg.cc/QMJWSFh4/TRANSPARENT.png" alt="Logo" className="h-9 w-auto object-contain" />
            <h1 className="font-extrabold text-base tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-violet-500 to-fuchsia-500">{t('appTitle')}</h1>
          </div>
          <button onClick={() => setLang(lang === 'en' ? 'zh' : 'en')} className="text-xs font-bold bg-pink-50 text-fuchsia-600 px-2 py-1 rounded-full"><Globe className="w-3 h-3 inline" /> {lang === 'en' ? '中' : 'EN'}</button>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Branches Menu */}
          <div className="mb-6">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
              <span>{t('branches')}</span> 
              {(!activeBranchId || isSuperAdmin) && (
                <button onClick={() => setIsAddBranchModalOpen(true)} className="p-1 -mr-1 rounded hover:bg-gray-100 text-gray-400 hover:text-fuchsia-500 transition-colors"><Plus className="w-4 h-4" /></button>
              )}
            </h2>
            <div className="space-y-1">
              {branches
                .filter(b => isSuperAdmin || !activeBranchId || b.id === activeBranchId)
                .map(b => (
                <div key={b.id} onClick={() => handleBranchClick(b)} className={`group p-3 rounded-lg text-sm flex items-center justify-between cursor-pointer ${activeBranchId === b.id ? 'bg-indigo-50 text-fuchsia-700 font-bold border border-fuchsia-100' : 'hover:bg-gray-50'}`}>
                  <div className="flex items-center gap-2 truncate">{(b.password && activeBranchId !== b.id && !isSuperAdmin) ? <Lock className="w-4 h-4 text-gray-400" /> : <Building className="w-4 h-4" />} <span className="truncate">{b.name}</span></div>
                  <div className="flex items-center gap-1 shrink-0">
                    {activeBranchId === b.id && !isSuperAdmin && (
                      <button onClick={(e) => { e.stopPropagation(); setActiveBranchId(''); }} className="p-1 rounded opacity-50 hover:opacity-100 hover:bg-indigo-100 transition-all text-indigo-600" title={t('exitBranch')}><LogOut className="w-3.5 h-3.5" /></button>
                    )}
                    {isSuperAdmin && <button onClick={(e) => handleDeleteBranch(b.id, e)} className="p-1 rounded opacity-30 group-hover:opacity-100 hover:bg-rose-100 transition-all text-gray-400 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Global Students Menu */}
          {activeBranchId && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3"><span>{t('allStudents')}</span></h2>
              <div onClick={() => setActiveView('students')} className={`p-3 rounded-lg text-sm flex items-center justify-between cursor-pointer ${activeView === 'students' ? 'bg-amber-50 text-orange-600 font-bold border border-orange-200' : 'hover:bg-gray-50 text-gray-600 font-medium'}`}>
                 <div className="flex items-center gap-2"><Users className="w-4 h-4" /> <span>{t('allStudents')} ({globalBranchStudents.length})</span></div>
              </div>
              <div onClick={() => setActiveView('billing')} className={`mt-1 p-3 rounded-lg text-sm flex items-center justify-between cursor-pointer ${activeView === 'billing' ? 'bg-indigo-50 text-indigo-600 font-bold border border-indigo-200' : 'hover:bg-gray-50 text-gray-600 font-medium'}`}>
                 <div className="flex items-center gap-2"><Receipt className="w-4 h-4" /> <span>{t('paymentReminder')}</span></div>
              </div>
              <div onClick={() => setActiveView('trash')} className={`mt-1 p-3 rounded-lg text-sm flex items-center justify-between cursor-pointer ${activeView === 'trash' ? 'bg-rose-50 text-rose-600 font-bold border border-rose-200' : 'hover:bg-gray-50 text-gray-600 font-medium'}`}>
                 <div className="flex items-center gap-2"><Trash2 className="w-4 h-4" /> <span>{t('recycleBin')}</span></div>
              </div>
            </div>
          )}

          {/* Classes Menu */}
          {activeBranchId && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>{t('classes')}</span> 
                <button onClick={() => setIsAddClassModalOpen(true)} className="p-1 -mr-1 rounded hover:bg-gray-100 text-gray-400 hover:text-blue-500 transition-colors"><Plus className="w-4 h-4" /></button>
              </h2>
              <div className="space-y-1">
                {branchClasses.map(c => (
                  <div key={c.id} onClick={() => { setActiveClassId(c.id); setActiveView('class'); }} className={`group p-3 rounded-lg text-sm flex items-center justify-between cursor-pointer ${activeClassId === c.id && activeView === 'class' ? 'bg-blue-50 text-blue-700 font-bold border border-blue-100' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2 truncate"><BookOpen className="w-4 h-4" /> <span className="truncate">{c.name}</span></div>
                    <div className="flex items-center gap-1 shrink-0 opacity-30 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setRenameClassPrompt({ isOpen: true, classId: c.id, newName: c.name }); }} className="p-1 rounded text-gray-400 hover:bg-blue-100 hover:text-blue-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => handleDeleteClass(c.id, e)} className="p-1 rounded text-gray-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lessons Menu */}
          {activeBranchId && activeClassId && activeView === 'class' && (
            <div className="mb-6">
              <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span>{t('lessons')}</span> 
                <button onClick={() => setIsAddingLesson(true)} className="p-1 -mr-1 rounded hover:bg-gray-100 text-gray-400 hover:text-teal-500 transition-colors"><Plus className="w-4 h-4" /></button>
              </h2>
              <div className="space-y-1">
                {classLessons.map(l => (
                  <div key={l.id} onClick={() => setActiveLessonId(l.id)} className={`group p-3 rounded-lg text-sm flex items-center justify-between cursor-pointer ${activeLessonId === l.id ? 'bg-emerald-50 text-teal-700 font-bold border border-teal-100' : 'hover:bg-gray-50'}`}>
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {l.date}</div>
                    <div className="flex items-center gap-1 shrink-0 opacity-30 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); setRenameLessonPrompt({ isOpen: true, lessonId: l.id, newDate: l.date }); }} className="p-1 rounded text-gray-400 hover:bg-teal-100 hover:text-teal-600 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={(e) => handleDeleteLesson(l.id, e)} className="p-1 rounded text-gray-400 hover:bg-rose-100 hover:text-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        <div className="p-4 border-t border-gray-50 space-y-2">
          <button onClick={() => { if(!activeBranchId){showToast(t('selectBranchFirst')); return;} setIsImageImportModalOpen(true); }} className="w-full py-2.5 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><Camera className="w-4 h-4" /> {t('scanImage')}</button>
          <button onClick={() => { if(!activeBranchId){showToast(t('selectBranchFirst')); return;} setIsImportModalOpen(true); }} className="w-full py-2.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-bold flex items-center justify-center gap-2"><FileUp className="w-4 h-4" /> {t('importList')}</button>
          <button onClick={() => isSuperAdmin ? setAdminDashboardOpen(true) : setAdminLoginPrompt({ isOpen: true, passwordInput: '', error: '' })} className="w-full py-2 bg-gray-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2"><Shield className="w-3.5 h-3.5" /> {isSuperAdmin ? t('adminDashboard') : t('superAdmin')}</button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {!activeBranchId ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6">
            <div className="bg-white p-10 rounded-[2rem] shadow-2xl max-w-lg w-full text-center border border-gray-100">
               <img src="https://i.postimg.cc/QMJWSFh4/TRANSPARENT.png" className="w-24 h-24 mx-auto mb-6" alt="Logo" />
               <h2 className="text-3xl font-extrabold text-fuchsia-600 mb-2">{t('appTitle')}</h2>
               <p className="text-sm font-bold text-gray-400 mb-8">{t('welcomeSelectBranch')}</p>
               <div className="space-y-3 max-h-[45vh] overflow-y-auto mb-8 px-2">
                 {branches.map(b => (
                   <div key={b.id} onClick={() => handleBranchClick(b)} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-indigo-50 border-2 border-transparent hover:border-indigo-100 rounded-2xl cursor-pointer transition-all">
                     <span className="font-extrabold text-gray-700">{b.name}</span>
                     {b.password && !isSuperAdmin ? <Lock className="w-5 h-5 text-gray-300" /> : <ArrowRight className="w-5 h-5 text-gray-300" />}
                   </div>
                 ))}
               </div>
               <button onClick={() => setIsAddBranchModalOpen(true)} className="w-full py-4 bg-gray-900 text-white font-bold rounded-2xl"><Plus className="w-5 h-5 inline" /> {t('createBranch')}</button>
            </div>
          </div>
        ) : activeView === 'trash' ? (
          /* --- RECYCLE BIN VIEW --- */
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
             <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center z-10 sticky top-0 shrink-0 shadow-sm">
                <Trash2 className="w-6 h-6 text-rose-500 mr-3" />
                <h2 className="text-xl font-extrabold text-gray-800">{t('recycleBin')} - {activeBranch?.name}</h2>
             </div>
             <div className="flex-1 overflow-auto p-6 space-y-8">
                
                {/* Deleted Classes */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-gray-400"/> {t('deletedClasses')} <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{deletedClasses.length}</span></h3>
                  {deletedClasses.length === 0 ? <p className="text-sm text-gray-400 italic">Empty</p> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {deletedClasses.map(c => (
                         <div key={c.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-colors">
                           <span className="font-bold text-gray-800">{c.name}</span>
                           <div className="flex gap-2 shrink-0">
                             <button onClick={() => handleRestore('classes', c)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5"/> {t('restore')}</button>
                             <button onClick={() => handleHardDelete('classes', c.id)} className="px-3 py-1.5 bg-white border border-gray-200 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">{t('permanentDelete')}</button>
                           </div>
                         </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Deleted Lessons */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><Calendar className="w-5 h-5 text-gray-400"/> {t('deletedLessons')} <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{deletedLessons.length}</span></h3>
                  {deletedLessons.length === 0 ? <p className="text-sm text-gray-400 italic">Empty</p> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {deletedLessons.map(l => {
                         const cls = classes.find(c => c.id === l.classId);
                         return (
                           <div key={l.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-colors">
                             <div>
                               <p className="font-bold text-gray-800">{l.date}</p>
                               <p className="text-xs text-gray-500 font-medium mt-0.5">Class: {cls?.name || 'Unknown'}</p>
                             </div>
                             <div className="flex gap-2 shrink-0">
                               <button onClick={() => handleRestore('lessons', l)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5"/> {t('restore')}</button>
                               <button onClick={() => handleHardDelete('lessons', l.id)} className="px-3 py-1.5 bg-white border border-gray-200 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">{t('permanentDelete')}</button>
                             </div>
                           </div>
                         )
                      })}
                    </div>
                  )}
                </div>

                {/* Deleted Students */}
                <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-700 mb-4 flex items-center gap-2"><UserMinus className="w-5 h-5 text-gray-400"/> {t('deletedStudents')} <span className="bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full text-xs">{deletedStudents.length}</span></h3>
                  {deletedStudents.length === 0 ? <p className="text-sm text-gray-400 italic">Empty</p> : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {deletedStudents.map(s => {
                         const cls = classes.find(c => c.id === s.classId);
                         return (
                           <div key={s.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center justify-between hover:border-gray-300 transition-colors">
                             <div>
                               <p className="font-bold text-gray-800">{s.name} <span className="text-xs text-gray-400 font-mono ml-1">({s.username})</span></p>
                               <p className="text-xs text-gray-500 font-medium mt-0.5">Class: {cls?.name || 'Unknown'}</p>
                             </div>
                             <div className="flex gap-2 shrink-0">
                               <button onClick={() => handleRestore('students', s)} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-lg hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5"/> {t('restore')}</button>
                               <button onClick={() => handleHardDelete('students', s.id)} className="px-3 py-1.5 bg-white border border-gray-200 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">{t('permanentDelete')}</button>
                             </div>
                           </div>
                         )
                      })}
                    </div>
                  )}
                </div>

             </div>
          </div>
        ) : activeView === 'billing' ? (
          /* --- BILLING / PAYMENT REMINDER VIEW --- */
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
             <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 sticky top-0 shrink-0 shadow-sm">
                <div className="flex items-center gap-3">
                  <Receipt className="w-6 h-6 text-indigo-500" />
                  <h2 className="text-xl font-extrabold text-gray-800">{t('paymentReminder')}</h2>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => { setEditingTemplateType('billing'); setEditingTemplates(normalizeTemplates(activeBranch?.templates)); setIsTemplateModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"> 
                      <Settings className="w-4 h-4 text-indigo-500" /> <span className="hidden md:block">{t('templateBilling')}</span> 
                   </button>
                   <label className="cursor-pointer bg-indigo-50 border border-indigo-200 text-indigo-600 hover:text-white hover:bg-indigo-600 font-bold px-4 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2 text-sm">
                      <FileSpreadsheet className="w-4 h-4" /> {t('uploadPaymentReport')}
                      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleBillingFileUpload} className="hidden" />
                   </label>
                </div>
             </div>
             <div className="flex-1 overflow-auto p-6 relative">
                {billingRecords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <div className="w-24 h-24 mb-6 rounded-full bg-indigo-50 flex items-center justify-center shadow-inner"> <Receipt className="w-10 h-10 text-indigo-300" /> </div>
                      <p className="text-lg font-bold mb-4 text-gray-500 max-w-md text-center leading-relaxed">{t('billingEmpty')}</p>
                      <label className="mt-4 cursor-pointer bg-gradient-to-r from-indigo-500 to-blue-600 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                          <FileSpreadsheet className="w-5 h-5" /> {t('uploadPaymentReport')}
                          <input type="file" accept=".xlsx, .xls, .csv" onChange={handleBillingFileUpload} className="hidden" />
                      </label>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                     {billingRecords.map((group, i) => (
                        <div key={i} className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden hover:shadow-xl transition-all flex flex-col transform hover:-translate-y-1">
                           <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-blue-50 flex justify-between items-center">
                              <span className="font-extrabold text-indigo-900 tracking-wide text-lg flex items-center gap-2">📞 {group.contact}</span>
                              <span className="bg-white text-rose-600 font-extrabold px-3 py-1.5 rounded-xl border border-rose-100 shadow-sm">RM {group.total.toFixed(2)}</span>
                           </div>
                           <div className="p-5 flex-1 space-y-4">
                              {Object.entries(group.details).map(([stuName, records]) => (
                                 <div key={stuName} className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                                    <h4 className="font-bold text-gray-800 text-sm mb-3 pb-2 border-b border-gray-200">{stuName}</h4>
                                    <ul className="text-xs font-bold text-gray-500 space-y-3">
                                       {(records as any[]).map((r: any, ri: number) => (
                                          <li key={ri} className="flex flex-col gap-1.5">
                                             <div className="flex justify-between items-center">
                                                <span className="bg-white px-2 py-0.5 rounded border border-gray-200 shadow-sm">{r.month}</span>
                                                <span className="text-gray-700">RM {r.amount.toFixed(2)}</span>
                                             </div>
                                             {r.itemStr && <span className="text-[10px] text-gray-400 font-medium break-words leading-tight bg-white p-1.5 rounded border border-dashed border-gray-200">{r.itemStr}</span>}
                                          </li>
                                       ))}
                                    </ul>
                                 </div>
                              ))}
                           </div>
                           <div className="p-4 border-t border-gray-50 bg-gray-50">
                              <button onClick={() => handleSendBillingWhatsApp(group)} className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm">
                                 <Send className="w-4 h-4" /> {t('sendReminder')}
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
                )}
             </div>
          </div>
        ) : activeView === 'students' ? (
          /* --- ALL STUDENTS VIEW (BRANCH LEVEL) --- */
          <>
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 sticky top-0 shrink-0">
              <div className="min-w-0 pr-4">
                <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 truncate"> {activeBranch?.name} <span className="text-gray-300 font-light shrink-0">/</span> <span className="text-orange-600">{t('allStudents')}</span> </h2>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-3 py-0.5 rounded-full text-xs font-bold shadow-sm">
                    <Users className="w-3.5 h-3.5" /> {globalBranchStudents.length} {t('studentsInClass')}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 relative">
              {globalBranchStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-orange-100 to-amber-100 flex items-center justify-center shadow-inner"> <Users className="w-10 h-10 text-orange-400 opacity-50" /> </div>
                  <p className="text-xl font-bold mb-4 text-gray-500">{t('noStudents')}</p>
                </div>
              ) : (
                <div className="w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto w-full">
                    <table className="min-w-full divide-y divide-gray-100 mb-10">
                      <thead className="bg-gradient-to-r from-amber-400 to-orange-400 text-white">
                        <tr>
                          <th className="sticky top-0 z-10 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur">{t('name')}</th>
                          <th className="sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur">{t('username')} / {t('password')}</th>
                          <th className="sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur">{t('gender')}</th>
                          <th className="sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur">{t('contact')}</th>
                          <th className="sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-center text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur w-48">{t('actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {globalBranchStudents.map((student, idx) => (
                            <tr key={student.username} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'} hover:bg-orange-50 transition-colors group`}>
                              <td className="whitespace-nowrap px-4 py-4 text-sm font-bold border-r border-gray-100 text-gray-800">
                                {student.name}
                                {student.joinedClasses && student.joinedClasses.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-1.5">
                                    {student.joinedClasses.map(cid => {
                                      const c = classes.find(cls => cls.id === cid);
                                      return c ? <span key={cid} className="text-[10px] bg-white border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded shadow-sm">{c.name}</span> : null;
                                    })}
                                  </div>
                                )}
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm font-bold border-r border-gray-100">
                                <div className="text-[11px] text-gray-500 font-mono bg-white px-2 py-1 rounded border border-gray-200 inline-block shadow-sm">
                                  U: {student.username} <br/> P: {student.password}
                                </div>
                              </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500 border-r border-gray-100 font-bold"> {student.gender === 'Female' ? (lang==='zh'?'女':'Female') : student.gender === 'Male' ? (lang==='zh'?'男':'Male') : student.gender} </td>
                              <td className="whitespace-nowrap px-4 py-4 text-sm font-bold text-gray-600 border-r border-gray-100">{student.contact || '-'}</td>
                              <td className="px-4 py-4 text-center align-middle">
                                 <div className="flex justify-center gap-2">
                                   <button onClick={() => handleWhatsApp(student, 'login')} className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-green-50 hover:text-green-600 hover:border-green-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center h-10 w-10" title={t('sendLogin')} > <Key className="w-4 h-4" /> </button>
                                   <button onClick={() => openStudentModal(student, true)} className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center h-10 w-10" title={lang === 'zh' ? '编辑学生 (全局)' : 'Edit Student (Global)'} > <Edit2 className="w-4 h-4" /> </button>
                                   <button onClick={() => handleDeleteStudent(student.id, true)} className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center h-10 w-10" title={lang === 'zh' ? '删除学生 (全局)' : 'Delete Student (Global)'} > <Trash2 className="w-4 h-4" /> </button>
                                 </div>
                              </td>
                            </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          /* --- CLASS VIEW --- */
          <>
            <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 sticky top-0 shrink-0">
              <div className="min-w-0 pr-4">
                <h2 className="text-xl font-extrabold text-gray-800 flex items-center gap-2 truncate"> {activeBranch?.name} <span className="text-gray-300 font-light shrink-0">/</span> <span className="text-fuchsia-600">{activeClass?.name || (lang==='zh'?'暂无班级':'No Class')}</span> <span className="text-gray-300 font-light shrink-0">|</span> <span className="shrink-0 text-teal-600">{activeLesson?.date || (lang==='zh'?'暂无课程':'No Lesson')}</span> </h2>
                <div className="flex items-center gap-4 mt-1.5">
                  <div className="flex items-center gap-1.5 bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs font-bold shadow-inner"> <Users className="w-3.5 h-3.5" /> {classStudents.length} {t('studentsInClass')} </div>
                  {activeClassId && (
                    <div className="flex gap-2">
                      <button onClick={() => setIsAddExistingModalOpen(true)} className="text-xs font-bold text-violet-600 bg-violet-50 hover:bg-violet-100 border border-violet-200 flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all"> <UserPlus className="w-3 h-3" /> {t('addExisting')} </button>
                      <button onClick={() => openStudentModal()} className="text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 flex items-center gap-1 px-3 py-1.5 rounded-full shadow-sm hover:shadow transition-all"> <Plus className="w-3 h-3" /> {t('addStudent')} </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                {activeClassId && (
                  <>
                     <button onClick={handleCopyAttendance} title={t('copyAttendance')} className="flex items-center justify-center p-2.5 text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm hover:shadow transition-all group"> <Copy className="w-4 h-4 group-hover:text-blue-500" /> </button>
                     <button onClick={() => setIsThemeModalOpen(true)} title={t('tableTheme')} className="flex items-center justify-center p-2.5 text-pink-500 bg-white border border-pink-100 rounded-xl hover:bg-pink-50 shadow-sm hover:shadow transition-all"> <Palette className="w-4 h-4" /> </button>
                  </>
                )}
                <button onClick={() => { setEditingTemplateType('login'); setEditingTemplates(normalizeTemplates(activeBranch?.templates)); setIsTemplateModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"> <Settings className="w-4 h-4 text-green-500" /> <span className="hidden md:block">{t('msgTemplate')}</span> </button>
                <button onClick={() => { setIsColumnModalOpen(true); setSelectedColumnTemplateId(""); }} className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"> <Settings className="w-4 h-4 text-blue-500" /> <span className="hidden md:block">{t('manageColumns')}</span> </button>
                <button onClick={handleExportReport} className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 shadow-sm transition-all"> <Download className="w-4 h-4 text-orange-500" /> <span className="hidden md:block">{t('exportReport')}</span> </button>
                <button onClick={() => { setSmartFillStep(1); setIsSmartFillModalOpen(true); }} className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 shadow-sm transition-all"> <Wand2 className="w-4 h-4" /> <span className="hidden md:block">{t('smartFill')}</span> </button>
                <button onClick={() => setAiLangModal({ isOpen: true, targetId: 'ALL' })} className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-xl hover:from-violet-600 hover:to-fuchsia-600 shadow-md hover:shadow-lg transition-all"> <Sparkles className="w-4 h-4" /> {t('autoFillAi')} </button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-6 relative">
              {classStudents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-tr from-pink-100 to-blue-100 flex items-center justify-center shadow-inner"> <Users className="w-10 h-10 text-gray-400 opacity-50" /> </div>
                  <p className="text-xl font-bold mb-4 text-gray-500">{t('noStudents')}</p>
                  <div className="flex gap-4">
                    <button onClick={() => setIsAddExistingModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-violet-200 text-violet-600 hover:bg-violet-50 font-bold rounded-xl shadow-sm transition-all"> <UserPlus className="w-5 h-5" /> {t('addExisting')} </button>
                    <button onClick={() => openStudentModal()} className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"> <Plus className="w-5 h-5" /> {t('addManually')} </button>
                    <button onClick={() => setIsImportModalOpen(true)} className="flex items-center gap-2 px-6 py-2.5 bg-white border-2 border-gray-200 text-gray-600 font-bold rounded-xl shadow-sm hover:border-blue-300 hover:text-blue-600 transition-all"> <FileUp className="w-5 h-5" /> {t('importExcel')} </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {!activeLessonId && (
                    <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-200 p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm shrink-0">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm shrink-0 text-teal-500">
                          <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-extrabold text-teal-900 text-lg">{lang === 'zh' ? '尚未选择课程日期' : 'No Lesson Selected'}</h3>
                          <p className="text-sm font-medium text-teal-700">{lang === 'zh' ? '请先创建或选择一个课程，才能开始记录考勤与评语。您仍可以管理下方学生名单。' : 'Create or select a lesson to record attendance and comments. You can still manage the student list below.'}</p>
                        </div>
                      </div>
                      <button onClick={() => setIsAddingLesson(true)} className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-xl shadow-md transition-all whitespace-nowrap flex items-center gap-2">
                        <Plus className="w-5 h-5" /> {t('createLesson')}
                      </button>
                    </div>
                  )}
                  <div className={`w-full bg-white rounded-2xl shadow-xl overflow-hidden border ${currentTheme?.border || ''}`}>
                    <div className="overflow-x-auto w-full">
                      <table className="min-w-full divide-y divide-gray-100 mb-20">
                        <thead className={`${currentTheme?.head || ''} text-white`}>
                          <tr>
                            <th className="sticky top-0 z-10 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur"> {t('monthDate')} </th>
                            <th className="sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur"> {t('name')} </th>
                            <th className="sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur"> {t('gender')} </th>
                            {activeColumns.map(col => ( <th key={col.id} className={`sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-left text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur ${col.id === 'teacher_comment' ? 'min-w-[300px]' : ''}`} > <div className="flex items-center justify-between"> {col.name} {col.id === 'teacher_comment' && <Sparkles className="w-4 h-4 text-yellow-300 ml-2 drop-shadow-md" />} </div> </th> ))}
                            <th className="sticky top-0 z-10 border-l border-white/20 px-4 py-4 text-center text-sm font-extrabold whitespace-nowrap shadow-sm bg-black/10 backdrop-blur w-44"> {t('actions')} </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {classStudents.map((student, idx) => {
                            const rec = records[`${student.id}_${activeLessonId}`] || {};
                            return (
                              <tr key={student.id} className={`${idx % 2 === 0 ? currentTheme?.row1 || '' : currentTheme?.row2 || ''} hover:bg-white/80 transition-colors group`}>
                                <td className={`whitespace-nowrap px-4 py-4 text-sm border-r ${currentTheme?.border || ''}`}> <div className={`font-extrabold ${currentTheme?.text || ''}`}>{activeLesson?.month || '-'}</div> <div className="text-xs text-gray-500 font-bold">{activeLesson?.date || '-'}</div> </td>
                                <td className={`whitespace-nowrap px-4 py-4 text-sm font-bold border-r ${currentTheme?.border || ''}`}>
                                  <div className={`text-base ${currentTheme?.text || ''}`}>{student.name}</div>
                                  <div className="text-[10px] text-gray-400 font-mono mt-1 bg-white/60 px-1.5 py-0.5 rounded border border-gray-100 inline-block shadow-inner">
                                    U: {student.username} <br/> P: {student.password}
                                  </div>
                                  <div className="flex items-center gap-1 mt-2">
                                     <button onClick={() => handleWhatsApp(student, 'login')} className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all" title={t('sendLogin')}><Key className="w-3.5 h-3.5" /></button>
                                     <button onClick={() => handleWhatsApp(student, 'absent')} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white rounded-lg transition-all" title={t('sendAbsent')}><UserMinus className="w-3.5 h-3.5" /></button>
                                     <button onClick={() => handleWhatsApp(student, 'homework')} className="p-1.5 bg-amber-50 text-amber-600 hover:bg-amber-500 hover:text-white rounded-lg transition-all" title={t('sendHW')}><FileX className="w-3.5 h-3.5" /></button>
                                     <button onClick={() => handleWhatsApp(student, 'comment')} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-lg transition-all" title={t('sendComment')}><MessageSquare className="w-3.5 h-3.5" /></button>
                                  </div>
                                </td>
                                <td className={`whitespace-nowrap px-4 py-4 text-sm text-gray-500 border-r ${currentTheme?.border || ''} font-bold`}> {student.gender === 'Female' ? (lang==='zh'?'女':'Female') : student.gender === 'Male' ? (lang==='zh'?'男':'Male') : student.gender} </td>
                                {activeColumns.map(col => {
                                  let bgColorClass = "p-1";
                                  const cellValue = String(rec[col.id] || '');
                                  if ((cellValue.includes('Complete') || cellValue.includes('完成')) && !cellValue.includes('未')) { bgColorClass = 'bg-gradient-to-br from-emerald-50 to-emerald-100 p-1 rounded-xl border border-emerald-200/60 shadow-inner'; } else if (cellValue.includes('Incomplete') || cellValue.includes('未完成') || cellValue.includes('No')) { bgColorClass = 'bg-gradient-to-br from-rose-50 to-rose-100 p-1 rounded-xl border border-rose-200/60 shadow-inner'; }
                                  return ( <td key={col.id} className={`px-3 py-3 text-sm border-r ${currentTheme?.border || ''} align-top`}> <div className={bgColorClass}> {col.id === 'teacher_comment' && generatingIds.has(student.id) ? ( <div className="flex items-center justify-center gap-2 text-fuchsia-500 p-4 bg-white/80 rounded-xl border border-fuchsia-200 shadow-sm backdrop-blur-sm"> <Loader2 className="w-5 h-5 animate-spin" /> <span className="text-sm font-extrabold animate-pulse">{t('generating')}</span> </div> ) : ( renderCellInput(col, student.id, rec[col.id]) )} </div> </td> );
                                })}
                                <td className="px-4 py-4 text-center align-middle">
                                   <div className="flex justify-center gap-2 flex-wrap opacity-60 group-hover:opacity-100 transition-opacity">
                                     <button onClick={() => setAiLangModal({ isOpen: true, targetId: student.id })} disabled={!activeLessonId || generatingIds.has(student.id)} className={`p-2 text-white rounded-xl shadow-sm transition-all flex items-center justify-center h-10 w-10 ${!activeLessonId || generatingIds.has(student.id) ? 'bg-gray-300 opacity-50 cursor-not-allowed' : 'bg-gradient-to-br from-violet-400 to-fuchsia-500 hover:from-violet-500 hover:to-fuchsia-600 hover:shadow-md'}`} title={lang === 'zh' ? '生成AI评语' : 'Generate AI Comment'} > <Sparkles className="w-4 h-4 drop-shadow-sm" /> </button>
                                     <button onClick={() => openStudentModal(student, false)} className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center h-10 w-10" title={lang === 'zh' ? '编辑学生' : 'Edit Student'} > <Edit2 className="w-4 h-4" /> </button>
                                     <button onClick={() => handleDeleteStudent(student.id, false)} className="p-2 bg-white border border-gray-200 text-gray-500 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center h-10 w-10" title={lang === 'zh' ? '删除学生' : 'Delete Student'} > <Trash2 className="w-4 h-4" /> </button>
                                   </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* --- MODALS --- */}

      {/* Admin Login Prompt */}
      {adminLoginPrompt.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Shield className="w-6 h-6 text-gray-800" /> {t('superAdmin')}</h3>
              <button onClick={() => setAdminLoginPrompt({ isOpen: false, passwordInput: '', error: '' })} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <input type="password" value={adminLoginPrompt.passwordInput} onChange={e => setAdminLoginPrompt({ ...adminLoginPrompt, passwordInput: e.target.value, error: '' })} onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} placeholder={t('enterPassword')} className="w-full border-2 border-gray-200 rounded-xl p-3 mb-2 focus:ring-4 focus:ring-gray-100 focus:border-gray-800 outline-none transition-all font-mono" autoFocus />
            {adminLoginPrompt.error && <p className="text-rose-500 text-xs font-bold mb-4">{adminLoginPrompt.error}</p>}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setAdminLoginPrompt({ isOpen: false, passwordInput: '', error: '' })} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleAdminLogin} className="px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-md transition-all">{t('login')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dashboard */}
      {adminDashboardOpen && (
        <div className="fixed inset-0 bg-gray-100 z-50 flex flex-col overflow-hidden">
          <div className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md shrink-0">
            <h2 className="text-xl font-extrabold flex items-center gap-2"><Shield className="w-6 h-6 text-yellow-400" /> {t('adminDashboard')}</h2>
            <button onClick={() => setAdminDashboardOpen(false)} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-xl font-bold transition-colors flex items-center gap-2"><X className="w-4 h-4" /> {t('close')}</button>
          </div>
          <div className="flex-1 overflow-auto p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><Building className="w-5 h-5 text-gray-400" /> {t('manageBranches')}</h3>
              <div className="space-y-3">
                {branches.map(b => (
                  <div key={b.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-gray-300 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800">{b.name}</p>
                      <p className="text-xs text-gray-500 font-mono mt-1">ID: {b.id}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {b.password && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded font-bold flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</span>}
                      <button onClick={(e) => handleDeleteBranch(b.id, e)} className="px-3 py-1.5 bg-white border border-gray-200 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all">{t('delete')}</button>
                    </div>
                  </div>
                ))}
                {branches.length === 0 && <p className="text-gray-400 text-sm italic py-4 text-center">No branches found.</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Branch Modal */}
      {isAddBranchModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">{t('createBranch')}</h3>
              <button onClick={() => setIsAddBranchModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('branchName')} *</label>
                <input type="text" value={newBranchName} onChange={e => setNewBranchName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateBranch()} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-bold text-gray-800" placeholder="e.g. Main Campus" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('password')} *</label>
                <input type="password" value={newBranchPassword} onChange={e => setNewBranchPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreateBranch()} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 outline-none transition-all font-mono" placeholder="Enter branch password" />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsAddBranchModalOpen(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleCreateBranch} className="px-5 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-md hover:shadow-lg transition-all">{t('create')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Branch Password Prompt Modal */}
      {unlockBranchPrompt.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Lock className="w-5 h-5 text-amber-500" /> {t('enterPassword')}</h3>
              <button onClick={() => setUnlockBranchPrompt({ isOpen: false, targetBranch: null, passwordInput: '', error: '' })} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4 font-medium">{t('branchLocked')}</p>
            <input type="password" value={unlockBranchPrompt.passwordInput} onChange={e => setUnlockBranchPrompt({ ...unlockBranchPrompt, passwordInput: e.target.value, error: '' })} onKeyDown={e => e.key === 'Enter' && handleUnlockBranch()} className="w-full border-2 border-gray-200 rounded-xl p-3 mb-2 focus:ring-4 focus:ring-amber-50 focus:border-amber-500 outline-none transition-all font-mono" autoFocus />
            {unlockBranchPrompt.error && <p className="text-rose-500 text-xs font-bold mb-4">{unlockBranchPrompt.error}</p>}
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setUnlockBranchPrompt({ isOpen: false, targetBranch: null, passwordInput: '', error: '' })} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleUnlockBranch} className="px-5 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 shadow-md transition-all">{t('unlock')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Class Modal */}
      {isAddClassModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">{t('createClass')}</h3>
              <button onClick={() => setIsAddClassModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('className')} *</label>
                <input type="text" value={newClassName} onChange={e => setNewClassName(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-gray-800" placeholder="e.g. Form 1 Math" autoFocus />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('classType')}</label>
                <select value={newClassType} onChange={e => setNewClassType(e.target.value as 'tuition' | 'daycare')} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-gray-800 bg-white">
                  <option value="tuition">{t('tuition')}</option>
                  <option value="daycare">{t('daycare')}</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsAddClassModalOpen(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleAddClass} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">{t('create')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Existing Student Modal */}
      {isAddExistingModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-gray-100 transform transition-all max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><UserPlus className="w-6 h-6 text-violet-500" /> {t('addExisting')}</h3>
              <button onClick={() => setIsAddExistingModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-4 shrink-0">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder={t('searchStudent')} value={existingSearch} onChange={e => setExistingSearch(e.target.value)} className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-violet-50 focus:border-violet-500 outline-none transition-all font-medium" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto min-h-[300px] border border-gray-100 rounded-xl bg-gray-50 p-2">
              {globalBranchStudents
                .filter(s => !s.joinedClasses?.includes(activeClassId) && s.name.toLowerCase().includes(existingSearch.toLowerCase()))
                .map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-white mb-2 rounded-lg border border-gray-100 hover:border-violet-200 transition-colors">
                    <div>
                      <p className="font-bold text-gray-800">{student.name}</p>
                      <p className="text-xs text-gray-500 font-mono">U: {student.username}</p>
                    </div>
                    <button onClick={() => handleAddSelectedExistingStudents()} className="px-4 py-1.5 bg-violet-100 text-violet-700 font-bold rounded-lg hover:bg-violet-200 transition-colors flex items-center gap-1 text-sm"><Plus className="w-4 h-4" /> {t('add')}</button>
                  </div>
              ))}
              {globalBranchStudents.filter(s => !s.joinedClasses?.includes(activeClassId) && s.name.toLowerCase().includes(existingSearch.toLowerCase())).length === 0 && (
                <div className="h-full flex items-center justify-center text-gray-400 font-medium italic">{t('noStudents')}</div>
              )}
            </div>
            <div className="flex justify-end mt-6 shrink-0">
              <button onClick={() => setIsAddExistingModalOpen(false)} className="px-6 py-2.5 bg-gray-100 text-gray-600 font-bold rounded-xl hover:bg-gray-200 transition-colors">{t('close')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Student Modal (Add/Edit) */}
      {isStudentModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">{editingStudent ? t('editStudent') : t('addStudent')}</h3>
              <button onClick={() => setIsStudentModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('name')} *</label>
                <input type="text" value={newStudentData.name} onChange={e => setNewStudentData({...newStudentData, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-gray-800" placeholder="Student Name" autoFocus />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('username')} *</label>
                  <input type="text" value={newStudentData.username} onChange={e => setNewStudentData({...newStudentData, username: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-sm" placeholder="Unique ID" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('password')} *</label>
                  <input type="text" value={newStudentData.password} onChange={e => setNewStudentData({...newStudentData, password: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-sm" placeholder="Password" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('gender')}</label>
                  <select value={newStudentData.gender} onChange={e => setNewStudentData({...newStudentData, gender: e.target.value as 'Male' | 'Female'})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-gray-800 bg-white">
                    <option value="Male">{lang==='zh'?'男':'Male'}</option>
                    <option value="Female">{lang==='zh'?'女':'Female'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('contact')}</label>
                  <input type="text" value={newStudentData.contact} onChange={e => setNewStudentData({...newStudentData, contact: e.target.value})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-mono text-sm" placeholder="+60123456789" />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsStudentModalOpen(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleSaveStudent} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {isAddingLesson && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800">{t('createLesson')}</h3>
              <button onClick={() => setIsAddingLesson(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">{t('date')} *</label>
                <input type="date" value={newLessonDate} onChange={e => setNewLessonDate(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all font-bold text-gray-800" autoFocus />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-8">
              <button onClick={() => setIsAddingLesson(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleAddLesson} className="px-5 py-2.5 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 shadow-md hover:shadow-lg transition-all">{t('create')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Rename Prompt Modal */}
      {renameClassPrompt.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Edit2 className="w-5 h-5 text-blue-500" /> {t('renameClass')}</h3>
              <button onClick={() => setRenameClassPrompt({ isOpen: false, classId: '', newName: '' })} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <input type="text" value={renameClassPrompt.newName} onChange={e => setRenameClassPrompt({ ...renameClassPrompt, newName: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleRenameClassSubmit()} className="w-full border-2 border-gray-200 rounded-xl p-3 mb-2 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 outline-none transition-all font-bold text-gray-800" autoFocus />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setRenameClassPrompt({ isOpen: false, classId: null, newName: '' })} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleRenameClassSubmit} className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md transition-all">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {renameLessonPrompt.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Edit2 className="w-5 h-5 text-teal-500" /> {t('renameLesson')}</h3>
              <button onClick={() => setRenameLessonPrompt({ isOpen: false, lessonId: '', newDate: '' })} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <input type="date" value={renameLessonPrompt.newDate} onChange={e => setRenameLessonPrompt({ ...renameLessonPrompt, newDate: e.target.value })} onKeyDown={e => e.key === 'Enter' && handleRenameLessonSubmit()} className="w-full border-2 border-gray-200 rounded-xl p-3 mb-2 focus:ring-4 focus:ring-teal-50 focus:border-teal-500 outline-none transition-all font-bold text-gray-800" autoFocus />
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setRenameLessonPrompt({ isOpen: false, lessonId: null, newDate: '' })} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleRenameLessonSubmit} className="px-5 py-2.5 bg-teal-500 text-white font-bold rounded-xl hover:bg-teal-600 shadow-md transition-all">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmAction.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all text-center">
            <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">{t('confirmDelete')}</h3>
            <p className="text-gray-500 mb-8 font-medium">{confirmAction.text}</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setConfirmAction({ isOpen: false, text: '', onConfirm: null })} className="px-6 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={() => { if(confirmAction.onConfirm) (confirmAction as any).onConfirm(); setConfirmAction({ isOpen: false, text: '', onConfirm: null }); }} className="px-6 py-2.5 bg-rose-500 text-white font-bold rounded-xl hover:bg-rose-600 shadow-md transition-all">{t('delete')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Columns Modal */}
      {isColumnModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[90vh] overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-gray-50 to-blue-50">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Settings className="w-5 h-5 text-blue-500" /> {t('manageColumns')}</h3>
              <button onClick={() => setIsColumnModalOpen(false)} className="text-gray-400 hover:text-gray-600 bg-white rounded-full p-1"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50/50">
              {/* Load Template Section */}
              <div className="mb-6 bg-white p-4 rounded-xl border border-blue-100 shadow-sm">
                <p className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-3">{lang === 'zh' ? '加载已保存的模板' : 'Load Saved Template'}</p>
                <div className="flex gap-3 items-center">
                  <select 
                    className="flex-1 border-2 border-gray-200 rounded-xl p-2.5 text-sm font-bold text-gray-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all"
                    value={selectedColumnTemplateId}
                    onChange={(e) => {
                      const tpl = savedTemplates.find(t => t.id === e.target.value);
                      if (tpl) {
                        setActiveColumns(tpl.columns);
                        setSelectedColumnTemplateId(tpl.id);
                        showToast(lang === 'zh' ? `已加载模板: ${tpl.name}` : `Loaded template: ${tpl.name}`);
                      }
                    }}
                  >
                    <option value="" disabled>{lang === 'zh' ? '-- 选择模板 --' : '-- Select Template --'}</option>
                    {savedTemplates.map(t => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                  <button 
                    onClick={() => {
                      const currentBranch = branches.find(b => b.id === activeBranchId);
                      if (currentBranch) {
                        const updatedBranch = { ...currentBranch, defaultColumns: activeColumns };
                        setBranches(prev => prev.map(b => b.id === activeBranchId ? updatedBranch : b));
                        syncSet('branches', activeBranchId, updatedBranch);
                        showToast(lang === 'zh' ? "✅ 设为默认成功！新班级将使用此模板" : "✅ Set as default successful! New classes will use this template");
                      }
                    }}
                    className="px-4 py-2.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-xl hover:bg-indigo-100 transition-colors whitespace-nowrap"
                  >
                    {lang === 'zh' ? '设为默认' : 'Set as Default'}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {activeColumns.map((col, idx) => (
                  <div key={col.id} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-shadow">
                    <div className="flex flex-col gap-1 mt-1 shrink-0">
                      {/* 上移按钮 */}
                      <button onClick={() => {
                        if (idx > 0) {
                          const newCols = [...activeColumns];
                          [newCols[idx - 1], newCols[idx]] = [newCols[idx], newCols[idx - 1]];
                          setActiveColumns(newCols);
                        }
                      }} disabled={idx === 0} className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-30 transition-colors">
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      {/* 下移按钮 */}
                      <button onClick={() => {
                        if (idx < activeColumns.length - 1) {
                          const newCols = [...activeColumns];
                          [newCols[idx + 1], newCols[idx]] = [newCols[idx], newCols[idx + 1]];
                          setActiveColumns(newCols);
                        }
                      }} disabled={idx === activeColumns.length - 1} className="p-1 rounded text-gray-400 hover:bg-gray-100 hover:text-blue-600 disabled:opacity-30 transition-colors">
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex-1">
                      {/* 列名输入框 */}
                      <input type="text" value={col.name} onChange={(e) => { const newCols = [...activeColumns]; newCols[idx].name = e.target.value; setActiveColumns(newCols); }} className="font-bold text-sm w-full border-2 border-gray-100 rounded-lg p-2.5 focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none transition-all" />
                      {/* 如果类型是 select，显示选项输入框 */}
                      {col.type === 'select' && (
                        <input type="text" value={Array.isArray(col.options) ? col.options.join(', ') : col.options} onChange={(e) => { const newCols = [...activeColumns]; newCols[idx].options = e.target.value.split(',').map(s => s.trim()); setActiveColumns(newCols); }} placeholder="Options (comma separated)" className="mt-3 text-xs w-full text-gray-600 font-medium border-2 border-dashed border-gray-200 rounded-lg p-2.5 focus:ring-4 focus:ring-blue-50 focus:border-blue-400 outline-none bg-gray-50 focus:bg-white transition-all" />
                      )}
                    </div>
                    {/* 列类型选择 */}
                    <select value={col.type} onChange={(e) => { const newCols = [...activeColumns]; newCols[idx].type = e.target.value; setActiveColumns(newCols); }} className="text-sm font-bold text-gray-700 border-2 border-gray-100 rounded-lg p-2.5 bg-gray-50 focus:bg-white focus:border-blue-400 outline-none cursor-pointer transition-all">
                      <option value="text">Text Input</option>
                      <option value="textarea">Multi-line Text</option>
                      <option value="select">Dropdown</option>
                    </select>
                    {/* 删除列按钮 (Teacher Comment 列不允许删除) */}
                    <button onClick={() => { if(col.id === 'teacher_comment') return; setActiveColumns(activeColumns.filter((_, i) => i !== idx)); }} className={`p-2.5 rounded-lg border-2 border-transparent transition-all ${col.id === 'teacher_comment' ? 'text-gray-300 cursor-not-allowed' : 'text-rose-400 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100'}`} disabled={col.id === 'teacher_comment'}><Trash2 className="w-5 h-5" /></button>
                  </div>
                ))}
              </div>
              {/* 添加新列按钮 */}
              <button onClick={() => setActiveColumns([...activeColumns, { id: `col_${Date.now()}`, name: 'New Column', type: 'text', options: [] }])} className="mt-5 flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 border-dashed px-4 py-3 rounded-xl w-full justify-center transition-colors">
                <Plus className="w-5 h-5" /> {t('addNewColumn')}
              </button>
              {/* 保存为新模板区域 */}
              <div className="mt-8 border-t-2 border-gray-100 pt-6 flex items-end gap-3">
                 <div className="flex-1">
                   <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-2">{t('saveAsNewTemplate')}</p>
                   <input type="text" placeholder={t('templateName')} value={newTemplateName} onChange={e => setNewTemplateName(e.target.value)} className="w-full border-2 border-gray-200 rounded-xl p-3 text-sm font-bold outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 transition-all" />
                 </div>
                 <button onClick={handleSaveAsNewTemplate} className="px-6 py-3 bg-gray-800 text-white text-sm font-bold rounded-xl hover:bg-gray-900 shadow-md hover:shadow-lg transition-all whitespace-nowrap">
                   {t('saveTemplateBtn')}
                 </button>
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 bg-white flex justify-end">
              <button onClick={() => setIsColumnModalOpen(false)} className="px-8 py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 shadow-md hover:shadow-lg transition-all">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Theme Modal */}
      {isThemeModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform transition-all">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Palette className="w-6 h-6 text-pink-500" /> {t('tableTheme')}</h3>
              <button onClick={() => setIsThemeModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(THEMES).map(([key, theme]) => (
                <button key={key} onClick={() => handleUpdateTheme(key)} className={`p-4 rounded-2xl border-2 text-left transition-all ${activeClass?.theme === key ? 'border-pink-500 shadow-md ring-4 ring-pink-50' : 'border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}>
                  <div className={`h-8 w-full rounded-lg mb-3 ${theme.head}`}></div>
                  <p className="font-bold text-gray-800 capitalize">{key}</p>
                </button>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button onClick={() => setIsThemeModalOpen(false)} className="px-6 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-black shadow-md transition-all">Done</button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform transition-all text-center">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><FileUp className="w-6 h-6 text-blue-500" /> {t('importExcel')}</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-8 font-medium text-left">{t('importDesc')}</p>
            <label className="cursor-pointer block w-full border-2 border-dashed border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-12 rounded-2xl transition-all">
              <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <span>{t('clickToUpload')}</span>
              <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      )}

      {/* Image Import Modal */}
      {isImageImportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border border-gray-100 transform transition-all text-center">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Camera className="w-6 h-6 text-indigo-500" /> {t('scanImage')}</h3>
              <button onClick={() => setIsImageImportModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-8 font-medium text-left">{lang === 'zh' ? '上传包含学生名单或考勤记录的图片，AI 将自动分析并导入数据。' : 'Upload an image of a student roster or attendance sheet. AI will analyze and import the data.'}</p>
            
            {isScanningImage ? (
              <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="text-indigo-600 font-bold animate-pulse">{lang === 'zh' ? 'AI 正在分析图片...' : 'AI is analyzing image...'}</p>
              </div>
            ) : (
              <label className="cursor-pointer block w-full border-2 border-dashed border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-12 rounded-2xl transition-all">
                <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <span>{t('clickToUpload')}</span>
                <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
              </label>
            )}
          </div>
        </div>
      )}

      {isSmartFillModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-gray-100 transform transition-all max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Wand2 className="w-6 h-6 text-purple-500" /> {t('smartFill')}</h3>
              <button onClick={() => { setIsSmartFillModalOpen(false); setSmartFillStep(1); setTemplateFile(null); setTemplateHeaders([]); setColumnMapping({}); }} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              {smartFillStep === 1 && (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 mb-8 font-medium text-left">{lang === 'zh' ? '上传您的 Excel 模板。系统将读取表头，并允许您将系统数据映射到模板的列中。' : 'Upload your Excel template. The system will read the headers and allow you to map system data to the template columns.'}</p>
                  <label className="cursor-pointer block w-full border-2 border-dashed border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-600 font-bold py-12 rounded-2xl transition-all">
                    <FileSpreadsheet className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <span>{t('clickToUpload')}</span>
                    <input type="file" accept=".xlsx, .xls" onChange={handleTemplateUpload} className="hidden" />
                  </label>
                </div>
              )}

              {smartFillStep === 2 && (
                <div>
                  <p className="text-sm text-gray-500 mb-6 font-medium">{lang === 'zh' ? '请将模板中的列与系统中的数据字段对应起来。' : 'Please map the columns in your template to the data fields in the system.'}</p>
                  <div className="space-y-4">
                    {templateHeaders.map((header: string) => (
                      <div key={header} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <span className="font-bold text-gray-700 w-1/3 truncate" title={header}>{header}</span>
                        <ArrowRight className="w-4 h-4 text-gray-300 shrink-0 mx-2" />
                        <select 
                          value={columnMapping[header] || ''} 
                          onChange={e => setColumnMapping({...columnMapping, [header]: e.target.value})}
                          className="flex-1 border-2 border-gray-200 rounded-lg p-2 focus:ring-2 focus:ring-purple-500 outline-none font-bold text-gray-700 bg-white"
                        >
                          <option value="">-- {lang === 'zh' ? '忽略此列' : 'Ignore this column'} --</option>
                          <optgroup label="Student Info">
                            <option value="student_name">{t('name')}</option>
                            <option value="student_username">{t('username')}</option>
                            <option value="student_gender">{t('gender')}</option>
                            <option value="student_contact">{t('contact')}</option>
                          </optgroup>
                          <optgroup label="Lesson Data">
                            {activeColumns.map(col => (
                              <option key={col.id} value={`col_${col.id}`}>{col.name}</option>
                            ))}
                          </optgroup>
                        </select>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => { setIsSmartFillModalOpen(false); setSmartFillStep(1); setTemplateFile(null); setTemplateHeaders([]); setColumnMapping({}); }} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              {smartFillStep === 2 && (
                <button onClick={processSmartFillExport} className="px-6 py-2.5 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 shadow-md transition-all flex items-center gap-2">
                  <Download className="w-4 h-4" /> {t('exportReport')}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {isTemplateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-2xl shadow-2xl border border-gray-100 transform transition-all max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center mb-6 shrink-0">
              <h3 className="text-xl font-extrabold text-gray-800 flex items-center gap-2"><Settings className="w-6 h-6 text-green-500" /> {editingTemplateType === 'billing' ? t('templateBilling') : t('msgTemplate')}</h3>
              <button onClick={() => setIsTemplateModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            {editingTemplateType !== 'billing' && (
              <div className="flex gap-2 mb-6 overflow-x-auto pb-2 shrink-0">
                {(['login', 'absent', 'homework', 'comment'] as const).map(type => (
                  <button key={type} onClick={() => setEditingTemplateType(type)} className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all ${editingTemplateType === type ? 'bg-green-100 text-green-700 shadow-sm' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                    {t(`template${type.charAt(0).toUpperCase() + type.slice(1)}`)}
                  </button>
                ))}
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">English Template</label>
                  <textarea value={editingTemplates[editingTemplateType]?.en || ''} onChange={e => setEditingTemplates({...editingTemplates, [editingTemplateType]: {...editingTemplates[editingTemplateType], en: e.target.value}})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-mono text-sm h-40 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Chinese Template</label>
                  <textarea value={editingTemplates[editingTemplateType]?.zh || ''} onChange={e => setEditingTemplates({...editingTemplates, [editingTemplateType]: {...editingTemplates[editingTemplateType], zh: e.target.value}})} className="w-full border-2 border-gray-200 rounded-xl p-3 focus:ring-4 focus:ring-green-50 focus:border-green-500 outline-none transition-all font-mono text-sm h-40 resize-none" />
                </div>
              </div>
              <div className="mt-6 bg-blue-50 p-4 rounded-xl border border-blue-100">
                <h4 className="text-sm font-bold text-blue-800 mb-2 flex items-center gap-1.5"><Info className="w-4 h-4" /> Available Variables</h4>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-blue-600">
                  {editingTemplateType === 'login' && <><span>{'{name}'}</span><span>{'{username}'}</span><span>{'{password}'}</span></>}
                  {editingTemplateType === 'absent' && <><span>{'{name}'}</span><span>{'{date}'}</span></>}
                  {editingTemplateType === 'homework' && <><span>{'{name}'}</span><span>{'{date}'}</span></>}
                  {editingTemplateType === 'comment' && <><span>{'{name}'}</span><span>{'{date}'}</span><span>{'{comment}'}</span></>}
                  {editingTemplateType === 'billing' && <><span>{'{name}'}</span><span>{'{month}'}</span><span>{'{amount}'}</span><span>{'{total}'}</span><span>{'{details}'}</span></>}
                </div>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end gap-3 shrink-0">
              <button onClick={() => setIsTemplateModalOpen(false)} className="px-5 py-2.5 text-gray-500 font-bold hover:bg-gray-100 rounded-xl transition-colors">{t('cancel')}</button>
              <button onClick={handleSaveTemplates} className="px-6 py-2.5 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 shadow-md transition-all">{t('save')}</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Language Selection Modal */}
      {aiLangModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl border border-gray-100 transform transition-all text-center">
            <div className="w-16 h-16 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-fuchsia-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-800 mb-2">{lang === 'zh' ? '选择评语语言' : 'Select Comment Language'}</h3>
            <p className="text-gray-500 mb-6 font-medium text-sm">{lang === 'zh' ? '请选择 AI 生成评语的目标语言。' : 'Please select the target language for the AI generated comments.'}</p>
            
            <div className="flex flex-col gap-3 text-left mb-6">
              <label className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedAiLangs.includes('English')}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedAiLangs([...selectedAiLangs, 'English']);
                    else setSelectedAiLangs(selectedAiLangs.filter(l => l !== 'English'));
                  }}
                  className="w-5 h-5 text-fuchsia-500 rounded focus:ring-fuchsia-500"
                />
                <span className="font-bold text-gray-700">English</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedAiLangs.includes('Chinese')}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedAiLangs([...selectedAiLangs, 'Chinese']);
                    else setSelectedAiLangs(selectedAiLangs.filter(l => l !== 'Chinese'));
                  }}
                  className="w-5 h-5 text-fuchsia-500 rounded focus:ring-fuchsia-500"
                />
                <span className="font-bold text-gray-700">中文 (Chinese)</span>
              </label>
              <label className="flex items-center gap-3 p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input 
                  type="checkbox" 
                  checked={selectedAiLangs.includes('Malay')}
                  onChange={(e) => {
                    if (e.target.checked) setSelectedAiLangs([...selectedAiLangs, 'Malay']);
                    else setSelectedAiLangs(selectedAiLangs.filter(l => l !== 'Malay'));
                  }}
                  className="w-5 h-5 text-fuchsia-500 rounded focus:ring-fuchsia-500"
                />
                <span className="font-bold text-gray-700">Bahasa Melayu (Malay)</span>
              </label>
            </div>

            <button 
              disabled={selectedAiLangs.length === 0}
              onClick={() => { 
                setAiLangModal({ ...aiLangModal, isOpen: false }); 
                if (aiLangModal.targetId === 'ALL') { 
                  generateAllComments(selectedAiLangs); 
                } else { 
                  generateAiComment(aiLangModal.targetId, selectedAiLangs); 
                } 
              }} 
              className="w-full py-3.5 bg-fuchsia-500 hover:bg-fuchsia-600 text-white font-bold rounded-xl transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {lang === 'zh' ? '生成评语' : 'Generate Comments'}
            </button>
            <button onClick={() => setAiLangModal({ isOpen: false, targetId: null })} className="mt-4 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors">{t('cancel')}</button>
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toastMessage && (
          <div className="bg-gray-900 text-white px-6 py-3 rounded-xl shadow-2xl font-bold flex items-center gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 pointer-events-auto">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            {toastMessage}
          </div>
        )}
      </div>

    </div>
  );
}
