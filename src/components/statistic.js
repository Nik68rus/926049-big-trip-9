import AbstractComponent from './abstarct-component';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {PLACE_TYPES, ACTION_TYPES} from '../constants';

export default class Statistic extends AbstractComponent {
  constructor(events) {
    super();
    this._events = events;
    this._moneyChart = null;
  }

  update(actualEvents) {
    this._events = actualEvents;
    this._updateMoneyChart();
    this._updateTransportChart();
    this._updateTimeChart();
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
//    const transportCtx = document.querySelector(`.statistics__chart--transport`);
//    const timeCtx = document.querySelector(`.statistics__chart--time`);

    const moneyChartData = this._getCosts();

    this._moneyChart = new Chart(moneyCtx, {
      plugins: [ChartDataLabels],
      type: `horizontalBar`,
      data: {
        labels: moneyChartData.map((type) => type.name.toUpperCase()),
        datasets: [{
          data: moneyChartData.map((type) => type.cost),
          backgroundColor: `white`,
          borderColor: `grey`,
          borderWidth: 0,
          hoverBorderWidth: 1,
        }]
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 15
            },
            color: `#000000`,
            anchor: `end`,
            align: `start`,
          }
        },
        scales: {
          yAxes: [{
            ticks: {
            },
            gridLines: {
              display: false,
              drawBorder: false
            }
          }],
          xAxes: [{
            ticks: {
              beginAtZero: true,
              display: false,
              fontStyle: `bold`,
              fontColor: `#000000`,
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
          text: `MONEY`,
          fontSize: 20,
        },
        layout: {
          padding: {
            top: 10
          }
        },
        tooltips: {
          enabled: false
        }
      }
    });
  }

  _getTypeCost(type) {
    const reducer = (accumulator, currentValue) => accumulator + currentValue;
    const fittingEvents = this._events.filter((curentEvent) => curentEvent.type === type);

    if (fittingEvents.length === 0) {
      return 0;
    } else {
      return fittingEvents.map((curentEvent) => curentEvent.price).reduce(reducer);
    }
  }

  _getCosts() {
    return ACTION_TYPES.concat(PLACE_TYPES)
    .map((type) => {
      return {
        name: type,
        cost: this._getTypeCost(type),
      };
    })
    .filter((type) => type.cost > 0);
  }

  _updateMoneyChart() {
    const newMoneyChartData = this._getCosts();
    this._moneyChart.data.labels = newMoneyChartData.map((type) => type.name.toUpperCase());
    this._moneyChart.data.datasets[0].data = newMoneyChartData.map((type) => type.cost);
    this._moneyChart.update();
  }

  _updateTransportChart() {

  }

  _updateTimeChart() {

  }

}
