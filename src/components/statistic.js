import AbstractComponent from './abstarct-component';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {PLACE_TYPES, ACTION_TYPES, Time, chartMaxHeight, TypeEmoji} from '../constants';

const reducer = (accumulator, currentValue) => accumulator + currentValue;
const priceMap = (curentEvent) => curentEvent.price;
const durationMap = (curentEvent) => curentEvent.time.end - curentEvent.time.start;
const moneyFormatter = (value) => `€` + value;
const transportFormatter = (value) => value + `x`;
const timeFormatter = (value) => value + `H`;

export default class Statistic extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
  }

  getTemplate() {
    return `
    <section class="statistics visually-hidden">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>
    `.trim();
  }

  init() {
    const moneyCtx = document.querySelector(`.statistics__chart--money`);
    const transportCtx = document.querySelector(`.statistics__chart--transport`);
    const timeCtx = document.querySelector(`.statistics__chart--time`);

    moneyCtx.style.maxHeight = transportCtx.style.maxHeight = timeCtx.style.maxHeight = chartMaxHeight;

    this._updateData(this._events);
    this._moneyChart = new Chart(moneyCtx, this._makeChartConfig(`MONEY`, this._moneyChartData, moneyFormatter));
    this._transportChart = new Chart(transportCtx, this._makeChartConfig(`TRANSPORT`, this._transportChartData, transportFormatter));
    this._timeChart = new Chart(timeCtx, this._makeChartConfig(`TIME`, this._timeChartData, timeFormatter));
  }

  update(actualEvents) {
    this._updateData(actualEvents);
    this._updateChart(this._moneyChart, this._moneyChartData);
    this._updateChart(this._transportChart, this._transportChartData);
    this._updateChart(this._timeChart, this._timeChartData);
  }

  _getTypeData(type, dataMap) {
    const fittingEvents = this._events.filter((curentEvent) => curentEvent.type === type);

    if (fittingEvents.length === 0) {
      return 0;
    } else {
      return fittingEvents.map(dataMap).reduce(reducer);
    }
  }

  _getQuantity(type) {
    return this._events.filter((curentEvent) => curentEvent.type === type).length;
  }

  _getCosts(types) {
    return types.map((type) => {
      return {
        name: type,
        data: this._getTypeData(type, priceMap),
      };
    })
    .filter((type) => type.data > 0)
    .sort((a, b) => b.data - a.data);
  }

  _getDurations(types) {
    return types.map((type) => {
      return {
        name: type,
        data: Math.round(this._getTypeData(type, durationMap) / Time.HOUR),
      };
    })
    .filter((type) => type.data > 0)
    .sort((a, b) => b.data - a.data);
  }

  _getQuantities(types) {
    return types.map((type) => {
      return {
        name: type,
        data: this._getQuantity(type),
      };
    })
    .filter((type) => type.data > 0)
    .sort((a, b) => b.data - a.data);
  }

  _makeChartConfig(title, data, infoFormatter) {
    return {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: data.map((type) => type.name.toUpperCase()),
        datasets: [{
          data: data.map((type) => type.data),
          backgroundColor: `white`,
          borderColor: `grey`,
          borderWidth: 0,
          hoverBorderWidth: 1,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            formatter: infoFormatter,
            font: {
              size: 15
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
          }
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }]
        },
        legend: {
          display: false,
        },
        title: {
          display: true,
          position: `left`,
          text: title,
          fontSize: 20,
        },
      }
    };
  }

  _updateData(actualData) {
    this._events = actualData;
    this._moneyChartData = this._getCosts(ACTION_TYPES.concat(PLACE_TYPES));
    this._transportChartData = this._getQuantities(ACTION_TYPES);
    this._timeChartData = this._getDurations(ACTION_TYPES.concat(PLACE_TYPES));
  }

  _updateChart(chart, newData) {
    chart.data.labels = newData.map((type) => `${TypeEmoji[type.name]} ${type.name.toUpperCase()}`);
    chart.data.datasets[0].data = newData.map((type) => type.data);
    chart.update();
  }
}
