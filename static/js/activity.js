/* 
    アクティビティ
 */
'use strict';
import { Heading, Modal, util } from './component.js';
import { MENUS } from './menu.js';


class ActivityTable {
  /**
   * アクティビティテーブル
   * 
   * @param {Array} activityData アクティビティデータ
   */
  constructor(activityData) {
    this._activityData = activityData;
  }

  /**
   * 要素返却
   * 
   * @return {Element} アクティビティテーブル
   */
  get component() {
    return this._create();
  }

  /**
   * アクティビティテーブル生成
   * 
   * @return {Element} table アクティビティテーブル
   */
  _create() {
    const table = document.createElement('table');

    table.id = 'activityTable';
    table.classList.add(...['cell-border', 'compact', 'hover', 'nowrap', 'stripe']);
    this._initDataTable(table);
    return table;
  }

  /**
   * DataTable初期化
   * 
   * @param {Element} table アクティビティテーブル
   * @return {undefined} undefined
   */
  _initDataTable(table) {
    const data = this._activityData;

    $(document).ready(function () {
      $(`#${table.id}`).DataTable({
        data: data,
        columns: [
          {
            data: 'date',
            title: '日時'
          },
          {
            data: null,
            title: '詳細',
            render: (data) => {
              let elm = `<div class="d-flex align-items-center activityTable-detail-wrap">`;

              MENUS.forEach(menu => {
                if (menu.getComponentName() === data.type) {
                  const [a, b] = menu.iconClassNames;

                  elm += `<div class="${data.type}"><i class="${a} ${b}"></i></div>`;
                  return false;
                }
                return true;
              });
              elm += `<div>${data.detail}</div>`;
              return elm;
            }
          },
        ],
        language: {
          url: 'http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json',
        },
        order: [0, 'desc'],
      });
    });
  }
}


export class ActivityComponent {
  /**
   * コンポーネント集約
   * 
   * @param {String} componentName コンポーネント名
   */
  constructor(componentName) {
    this._activityData = this._getActivityData(componentName);
    this._activityElm = this._createActivityWrap(this._activityData);
  }

  /**
   * 要素返却
   * 
   * @return {Element} アクティビティコンポーネント
   */
  get component() {
    return this._activityElm;
  }

  /**
   * アクティビティデータ取得
   * 
   * @param {String} componentName コンポーネント名
   * @return {Object} アクティビティデータ
   */
  async _getActivityData(componentName) {
    try {
      return await util.httpRequest(componentName);
    } catch (err) {
      const errObj = await err;
      Modal.show({
        headerText: errObj.title,
        bodyText: errObj.msg
      });
      return false;
    }
  }

  /**
   * アクティビティ生成(ラッパー)
   * 
   * @param {Array} activityData アクティビティデータ
   * @return {Object} アクティビティ
   */
  async _createActivityWrap(activityData) {
    const _activityData = await activityData;

    return util.createDocumentFragment([
      this._createHeading(),
      this._createActivityTable(_activityData)
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeading() {
    const headingInst = new Heading({ text: 'アクティビティ一覧' });

    return headingInst.component;
  }

  /**
   * アクティビティテーブル生成
   * 
   * @param {Object} activityData アクティビティデータ
   * @return {Element} アクティビティテーブル
   */
  _createActivityTable(activityData) {
    const activityTableInst = new ActivityTable(activityData);

    return util.createWrap({
      id: 'activityTableWrap',
      classNames: [
        'card',
        'w-70',
        'mt-2',
        'mb-2',
        'mr-auto',
        'ml-auto',
        'pt-2',
        'pb-2',
        'pr-2',
        'pl-2',
      ],
      innerElm: [activityTableInst.component]
    });
  }
}