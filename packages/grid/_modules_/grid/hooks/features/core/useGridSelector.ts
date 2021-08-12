import { GridApiRef } from '../../../models/api/gridApiRef';
import { useGridState } from './useGridState';

export const useGridSelector = <State>(
  apiRef: GridApiRef | undefined,
  selector: (state: any) => State,
) => {
  const [state] = useGridState(apiRef!);
  return selector(state);
};
