import { GridState } from '../hooks/features/core/gridState';

export interface GridControlStateItem<TModel> {
  stateId: string;
  propModel?: any;
  stateSelector: (state: GridState) => TModel;
  propOnChange?: (model: TModel, details: any) => void;
  changeEvent: string;
}
