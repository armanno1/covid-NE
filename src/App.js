import React from 'react';
import { VaccineTotal } from './components';
import styles from './App.module.css';
import { fetchDataVaccines, fetchDataDailyCases } from './api';
import VisxChart from './components/VisxChart/VisxChart';
import ParentSize from '@visx/responsive/lib/components/ParentSize';

class App extends React.Component {

    state = {
        vaccineData: {},
        casesData: {},
        numDays: 170
    }

    async componentDidMount() {
        const updatedVaccineData = await fetchDataVaccines();
        const updatedCasesData = await fetchDataDailyCases();
        this.setState({vaccineData: updatedVaccineData, casesData: updatedCasesData});
    };

    handleNumDaysChange = (event) => {
        const numDays = event.target.value < 175 ? event.target.value : 170;
        this.setState({numDays: numDays})
    }

    render() {
        const data = this.state.vaccineData[0];
        return (
            <div className={styles.container}>
                <div className={styles.numDaysInputContainer}>
                    <p>Days</p><input type='form' value={this.state.numDays} className={styles.numDaysInputField} onChange={this.handleNumDaysChange}/>
                </div>
                <div className={styles.title}>
                    COVID-19 cases North East (UK)
                    <div className={styles.vaccineTotal}>
                        <VaccineTotal data={data} />
                    </div>
                </div>
                <ParentSize className={styles.graphContainer} debounceTime={0}>
                    {({ width: visWidth, height: visHeight }) => (
                        this.state.casesData.length && (<VisxChart width={visWidth-40} height={visHeight-40} data={this.state.casesData} days={this.state.numDays}/>)
                    )}
                </ParentSize>
            </div>
        )
    }
}

export default App;