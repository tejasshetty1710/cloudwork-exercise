import React from 'react';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootAction, RootState } from '../../state';
import { cancel } from '../../state/workloads/actions';
import { WorkloadItem, WorkloadItemStateProps } from '../WorkloadItem';
import './WorkloadList.css';
import { Status } from '../../state/workloads/types';


export interface WorkloadListStateProps {
  workloads: WorkloadItemStateProps[];
}

export interface WorkloadListDispatchProps {
  cancelWorkload: (id: number) => void;
}

export interface WorkloadListProps extends 
  WorkloadListStateProps,
  WorkloadListDispatchProps {}

  interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  }
  
  export const Checkbox: React.FunctionComponent<IProps> = ({ children, ...shared }) => {
    return <input {...shared} />
  }


const WorkloadList: React.SFC<WorkloadListProps> = ({ workloads, cancelWorkload }) => {
  const [filter, setFilter] = React.useState<Array<Status>>([]);

  const handleOptionChange = React.useCallback((changeEvent: React.ChangeEvent<HTMLInputElement>) => {
    const {target: { value: currFilter }} = changeEvent
    setFilter((prevFilter) => {
      if(prevFilter.includes(currFilter as Status)) return prevFilter.filter(filters => filters !== currFilter);
      return [...prevFilter, currFilter as Status]
    })
  }, [setFilter, ]);

  const displayWorkloads = React.useMemo(() => workloads.filter((workload) => {
    if(filter.length === 0) return true;
    return filter.includes(workload.status)
  }),[workloads, filter]);

  // TODO: iterate over the enum to generate Checkbox list
  return (<>
  <div className="workload-filter-list">
    <label>
      <Checkbox
        value={Status.SUCCESS}
        type="checkbox"
        checked={filter.includes(Status.SUCCESS)}
        className="workload-filter-checkbox"
        onChange={handleOptionChange}
        disabled={!workloads.length}
      />
      Successful
    </label>
    <label>
      <Checkbox
        value={Status.FAILURE}
        type="checkbox"
        checked={filter.includes(Status.FAILURE)}
        className="workload-filter-checkbox"
        onChange={handleOptionChange}
        disabled={!workloads.length}
      />
      Failed
    </label>
    <label>
      <Checkbox
        value={Status.CANCELLED}
        type="checkbox"
        checked={filter.includes(Status.CANCELLED)}
        className="workload-filter-checkbox"
        onChange={handleOptionChange}
        disabled={!workloads.length}
      />
      Cancelled
    </label>
    <label>
      <Checkbox
        value={Status.WORKING}
        type="checkbox"
        checked={filter.includes(Status.WORKING)}
        className="workload-filter-checkbox"
        onChange={handleOptionChange}
        disabled={!workloads.length}
      />
      Working
    </label>
  </div>
  {!displayWorkloads.length 
    ? (
      <span>No workloads to display</span>
    )
  : (
    <ul className="workload-list">
      {displayWorkloads.map((workload) => (
        <li key={workload.id}>
          <WorkloadItem {...workload} onCancel={() => cancelWorkload(workload.id)} />
        </li>
      ))}
    </ul>
)}
  </>
)};


const mapStateToProps = (state: RootState): WorkloadListStateProps => ({
  workloads: Object.values(state.workloads),
});

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): WorkloadListDispatchProps => ({
  cancelWorkload: (id: number) => dispatch(cancel({ id })),
}) 

const WorkloadListContainer = connect(mapStateToProps, mapDispatchToProps)(WorkloadList);


export {
  WorkloadList,
  WorkloadListContainer,
};

export default WorkloadList;
