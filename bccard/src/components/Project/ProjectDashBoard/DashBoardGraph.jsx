import React, { useEffect, useState } from "react";
import DashBoardCard from "./DashBoardCard";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement,
} from "chart.js";
import { Doughnut, Bar, Line } from "react-chartjs-2";

import styles from "./ProjectDashBoard.module.css";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  PointElement,
  LineElement
);

const plugins = [
  {
    afterDraw: function (chart) {
      // console.log(chart);
      if (chart.data.datasets[0].data.length < 1) {
        let ctx = chart.ctx;
        let width = chart.width;
        let height = chart.height;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px 'Helvetica Nueue'";
        ctx.fillText("데이터가 없습니다", width / 2, height / 2);
        ctx.restore();
      }
    },
  },
];

function DashBoardGraph(props) {
  const { doughnutChartData, barCharData, lineChartData } = props;

  return (
    <>
      <div className={styles.doughnutChart}>
        <Doughnut plugins={plugins} data={doughnutChartData} />
      </div>
      <div className={styles.barChart}>
        <Bar
          plugins={plugins}
          options={{
            events: ["mousemove", "mouseout", "touchstart", "touchmove"],
            y: { ticks: { stepSize: 1 } },
          }}
          data={barCharData}
        />
      </div>
      <div className={styles.lineChart}>
        <Line
          plugins={plugins}
          options={{
            events: ["mousemove", "mouseout", "touchstart", "touchmove"],
            y: { ticks: { stepSize: 1 } },
          }}
          data={lineChartData}
        />
      </div>
    </>
  );
}

export default DashBoardGraph;
