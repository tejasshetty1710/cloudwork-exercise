import React, { PureComponent } from 'react';

import { WorkloadListContainer } from '../WorkloadList';
import { WorkloadFormContainer } from '../WorkloadForm';
import './App.css';


class App extends PureComponent {
  render() {
    return (
      <div className="flex-wrapper">
        <div className="container">
          <h1 className="header-wrapper">CloudWork</h1>
          <div className="horizontal-line"></div>
          <div className="content-wrapper">
            <div className="workload-list-wrapper">  
              <h2 className="workload-list-title">Workloads</h2>     
                <WorkloadListContainer />
            </div>
              <div className="form-wrapper">
              <WorkloadFormContainer />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
