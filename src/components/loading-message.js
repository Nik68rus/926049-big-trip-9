import AbstractComponent from './abstarct-component';

export default class LoadingMessage extends AbstractComponent {
  getTemplate() {
    return `
    <p class="trip-events__msg">Loading...</p>
    `.trim();
  }
}
