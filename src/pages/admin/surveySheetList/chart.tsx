import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend);
interface propsData {
  data1?: number;
  data2?: number;
  data3?: number;
  title1?: string;
  title2?: string;
}
const Chart = (props: propsData) => {
  const { data1 = 0, data2 = 0, data3 = 0, title1, title2 }: propsData = props;
  const totalData: number = data1 + data2 + data3;
  const realData1: number = (100 * data1) / totalData;
  const realData2: number = (100 * data2) / totalData;
  const realData3: number = (100 * data3) / totalData;

  // yellow, blue, grey

  const options: any = {
    // maintainAspectRatio: false,
    responsive: true,
    legend: {
      display: false, // Tắt hiển thị chú thích
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function (tooltipItem: any, data: any) {},
      },
    },
  };

  const data: any = {
    labels: [],
    datasets: [
      {
        label: '%',
        data: [realData1, realData2, realData3],
        backgroundColor: ['#FAEE00', '#93D2EF', '#727171'],
        borderColor: ['transparent'],
        borderWidth: 1,
      },
    ],
  };

  // CHECK DATA NaN
  const checkDataChartEmpty = (data: any) => {
    return data?.datasets[0]?.data?.find((item: any): boolean => !Number.isNaN(item));
  };

  return (
    <div style={{ width: '300px' }} className="chart-component-wrapper">
      <div className="title">
        <span>
          {title1}
          <br />
          {title2}
        </span>
      </div>
      {checkDataChartEmpty(data) !== undefined ? (
        <Pie data={data} options={options} />
      ) : (
        <div className="survey-empty">該当なし</div>
      )}
    </div>
  );
};

export default Chart;
