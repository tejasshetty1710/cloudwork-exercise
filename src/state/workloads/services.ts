import moment from 'moment';

import { Status } from './types';


export class WorkloadService {  
  
  private workLoads: { [key in number]: Work } = {};
  private counter = 0;
  

  private getWorkload(id: number): Work | undefined {
    return this.workLoads[id]; 
  }

  private completeWorkload(work: Work) {
    work.status = this.counter % 2 
      ? 'SUCCESS'
      : 'FAILURE';
  }


  public create({ complexity }: { complexity: number }) {
    const id = this.counter++;
    const status = 'WORKING';
    
    const seconds = complexity;
    const completeDate = moment().add(complexity, 'second').toDate();
    const timer = setTimeout(() => this.completeWorkload(work), seconds);

    const work: Work = {
      id,
      complexity,
      status,
      completeDate,
      timer,
    }
    this.workLoads[id] = work;

    return Promise.resolve({ id, complexity, completeDate });
  }

  public checkStatus({ id }: { id: number }) {
    const work = this.getWorkload(id);
    if (!work) return Promise.reject('Workload not found');
    return Promise.resolve(work);
  }

  public cancel({ id }: { id: number }) {
    const work = this.getWorkload(id);
    if (!work) return Promise.reject('Workload not found');
    if (work.status !== 'WORKING') return Promise.reject('Workload cannot be canceled');
    
    clearTimeout(work.timer)
    work.status = 'CANCELED';

    return Promise.resolve(work);
  }
}

interface Work {
  id: number;
  complexity: number;
  completeDate: Date;
  status: Status;
  timer: NodeJS.Timeout;
}
