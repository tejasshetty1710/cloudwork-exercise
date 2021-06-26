import { combineEpics, Epic } from 'redux-observable';
import { filter, mergeMap, delay } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootAction, RootState } from '../reducer';
import {created, submit, updateStatus, cancel as stop } from './actions';
import { from } from 'rxjs';
import {WorkloadService} from './services';


type AppEpic = Epic<RootAction, RootAction, RootState>;
const workloadService = new WorkloadService();

const startWorkload: AppEpic = (action$) => (
	action$.pipe(
    filter(isActionOf(submit)),
    mergeMap(async ({ payload }) => {
		const createdWorkLoad = await workloadService.create({complexity: payload.complexity});
		return created(createdWorkLoad);
	})
  )
);

const cancelWorkload: AppEpic = (action$) =>
	action$.pipe(
	  filter(isActionOf(stop)),
	  mergeMap(async ({ payload }) => {
		const curr = await workloadService.checkStatus(payload);
		if (curr.status === "WORKING") {
		  const work = await workloadService.cancel(payload);
		  return updateStatus(work);
		}
		return updateStatus(curr);
	  })
	);

const pollWorkload: AppEpic = (action$) =>
	action$.pipe(
		filter(isActionOf(created)),
		mergeMap(
			({ payload: { id, completeDate } }) =>	from(new Promise(resolve => setTimeout(() => resolve(true), 0))).pipe(	
				delay(completeDate),
				mergeMap(async () => {
					const workLoad = await workloadService.checkStatus({id});
					return updateStatus({id: workLoad.id, status: workLoad.status});
				})
			)
		)
	);



export const epics = combineEpics(
  startWorkload,
  cancelWorkload,
  pollWorkload
);

export default epics;
