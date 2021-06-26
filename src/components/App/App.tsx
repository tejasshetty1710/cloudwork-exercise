import React, { PureComponent } from 'react';

import { WorkloadListContainer } from '../WorkloadList';
import { WorkloadFormContainer } from '../WorkloadForm';
import './App.css';


class App extends PureComponent {
  render() {
    return (
      <div className="container">
        <div className="container-title">
        <h1>CloudWork</h1>
        </div>
        <h2 className="container-list__title">Workloads</h2>
        <div className="workload-container">
        <div className="container-list">       
          <WorkloadListContainer />
        </div>
        <h2 className="container-list__title-mobile">Workloads</h2>
        <div className="container-form">
          <WorkloadFormContainer />
        </div>
        </div>
      </div>
    );
  }
}

export default App;
