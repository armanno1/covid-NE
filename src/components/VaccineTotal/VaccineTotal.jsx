import React from "react";
import styles from './VaccineTotal.module.css';

const VaccineTotal = ( props ) => {

  let vaccineTotal = 'Loading', date = 'Loading';

  if (props.data) {
    vaccineTotal = props.data.cumPeopleReceivingFirstDose;
    date = props.data.date;
  }

  let dateDiff = '';
  date !== 'Loading' ? dateDiff = Math.floor((new Date() - new Date(date))/86400000) : dateDiff = '...';

  return (
    <div className={ styles.container }>
      Total Vaccinated: {vaccineTotal.toLocaleString()} ({typeof(vaccineTotal) === 'number' ? (vaccineTotal / 66000000 * 100).toFixed(1) : '...'}%)
      <div>
        Last updated: {date} (~{dateDiff} days ago)
      </div>
    </div>
  )
};

export default VaccineTotal;
