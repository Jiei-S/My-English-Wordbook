"""pytest

api.py
"""
from datetime import date, timedelta
import json
import os
import pytest
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from module import api
from module import dbaccess
from module import util


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
          '{
            "count": {
              "wordTotal": 1000,
              "isCorrectTotal": 100,
              "bookmarkTotal": 10,
            },
            "activitys": [
              {
                "type_flag": "learning",
                "detail": "英語を習得しました"
              }
            ],
            "learningLog": [
              {
                "count": 10,
                "date": "2020/10/01"
              }
            ],
          }'
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

    def test_open_html_file_001(self):
        """HTML読み込み
        正常ケース

        in:
          index.html
        expect:
          HTMLコード
        """
        with open('index.html', 'r') as file:
            assert self.inst._open_html_file() == file.read()

    def test_count_num_001(self, monkeypatch):
        """登録単語数、習得済み単語数、ブックマーク数カウント
        正常ケース

        in:
          {
            'wordTotal': 1000,
            'isCorrectTotal': 100,
            'bookmarkTotal': 1,
          }
        expect:
          {
            'wordTotal': 1000,
            'isCorrectTotal': 100,
            'bookmarkTotal': 1,
          }
        """
        def mock_count_all(self):
            return 1000

        def mock_count_is_correct(self):
            return 100

        def mock_count_bookmark(self):
            return 1

        monkeypatch.setattr(dbaccess.Word, 'count_all', mock_count_all)
        monkeypatch.setattr(dbaccess.Word, 'count_is_correct', mock_count_is_correct)
        monkeypatch.setattr(dbaccess.Word, 'count_bookmark', mock_count_bookmark)
        assert self.inst._count_num() == {
            'wordTotal': 1000,
            'isCorrectTotal': 100,
            'bookmarkTotal': 1,
        }

    def test_select_activity_order_by_desc_limit_5_001(self, monkeypatch):
        """アクティビティ5件取得
        正常ケース

        in:
          [
            {
              'type': 0,
              'detail': '英語を習得しました'
            },
            {
              'type': 1,
              'detail': '英語を登録しました'
            },
            {
              'type': 2,
              'detail': '英語を削除しました'
            },
            {
              'type': 3,
              'detail': 'ブックマークを登録しました'
            },
            {
              'type': 4,
              'detail': 'ブックマークを解除しました'
            },
          ]
        expect:
          [
            {
              'type': 'learning',
              'detail': '英語を習得しました'
            },
            {
              'type': 'english_list',
              'detail': '英語を登録しました'
            },
            {
              'type': 'english_list',
              'detail': '英語を削除しました'
            },
            {
              'type': 'bookmark',
              'detail': 'ブックマークを登録しました'
            },
            {
              'type': 'bookmark',
              'detail': 'ブックマークを解除しました'
            },
          ]
        """
        def mock_select_activity_order_by_desc_limit_5(self):
            return [
                {
                    'type': 0,
                    'detail': '英語を習得しました'
                },
                {
                    'type': 1,
                    'detail': '英語を登録しました'
                },
                {
                    'type': 2,
                    'detail': '英語を削除しました'
                },
                {
                    'type': 3,
                    'detail': 'ブックマークを登録しました'
                },
                {
                    'type': 4,
                    'detail': 'ブックマークを解除しました'
                },
            ]

        monkeypatch.setattr(
            dbaccess.Activity,
            'select_activity_order_by_desc_limit_5',
            mock_select_activity_order_by_desc_limit_5
        )
        assert self.inst._select_activity_order_by_desc_limit_5() == [
            {
                'type': 'learning',
                'detail': '英語を習得しました'
            },
            {
                'type': 'english_list',
                'detail': '英語を登録しました'
            },
            {
                'type': 'english_list',
                'detail': '英語を削除しました'
            },
            {
                'type': 'bookmark',
                'detail': 'ブックマークを登録しました'
            },
            {
                'type': 'bookmark',
                'detail': 'ブックマークを解除しました'
            },
        ]

    def test_select_count_learning_date_001(self, monkeypatch):
        """習得ログ取得
        正常ケース

        in:
          [
            {
              'count': 0,
              'date': datetime.date.today()
            },
            {
              'count': 1,
              'date': datetime.date.today()
            },
          ]
        expect:
          [
            {
              'count': 0,
              'date': datetime.date.today().strftime('%Y/%m/%d')
            },
            {
              'count': 1,
              'date': datetime.date.today().strftime('%Y/%m/%d')
            },
          ]
        """
        from_date = date.today() - timedelta(days=7)
        to_date = date.today()
        def mock_select_count_learning_date(self, from_date, to_date):
            return [
                {
                    'count': 0,
                    'date': from_date
                },
                {
                    'count': 1,
                    'date': from_date
                },
            ]

        monkeypatch.setattr(
            dbaccess.Activity,
            'select_count_learning_date',
            mock_select_count_learning_date
        )
        assert self.inst._select_count_learning_date() == [
            {
                'count': 0,
                'date': from_date.strftime('%Y/%m/%d')
            },
            {
                'count': 1,
                'date': from_date.strftime('%Y/%m/%d')
            },
        ]


