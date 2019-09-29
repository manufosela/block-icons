import { LitElement, html, css } from 'lit-element';

/**
 * `block-icons`
 * BlockIcons
 *
 * @customElement block-icons
 * @polymer
 * @litElement
 * @demo demo/index.html
 */

class BlockIcons extends LitElement {
  static get is() {
    return 'block-icons';
  }

  static get properties() {
    return {
      href: { type: String },
      numIcons: { type: Number },
      numMaxIcons: { type: Number },
      bloqueCSS: { type: String }
    };
  }

  static get styles() {
    return css`
      :host {
        background: #FF0;
        --block-size: 300px;
        --relation-mobile: 3.5;
      }
      a { color: #000; text-decoration:none; }

      .block {
        max-width: var(--block-size);
        min-width: var(--block-size);  
        height: var(--block-size);
        background: #FF0;
        padding: 10px;
      }
      .plus:before {
        content: "\\002B";
        font-size: 130px;
      }
    `;
  }

  constructor() {
    super();
    this.href = '#';

    this.numIcons = 0;
    this.numMaxIcons = 11;
    this.bloqueCSS = '';

    this.blockWidth = 300;
    this.iconWidth = this.blockWidth / 2;
    this.maxScreenWidth = 10 * this.blockWidth / 6; // 500;

    this.screenWidth = document.documentElement.clientWidth;
    this.hostWidth = 0;
    this.numIconsToShow = 0;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('resize', this.styleCalc.bind(this));
  }

  firstUpdated() {
    /* GET BLOCK CONTENT */
    let blockContent = this.innerHTML.match(/<!--block-content>(.*)<\/block-content-->/);
    this.blockContent = blockContent[1];
    /* GET ICONS CONTENT */
    let iconsContent = this.innerHTML.match(/<!--icon-content>.*<\/icon-content-->/g);
    this.numIcons = iconsContent.length;
    this.iconsContent = iconsContent.map((icon)=>{
      return icon.replace(/<!--icon-content>(.*)<\/icon-content-->/, '$1');
    });
    this.styleCalc();
  }

  drawIcons(numIcons) {
    let icons = '';
    let i;
    for (i = 1; i <= numIcons; i++) {
      icons += `<div id="icon_${i}" class="icon">${this.iconsContent[i - 1]}</div>`;
    }
    if (this.screenWidth >= this.maxScreenWidth) {
      icons += `<div id="icon_${i}" class="icon plus"></div>`;
    }
    return `${icons}`;
  }

  getNumIconsToDraw(minWidth, maxWidth, maxIcons) {
    let numIconsToShow = null;
    /* this.shadowRoot.querySelector('.block').innerHTML = this.hostWidth + ', ' + minWidth + ', ' + maxWidth + ', MaxIcons: ' + maxIcons; */
    if (this.hostWidth >= minWidth && this.hostWidth < maxWidth) {
      numIconsToShow = (this.numIcons < maxIcons) ? ((this.numIcons % 2 === 0) ? this.numIcons : this.numIcons + 1) : maxIcons;
    }
    return numIconsToShow;
  }

  showIconsByWidth() {
    let counter = 1;
    for (let i = 1; i < this.numMaxIcons; i += 2) {
      let minWidth = this.blockWidth + (this.iconWidth * counter);
      let maxWidth = minWidth + this.iconWidth;
      this.numIconsToShow = this.getNumIconsToDraw(minWidth, maxWidth, i);
      if (this.numIconsToShow) {
        break;
      }
      counter++;
    }
  }

  styleIcon() {
    let cssIcon = '';
    let counter = 1;
    for (let col = 1; col <= this.numMaxIcons / 2; col++) {
      for (let row = 1; row <= 2; row++) {
        cssIcon += `
          .icon:nth-child(${counter}) {
            grid-row-start: ${row};
            grid-row-end: ${row + 1};
            grid-column-start: ${col};
            grid-column-end: ${col + 1};
          }
        `;
        counter++;
      }
    }
    return cssIcon;
  }

  styleCalc() {
    this.hostWidth = this.shadowRoot.querySelector('.container').clientWidth;
    this.screenWidth = document.documentElement.clientWidth;
    /* this.shadowRoot.querySelector('.block').innerHTML = 'WC: ' + this.hostWidth + ' - SCREEN: ' + this.screenWidth; */
    this.shadowRoot.getElementById('block').innerHTML = this.blockContent;
    let common = `
      .icons {
        display: grid;
      }
      .icon {
        background: #55F;
        border:1px solid blue;
        margin:0 auto;
        text-align:center;
        vertical-align:middle;
      }
    `;
    if (this.screenWidth >= this.maxScreenWidth) {
      this.bloqueCSS = html`
        ${common}
        .container {
          display: flex;
          flex-flow: row;
          height: var(--block-size);
          width:90vw;
          margin: 0 auto;
          border:0px solid red;
          overflow:hidden;
          max-width: 1200px;
        }
        .icon {
          height: calc(var(--block-size)/2);
          width: calc(var(--block-size)/2);
        }
        ${this.styleIcon()}
      `;
      this.showIconsByWidth();
      this.shadowRoot.getElementById('icons').innerHTML = this.drawIcons(this.numIconsToShow);
    } else {
      this.bloqueCSS = html`
        ${common}
        .container {
          width: calc(var(--block-size)*1.1);
          height: calc(var(--block-size)*1.33);
          flex-flow: column;
        }
        .icons {
          grid-gap: 0;
          grid-template-columns: repeat(12, calc(var(--block-size)/var(--relation-mobile)));
          grid-template-rows: minmax(var(--block-size), 1fr);
          overflow-x: scroll;
          overflow-y: hidden;
          scroll-snap-type: x proximity;
          padding: 0;
          margin: 0;
          height: calc(var(--block-size)/3);
        }
        .icon {
          width: calc(var(--block-size)/var(--relaction-mobile));
          height: calc(var(--block-size)/3);
          margin:0;
        }
      `;
      this.shadowRoot.getElementById('icons').innerHTML = this.drawIcons(this.numIcons);
    }
  }

  render() {
    return html`
      <style>
        ${this.bloqueCSS}
      </style>
      <a href="${this.href}">
        <div class="container">
          <div id="block" class="block">
            BLOCK
          </div>
          <div id="icons" class="icons"></div>
        </div>
      </a>
    `;
  }
}

window.customElements.define(BlockIcons.is, BlockIcons);