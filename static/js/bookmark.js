/* 
    ブックマーク一覧
 */
'use strict';
import { ConfirmModal, Heading, Modal, util } from './component.js';


class BookmarkTable {
  /**
   * ブックマーク一覧テーブル
   * 
   * @param {Array} bookmarkData ブックマークデータ
   */
  constructor(bookmarkData) {
    this._bookmarkData = bookmarkData;
  }

  /**
   * 要素返却
   * 
   * @return {Element} ブックマーク一覧テーブル
   */
  get component() {
    return this._create();
  }

  /**
   * ブックマーク一覧テーブル生成
   * 
   * @return {Element} table ブックマーク一覧テーブル
   */
  _create() {
    const table = document.createElement('table');

    table.id = 'bookmarkTable';
    table.classList.add(...['cell-border', 'compact', 'hover', 'nowrap', 'stripe']);
    this._initDataTable(table);
    return table;
  }

  /**
   * DataTable初期化
   * 
   * @param {Element} table ブックマーク一覧テーブル
   * @return {undefined} undefined
   */
  _initDataTable(table) {
    const data = this._bookmarkData;

    $(document).ready(function () {
      const bookmarkTable = $(`#${table.id}`).DataTable({
        data: data,
        columns: [
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
            render: (data) => {
              let elm = '<div class="admin-wrap d-flex">';

              elm += `
                <button class="pronounce primary" data-english-val="${data.english}">
                  <i class="fas fa-volume-up"></i>
                  <span>発音<span>
                </button>`;

              elm += `
                <button class="rescission-bookmark danger" data-english-id=${data.id} data-english-val="${data.english}">
                  <i class="far fa-trash-alt"></i>
                  <span>ブックマーク解除<span>
                </button>`;
              return elm;
            },
            orderable: false,
            searchable: false,
          },
        ],
        language: {
          url: 'http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json',
        },
        order: [0, 'asc']
      });

      /**
       * 発音イベント
       * 
       * @param {Event} e イベント
       */
      $(document).off().on('click', '.pronounce', (e) => {
        util.pronounceEnglish(e.currentTarget.dataset.englishVal);
      });

      /**
       * ブックマーク解除イベント
       * 
       * @param {Event} e イベント
       */
      $(document).on('click', '.rescission-bookmark', (e) => {
        const clickedBtn = e.currentTarget;
        const pkey = clickedBtn.dataset.englishId;
        const flag = util.FLAG.false;

        ConfirmModal.show({
          headerText: 'ブックマーク解除',
          bodyText: `${clickedBtn.dataset.englishVal}をブックマーク解除します`,
          btnEvent: async (e) => {
            try {
              await util.httpRequest('update/bookmark', {
                method: 'POST',
                body: JSON.stringify({ pkey, flag })
              });
              bookmarkTable.rows(clickedBtn.closest('tr')).remove().draw();

              ConfirmModal.afterOperation(
                e.target.closest('#okBtn'),
                `${clickedBtn.dataset.englishVal}をブックマーク解除しました`
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


export class BookmarkComponent {
  /**
   * コンポーネント集約
   * 
   * @param {String} componentName コンポーネント名
   */
  constructor(componentName) {
    this._bookmarkData = this._getBookmarkData(componentName);
    this._bookmarkElm = this._createBookmarkWrap(this._bookmarkData);
  }

  /**
   * 要素返却
   * 
   * @return {Element} ブックマーク一覧コンポーネント
   */
  get component() {
    return this._bookmarkElm;
  }

  /**
   * ブックマーク一覧データ取得
   * 
   * @param {String} componentName コンポーネント名
   * @return {Object} ブックマーク一覧データ
   */
  async _getBookmarkData(componentName) {
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
   * ブックマーク一覧生成(ラッパー)
   * 
   * @param {Array} bookmarkData ブックマーク一覧データ
   * @return {Object} ブックマーク一覧
   */
  async _createBookmarkWrap(bookmarkData) {
    const _bookmarkData = await bookmarkData;

    return util.createDocumentFragment([
      this._createHeading(),
      this._createBookmarkTable(_bookmarkData)
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeading() {
    const headingInst = new Heading({ text: 'ブックマーク一覧' });

    return headingInst.component;
  }

  /**
   * ブックマーク一覧テーブル生成
   * 
   * @param {Object} bookmarkData ブックマーク一覧データ
   * @return {Element} ブックマーク一覧テーブル
   */
  _createBookmarkTable(bookmarkData) {
    const bookmarkTableInst = new BookmarkTable(bookmarkData);

    return util.createWrap({
      id: 'bookmarkTableWrap',
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
      innerElm: [bookmarkTableInst.component]
    });
  }
}