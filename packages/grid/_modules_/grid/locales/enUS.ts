import { enUS as enUSCore } from '@material-ui/core/locale';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';
import { GRID_DEFAULT_LOCALE_TEXT } from '../constants/localeTextConstants';

export const enUS: Localization = getGridLocalization(GRID_DEFAULT_LOCALE_TEXT, enUSCore);
