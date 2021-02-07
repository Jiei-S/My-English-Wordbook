/* 
    学習
 */
'use strict';
import { Button, PronounceButton, Modal, util } from './component.js';


class English {
  /**
   * 英語
   * 
   * @param {String} english 英語
   */
  constructor(english) {
    this._english = english;
  }

  /**
   * 要素返却
   * 
   * @return {Element} 英語
   */
  get component() {
    return this._create();
  }

  /**
   * 英語生成
   * 
   * @return {Element} english 英語
   */
  _create() {
    const english = document.createElement('span');

    english.classList.add('english');
    english.textContent = this._english;
    return english;
  }
}


class Answer {
  /**
   * 回答
   * 
   * @param {Object} correctData 正解データ
   * @param {Array} answer 回答
   */
  constructor(correctData, answer) {
    this._correctData = correctData;
    this._answer = answer;
  }

  /**
   * 要素返却
   * 
   * @return {Element} 回答
   */
  get component() {
    return this._createAnswersWrap();
  }

  /**
   * 回答生成(ラッパー)
   * 
   * @return {Element} 回答
   */
  _createAnswersWrap() {
    const answersWrap = document.createElement('ul');

    answersWrap.classList.add('learning-answers-wrap');
    return util.appendMultipleChild(answersWrap,
      this._shuffleAnswer(this._answer.map(val => {
        return this._createAnswerItem(val);
      }))
    );
  }

  /**
   * 回答生成
   * 
   * @param {String} val 回答テキスト
   * @return {Element} li 回答テキスト
   */
  _createAnswerItem(val) {
    const li = document.createElement('li');

    li.textContent = val;
    li.addEventListener('click', this._renderAnswer);
    return li;
  }

  /**
   * 正解/不正解アイコン生成
   * 
   * @param {Array} iconClassNames アイコンクラス名
   * @return {Element} icon 正解/不正解アイコン
   */
  _createCorrectOrIncorrectIcon(...iconClassNames) {
    const icon = document.createElement('i');

    iconClassNames.forEach(className => icon.classList.add(className));
    return icon;
  }

  /**
   * 回答シャッフル
   * 
   * @param {Array} array 回答
   * @return {Array} array 回答
   */
  _shuffleAnswer(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  /**
   * 正解/不正解描画
   * - 正解した場合、workテーブルのis_correctフラグをTRUEに更新
   * 
   * @param {Event} e イベント
   * @return {Boolean} false 不正解ケース
   * @return {undefined} undefined 正解ケース
   */
  _renderAnswer = (e) => {
    const answeredElm = e.target;
    const answersWrap = answeredElm.parentNode;
    const correctVal = this._correctData.correct;

    answersWrap.classList.add('event-none');
    document.getElementById('learningButtonWrap').classList.remove('d-none');

    // 正解判定・描画
    Array.from(answersWrap.children).forEach(elm => {
      if (elm.textContent === correctVal) {
        elm.appendChild(
          this._createCorrectOrIncorrectIcon('far', 'fa-circle')
        );
        elm.classList.add('is-correct');
      }
    });

    // 不正解判定・描画
    if (answeredElm.textContent !== correctVal) {
      answeredElm.appendChild(
        this._createCorrectOrIncorrectIcon('fas', 'fa-times')
      );
      answeredElm.classList.add('is-incorrect');
      return false;
    }

    this._updateCorrectFlag(this._correctData.id);
    return true;
  }

  /**
   * workテーブルのis_correctフラグをTRUEに更新
   * 
   * @param {String} englishId PKEY
   * @return {undefined} undefined
   */
  async _updateCorrectFlag(englishId) {
    const pkey = englishId;
    const flag = util.FLAG.true;

    try {
      await util.httpRequest('update/is_correct', {
        method: 'POST',
        body: JSON.stringify({ pkey, flag })
      });
    } catch (err) {
      const errObj = await err;
      Modal.show({
        headerText: errObj.title,
        bodyText: errObj.msg
      });
    }
  }
}


class BookmarkButton extends Button {
  /**
   * ブックマークボタン
   * 
   * @param {String} englishId PKEY
   */
  constructor(englishId) {
    super({
      text: 'ブックマーク',
      classNames: [
        'bookmark-btn',
        'primary'
      ],
      iconClassNames: [
        'fas',
        'fa-bookmark'
      ]
    });
    super.setAddEventListener(this._updateBookmarkFlag);
    this._englishId = englishId;
  }

