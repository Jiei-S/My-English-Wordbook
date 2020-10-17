/* 
    汎用
 */
'use strict';
import { MENUS } from './menu.js';


const FLAG = {
  'true': 'TRUE',
  'false': 'FALSE'
};


const MAX_WORD_SIZE = 256;
const COMMON_TEXT = {
  NOT_EXIST_DATA: 'データがありません',
};


/**
 * ラッパー生成
 * 
 * @param {String} id ラッパーID
 * @param {Array} classNames ラッパークラス名
 * @param {Array} innerElm インナー要素
 * @return {Element} wrap ラッパー
 */
const createWrap = ({ id = null, classNames = null, innerElm }) => {
  const wrap = document.createElement('div');

  wrap.id = id || '';
  if (classNames) {
    wrap.classList.add(...classNames);
  }
  innerElm.forEach(elm => wrap.appendChild(elm));
  return wrap;
};


/**
 * セクション生成
 * 
 * @param {String} id セクションID
 * @param {Array} classNames セクションクラス名
 * @param {Array} innerElm インナー要素
 * @return {Element} section セクション
 */
const createSection = ({ id = null, classNames = null, innerElm }) => {
  const section = document.createElement('section');

  section.id = id ? id : '';
  if (classNames) {
    section.classList.add(...classNames);
  }
  innerElm.forEach(elm => section.appendChild(elm));
  return section;
};


/**
 * エラーメッセージ生成
 * 
 * @param {Array} classNames エラーメッセージクラス名
 * @param {String} text メッセージ
 * @return {Element} errorMsg エラーメッセージ
 */
const createErrorMsg = ({ classNames = null, text = null } = {}) => {
  const errorMsg = document.createElement('div');

  errorMsg.classList.add('error-msg');
  if (classNames) {
    errorMsg.classList.add(...classNames);
  }
  errorMsg.textContent = text ? text : '';
  return errorMsg;
};


/**
 * 子要素一括追加
 * 
 * @param {Element} target 親要素
 * @param {Array} elms 子要素
 * @return {Element} target 要素
 */
const appendMultipleChild = (target, elms) => {
  elms.forEach(elm => { target.appendChild(elm); });
  return target;
};


/**
 * 文書フラグメント生成
 * 
 * @param {Array} elms 要素
 * @return {Element} fragment 文書フラグメント
 */
const createDocumentFragment = (elms) => {
  const fragment = document.createDocumentFragment();

  elms.forEach(elm => { fragment.appendChild(elm); });
  return fragment;
};


/**
 * HTTP通信
 * 
 * @param {String} url リクエストURL
 * @param {Object} option 通信オプション
 * @return {Promise} レスポンスデータ
 */
const httpRequest = (url, option = null) => {
  return fetch(url, option)
    .then(response => {
      if (!response.ok) {
        return Promise.reject(response.json());
      }
      return response.json();
    });
};


/**
 * 発音
 * 
 * @param {String} english 英語
 * @return {undefined} undefined
 */
const pronounceEnglish = (english) => {
  const utterThis = new SpeechSynthesisUtterance();

  utterThis.lang = 'en-US';
  utterThis.text = english;
  speechSynthesis.speak(utterThis);
};


export const util = {
  FLAG,
  MAX_WORD_SIZE,
  COMMON_TEXT,
  createWrap,
  createSection,
  createErrorMsg,
  appendMultipleChild,
  createDocumentFragment,
  httpRequest,
  pronounceEnglish
};


export class Menu {
  /**
   * メニュー
   */
  constructor() {
    // do nothing.
  }

  /**
   * 要素返却
   * 
   * @return {Element} メニュー
   */
  get component() {
    return this._create();
  }

