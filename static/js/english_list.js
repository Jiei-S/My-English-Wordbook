/* 
    単語
 */
'use strict';
import { ConfirmModal, Heading, Modal, util } from './component.js';


class EnglishListTable {
  /**
   * 単語テーブル
   * 
   * @param {Array} englishListData 単語データ
   */
  constructor(englishListData) {
    this._englishListData = englishListData;
  }

  /**
   * 要素返却
   * 
   * @return {Element} 単語テーブル
   */
  get component() {
    return this._create();
  }

  /**
   * 単語テーブル生成
   * 
   * @return {Element} table 単語テーブル
   */
  _create() {
    const table = document.createElement('table');

    table.id = 'englishListTable';
    table.classList.add(...['cell-border', 'compact', 'hover', 'stripe', 'dt-responsive']);
    this._initDataTable(table);
    return table;
  }

  /**
   * DataTable初期化
   * 
   * @param {Element} table 単語テーブル
   * @return {undefined} undefined
   */
  _initDataTable(table) {
    const data = this._englishListData;

    $(document).ready(function () {
      const englishListTable = $(`#${table.id}`).DataTable({
        data: data,
        columns: [
          {
            data: 'is_correct',
            title: 'ステータス',
            className: 'learning-status-flag',
            render: (data) => data ? '習得済み' : '未習得',
            searchable: false,
          },
          {
            data: 'english',
            title: '英語'
          },
          {
            data: 'japanese',
            title: '日本語'
          },
          {
            data: null,
            title: '管理',
            className: 'tx-center',
            render: (data) => {
              let adminBtnWrap = '<div class="admin-btn-wrap d-none">';

              adminBtnWrap += `
                <button class="pronounce primary" data-english-val="${data.english}">
                  <i class="fas fa-volume-up"></i>
                  <span>発音<span>
                </button>`;

              /**
              if (data.is_correct) {
                adminBtnWrap += `
                  <button class="rescission-correct danger" data-english-id=${data.id} data-english-val="${data.english}">
                    <i class="far fa-times-circle"></i>
                    <span>未習得に変更</span>
                  </button>`;
              }
              */

              adminBtnWrap += `
                <button class="delete-word danger" data-english-id=${data.id} data-english-val="${data.english}">
                  <i class="far fa-trash-alt"></i>
                  <span>単語削除<span>
                </button>`;

              return `<i class="admin-btn-show far fa-minus-square fa-plus-square"></i>${adminBtnWrap}`;
            },
            orderable: false,
            searchable: false,
          },
        ],
        columnDefs: [
          { targets: 0, width: 80 },
          { targets: 1, width: 180 },
          { targets: 2, width: 120 },
          { targets: 3, width: 80 }
        ],
        language: {
          url: 'http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json',
        },
        order: [1, 'asc'],
      });

      /**
       * 管理ボタントグルイベント
       * 
       * @param {Event} e イベント
       */
      $(document).off().on('click', '.admin-btn-show', (e) => {
        const adminBtnWrapShowIcon = e.target;

        adminBtnWrapShowIcon.classList.toggle('fa-plus-square');
        adminBtnWrapShowIcon.classList.toggle('open');
        adminBtnWrapShowIcon.nextElementSibling.classList.toggle('d-none');
      });

      /**
       * 発音イベント
       * 
       * @param {Event} e イベント
       */
      $(document).on('click', '.pronounce', (e) => {
        util.pronounceEnglish(e.currentTarget.dataset.englishVal);
      });

      /**
       * 未習得に変更イベント
       * 
       * @param {Event} e イベント
      $(document).on('click', '.rescission-correct', (e) => {
        const clickedBtn = e.currentTarget;
        const pkey = clickedBtn.dataset.englishId;
        const flag = util.FLAG.false;

        ConfirmModal.show({
          headerText: '未習得に変更',
          bodyText: `${clickedBtn.dataset.englishVal}を未習得に変更します`,
          btnEvent: async (e) => {
            try {
              await util.httpRequest('update/is_correct', {
                method: 'POST',
                body: JSON.stringify({ pkey, flag })
              });
              Array.from(clickedBtn.closest('tr').children).forEach(elm => {
                if (elm.classList.contains('learning-status-flag')) {
                  elm.textContent = '未習得';
                }
              });
              clickedBtn.remove();

              ConfirmModal.afterOperation(
                e.target.closest('#okBtn'),
                `${clickedBtn.dataset.englishVal}未習得に変更しました`
              );
              return true;
            } catch (err) {
              const errObj = await err;
              Modal.show({
                headerText: errObj.title,
                bodyText: errObj.msg
              });
              return false;
            }
          }
        });
      });
      */

      /**
       * 単語削除イベント
       * 
       * @param {Event} e イベント
       */
      $(document).on('click', '.delete-word', (e) => {
        const clickedBtn = e.currentTarget;
        const pkey = clickedBtn.dataset.englishId;

        ConfirmModal.show({
          headerText: '単語削除',
          bodyText: `${clickedBtn.dataset.englishVal}を削除します`,
          btnEvent: async (e) => {
            try {
              await util.httpRequest('delete/word', {
                method: 'POST',
                body: JSON.stringify({ pkey })
              });
              englishListTable.rows(clickedBtn.closest('tr')).remove().draw();

              ConfirmModal.afterOperation(
                e.target.closest('#okBtn'),
                `${clickedBtn.dataset.englishVal}を削除しました`
              );
              return true;
            } catch (err) {
              const errObj = await err;
              Modal.show({
                headerText: errObj.title,
                bodyText: errObj.msg
              });
              return false;
            }
          }
        });
      });
    });
  }
}


export class EnglishListComponent {
  /**
   * コンポーネント集約
   * 
   * @param {String} componentName コンポーネント名
   */
  constructor(componentName) {
    this._englishListData = this._getEnglishListData(componentName);
    this._englishListElm = this._createEnglishListWrap(this._englishListData);
  }

  /**
   * 要素返却
   * 
   * @return {Element} 単語コンポーネント
   */
  get component() {
    return this._englishListElm;
  }

  /**
   * 単語データ取得
   * 
   * @param {String} componentName コンポーネント名
   * @return {Object} 単語データ
   */
  async _getEnglishListData(componentName) {
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
   * 単語生成(ラッパー)
   * 
   * @param {Array} englishListData 単語データ
   * @return {Object} 単語
   */
  async _createEnglishListWrap(englishListData) {
    const _englishListData = await englishListData;

    return util.createDocumentFragment([
      this._createHeading(),
      this._createEnglishListTable(_englishListData)
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeading() {
    const headingInst = new Heading({ text: '単語' });

    return headingInst.component;
  }

  /**
   * 単語テーブル生成
   * 
   * @param {Object} englishListData 単語データ
   * @return {Element} 単語テーブル
   */
  _createEnglishListTable(englishListData) {
    const englishListTableInst = new EnglishListTable(englishListData);

    return util.createWrap({
      classNames: [
        'card',
        'component-wrap',
      ],
      innerElm: [englishListTableInst.component]
    });
  }
}