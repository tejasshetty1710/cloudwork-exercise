import { combineEpics, Epic } from 'redux-observable';
import { filter, map, tap, ignoreElements, mergeMap, delay } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootAction, RootState } from '../reducer';
import * as workloadsActions from './actions';
import { from } from 'rxjs';
import {WorkloadService} from './services';


type AppEpic = Epic<RootAction, RootAction, RootState>;
const WorkloadServiceInstance = new WorkloadService();

const logWorkloadSubmissions: AppEpic = (action$, state$) => (
  action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    map(action => action.payload),
    tap((payload) => console.log('Workload submitted', payload)),
    ignoreElements(),
  )
);

const startWorkload: AppEpic = (action$, state$) => (
	action$.pipe(
    filter(isActionOf(workloadsActions.submit)),
    mergeMap((action) =>
			WorkloadServiceInstance.create({complexity: action.payload.complexity}).then(
				(payload) => workloadsActions.created(payload)
			)
		)
  )
);



export const epics = combineEpics(
  logWorkloadSubmissions,
  startWorkload
);

export default epics;
