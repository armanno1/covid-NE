import React from 'react';
import { VaccineTotal } from './components';
import styles from './App.module.css';
import { fetchDataVaccines, fetchDataDailyCases, fetchDailyAdm } from './api';
import VisxChart from './components/VisxChart/VisxChart';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

class App extends React.Component {

    state = {
        vaccineData: {},
        casesData: {},
        numDays: 170,
        admData: {}
    }

    async componentDidMount() {
        const updatedVaccineData = await fetchDataVaccines();
        const updatedCasesData = await fetchDataDailyCases();
        const updatedAdmData = await fetchDailyAdm();
        this.setState({vaccineData: updatedVaccineData, casesData: updatedCasesData, admData: updatedAdmData});
    };

    handleNumDaysChange = (event) => {
        const numDays = event.target.value < 175 ? event.target.value : 170;
        this.setState({numDays: numDays})
    }

    handleReset = (event) => {
        this.setState({numDays: 170})
    }

    render() {
        const vaccineData = this.state.vaccineData[0];
        const admData = this.state.admData;
        return (
            <div className={styles.container}>
                <div className={styles.numDaysInputContainer}>
                    Last
                    <input type='form' value={this.state.numDays} className={styles.numDaysInputField} onChange={this.handleNumDaysChange}/>
                    <span>days</span>
                    {this.state.numDays !== 170 && <p onClick={this.handleReset}>(reset)</p>}
                </div>
                <div className={styles.title}>
                    COVID-19 cases North East (UK)
                    <div className={styles.vaccineTotal}>
                        <VaccineTotal data={vaccineData} />
                    </div>
                </div>
                <ParentSize className={styles.graphContainer} debounceTime={0}>
                    {({ width: visWidth, height: visHeight }) => (
                        this.state.casesData.length && (<VisxChart width={visWidth-40} height={visHeight-40} data={this.state.casesData} admData={admData} days={this.state.numDays}/>)
                    )}
                </ParentSize>
            </div>
        )
    }
}

export default App;