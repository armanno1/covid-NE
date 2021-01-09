import React, { useState, useEffect } from 'react';
import { fetchDataDailyCases } from '../../api';
import { Bar } from 'react-chartjs-2';
import styles from './Chart.module.css'; 

const Chart = () => {
    const [dailyData, setDailyData] = useState([]);
    useEffect(() => {
        const fetchAPI = async () => {
            setDailyData(await fetchDataDailyCases());
        } 
        fetchAPI();
    }, []);

    let lineChart = 'loading...'
    
    if (dailyData.length) {
        lineChart = (
            <Bar 
                data={{
                    labels: dailyData.slice(1, 101).reverse().map(({ date }) => date),
                    datasets: [{
                        data: dailyData.slice(1, 101).reverse().map(({ newCasesByPublishDate }) => newCasesByPublishDate),
                        label: 'North East: Daily cases (last 100 days)',
                        backgroundColor: 'rgba(0,0,255,0.4)',
                        borderColor: 'rgba(0,0,255,0.8)',
                        borderWidth: 1,
                        fill: true,
                        key: Math.random()
                    }]
                }}
            />
        )
    } else {
         return null;
    }

    return (
        <div className={styles.container}>
            <div className={styles.chartComponent}>
                {lineChart}
            </div>
        </div>
    )
}

export default Chart;