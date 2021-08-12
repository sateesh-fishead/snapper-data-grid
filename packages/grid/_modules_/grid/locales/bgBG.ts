import { bgBG as bgBGCore } from '@material-ui/core/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const bgBGGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Няма редове',
  // noResultsOverlayLabel: 'No results found.',
  errorOverlayDefaultLabel: 'Възникна грешка.',

  // Density selector toolbar button text
  toolbarDensity: 'Гъстота',
  toolbarDensityLabel: 'Гъстота',
  toolbarDensityCompact: 'Компактна',
  toolbarDensityStandard: 'Стандартна',
  toolbarDensityComfortable: 'Комфортна',

  // GridColumns selector toolbar button text
  toolbarColumns: 'Колони',
  toolbarColumnsLabel: 'Покажи селектора на колони',

  // Filters toolbar button text
  toolbarFilters: 'Филтри',
  toolbarFiltersLabel: 'Покажи Филтрите',
  toolbarFiltersTooltipHide: 'Скрий Филтрите',
  toolbarFiltersTooltipShow: 'Покажи Филтрите',
  toolbarFiltersTooltipActive: (count) => `${count} активни филтри`,

  // GridColumns panel text
  columnsPanelTextFieldLabel: 'Намери колона',
  columnsPanelTextFieldPlaceholder: 'Заглавие на колона',
  columnsPanelDragIconLabel: 'Пренареди на колона',
  columnsPanelShowAllButton: 'Покажи Всички',
  columnsPanelHideAllButton: 'Скрий Всички',

  // Filter panel text
  filterPanelAddFilter: 'Добави Филтър',
  filterPanelDeleteIconLabel: 'Изтрий',
  filterPanelOperators: 'Оператори',
  filterPanelOperatorAnd: 'И',
  filterPanelOperatorOr: 'Или',
  filterPanelColumns: 'Колони',

  // Filter operators text
  filterOperatorContains: 'съдържа',
  filterOperatorEquals: 'равно',
  filterOperatorStartsWith: 'започва с',
  filterOperatorEndsWith: 'завършва с',
  filterOperatorIs: 'е',
  filterOperatorNot: 'не е',
  filterOperatorAfter: 'е след',
  filterOperatorOnOrAfter: 'е на или след',
  filterOperatorBefore: 'е преди',
  filterOperatorOnOrBefore: 'е на или преди',
  filterPanelInputLabel: 'Стойност',
  filterPanelInputPlaceholder: 'Стойност на филтъра',
  // filterOperatorIsEmpty: 'is empty',
  // filterOperatorIsNotEmpty: 'is not empty',

  // Column menu text
  columnMenuLabel: 'Меню',
  columnMenuShowColumns: 'Покажи колоните',
  columnMenuFilter: 'Филтри',
  columnMenuHideColumn: 'Скрий',
  columnMenuUnsort: 'Отмени сортирането',
  columnMenuSortAsc: 'Сортирай по възходящ ред',
  columnMenuSortDesc: 'Сортирай по низходящ ред',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count} активни филтри`,
  columnHeaderFiltersLabel: 'Покажи Филтрите',
  columnHeaderSortIconLabel: 'Сортирай',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} избрани редове`
      : `${count.toLocaleString()} избран ред`,

  // Total rows footer text
  footerTotalRows: 'Общо Rедове:',

  // Total visible rows footer text
  // footerTotalVisibleRows: (visibleCount, totalCount) =>
  //   `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,
};

export const bgBG: Localization = getGridLocalization(bgBGGrid, bgBGCore);
