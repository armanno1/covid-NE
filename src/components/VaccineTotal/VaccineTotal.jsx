import React from "react";
import styles from './VaccineTotal.module.css';
import { ReactComponent as Syringe } from './syringe.svg'

const VaccineTotal = ( props ) => {

  let vaccineTotal = 'Loading', date = 'Loading';

  if (props.data) {
    vaccineTotal = props.data.cumPeopleReceivingFirstDose;
    date = props.data.date;
  }

  let dateDiff = '';
  date !== 'Loading' ? dateDiff = Math.floor((new Date() - new Date(date))/86400000) : dateDiff = '...';

  return (
    <div className={styles.vaccineDataContainer}>
      <Syringe className={styles.syringe}/>{vaccineTotal.toLocaleString()} ({typeof(vaccineTotal) === 'number' ? (vaccineTotal / 66000000 * 100).toFixed(1) : '...'}%) ~ {dateDiff} days ago
    </div>
  )
};

export default VaccineTotal;
