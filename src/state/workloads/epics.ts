import {combineEpics, Epic} from 'redux-observable';
import { from } from 'rxjs';

import {
	filter,
	mergeMap,
  delay,
} from 'rxjs/operators';

import {isActionOf} from 'typesafe-actions';

import {RootAction, RootState} from '../reducer';
import * as workloadsActions from './actions';
import {WorkloadService} from './services';

type AppEpic = Epic<RootAction, RootAction, RootState>;

const WorkloadApi = new WorkloadService();


const createWorkload: AppEpic = (action$, state$) =>
	action$.pipe(
		filter(isActionOf(workloadsActions.submit)),
		mergeMap((action) =>
			WorkloadApi.create({complexity: action.payload.complexity}).then(
				(payload) => workloadsActions.created(payload)
			)
		)
	);

const monitorWorkload: AppEpic = (action$, state$, s) =>
	action$.pipe(
		filter(isActionOf(workloadsActions.created)),
		mergeMap(
      action =>	from(new Promise(resolve => setTimeout(() => resolve(true), 100))).pipe(	
        delay(action.payload.completeDate),
        mergeMap(() =>
					WorkloadApi.checkStatus({id: action.payload.id}).then(
						(payload) => {
              return workloadsActions.updateStatus({id: payload.id, status: payload.status});
            }
					)))
				)
			);

const cancelWorkload: AppEpic = (action$, state$) =>
	action$.pipe(
		filter(isActionOf(workloadsActions.cancel)),
		mergeMap((action) =>
			WorkloadApi.checkStatus({id: action.payload.id}).then((payload) => {
				if (payload.status === 'SUCCESS')
					return workloadsActions.updateStatus(payload);
				else {
					return WorkloadApi.cancel({id: action.payload.id}).then(
						(payload) => workloadsActions.updateStatus(payload)
					);
				}
			})
		)
	);

export const epics = combineEpics(
  monitorWorkload,
	createWorkload,
	cancelWorkload
);

export default epics;
