"""pytest

api.py
"""
import json
import os
import pytest
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from module import api


class TestResponseBase(object):
    """ レスポンス基底 """
    def setup(self):
        self.inst = api.ResponseBase('application/json', 'body')

    def test_status_001(self):
        """ステータスコード
        正常ケース

        in:
          '200 OK'
        expect:
          '200 OK'
        """
        assert self.inst.status == '200 OK'

    def test_content_type_001(self):
        """コンテンツタイプ
        正常ケース
        
        in:
          'application/json'
        expect:
          'application/json'
        """
        assert self.inst.content_type == 'application/json'

    def test_body_001(self):
        """ボディ
        正常ケース

        in:
          'body'
        expect:
          'body'
        """
        assert self.inst.body == 'body'


class TestHtmlResponse(object):
    """ HTMLレスポンス """
    def setup(self):
        self.inst = api.HtmlResponse('body')

    def test_status_001(self):
        """ステータスコード
        正常ケース

        in:
          '200 OK'
        expect:
          '200 OK'
        """
        assert self.inst.status == '200 OK'

    def test_content_type_001(self):
        """コンテンツタイプ
        正常ケース
        
        in:
          'text/html'
        expect:
          'text/html'
        """
        assert self.inst.content_type == 'text/html'

    def test_body_001(self):
        """ボディ
        正常ケース

        in:
          'body'
        expect:
          'body'
        """
        assert self.inst.body == 'body'


class TestStaticResponse(object):
    """ 静的データレスポンス """
    def setup(self):
        self.inst = api.StaticResponse('static/js/component.js', 'js')

    def test_status_001(self):
        """ステータスコード
        正常ケース

        in:
          '200 OK'
        expect:
          '200 OK'
        """
        assert self.inst.status == '200 OK'

    def test_content_type_001(self):
        """コンテンツタイプ
        正常ケース
        
        in:
          'text/javascript'
        expect:
          'text/javascript'
        """
        assert self.inst.content_type == 'text/javascript'

    def test_body_001(self):
        """ボディ
        正常ケース

        in:
          'static/js/component.js'
        expect:
          JSコード
        """
        with open('static/js/component.js', 'r') as file:
            assert self.inst.body == file.read()


class TestJsonResponse(object):
    """ JSONレスポンス """
    def setup(self):
        self.inst = api.JsonResponse({'id': 10})

    def test_status_001(self):
        """ステータスコード
        正常ケース

        in:
          '200 OK'
        expect:
          '200 OK'
        """
        assert self.inst.status == '200 OK'

    def test_content_type_001(self):
        """コンテンツタイプ
        正常ケース
        
        in:
          'application/json'
        expect:
          'application/json'
        """
        assert self.inst.content_type == 'application/json'

    def test_body_001(self):
        """ボディ
        正常ケース

        in:
          {'id': 10}
        expect:
          '{"id": 10}'
        """
        assert self.inst.body == '{"id": 10}'