  /**
   * workテーブルのbookmarkフラグをTRUEに更新
   * 
   * @param {Event} e イベント
   * @return {undefined} undefined
   */
  _updateBookmarkFlag = async (e) => {
    const pkey = this._englishId;
    const flag = util.FLAG.true;
    const bookmarkBtn = e.target.closest('.bookmark-btn');

    bookmarkBtn.classList.add(...['event-none', 'secondary']);

    try {
      await util.httpRequest('update/bookmark', {
        method: 'POST',
        body: JSON.stringify({ pkey, flag })
      });
      bookmarkBtn.children[0].classList.add(...['far', 'fa-check-circle']);
      bookmarkBtn.children[1].textContent = '完了';
    } catch (err) {
      const errObj = await err;
      Modal.show({
        headerText: errObj.title,
        bodyText: errObj.msg
      });
    }
  }
}


class NextButton extends Button {
  /**
   * 次へボタン
   * 
   * @param {Object} learningData 次の学習データ
   */
  constructor(learningData) {
    super({
      text: '次へ',
      classNames: [
        'next-btn',
        'primary',
      ],
      iconClassNames: [
        'fas',
        'fa-arrow-right'
      ]
    });
    super.setAddEventListener(this._renderNext);
    this._learningData = learningData;
  }

  /**
   * 次の学習データを描画
   * 
   * @return {undefined} undefined
   */
  _renderNext = () => {
    const learningElm = LearningComponent.prototype.createLearningWrap(
      this._learningData
    );

    document.getElementById('learningWrap').remove();
    learningElm.then(elm => document.getElementById('main').appendChild(elm));
  }
}


export class LearningComponent {
  /**
   * コンポーネント集約
   * 
   * @param {String} componentName コンポーネント名
   */
  constructor(componentName) {
    this._learningData = this._getLearningData(componentName);
    this._initialLearningElm = this.createLearningWrap(this._learningData);
  }

  /**
   * 要素返却
   * 
   * @return {Element} 学習コンポーネント
   */
  get component() {
    return this._initialLearningElm.then(elm => elm);
  }

  /**
   * 学習データ取得
   * 
   * @param {String} componentName コンポーネント名
   * @return {Object} 学習データ
   */
  async _getLearningData(componentName) {
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
   * 学習生成(ラッパー)
   * 
   * @param {Array} learningData 学習データ
   * @return {Object} 学習データ
   */
  async createLearningWrap(learningData) {
    const _learningData = await learningData;

    if (!_learningData.length) {
      return util.createErrorMsg({
        classNames: ['tx-center'],
        text: util.COMMON_TEXT.NOT_EXIST_DATA
      });
    }

    const { id, english, correct, incorrect_1, incorrect_2, incorrect_3, bookmark_flag } = _learningData.shift();
    const correctData = { id, correct };

    return util.createWrap({
      classNames: [
        'card',
        'learning-wrap',
        'component-wrap'
      ],
      innerElm: [
        this._createEnglish(english),
        this._createAnswer(
          correctData,
          correct,
          incorrect_1,
          incorrect_2,
          incorrect_3
        ),
        util.createWrap({
          id: 'learningButtonWrap',
          classNames: [
            'learning-btn-wrap',
            'd-none',
          ],
          innerElm: [
            this._createLeftBtnWrap(id, english, bookmark_flag),
            this._createRightBtnWrap(learningData)
          ]
        })
      ]
    });
  }

  /**
   * 英語生成
   * 
   * @param {String} english 英語
   * @return {Element} 英語
   */
  _createEnglish(english) {
    const englishInst = new English(english);

    return englishInst.component;
  }

  /**
   * 回答生成
   * 
   * @param {Object} correctData 正解データ
   * @param {Array} elms 回答
   * @return {Element} 回答
   */
  _createAnswer(correctData, ...elms) {
    const answerInst = new Answer(correctData, elms);

    return answerInst.component;
  }

  /**
   * ボタン生成(ラッパー左側)
   * - 発音ボタン生成
   * - ブックマークボタン生成
   * 
   * @param {Number} id PKEY
   * @param {String} english 英語
   * @param {Boolean} bookmarkFlag ブックマークフラグ
   * @return {Element} ボタン(ラッパー左側)
   */
  _createLeftBtnWrap(id, english, bookmarkFlag) {
    const pronounceButtonInst = new PronounceButton(english);

    if (bookmarkFlag) {
      return util.createWrap({
        classNames: ['btn-wrap'],
        innerElm: [pronounceButtonInst.component]
      });
    }
    const bookmarkButtonInst = new BookmarkButton(id);

    return util.createWrap({
      classNames: ['btn-wrap'],
      innerElm: [
        pronounceButtonInst.component,
        bookmarkButtonInst.component
      ]
    });
  }

  /**
   * ボタン生成(ラッパー右側)
   * - 次へボタン生成
   * 
   * @param {Object} learningData 学習データ
   * @return {Element} ボタン(ラッパー右側)
   */
  _createRightBtnWrap(learningData) {
    const nextButtonInst = new NextButton(learningData);

    return util.createWrap({
      innerElm: [nextButtonInst.component]
    });
  }
}