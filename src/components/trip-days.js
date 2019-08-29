import AbstractComponent from './abstarct-component';

export default class TripDays extends AbstractComponent {
  getTemplate() {
    return `
    <ul class="trip-days">
    </ul>
    `.trim();
  }
}
