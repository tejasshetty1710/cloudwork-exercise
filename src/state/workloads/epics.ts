import { combineEpics, Epic } from 'redux-observable';
import { filter, map, tap, ignoreElements, mergeMap, delay } from 'rxjs/operators';
import { isActionOf } from 'typesafe-actions';
import { RootAction, RootState } from '../reducer';
import {created, submit, updateStatus, cancel as stop }from './actions';
import { from } from 'rxjs';
import {WorkloadService} from './services';


type AppEpic = Epic<RootAction, RootAction, RootState>;
const { create, checkStatus, cancel } = new WorkloadService();

const startWorkload: AppEpic = (action$, state$) => (
	action$.pipe(
    filter(isActionOf(submit)),
    mergeMap(async ({ payload }) => {
		const creeatedWorkLoad = await create({complexity: payload.complexity});
		return created(creeatedWorkLoad);
	})
  )
);

const cancelWorkload: AppEpic = (action$) =>
	action$.pipe(
	  filter(isActionOf(stop)),
	  mergeMap(async ({ payload }) => {
		const curr = await checkStatus(payload);
		if (curr.status === "WORKING") {
		  const work = await cancel(payload);
		  return updateStatus(work);
		}
		return updateStatus(curr);
	  })
	);



export const epics = combineEpics(
  startWorkload,
  cancelWorkload
);

export default epics;
