import AbstractComponent from './abstarct-component';

export default class DayEvents extends AbstractComponent {
  getTemplate() {
    return `
    <ul class="trip-events__list">
    </ul>
`.trim();
  }
}