class TestLearningView(object):
    """ 学習画面 """

    def setup(self):
        self.inst = api.LearningView()

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          '[
            {
              "id': 1,
              "english": "english",
              "correct": "日本語",
              "incorrect_1": "日本語_1'",
              "incorrect_2": "日本語_2",
              "incorrect_3": "日本語_3",
              "bookmark_flag": "TRUE"
            },
            {
              "id': 2,
              "english": "english",
              "correct": "日本語",
              "incorrect_1": "日本語_1'",
              "incorrect_2": "日本語_2",
              "incorrect_3": "日本語_3",
              "bookmark_flag": "TRUE"
            },
          ]'

        """
        expect_select_learning = [
            {
                'id': 1,
                'english': 'english',
                'correct': '日本語',
                'incorrect_1': '日本語_1',
                'incorrect_2': '日本語_2',
                'incorrect_3': '日本語_3',
                'bookmark_flag': 'TRUE'
            },
            {
                'id': 2,
                'english': 'english',
                'correct': '日本語',
                'incorrect_1': '日本語_1',
                'incorrect_2': '日本語_2',
                'incorrect_3': '日本語_3',
                'bookmark_flag': 'TRUE'
            },
        ]
        def mock_select_learning():
            return expect_select_learning

        monkeypatch.setattr(self.inst, '_select_learning', mock_select_learning)
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps(expect_select_learning)

    def test_select_learning_001(self, monkeypatch):
        """学習データ取得
        正常ケース

        in_01:
          [
            {
              'id': 1,
              'english': 'english',
              'japanese': '日本語',
              'bookmark': 'TRUE'
            },
          ]
        in_02:
          [['日本語_1']]
        expect:
          [
            {
              'id': 1,
              'english': 'english',
              'correct': '日本語',
              'incorrect_1': '日本語_1',
              'incorrect_2': '日本語_1',
              'incorrect_3': '日本語_1',
              'bookmark_flag': 'TRUE'
            },
          ]
        """
        def mock_select_learning(self):
            return [
                {
                    'id': 1,
                    'english': 'english',
                    'japanese': '日本語',
                    'bookmark': 'TRUE'
                },
            ]

        def mock_select_incorrect(self):
            return [['日本語_1']]

        monkeypatch.setattr(dbaccess.Word, 'select_learning', mock_select_learning)
        monkeypatch.setattr(dbaccess.Word, 'select_incorrect', mock_select_incorrect)
        assert self.inst._select_learning() == [
            {
                'id': 1,
                'english': 'english',
                'correct': '日本語',
                'incorrect_1': '日本語_1',
                'incorrect_2': '日本語_1',
                'incorrect_3': '日本語_1',
                'bookmark_flag': 'TRUE'
            },
        ]

    @pytest.mark.parametrize('input_01, input_02, expect', [
        (
            [
                {
                    'id': 1,
                    'english': 'english',
                    'japanese': '日本語',
                    'bookmark': 'TRUE'
                },
            ],
            [
                ['日本語_1'],
            ],
            [
                {
                    'id': 1,
                    'english': 'english',
                    'correct': '日本語',
                    'incorrect_1': '日本語_1',
                    'incorrect_2': '日本語_1',
                    'incorrect_3': '日本語_1',
                    'bookmark_flag': 'TRUE'
                },
            ]
        ),
        (
            [],
            [],
            []
        ),
    ])
    def test_convert_to_learning_for_display_001(self, input_01, input_02, expect):
        """学習データを表示用に変換
        正常ケース

        in_01:
          [
            {
              'id': 1,
              'english': 'english',
              'japanese': '日本語',
              'bookmark': 'TRUE'
            },
          ]
        im_02:
          [['日本語_1']]
        expect:
          [
            {
              'id': 1,
              'english': 'english',
              'correct': '日本語',
              'incorrect_1': '日本語_1',
              'incorrect_2': '日本語_1',
              'incorrect_3': '日本語_1',
              'bookmark_flag': 'TRUE'
            },
          ]
        in_01:
          []
        im_02:
          []
        expect:
          []
        """
        assert self.inst._convert_to_learning_for_display(input_01, input_02) ==\
            expect


class TestEnglishListView(object):
    """ 単語一覧画面 """

    def setup(self):
        self.inst = api.EnglishListView()

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          '[
            {
              "id': 1,
              "english": "english",
              "japanese": "日本語",
              'is_correct': 'TRUE'
            },
            {
              "id': 2,
              "english": "english",
              "japanese": "日本語",
              'is_correct': 'TRUE'
            },
          ]'

        """
        expect_select_english_list = [
            {
                'id': 1,
                'english': 'english',
                'japanese': '日本語',
                'is_correct': 'TRUE'
            },
            {
                'id': 2,
                'english': 'english',
                'japanese': '日本語',
                'is_correct': 'TRUE'
            },
        ]
        def mock_select_english_list():
            return expect_select_english_list

        monkeypatch.setattr(self.inst, '_select_english_list', mock_select_english_list)
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps(expect_select_english_list)

    def test_select_english_list_001(self, monkeypatch):
        """単語一覧データ取得
        正常ケース

        in:
          [
            {
              'id': 1,
              'english': 'english',
              'japanese': '日本語',
              'is_correct': 'TRUE'
            },
            {
              'id': 2,
              'english': 'english',
              'japanese': '日本語',
              'is_correct': 'FALSE'
            },
          ]
        expect:
          [
            {
              'id': 1,
              'english': 'english',
              'japanese': '日本語',
              'is_correct': 'TRUE'
            },
            {
              'id': 2,
              'english': 'english',
              'japanese': '日本語',
              'is_correct': 'FALSE'
            },
          ]
        """
        expect_select_english_list = [
            {
                'id': 1,
                'english': 'english',
                'japanese': '日本語',
                'is_correct': 'TRUE'
            },
            {
                'id': 2,
                'english': 'english',
                'japanese': '日本語',
                'is_correct': 'FALSE'
            },
        ]
        def mock_select_english_list(self):
            return expect_select_english_list

        monkeypatch.setattr(
            dbaccess.Word,
            'select_english_list',
            mock_select_english_list
        )
        assert self.inst._select_english_list() == expect_select_english_list


