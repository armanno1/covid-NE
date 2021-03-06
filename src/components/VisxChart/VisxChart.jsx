import React, { useMemo, useCallback } from 'react';
import { Group } from '@visx/group';
import { GradientTealBlue } from '@visx/gradient';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AxisLeft } from '@visx/axis';
import { GridRows } from '@visx/grid';
import { Bar, Line, Area } from '@visx/shape';
import { extent, bisector } from 'd3-array';
import { Text } from '@visx/text';
//tooltip
import { withTooltip, Tooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
//import { WithTooltipProvidedProps } from '@visx/tooltip/lib/enhancers/withTooltip';
import { localPoint } from '@visx/event';
import { timeFormat } from "d3-time-format";
import styles from './VisxChart.module.css';
import { curveCardinal } from '@visx/curve'
import { LinearGradient } from '@visx/gradient';

//variables
const verticalMargin = 150; 
const leftPad = 0;
//const greens = ['rgba(236,244,243,0.3)', '#68b0ab', '#006a71'];
const background = "#2c3e50";
export const background2 = '#204051';
export const accentColor = '#edffea';
export const accentColorDark = '#95a5a6';
const tooltipStyles = {
  ...defaultStyles,
  background,
  fontFamily: 'Arial',
  border: "1px solid white",
  color: "white"
};
//util
const formatDate = timeFormat("%b %d, '%y");

export default withTooltip(({ 
  width, 
  height, 
  data,
  admData,
  showTooltip, 
  tooltipData, 
  margin = { top: 0, right: 0, bottom: 0, left: 0 }, 
  hideTooltip,
  tooltipTop = 0,
  tooltipLeft = 0,
  days
}) => {
    let numDays = days ? days : 170;
    const dailyData = data.slice(0,numDays); //change slice amount here
    const admissionData = admData.slice(0,numDays);
    const xMax = width - leftPad;
    const yMax = height - verticalMargin;

    //utils again
    const getDate = (d) => new Date(d.date);
    const getDailyCases = (d) => d.newCasesByPublishDate;
    const getNewAdmissions = (d) => d.newAdmissions;
    const datesArray = dailyData.reverse().map(d => new Date(d.date))

    // scales, memoize for performance
    const xScale = useMemo(
        () =>
        scaleTime({
          domain: extent(dailyData, d => getDate(d)),
          range: [0, (xMax)],
        }),
        [xMax, dailyData]
    );

    const yScale = useMemo(
        () =>
        scaleLinear({
            range: [yMax, 0],
            domain: [0, Math.max(...dailyData.map(d => getDailyCases(d)))], //needs to be deconstructed for Math.max
        }),
        [yMax, dailyData],
    );

    //tooltip handler
    const handleTooltip = useCallback(
      (event) => {
        const { x } = localPoint(event) || { x: 0 };
        const x0 = xScale.invert(x); //this is not the problem!
        const index = bisector(d => d).left(datesArray, x0, 1)
        const d0 = dailyData[index - 1];
        const d1 = dailyData[index];
        let d = d0;
        if (d1 && getDate(d1)) {
          d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
        }
        showTooltip({
          tooltipData: d,
          tooltipLeft: x,
          tooltipTop: yScale(getDailyCases(d)),
        });
      },
      [showTooltip, yScale, xScale, dailyData, datesArray],
    ); 

  return width < 10 ? null : (
    <div className={styles.chartContainer}>
      <svg width={width} height={height}>
        <GradientTealBlue id="teal" />
        <rect width={width} height={height} fill={background}/>
        <LinearGradient id="area-background-gradient" from={background} to={background2} />
        <LinearGradient id="stroke-gradient" from={accentColor} to={accentColor} toOpacity={0.3} />
        {/*<LinearGradient id="area-gradient" from="#1D2835" to="#33475C" toOpacity={0.7} />*/}
        <AxisLeft 
            scale={yScale}
            left={50}
            top={verticalMargin}
            hideZero={true}
            strokeWidth={0}
            hideTicks={true}
            tickClassName={styles.axisLeftValue}
        />
        <GridRows
            left={margin.left + 50}
            top={verticalMargin}
            scale={yScale}
            width={width}
            strokeDasharray="1,3"
            stroke={accentColor}
            strokeOpacity={0.2}
            pointerEvents="none"
        />
          <Text
          width={width}
          verticalAnchor="end"
          textAnchor="end"
          fontFamily="Arial"
          fontSize={12}
          x={width}
          y={height-10}
          fill="red"
          opacity={0.3}
          >
            Daily admissions
          </Text>
        <Group top={verticalMargin} left={leftPad/2}>
          <Area
            data={admissionData}
            x={d => xScale(getDate(d)) ?? 0}
            y={d => yScale(getNewAdmissions(d)) ?? 0}
            strokeWidth={1.5}
            stroke="red"
            opacity={0.5}
            curve={curveCardinal}
          />
          <Area
            data={dailyData}
            x={d => xScale(getDate(d)) ?? 0}
            y={d => yScale(getDailyCases(d)) ?? 0}
            strokeWidth={1.5}
            stroke="url(#stroke-gradient)"
            curve={curveCardinal}
          />
          <Bar
            x={0}
            y={0}
            width={xMax}
            height={yMax}
            fill="transparent"
            rx={0}
            onTouchStart={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseMove={handleTooltip}
            onMouseLeave={() => hideTooltip()}
          />
        </Group>
        {/*This is the line bit...*/}
        {tooltipData && (
            <g>
              <Line
                from={{ x: tooltipLeft, y: margin.top }}
                to={{ x: tooltipLeft, y: height }} 
                stroke={accentColorDark}
                strokeWidth={2}
                pointerEvents="none"
                strokeDasharray="5,2"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + verticalMargin}
                r={4}
                fill="black"
                fillOpacity={0.1}
                stroke="black"
                strokeOpacity={0.1}
                strokeWidth={2}
                pointerEvents="none"
              />
              <circle
                cx={tooltipLeft}
                cy={tooltipTop + verticalMargin}
                r={4}
                fill={accentColorDark}
                stroke="white"
                strokeWidth={2}
                pointerEvents="none"
              />
            </g>
          )}
      </svg>
      {tooltipData && (
        <div>
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop + verticalMargin - 30}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            {`${getDailyCases(tooltipData)}`}
          </TooltipWithBounds>
          <Tooltip
            top={height-40}
            left={tooltipLeft}
            style={{
              ...defaultStyles,
              minWidth: 72,
              textAlign: "center",
              transform: "translateX(-50%)",
              fontFamily: 'Arial',
              opacity: 0.7
            }}
          >
            {formatDate(getDate(tooltipData))}
          </Tooltip>
          </div> 
      )}
    </div>
  );
});
