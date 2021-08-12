import { ukUA as ukUACore } from '@material-ui/core/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

export const ukUAGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Немає рядків',
  // noResultsOverlayLabel: 'No results found.',
  errorOverlayDefaultLabel: 'Виявлено помилку.',

  // Density selector toolbar button text
  toolbarDensity: 'Висота рядка',
  toolbarDensityLabel: 'Висота рядка',
  toolbarDensityCompact: 'Компактний',
  toolbarDensityStandard: 'Стандартний',
  toolbarDensityComfortable: 'Комфортний',

  // Columns selector toolbar button text
  toolbarColumns: 'Стовпці',
  toolbarColumnsLabel: 'Виділіть стовпці',

  // Filters toolbar button text
  toolbarFilters: 'Фільтри',
  toolbarFiltersLabel: 'Показати фільтри',
  toolbarFiltersTooltipHide: 'Сховати фільтри',
  toolbarFiltersTooltipShow: 'Показати фільтри',
  toolbarFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} активні фільтри` : `${count} активний фільтр`,

  // Export selector toolbar button text
  toolbarExport: 'Експорт',
  toolbarExportLabel: 'Експорт',
  toolbarExportCSV: 'Завантажити у форматі CSV',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Знайти стовпець',
  columnsPanelTextFieldPlaceholder: 'Заголовок стовпця',
  columnsPanelDragIconLabel: 'Змінити порядок стовпця',
  columnsPanelShowAllButton: 'Показати усі',
  columnsPanelHideAllButton: 'Сховати усі',

  // Filter panel text
  filterPanelAddFilter: 'Додати фільтр',
  filterPanelDeleteIconLabel: 'Видалити',
  filterPanelOperators: 'Оператори',
  filterPanelOperatorAnd: 'І',
  filterPanelOperatorOr: 'Або',
  filterPanelColumns: 'Стовпці',
  filterPanelInputLabel: 'Значення',
  filterPanelInputPlaceholder: 'Значення фільтра',

  // Filter operators text
  filterOperatorContains: 'містить',
  filterOperatorEquals: 'дорівнює',
  filterOperatorStartsWith: 'починається з',
  filterOperatorEndsWith: 'закінчується на',
  filterOperatorIs: 'дорівнює',
  filterOperatorNot: 'не',
  filterOperatorAfter: 'більше ніж',
  filterOperatorOnOrAfter: 'більше або дорівнює',
  filterOperatorBefore: 'менше ніж',
  filterOperatorOnOrBefore: 'менше або дорівнює',
  // filterOperatorIsEmpty: 'is empty',
  // filterOperatorIsNotEmpty: 'is not empty',

  // Filter values text
  filterValueAny: 'будь-який',
  filterValueTrue: 'правда',
  filterValueFalse: 'помилковий',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Показати стовпці',
  columnMenuFilter: 'Фільтр',
  columnMenuHideColumn: 'Сховати',
  columnMenuUnsort: 'Скасувати сортування',
  columnMenuSortAsc: 'Сортувати за зростанням',
  columnMenuSortDesc: 'Сортувати за спаданням',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} активні фільтри` : `${count} активний фільтр`,
  columnHeaderFiltersLabel: 'Показати фільтри',
  columnHeaderSortIconLabel: 'Сортувати',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} вибрані рядки`
      : `${count.toLocaleString()} вибраний рядок`,

  // Total rows footer text
  footerTotalRows: 'Всього рядків:',

  // Total visible rows footer text
  // footerTotalVisibleRows: (visibleCount, totalCount) =>
  //   `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Вибір прапорця',

  // Boolean cell text
  booleanCellTrueLabel: 'правда',
  booleanCellFalseLabel: 'помилковий',
};

export const ukUA: Localization = getGridLocalization(ukUAGrid, ukUACore);
