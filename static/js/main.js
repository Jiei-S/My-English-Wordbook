/* 
    画面描画
 */
'use strict';
import { Menu, util } from './component.js';
import { DashboardComponent } from './dashboard.js';
import { LearningComponent } from './learning.js';
import { EnglishListComponent } from './english_list.js';
import { BookmarkComponent } from './bookmark.js';
import { ActivityComponent } from './activity.js';
import { RegisterComponent } from './register.js';


/**
 * 描画
 * 
 * @param {Element} elm 描画要素
 * @return {undefined} undefined
 */
const render = (elm) => {
  const renderTarget = document.getElementById('main');

  renderTarget.textContent = null;
  renderTarget.appendChild(elm);
};


export class Header {
  /**
   * ヘッダコンポーネント
   * 
   * @param {Element} body ボティ
   */
  constructor(body) {
    body.insertBefore(this._create(), body.children[0]);
  }

  /**
   * ヘッダ生成
   * 
   * @return {Element} ヘッダ
   */
  _create() {
    const header = document.createElement('header');
    const menuInst = new Menu();

    header.classList.add(...['d-flex', 'justify-content-between', 'align-items-center']);
    return util.appendMultipleChild(header, [
      this._createLogo(),
      menuInst.component,
    ]);
  }

  /**
   * ロゴ生成
   * 
   * @return {Element} logo ロゴ
   */
  _createLogo() {
    const logo = document.createElement('div');

    logo.classList.add('cursor-pointer');
    logo.textContent = 'My English Wordbook';
    logo.addEventListener('click', () => { location.href = '/'; });
    return logo;
  }
}


export class Footer {
  /**
   * フッタコンポーネント
   *
   * @param {Element} body ボティ
   */
  constructor(body) {
    body.appendChild(this._create());
  }

  /**
   * フッタ生成
   * 
   * @return {Element} フッタ
   */
  _create() {
    const footer = document.createElement('footer');
    const menuInst = new Menu();

    footer.classList.add(...['d-flex', 'justify-content-between', 'align-items-center']);
    return util.appendMultipleChild(footer, [
      menuInst.component,
      this._createCopyright()
    ]);
  }

  /**
   * コピーライト生成
   * 
   * @return {Element} コピーライト
   */
  _createCopyright() {
    const small = document.createElement('small');

    small.textContent = `© ${this._getThisYear()} Jiei-S`;
    return small;
  }

  /**
   * 年取得
   * 
   * @return {Number} 年
   */
  _getThisYear() {
    const dateInst = new Date();

    return dateInst.getFullYear();
  }
}


export class Dashboard {
  /**
   * ダッシュボードコンポーネント
   * 
   * @param {Object} dashboardData ダッシュボードデータ
   */
  static COMPONENT_NAME = 'dashboard';
  constructor(dashboardData) {
    this._dashboardData = dashboardData;
    this._dashboardComponentInst = new DashboardComponent(this._dashboardData);
    render(this._dashboardComponentInst.component);
  }
}


export class Learning {
  /**
   * 学習コンポーネント
   */
  static COMPONENT_NAME = 'learning';
  constructor() {
    this._render();
  }

  /**
   * 描画
   * 
   * @return {undefined} undefined
   */
  async _render() {
    const learningComponentInst = new LearningComponent(Learning.COMPONENT_NAME);

    render(await learningComponentInst.component);
  }
}


export class EnglishList {
  /**
   * 単語コンポーネント
   */
  static COMPONENT_NAME = 'english_list';
  constructor() {
    this._render();
  }

  /**
   * 描画
   * 
   * @return {undefined} undefined
   */
  async _render() {
    const englishListComponentInst = new EnglishListComponent(EnglishList.COMPONENT_NAME);

    render(await englishListComponentInst.component);
  }
}


export class Bookmark {
  /**
   * ブックマークコンポーネント
   */
  static COMPONENT_NAME = 'bookmark';
  constructor() {
    this._render();
  }

  /**
   * 描画
   * 
   * @return {undefined} undefined
   */
  async _render() {
    const bookmarkComponentInst = new BookmarkComponent(Bookmark.COMPONENT_NAME);

    render(await bookmarkComponentInst.component);
  }
}


export class Activity {
  /**
   * アクティビティコンポーネント
   */
  static COMPONENT_NAME = 'activity';
  constructor() {
    this._render();
  }

  /**
   * 描画
   * 
   * @return {undefined} undefined
   */
  async _render() {
    const activityComponentInst = new ActivityComponent(Activity.COMPONENT_NAME);

    render(await activityComponentInst.component);
  }
}


export class Register {
  /**
   * 単語登録コンポーネント
   */
  static COMPONENT_NAME = 'register';
  constructor() {
    this._registerComponentInst = new RegisterComponent();
    render(this._registerComponentInst.component);
  }
}