  /**
   * メニュー生成
   * 
   * @return {Element} メニュー
   */
  _create() {
    return createWrap({
      classNames: [
        'menu-wrap',
        'd-flex',
        'justify-content-between'
      ],
      innerElm: MENUS.map(menuData => {
        const menu = document.createElement('div');
        const span = document.createElement('span');
        const menuIcon = document.createElement('i');

        menu.classList.add(...['menu', 'cursor-pointer']);
        menu.dataset.componentName = menuData.getComponentName();
        menu.addEventListener('click', menuData.renderComponent);
        span.textContent = menuData.text;
        menuIcon.classList.add(...menuData.iconClassNames);

        return util.appendMultipleChild(menu, [
          menuIcon,
          span,
        ]);
      })
    });
  }
}


export class Heading {
  /**
   * ヘディング
   * 
   * @param {String} text ヘディングテキスト
   */
  constructor({ text }) {
    this._text = text;
  }

  /**
   * 要素返却
   * 
   * @return {Element} ヘディング
   */
  get component() {
    return this._create();
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} heading ヘディング
   */
  _create() {
    const heading = document.createElement('h1');

    heading.textContent = this._text;
    return heading;
  }
}


export class HeadingSecond {
  /**
   * ヘディングセカンド
   * 
   * @param {String} text ヘディングセカンドテキスト
   * @param {Array} iconClassNames アイコンクラス名
   */
  constructor({ text, iconClassNames }) {
    this._text = text;
    this._iconClassNames = iconClassNames;
  }

  /**
   * 要素返却
   * 
   * @return {Element} ヘディングセカンド
   */
  get component() {
    return this._create();
  }

  /**
   * ヘディングセカンド生成
   * 
   * @return {Element} heading ヘディングセカンド
   */
  _create() {
    const heading = document.createElement('h2');
    const text = document.createTextNode(this._text);
    const icon = document.createElement('i');

    icon.classList.add(...this._iconClassNames);
    util.appendMultipleChild(heading, [
      icon,
      text
    ]);
    return heading;
  }
}


export class Button {
  /**
   * ボタン
   * 
   * @param {String} id ボタンID
   * @param {String} text ボタンテキスト
   * @param {Array} classNames ボタンクラス名
   * @param {Array} iconClassNames アイコンクラス名
   */
  constructor({ id = null, text, classNames, iconClassNames }) {
    this._id = id;
    this._text = text;
    this._classNames = classNames;
    this._iconClassNames = iconClassNames;
    this._buttonElm = this._create();
  }

  /**
   * 要素返却
   * 
   * @return {Element} ボタン
   */
  get component() {
    return this._buttonElm;
  }

  /**
   * ボタン生成
   * 
   * @return {Element} button ボタン
   */
  _create() {
    const button = document.createElement('button');

    button.id = this._id || '';
    button.classList.add(...this._classNames);
    button.addEventListener('click', this._clickEvent);
    return appendMultipleChild(button, [
      this._createIcon(),
      this._createText()
    ]);
  }

  /**
   * ボタンテキスト生成
   * 
   * @return {Element} span ボタンテキスト
   */
  _createText() {
    const span = document.createElement('span');

    span.textContent = this._text;
    return span;
  }

  /**
   * ボタンアイコン生成
   * 
   * @return {Element} icon ボタンアイコン
   */
  _createIcon() {
    const icon = document.createElement('i');

    icon.classList.add(...this._iconClassNames);
    return icon;
  }

  /**
   * イベント登録
   * 
   * @param {Function} event イベントメソッド
   * @return {undefined} undefined
   */
  setAddEventListener(event) {
    this._buttonElm.addEventListener('click', event);
  }
}


export class Modal {
  /**
   * モーダル
   * 
   * @param {String} headerText ヘッダテキスト
   * @param {String} bodyText ボティテキスト
   * @param {Function} btnEvent イベントメソッド
   */
  constructor(headerText, bodyText, btnEvent) {
    this._innerTarget = document.getElementById('body');
    this._headerText = headerText;
    this._bodyText = bodyText;
    this._btnEvent = btnEvent;
  }