class TestBookMarkView(object):
    """ ブックマーク画面 """

    def setup(self):
        self.inst = api.BookMarkView()

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          '[
            {
              "id': 1,
              "english": "english",
              "japanese": "日本語",
            },
            {
              "id': 2,
              "english": "english",
              "japanese": "日本語",
            },
          ]'

        """
        expect_select_bookmark = [
            {
                'id': 1,
                'english': 'english',
                'japanese': '日本語',
            },
            {
                'id': 2,
                'english': 'english',
                'japanese': '日本語',
            },
        ]
        def mock_select_bookmark():
            return expect_select_bookmark

        monkeypatch.setattr(self.inst, '_select_bookmark', mock_select_bookmark)
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps(expect_select_bookmark)

    def test_select_bookmark_001(self, monkeypatch):
        """ブックマークデータ取得
        正常ケース

        in:
          [
            {
              'id': 1,
              'english': 'english',
              'japanese': '日本語',
            },
            {
              'id': 2,
              'english': 'english',
              'japanese': '日本語',
            },
          ]
        expect:
          [
            {
              'id': 1,
              'english': 'english',
              'japanese': '日本語',
            },
            {
              'id': 2,
              'english': 'english',
              'japanese': '日本語',
            },
          ]
        """
        expect_select_bookmark = [
            {
                'id': 1,
                'english': 'english',
                'japanese': '日本語',
            },
            {
                'id': 2,
                'english': 'english',
                'japanese': '日本語',
            },
        ]
        def mock_select_bookmark(self):
            return expect_select_bookmark

        monkeypatch.setattr(
            dbaccess.Word,
            'select_bookmark',
            mock_select_bookmark
        )
        assert self.inst._select_bookmark() == expect_select_bookmark


class TestActivityView(object):
    """ アクティビティ一覧画面 """
    def setup(self):
        self.inst = api.ActivityView()

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          [
            {
              'date': '2020/10/01',
              'type_flag': 'learning',
              'detail': '英語を習得しました'
            }
          ]
        """
        expect_select_all = [
            {
                'date': '2020/10/01',
                'type_flag': 'learning',
                'detail': '英語を習得しました'
            }
        ]

        def mock_select_all():
            return expect_select_all

        monkeypatch.setattr(self.inst, '_select_all', mock_select_all)
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps(expect_select_all)

    def test_select_all_001(self, monkeypatch):
        """アクティビティ一覧データ取得
        正常ケース

        in:
          [
            {
              'date': datetime.date.today()
              'type': 0,
              'detail': '英語を習得しました'
            },
            {
              'date': datetime.date.today()
              'type': 1,
              'detail': '英語を登録しました'
            },
            {
              'date': datetime.date.today()
              'type': 2,
              'detail': '英語を削除しました'
            },
            {
              'date': datetime.date.today()
              'type': 3,
              'detail': 'ブックマークを登録しました'
            },
            {
              'date': datetime.date.today()
              'type': 4,
              'detail': 'ブックマークを解除しました'
            },
          ]
        expect:
          [
            {
              'date': datetime.date.today().strftime('%Y/%m/%d')
              'type': 'learning',
              'detail': '英語を習得しました'
            },
            {
              'date': datetime.date.today().strftime('%Y/%m/%d')
              'type': 'english_list',
              'detail': '英語を登録しました'
            },
            {
              'date': datetime.date.today().strftime('%Y/%m/%d')
              'type': 'english_list',
              'detail': '英語を削除しました'
            },
            {
              'date': datetime.date.today().strftime('%Y/%m/%d')
              'type': 'bookmark',
              'detail': 'ブックマークを登録しました'
            },
            {
              'date': datetime.date.today().strftime('%Y/%m/%d')
              'type': 'bookmark',
              'detail': 'ブックマークを解除しました'
            },
          ]
        """
        _date = date.today()
        def mock_select_all(self):
            return [
                {
                    'date': _date,
                    'type': 0,
                    'detail': '英語を習得しました'
                },
                {
                    'date': _date,
                    'type': 1,
                    'detail': '英語を登録しました'
                },
                {
                    'date': _date,
                    'type': 2,
                    'detail': '英語を削除しました'
                },
                {
                    'date': _date,
                    'type': 3,
                    'detail': 'ブックマークを登録しました'
                },
                {
                    'date': _date,
                    'type': 4,
                    'detail': 'ブックマークを解除しました'
                },
            ]

        monkeypatch.setattr(dbaccess.Activity, 'select_all', mock_select_all)
        assert self.inst._select_all() == [
            {
                'date': _date.strftime('%Y/%m/%d'),
                'type': 'learning',
                'detail': '英語を習得しました'
            },
            {
                'date': _date.strftime('%Y/%m/%d'),
                'type': 'english_list',
                'detail': '英語を登録しました'
            },
            {
                'date': _date.strftime('%Y/%m/%d'),
                'type': 'english_list',
                'detail': '英語を削除しました'
            },
            {
                'date': _date.strftime('%Y/%m/%d'),
                'type': 'bookmark',
                'detail': 'ブックマークを登録しました'
            },
            {
                'date': _date.strftime('%Y/%m/%d'),
                'type': 'bookmark',
                'detail': 'ブックマークを解除しました'
            },
        ]


