/* 
    ブックマーク
 */
'use strict';
import { ConfirmModal, Heading, Modal, util } from './component.js';


class BookmarkTable {
  /**
   * ブックマークテーブル
   * 
   * @param {Array} bookmarkData ブックマークデータ
   */
  constructor(bookmarkData) {
    this._bookmarkData = bookmarkData;
  }

  /**
   * 要素返却
   * 
   * @return {Element} ブックマークテーブル
   */
  get component() {
    return this._create();
  }

  /**
   * ブックマークテーブル生成
   * 
   * @return {Element} table ブックマークテーブル
   */
  _create() {
    const table = document.createElement('table');

    table.id = 'bookmarkTable';
    table.classList.add(...['cell-border', 'compact', 'hover', 'stripe', 'dt-responsive']);
    this._initDataTable(table);
    return table;
  }

  /**
   * DataTable初期化
   * 
   * @param {Element} table ブックマークテーブル
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
            className: 'tx-center',
            render: (data) => {
              let adminBtnWrap = '<div class="admin-btn-wrap d-none">';

              adminBtnWrap += `
                <button class="pronounce primary" data-english-val="${data.english}">
                  <i class="fas fa-volume-up"></i>
                  <span>発音<span>
                </button>`;

              adminBtnWrap += `
                <button class="rescission-bookmark danger" data-english-id=${data.id} data-english-val="${data.english}">
                  <i class="far fa-trash-alt"></i>
                  <span>ブックマーク解除<span>
                </button>`;

              return `<i class="admin-btn-show far fa-minus-square fa-plus-square"></i>${adminBtnWrap}`;
            },
            orderable: false,
            searchable: false,
          },
        ],
        columnDefs: [
          { targets: 0, width: 180 },
          { targets: 1, width: 120 },
          { targets: 2, width: 80 },
        ],
        language: {
          url: 'http://cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Japanese.json',
        },
        order: [0, 'asc']
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
   * @return {Element} ブックマークコンポーネント
   */
  get component() {
    return this._bookmarkElm;
  }

  /**
   * ブックマークデータ取得
   * 
   * @param {String} componentName コンポーネント名
   * @return {Object} ブックマークデータ
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
   * ブックマーク生成(ラッパー)
   * 
   * @param {Array} bookmarkData ブックマークデータ
   * @return {Object} ブックマーク
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
    const headingInst = new Heading({ text: 'ブックマーク' });

    return headingInst.component;
  }

  /**
   * ブックマークテーブル生成
   * 
   * @param {Object} bookmarkData ブックマークデータ
   * @return {Element} ブックマークテーブル
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