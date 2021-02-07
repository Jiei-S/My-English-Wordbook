/* 
    単語登録
 */
'use strict';
import { Button, Heading, Modal, util } from './component.js';


class RegisterRunButton extends Button {
  /**
   * 単語登録ボタン
   */
  constructor() {
    super({
      text: '登録',
      classNames: ['primary'],
      iconClassNames: [
        'far',
        'fa-check-circle'
      ]
    });
    super.setAddEventListener(this._registerRun);
  }

  /**
   * 登録
   * 
   * @return {undefined} undefined
   */
  _registerRun = async () => {
    const eng_val = this._validateEnglish(document.getElementById('english'));
    const jap_val = this._validateJapanese(document.getElementById('japanese'));

    if (eng_val && jap_val) {
      try {
        await util.httpRequest('register/word', {
          method: 'POST',
          body: JSON.stringify({ eng_val, jap_val })
        });
        Modal.show({
          headerText: '登録完了',
          bodyText: `英語: ${eng_val} 日本語: ${jap_val}の登録が完了しました`,
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

  /**
   * バリデーション共通
   * 
   * @param {String} value 登録値
   * @return {String} value 登録値
   */
  _validateCommon(value) {
    const valueLen = value.length;

    if ((!valueLen) || (valueLen > util.MAX_WORD_SIZE)) {
      return false;
    }
    return value;
  }

  /**
   * バリデーション英語
   * 
   * @param {Element} englishElm 英語
   * @return {Boolean} false フォーマットエラーケース
   * @return {String} eng_val 英語
   */
  _validateEnglish(englishElm) {
    const eng_val = englishElm.value;
    const errMsgElm = englishElm.nextElementSibling;

    errMsgElm.textContent = null;
    if (!this._validateCommon(eng_val)) {
      errMsgElm.textContent = `文字数は1から${util.MAX_WORD_SIZE}文字で入力してください`;
      return false;
    }
    if ((!eng_val.match(/^[A-Za-z ]*$/)) || (!eng_val.match(/\S/g))) {
      errMsgElm.textContent = '半角大文字小文字の英語を入力してください';
      return false;
    }
    return eng_val;
  }

  /**
   * バリデーション日本語
   * 
   * @param {Element} japaneseElm 日本語
   * @return {Boolean} false フォーマットエラーケース
   * @return {String} jap_val 日本語
   */
  _validateJapanese(japaneseElm) {
    const jap_val = japaneseElm.value;
    const errMsgElm = japaneseElm.nextElementSibling;

    if (!this._validateCommon(jap_val)) {
      errMsgElm.textContent = `文字数は1から${util.MAX_WORD_SIZE}文字で入力してください`;
      return false;
    }
    return jap_val;
  }
}

class RegisterCancelButton extends Button {
  /**
   * キャンセルボタン
   */
  constructor() {
    super({
      text: 'キャンセル',
      classNames: ['secondary'],
      iconClassNames: [
        'far',
        'fa-times-circle'
      ]
    });
    super.setAddEventListener(() => { location.href = '/'; });
  }
}


class RegisterForm {
  /**
   * 登録フォーム
   */
  constructor() {
    this._fieldData = [
      {
        label: '英語',
        createFiled: () => {
          return this._createInputTextField({
            id: 'english',
            validate: this._validateEnglish
          });
        }
      },
      {
        label: '日本語',
        createFiled: () => {
          return this._createInputTextField({
            id: 'japanese',
          });
        }
      },
    ];
  }

  /**
   * 要素返却
   * 
   * @return {Element} 登録フォーム
   */
  get component() {
    return this._create();
  }

  /**
   * 登録フォーム生成(ラッパー)
   * 
   * @return {Element} 登録フォーム
   */
  _create() {
    return util.createDocumentFragment(this._fieldData.map(data => {
      return util.createWrap({
        classNames: ['form-group'],
        innerElm: [
          this._createLabel({ text: data.label }),
          data.createFiled(),
        ]
      });
    }));
  }

  /**
   * ラベル生成
   * 
   * @return {Element} label ラベル
   */
  _createLabel({ id = null, classNames = null, text }) {
    const label = document.createElement('label');

    label.textContent = text;
    label.id = id || '';
    if (classNames) {
      label.classList.add(...classNames);
    }
    return label;
  }

  /**
   * テキストフィールド生成
   * 
   * @return {Element} テキストフィールド
   */
  _createInputTextField({ id = null, classNames = null, validate = null }) {
    const input = document.createElement('input');

    input.type = 'text';
    input.id = id || '';
    input.addEventListener('change', validate);
    if (classNames) {
      input.classList.add(...classNames);
    }
    return util.createDocumentFragment([
      input,
      util.createErrorMsg()
    ]);
  }

  /**
   * バリデーション英語
   * 
   * @param {Event} e イベント
   * @return {Boolean} false フォーマットエラーケース
   * @return {String} eng_val 英語
   */
  _validateEnglish(e) {
    const eng_val = e.target.value;
    const errMsgElm = e.target.nextElementSibling;

    errMsgElm.textContent = null;
    if ((!eng_val.match(/^[A-Za-z ]*$/)) || (!eng_val.match(/\S/g))) {
      errMsgElm.textContent = '半角大文字小文字の英語を入力してください';
      return false;
    }
    return eng_val;
  }
}


export class RegisterComponent {
  /**
   * コンポーネント集約
   */
  constructor() {
    this._registerElm = this._createRegisterWrap();
  }

  /**
   * 要素返却
   * 
   * @return {Element} 単語登録コンポーネント
   */
  get component() {
    return this._registerElm;
  }

  /**
   * 単語登録生成(ラッパー)
   * 
   * @return {Element} 単語登録
   */
  _createRegisterWrap() {
    return util.createDocumentFragment([
      this._createHeading(),
      this._createRegisterForm(),
    ]);
  }

  /**
   * ヘディング生成
   * 
   * @return {Element} ヘディング
   */
  _createHeading() {
    const headingInst = new Heading({ text: '単語登録' });

    return headingInst.component;
  }

  /**
   * 単語登録フォーム生成
   * 
   * @return {Element} 単語登録フォーム
   */
  _createRegisterForm() {
    const registerFormInst = new RegisterForm();

    return util.createWrap({
      id: 'registerFormWrap',
      classNames: [
        'card',
        'register-form-wrap',
        'component-wrap'
      ],
      innerElm: [
        registerFormInst.component,
        this._createButtonWrap()
      ]
    });
  }

  /**
   * ボタン生成
   * 
   * @return {Element} ボタン
   */
  _createButtonWrap() {
    const registerRunButtonInst = new RegisterRunButton();
    const registerCancelButtonInst = new RegisterCancelButton();

    return util.createWrap({
      classNames: [
        'btn-wrap',
        'tx-right'
      ],
      innerElm: [
        registerRunButtonInst.component,
        registerCancelButtonInst.component
      ]
    });
  }
}