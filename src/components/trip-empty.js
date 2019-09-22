import AbstractComponent from './abstarct-component';

export default class TripEmpty extends AbstractComponent {
  getTemplate() {
    return `
    <p class="trip-events__msg">Click New Event to create your first point</p>
    `.trim();
  }
}