class TestValidate(object):
    """ バリデーション """
    def setup(self):
        self.inst = api.Validate('{"pkey": "1", "flag": "TRUE"}')

    def test_validate_json_001(self):
        """JSONバリデーション(is_correct、bookmarkフラグ更新)
        正常ケース

        in:
          '{"pkey": "1", "flag": "TRUE"}'
        expect:
          {'pkey': '1', 'flag': 'TRUE'}
        """
        assert self.inst._validate_json('{"pkey": "1", "flag": "TRUE"}') ==\
            {'pkey': '1', 'flag': 'TRUE'}

    def test_validate_json_002(self):
        """JSONバリデーション(単語登録)
        正常ケース

        in:
          '{"eng_val": "english", "jap_val": "日本語"}'
        expect:
          {'eng_val': 'english', 'jap_val': '日本語'}
        """
        assert self.inst._validate_json('{"eng_val": "english", "jap_val": "日本語"}') ==\
            {'eng_val': 'english', 'jap_val': '日本語'}

    def test_validate_json_003(self):
        """JSONバリデーション(単語削除)
        正常ケース

        in:
          '{"pkey": "1"}'
        expect:
          {'pkey': '1'}
        """
        assert self.inst._validate_json('{"pkey": "1"}') == {'pkey': '1'}

    @pytest.mark.parametrize('input', [
        ({"pkey": "1", "flag": "TRUE"}),
        ('str'),
    ])
    def test_validate_json_004(self, input):
        """JSONバリデーション
        エラーケース

        in:
          {"pkey": "1", "flag": "TRUE"}
        expect:
          ValueError
        in:
          'str'
        expect:
          ValueError
        """
        with pytest.raises(ValueError):
            self.inst._validate_json(input)

    def test_validate_pkey_flag_001(self, monkeypatch):
        """フラグ更新バリデーション
        正常ケース

        in:
          {'pkey': '1', 'flag': 'TRUE'}
        expect:
          {'pkey': 1, 'flag': 'TRUE'}
        """
        def mock_validate_pkey():
            return 1

        def mock_validate_flag():
            return 'TRUE'

        monkeypatch.setattr(self.inst, 'validate_pkey', mock_validate_pkey)
        monkeypatch.setattr(self.inst, 'validate_flag', mock_validate_flag)
        assert self.inst.validate_pkey_flag() == {'pkey': 1, 'flag': 'TRUE'}

    def test_validate_register_001(self):
        """単語登録バリデーション
        正常ケース

        in:
          {'eng_val': 'english', 'jap_val': '日本語'}
        expect:
          {'eng_val': 'english', 'jap_val': '日本語'}
        """
        self.inst = api.Validate('{"eng_val": "english", "jap_val": "日本語"}')

        assert self.inst.validate_register(
        ) == {'eng_val': 'english', 'jap_val': '日本語'}

    def test_validate_pkey_001(self):
        """PKEYバリデーション
        正常ケース

        in:
          {'pkey': '1'}
        expect:
          1
        """
        self.inst = api.Validate('{"pkey": "1"}')

        assert self.inst.validate_pkey() == 1

    @pytest.mark.parametrize('input', [
        ('{"pkey": ""}'),
        ('{"pkey": {}}'),
        ('{"KeyError": "1"}'),
    ])
    def test_validate_pkey_002(self, input):
        """PKEYバリデーション
        エラーケース

        in:
          '{"pkey": ""}'
        expect:
          ValueError
        in:
          '{"pkey": {}}'
        expect:
          ValueError
        in:
          '{"KeyError": "1"}'
        expect:
          ValueError
        """
        self.inst = api.Validate(input)

        with pytest.raises(ValueError):
            self.inst.validate_pkey()

    def test_validate_flag_001(self):
        """フラグバリデーション(TRUE)
        正常ケース

        in:
          {'flag': 'TRUE'}
        expect:
          'TRUE'
        """
        self.inst = api.Validate('{"pkey": "1", "flag": "TRUE"}')

        assert self.inst.validate_flag() == 'TRUE'

    def test_validate_flag_002(self):
        """フラグバリデーション(FALSE)
        正常ケース

        in:
          {'flag': 'FALSE'}
        expect:
          'FALSE'
        """
        self.inst = api.Validate('{"pkey": "1", "flag": "FALSE"}')

        assert self.inst.validate_flag() == 'FALSE'

    @pytest.mark.parametrize('input', [
        ('{"flag": "true"}'),
        ('{"flag": "false"}'),
        ('{"flag": {}}'),
        ('{"KeyError": "TRUE"}'),
    ])
    def test_validate_flag_003(self, input):
        """フラグバリデーション
        エラーケース

        in:
          '{"flag": "true"}'
        expect:
          ValueError
        in:
          '{"flag": "false"}'
        expect:
          ValueError
        in:
          '{"flag": {}}'
        expect:
          ValueError
        in:
          '{"KeyError": "TRUE"}'
        expect:
          ValueError
        """
        self.inst = api.Validate(input)

        with pytest.raises(ValueError):
            self.inst.validate_flag()

    def test_validate_english_001(self):
        """英語バリデーション
        正常ケース

        in:
          {'eng_val': 'english'}
        expect:
          'english'
        """
        self.inst = api.Validate('{"eng_val": "english", "jap_val": "日本語"}')

        assert self.inst.validate_english() == 'english'

    @pytest.mark.parametrize('input', [
        ('{"eng_val": ""}'),
        ('{"eng_val": {}}'),
        ('{"KeyError": "english"}'),
    ])
    def test_validate_english_002(self, input):
        """英語バリデーション
        エラーケース

        in:
          '{"eng_val": ""}'
        expect:
          ValueError
        in:
          '{"eng_val": {}}'
        expect:
          ValueError
        in:
          '{"KeyError": "english"}'
        expect:
          ValueError
        """
        self.inst = api.Validate(input)

        with pytest.raises(ValueError):
            self.inst.validate_english()


class TestDashboardView(object):
    """ ダッシュボード画面 """
    def setup(self):
        self.inst = api.DashboardView()

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          {
            'wordTotal': 1000,
            'isCorrectTotal': 100,
            'bookmarkTotal': 10,
          }
        """
        expect_count_num = {
            'wordTotal': 1000,
            'isCorrectTotal': 100,
            'bookmarkTotal': 10,
        }
        expect_select_activity_order_by_desc_limit_5 = [
            {
                'type_flag': 'learning',
                'detail': '英語を習得しました'
            }
        ]
        expect_select_count_learning_date = [
            {
                'count': 10,
                'date': '2020/10/01'
            }
        ]

        def mock_count_num():
            return expect_count_num

        def mock_select_activity_order_by_desc_limit_5():
            return expect_select_activity_order_by_desc_limit_5

        def mock_select_count_learning_date():
            return expect_select_count_learning_date

        monkeypatch.setattr(self.inst, '_count_num', mock_count_num)
        monkeypatch.setattr(
            self.inst,
            '_select_activity_order_by_desc_limit_5',
            mock_select_activity_order_by_desc_limit_5
        )
        monkeypatch.setattr(
            self.inst,
            '_select_count_learning_date',
            mock_select_count_learning_date
        )
        result = self.inst.view()

        assert isinstance(result, api.HtmlResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'text/html'
        assert result.body == self.inst._body.format(dashboardData=json.dumps({
            'count': expect_count_num,
            'activitys': expect_select_activity_order_by_desc_limit_5,
            'learningLog': expect_select_count_learning_date
        }))