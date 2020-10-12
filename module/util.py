"""
汎用
"""
from module.dbaccess import (
    Activity, DbOperationError
)


def open_html_file(file):
    """HTML読み込み

    @param file HTMLファイル
    @return ファイルの内容
    @exception FileNotFoundError
    """
    try:
        with open(file, 'r') as f:
            return f.read()
    except FileNotFoundError as err:
        raise FileNotFoundError(err)


def db_operation(func):
    """DB操作デコレータ

    @param func メソッド
    @return メソッド
    @exception DbOperationError
    """
    def _db_operation(*args):
        try:
            return func(*args)
        except DbOperationError:
            raise DbOperationError()
    return _db_operation


def convert_to_activity_type_for_display(activity_type):
    """アクティビティ種別をCSS用に変換

    @param activity_type アクティビティ種別
    @return アクティビティ種別(CSS用)
    """
    return Activity.TYPE[int(activity_type)][1]


def convert_to_date_for_display(date):
    """アクティビティ日付をCSS用に変換

    @param date アクティビティ日付
    @return アクティビティ日付(CSS用)
    """
    return date.strftime('%Y/%m/%d')