  /**
   * モーダル描画
   * 
   * @param {String} headerText ヘッダテキスト
   * @param {String} bodyText ボティテキスト
   * @param {Function} btnEvent イベントメソッド
   * @return {undefined} undefined
   */
  static show({ headerText, bodyText, btnEvent = null }) {
    const inst = new this(headerText, bodyText, btnEvent);

    inst._innerTarget.classList.add('modal-open');
    inst._innerTarget.appendChild(
      createDocumentFragment([
        inst._createModal(),
        inst._createBackground()
      ])
    );
  }

  /**
   * モーダル削除
   * 
   * @return {undefined} undefined
   */
  static close() {
    document.getElementById('body').classList.remove('modal-open');
    document.getElementById('modal').remove();
    document.getElementById('modalBackground').remove();
  }

  /**
   * モーダルオペレーション後の処理
   * 
   * @param {Element} okBtn OKボタン
   * @param {String} bodyText ボティテキスト
   * @return {undefined} undefined
   */
  static afterOperation(okBtn, bodyText) {
    document.getElementById('modalHeader').textContent = '完了';
    document.getElementById('modalBody').textContent = bodyText;
    okBtn.nextElementSibling.children[1].textContent = '閉じる';
    okBtn.closest('#okBtn').remove();
  }

  /**
   * モーダル生成
   * 
   * @return {Element} モーダル
   */
  _createModal() {
    return createWrap({
      id: 'modal',
      innerElm: [
        this._createHeader(),
        this._createBody(),
        this._createFooter()
      ]
    });
  }

  /**
   * ヘッダ生成
   * 
   * @return {Element} ヘッダ
   */
  _createHeader() {
    const elm = document.createElement('div');

    elm.id = 'modalHeader';
    elm.textContent = this._headerText;
    return elm;
  }

  /**
   * ボティ生成
   * 
   * @return {Element} ボティ
   */
  _createBody() {
    const elm = document.createElement('div');

    elm.id = 'modalBody';
    elm.textContent = this._bodyText;
    return elm;
  }

  /**
   * フッタ生成
   * 
   * @return {Element} フッタ
   */
  _createFooter() {
    const elm = document.createElement('div');

    elm.id = 'modalFooter';
    elm.appendChild(this._createFooterBtn());
    return elm;
  }

  /**
   * バックグラウンド生成
   * 
   * @return {Element} バックグラウンド
   */
  _createBackground() {
    const elm = document.createElement('div');

    elm.id = 'modalBackground';
    return elm;
  }

  /**
   * フッタボタン生成
   * 
   * @return {Element} フッタボタン
   */
  _createFooterBtn() {
    const buttonInst = new Button({
      id: 'okBtn',
      text: 'OK',
      classNames: ['danger'],
      iconClassNames: [
        'far',
        'fa-check-circle'
      ]
    });

    buttonInst.setAddEventListener(this._btnEvent ? this._btnEvent : () => { location.href = '/'; });
    return createWrap({
      classNames: ['btnWrap'],
      innerElm: [buttonInst.component],
    });
  }
}


export class ConfirmModal extends Modal {
  /**
   * 確認用モーダル
   * 
   * @param {String} headerText ヘッダテキスト
   * @param {String} bodyText ボティテキスト
   * @param {Function} btnEvent イベントメソッド
   */
  constructor(headerText, bodyText, btnEvent) {
    super(headerText, bodyText, btnEvent);
  }

  /**
   * フッタボタン生成
   * 
   * @return {Element} フッタボタン
   */
  _createFooterBtn() {
    const btnWrap = super._createFooterBtn();
    const buttonInst = new Button({
      classNames: ['secondary'],
      text: 'キャンセル',
      iconClassNames: [
        'far',
        'fa-times-circle'
      ]
    });

    buttonInst.setAddEventListener(Modal.close);
    btnWrap.appendChild(buttonInst.component);
    return btnWrap;
  }
}