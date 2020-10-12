/* 
    ダッシュボード
 */
'use strict';
import { Button, Heading, HeadingSecond, util } from './component.js';
import { LearningRateChart, LearningLogChart } from './chart.js';
import { MENUS } from './menu.js';


class DownloadPngButton extends Button {
  /**
   * PNGダウンロードボタン
   */
  constructor() {
    super({
      text: 'Download PNG',
      classNames: ['secondary'],
      iconClassNames: [
        'fas',
        'fa-download'
      ]
    });
    super.setAddEventListener(this._downloadPng);
  }

  /**
   * PNGダウンロード
   * 
   * @return {undefined} undefined
   */
  _downloadPng() {
    html2canvas(document.getElementById('main')).then(canvas => {
      const downloadElm = document.createElement('a');

      downloadElm.href = canvas.toDataURL('image/png');
      downloadElm.download = 'dashboard.png';
      downloadElm.click();
    });
  }
}


class WordTotal {
  /**
   * 登録単語数
   * 
   * @param {Number} wordTotal 登録単語数
   */
  constructor(wordTotal) {
    this._wordTotal = wordTotal;
  }

  /**
   * 要素返却
   * 
   * @return {Element} 登録単語数
   */
  get component() {
    return util.createDocumentFragment([
      this._createHeadingSecond(),
      this._createWordTotalWrap()
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeadingSecond() {
    const headingInst = new HeadingSecond({
      text: '登録単語',
      iconClassNames: [
        'fas',
        'fa-book',
        'mr-05'
      ]
    });

    return util.createWrap({
      classNames: [
        'head-wrap',
        'ml-1'
      ],
      innerElm: [headingInst.component]
    });
  }

  /**
   * 登録単語数生成(ラッパー)
   * 
   * @return {Element} 登録単語数
   */
  _createWordTotalWrap() {
    return util.createWrap({
      id: 'wordTotalWrap',
      classNames: [
        'pt-1',
        'pb-1',
        'pr-2',
        'pl-2',
        'tx-right',
        'font-size-2'
      ],
      innerElm: [this._createWordTotal()]
    });
  }

  /**
   * 登録単語数生成
   * 
   * @return {Element} 登録単語数
   */
  _createWordTotal() {
    const text = document.createElement('p');
    const textNode = document.createTextNode(this._wordTotal);
    const unit = document.createElement('span');

    unit.textContent = '語';
    unit.classList.add(...['ml-05', 'font-size-1']);
    return util.appendMultipleChild(text, [
      textNode,
      unit
    ]);
  }
}


class BookmarkTotal {
  /**
   * ブックマーク
   * 
   * @param {Number} bookmarkTotal ブックマーク数
   */
  constructor(bookmarkTotal) {
    this._bookmarkTotal = bookmarkTotal;
  }

  /**
   * 要素返却
   * 
   * @return {Element} ブックマーク数
   */
  get component() {
    return util.createDocumentFragment([
      this._createHeadingSecond(),
      this._createBookmarkTotalWrap()
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeadingSecond() {
    const headingInst = new HeadingSecond({
      text: 'ブックマーク',
      iconClassNames: [
        'fas',
        'fa-bookmark',
        'mr-05'
      ]
    });

    return util.createWrap({
      classNames: [
        'head-wrap',
        'ml-1'
      ],
      innerElm: [headingInst.component]
    });
  }

  /**
   * ブックマーク数生成(ラッパー)
   * 
   * @return {Element} ブックマーク数
   */
  _createBookmarkTotalWrap() {
    return util.createWrap({
      id: 'bookmarkTotalWrap',
      classNames: [
        'pt-1',
        'pb-1',
        'pr-2',
        'pl-2',
        'tx-right',
        'font-size-2'
      ],
      innerElm: [this._createBookmarkTotal()]
    });
  }

  /**
   * ブックマーク数生成
   * 
   * @return {Element} ブックマーク数
   */
  _createBookmarkTotal() {
    const text = document.createElement('p');
    const textNode = document.createTextNode(this._bookmarkTotal);
    const unit = document.createElement('span');

    unit.textContent = '語';
    unit.classList.add(...['ml-05', 'font-size-1']);
    return util.appendMultipleChild(text, [
      textNode,
      unit
    ]);
  }
}


class LearningRate {
  /**
   * 習得率
   * 
   * @param {Number} wordTotal 登録単語数
   * @param {Number} isCorrectTotal 習得済み単語数
   */
  constructor(wordTotal, isCorrectTotal) {
    this._wordTotal = wordTotal;
    this._isCorrectTotal = isCorrectTotal;
  }

  /**
   * 要素返却
   * 
   * @return {Element} 習得率
   */
  get component() {
    return util.createDocumentFragment([
      this._createHeadingSecond(),
      this._createLearningRate()
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeadingSecond() {
    const headingInst = new HeadingSecond({
      text: '習得率',
      iconClassNames: [
        'fas',
        'fa-chart-pie',
        'mr-05'
      ]
    });

    return util.createWrap({
      classNames: [
        'head-wrap',
        'ml-1'
      ],
      innerElm: [headingInst.component]
    });
  }

  /**
   * 習得率生成
   * 
   * @return {Element} 習得率
   */
  _createLearningRate() {
    const learningRateChartInst = new LearningRateChart(
      this._wordTotal,
      this._isCorrectTotal
    );

    return util.createWrap({
      classNames: [
        'd-flex',
        'align-items-center',
        'pt-1',
        'pb-1',
        'pr-2'
      ],
      innerElm: [learningRateChartInst.component]
    });
  }
}


class Activity {
  /**
   * 最近のアクティビティ
   * 
   * @param {Number} activitys アクティビティ数
   */
  constructor(activitys) {
    this._activitys = activitys;
  }

  /**
   * 要素返却
   * 
   * @return {Element} 最近のアクティビティ
   */
  get component() {
    return util.createDocumentFragment([
      this._createHeadingSecond(),
      this._createActivityWrap()
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeadingSecond() {
    const headingInst = new HeadingSecond({
      text: '最近のアクティビティ',
      iconClassNames: [
        'far',
        'fa-list-alt',
        'mr-05'
      ]
    });

    return util.createWrap({
      classNames: [
        'head-wrap',
        'ml-1'
      ],
      innerElm: [headingInst.component]
    });
  }

  /**
   * アクティビティ生成(ラッパー)
   * 
   * @return {Element} アクティビティ
   */
  _createActivityWrap() {
    const ul = document.createElement('ul');

    this._activitys.forEach(activity => {
      const li = document.createElement('li');

      li.classList.add(...['d-flex', 'align-items-center', 'pt-05', 'pb-05']);
      util.appendMultipleChild(li, [
        this._createActivityIcon(activity.type_flag),
        this._createActivity(activity.detail, activity.type_flag)
      ]);
      ul.appendChild(li);
    });
    return util.createWrap({
      id: 'activityWrap',
      classNames: [
        'mt-1',
        'pr-2',
        'pl-2'
      ],
      innerElm: [ul]
    });
  }

  /**
   * アクティビティアイコン生成
   * 
   * @param {String} typeFlag アクティビティ種別
   * @return {Element} アクティビティアイコン
   */
  _createActivityIcon(typeFlag) {
    const activityIcon = document.createElement('i');

    MENUS.forEach(menu => {
      if (menu.getComponentName() === typeFlag) {
        activityIcon.classList.add(...menu.iconClassNames);
      }
    });
    return util.createWrap({
      classNames: [typeFlag],
      innerElm: [activityIcon]
    });
  }

  /**
   * アクティビティテキスト生成
   * 
   * @param {String} detail アクティビティテキスト
   * @return {Element} text アクティビティテキスト
   */
  _createActivity(detail) {
    const text = document.createElement('div');

    text.textContent = detail;
    return text;
  }
}


class LearningLog {
  /**
   * 習得ログ
   * 
   * @param {Array} learningLogData 習得ログデータ
   */
  constructor(learningLogData) {
    this._learningLogData = learningLogData;
  }

  /**
   * 要素返却
   * 
   * @return {Element} 習得ログ
   */
  get component() {
    return util.createDocumentFragment([
      this._createHeadingSecond(),
      this._createLearningLog()
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeadingSecond() {
    const headingInst = new HeadingSecond({
      text: '習得ログ',
      iconClassNames: [
        'fas',
        'fa-chart-line',
        'mr-05'
      ]
    });

    return util.createWrap({
      classNames: [
        'head-wrap',
        'ml-1'
      ],
      innerElm: [headingInst.component]
    });
  }

  /**
   * 習得ログ生成
   * 
   * @return {Element} 習得ログ
   */
  _createLearningLog() {
    const learningLogChartInst = new LearningLogChart(this._learningLogData);

    return util.createWrap({
      id: 'learningLogWrap',
      classNames: [
        'pt-1',
        'pb-1',
        'pr-1',
        'pl-1'
      ],
      innerElm: [learningLogChartInst.component]
    });
  }
}


export class DashboardComponent {
  /**
   * コンポーネント集約
   * 
   * @param {Object} dashboardData ダッシュボードデータ
   */
  constructor(dashboardData) {
    this._wordTotal = dashboardData.count.wordTotal;
    this._isCorrectTotal = dashboardData.count.isCorrectTotal;
    this._bookmarkTotal = dashboardData.count.bookmarkTotal;
    this._activitys = dashboardData.activitys;
    this._learningLogData = dashboardData.learningLog;
  }

  /**
   * 要素返却
   * 
   * @return {Element} ダッシュボードコンポーネント
   */
  get component() {
    return util.createDocumentFragment([
      this._createFirstWrap(),
      this._createSecondWrap(),
      this._createThirdWrap()
    ]);
  }

  /**
   * ファーストラップ生成
   * - ヘディング生成
   * - PNGダウンロードボタン生成
   * 
   * @return {Element} ファーストラップ
   */
  _createFirstWrap() {
    const headingInst = new Heading({ text: 'ダッシュボード' });
    const downloadPngButtonInst = new DownloadPngButton();

    return util.createWrap({
      classNames: [
        'd-flex',
        'justify-content-between'
      ],
      innerElm: [
        headingInst.component,
        downloadPngButtonInst.component
      ]
    });
  }

  /**
   * セカンドラップ生成
   * 
   * @return {Element} セカンドラップ
   */
  _createSecondWrap() {
    return util.createWrap({
      id: 'secondWrap',
      classNames: [
        'd-flex',
        'justify-content-between',
        'flex-wrap',
        'mt-2',
        'mb-2'
      ],
      innerElm: [
        this._createSecondLeftWrap(),
        this._createSecondRightWrap()
      ]
    });
  }

  /**
   * セカンドラップ(左側)生成
   * 
   * @return {Element} セカンドラップ(左側)
   */
  _createSecondLeftWrap() {
    return util.createWrap({
      id: 'secondLeftWrap',
      classNames: ['w-49'],
      innerElm: [
        this._createSecondLeftTopWrap(),
        this._createSecondLeftBottomWrap()
      ]
    });
  }

  /**
   * セカンドラップ(左側上部)生成
   * - 登録単語数生成
   * - ブックマーク数生成
   * 
   * @return {Element} セカンドラップ(左側上部)
   */
  _createSecondLeftTopWrap() {
    const wordTotalInst = new WordTotal(this._wordTotal);
    const bookmarkTotalInst = new BookmarkTotal(this._bookmarkTotal);

    return util.createWrap({
      id: 'secondLeftTopWrap',
      classNames: [
        'd-flex',
        'justify-content-between'
      ],
      innerElm: [
        util.createSection({
          classNames: [
            'card',
            'w-49'
          ],
          innerElm: [wordTotalInst.component]
        }),
        util.createSection({
          classNames: [
            'card',
            'w-49'
          ],
          innerElm: [bookmarkTotalInst.component]
        })
      ]
    });
  }

  /**
   * セカンドラップ(左側下部)生成
   * - 学習率生成
   * 
   * @return {Element} セカンドラップ(左側下部)
   */
  _createSecondLeftBottomWrap() {
    const learningRateInst = new LearningRate(this._wordTotal, this._isCorrectTotal);

    return util.createSection({
      classNames: [
        'card',
        'mt-1'
      ],
      innerElm: [learningRateInst.component]
    });
  }

  /**
   * セカンドラップ(右側)生成
   * - 最近のアクティビティ生成
   * 
   * @return {Element} セカンドラップ(右側)
   */
  _createSecondRightWrap() {
    const activityInst = new Activity(this._activitys);

    return util.createWrap({
      id: 'secondRightWrap',
      classNames: ['w-49'],
      innerElm: [
        util.createSection({
          classNames: [
            'card',
            'h-100'
          ],
          innerElm: [activityInst.component]
        })
      ]
    });
  }

  /**
   * サードラップ生成
   * - 習得ログ生成
   * 
   * @return {Element} サードラップ
   */
  _createThirdWrap() {
    const learningLoginst = new LearningLog(this._learningLogData);

    return util.createWrap({
      innerElm: [
        util.createSection({
          classNames: [
            'card'
          ],
          innerElm: [learningLoginst.component]
        })
      ]
    });
  }
}