class TestUpdateIsCorrectFlagView(object):
    """ is_correctフラグ更新 """
    def setup(self):
        self.inst = api.UpdateIsCorrectFlagView('{"pkey": "1", "flag": "TRUE"}')

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          '{"msg": "englishを習得しました"}'
        """
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps({'msg': 'englishを習得しました'})

    def test_validate_001(self):
        """更新データバリデーション
        正常ケース

        expect:
          {'pkey': 1, 'flag': 'TRUE'}
        """
        return self.inst._validate() == {'pkey': 1, 'flag': 'TRUE'}

    def test_update_is_correct_flag_001(self, monkeypatch):
        """is_correctフラグ更新
        正常ケース

        in:
          {'pkey': 1, 'flag': 'TRUE'}
        expect:
          'englishを習得しました'
        """
        expect_update_is_correct_flag = 'english'
        def mock_update_is_correct_flag(self, pkey, flag):
            return expect_update_is_correct_flag

        monkeypatch.setattr(
            dbaccess.Word,
            'update_is_correct_flag',
            mock_update_is_correct_flag
        )
        assert self.inst._update_is_correct_flag({'pkey': 1, 'flag': 'TRUE'}) ==\
            f'{expect_update_is_correct_flag}を習得しました'

    @pytest.mark.parametrize('input_01, input_02, expect', [
        ('english', 'TRUE', 'englishを習得しました'),
        ('english', 'FALSE', 'englishを未習得に変更しました'),
    ])
    def test_register_activity_001(self, monkeypatch, input_01, input_02, expect):
        """アクティビティ登録
        正常ケース

        in_01:
          'english'
        in_02:
          'TRUE'
        expect:
          'englishを習得しました'
        in_01:
          'english'
        in_02:
          'FALSE'
        expect:
          'englishを未習得に変更しました'
        """
        assert self.inst._register_activity(input_01, input_02) == expect


class TestUpdateBookmarkView(object):
    """ bookmarkフラグ更新 """
    def setup(self):
        self.inst = api.UpdateBookmarkView('{"pkey": "1", "flag": "TRUE"}')

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          '{"msg": "englishをブックマーク登録しました"}'
        """
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps({'msg': 'englishをブックマーク登録しました'})

    def test_validate_001(self):
        """更新データバリデーション
        正常ケース

        expect:
          {'pkey': 1, 'flag': 'TRUE'}
        """
        return self.inst._validate() == {'pkey': 1, 'flag': 'TRUE'}

    def test_update_bookmark_flag_001(self, monkeypatch):
        """bookmarkフラグ更新
        正常ケース

        in:
          {'pkey': 1, 'flag': 'TRUE'}
        expect:
          'englishをブックマーク登録しました'
        """
        expect_update_bookmark_flag = 'english'
        def mock_update_bookmark_flag(self, pkey, flag):
            return expect_update_bookmark_flag

        monkeypatch.setattr(
            dbaccess.Word,
            'update_bookmark_flag',
            mock_update_bookmark_flag
        )
        assert self.inst._update_bookmark_flag({'pkey': 1, 'flag': 'TRUE'}) ==\
             f'{expect_update_bookmark_flag}をブックマーク登録しました'

    @pytest.mark.parametrize('input_01, input_02, expect', [
        ('english', 'TRUE', 'englishをブックマーク登録しました'),
        ('english', 'FALSE', 'englishをブックマーク解除しました'),
    ])
    def test_register_activity_001(self, monkeypatch, input_01, input_02, expect):
        """アクティビティ登録
        正常ケース

        in_01:
          'english'
        in_02:
          'TRUE'
        expect:
          'englishをブックマーク登録しました'
        in_01:
          'english'
        in_02:
          'FALSE'
        expect:
          'englishをブックマーク解除しました'
        """
        assert self.inst._register_activity(input_01, input_02) == expect


