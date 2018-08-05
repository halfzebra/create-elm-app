import './main.css';
import '@webcomponents/webcomponentsjs';
import { Main } from './Main.elm';
import registerServiceWorker from './registerServiceWorker';

class MyCustomButton extends HTMLElement {
  constructor() {
    super();
    this.i = 0;
    this.addEventListener('boom', console.log);
  }
  connectedCallback() {
    const button = document.createElement('button');

    button.innerText = "I'm a webcomponent";

    button.addEventListener('click', () => {
      this.i = this.i + 1;
      this.dispatchEvent(
        new CustomEvent('boom', { detail: { times: this.i } })
      );
    });

    this.appendChild(button);
  }
}

window.customElements.define('hello-world', MyCustomButton);

Main.embed(document.getElementById('root'));

registerServiceWorker();
