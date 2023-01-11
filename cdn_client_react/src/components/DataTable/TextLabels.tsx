import { laguageMap } from "src/layouts/SidebarLayout/Header/LanguageBox";

const getTextLabelsEn = () => ({
  body: {
    noMatch: 'Sorry, no matching records found',
    toolTip: 'Sort',
  },
  pagination: {
    next: 'Next Page',
    previous: 'Previous Page',
    rowsPerPage: 'Rows per page:',
    displayRows: 'of',
    jumpToPage: 'Jump to Page:',
  },
  toolbar: {
    search: 'Search',
    downloadCsv: 'Download CSV',
    print: 'Print',
    viewColumns: 'View Columns',
    filterTable: 'Filter Table',
  },
  filter: {
    all: 'All',
    title: 'FILTERS',
    reset: 'RESET',
  },
  viewColumns: {
    title: 'Show Columns',
    titleAria: 'Show/Hide Table Columns',
  },
  selectedRows: {
    text: 'row(s) selected',
    delete: 'Delete',
    deleteAria: 'Delete Selected Rows',
  },
});

const getTextLabelsTw = () => ({
  body: {
    noMatch: '抱歉，無符合的資料',
    toolTip: '排序'
  },
  pagination: {
    next: '下一頁',
    previous: '上一頁',
    rowsPerPage: '每頁筆數:',
    displayRows: '筆，總筆數',
    jumpToPage: '前往頁數:'
  },
  toolbar: {
    search: '搜尋',
    downloadCsv: '下載 CSV',
    print: '列印',
    viewColumns: '顯示欄位',
    filterTable: '過濾表'
  },
  filter: {
    all: '全選',
    title: '過濾',
    reset: '重置'
  },
  viewColumns: {
    title: '顯示欄位',
    titleAria: '顯示/隱藏，表格欄位'
  },
  selectedRows: {
    text: '選取的項目',
    delete: '刪除',
    deleteAria: '刪除，選取的項目'
  }
});

const getTextLabelsCn = () => ({
  body: {
    noMatch: '抱歉，无符合的资料',
    toolTip: '排序'
  },
  pagination: {
    next: '下一页',
    previous: '上一页',
    rowsPerPage: '每页笔数:',
    displayRows: '笔，总笔数',
    jumpToPage: '前往页数:'
  },
  toolbar: {
    search: '搜寻',
    downloadCsv: '下载 CSV',
    print: '列印',
    viewColumns: '显示栏位',
    filterTable: '过滤表'
  },
  filter: {
    all: '全选',
    title: '过滤',
    reset: '重置'
  },
  viewColumns: {
    title: '显示栏位',
    titleAria: '显示/隐藏，表格栏位'
  },
  selectedRows: {
    text: '选取的项目',
    delete: '删除',
    deleteAria: '删除，选取的项目'
  }
});

const datatableLabelsMap = {
  "en": getTextLabelsEn(),
  "tw": getTextLabelsTw(),
  "cn": getTextLabelsCn(),
}

export const getTextLabelsByLang = (lang: string) => {
  return datatableLabelsMap[laguageMap[lang].value];
}