class TestRegisterWordView(object):
    """ 単語登録 """
    def setup(self):
        self.inst = api.RegisterWordView('{"eng_val": "english", "jap_val": "日本語"}')

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          '{"msg": "英語: english 日本語: 日本語 を登録しました"}'
        """
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps({'msg': '英語: english 日本語: 日本語 を登録しました'})

    def test_validate_001(self):
        """登録データバリデーション
        正常ケース

        expect:
          {'eng_val': 'english', 'jap_val': '日本語'}
        """
        return self.inst._validate() == {'eng_val': 'english', 'jap_val': '日本語'}

    def test_insert_001(self, monkeypatch):
        """英語登録
        正常ケース

        in:
          {'eng_val': 'english', 'jap_val': '日本語'}
        expect:
          '英語: english 日本語: 日本語 を登録しました'
        """
        assert self.inst._insert({'eng_val': 'english', 'jap_val': '日本語'}) ==\
            '英語: english 日本語: 日本語 を登録しました'

    def test_register_activity_001(self, monkeypatch):
        """アクティビティ登録
        正常ケース

        in_01:
          'english'
        in_02:
          '日本語'
        expect:
          '英語: english 日本語: 日本語 を登録しました'
        """
        assert self.inst._register_activity('english', '日本語') ==\
            '英語: english 日本語: 日本語 を登録しました'


class TestDeleteView(object):
    """ 削除 """
    def setup(self):
        self.inst = api.DeleteView('{"pkey": "1"}')
        self.db = dbaccess.Word()

    def test_view_001(self, monkeypatch):
        """レスポンス
        正常ケース

        expect:
          '{"msg": "englishを削除しました"}'
        """
        result = self.inst.view()

        assert isinstance(result, api.JsonResponse)
        assert result.status == '200 OK'
        assert result.content_type == 'application/json'
        assert result.body == json.dumps({'msg': 'englishを削除しました'})

    def test_validate_001(self):
        """削除データバリデーション
        正常ケース

        expect:
          {'pkey': 1}
        """
        return self.inst._validate() == {'pkey': 1}

    def test_delete_001(self, monkeypatch):
        """英語削除
        正常ケース

        in:
          {'pkey': 1}
        expect:
          'englishを削除しました'
        """
        assert self.inst._delete({'pkey': 1}) == 'englishを削除しました'

    def test_register_activity_001(self, monkeypatch):
        """アクティビティ登録
        正常ケース

        in:
          'english'
        expect:
          'englishを削除しました'
        """
        assert self.inst._register_activity('english') ==\
            'englishを削除しました'
