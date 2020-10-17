"""
エンドポイント
"""
import logging.config
from pathlib import PurePath

from module.dbaccess import DbOperationError
from module.api import (
    DashboardView, LearningView, EnglishListView, ActivityView, BookMarkView,
    UpdateIsCorrectFlagView, UpdateBookmarkView, RegisterWordView, DeleteView,
    StaticResponse, BadRequest, NotFound, InternalServerError
)


logging.config.fileConfig('./setting/logging.conf')
LOGGER = logging.getLogger()

# エンドポイント
END_POINT = {
    '/': DashboardView,
    '/learning': LearningView,
    '/english_list': EnglishListView,
    '/bookmark': BookMarkView,
    '/activity': ActivityView,
    '/update/is_correct': UpdateIsCorrectFlagView,
    '/update/bookmark': UpdateBookmarkView,
    '/register/word': RegisterWordView,
    '/delete/word': DeleteView,
}


def dispatch(req_data):
    """割り当て

    @param req_data リクエストデータ
    @return 正常レスポンス
    @return NotFoundレスポンス
    @return BadRequestレスポンス
    @return InternalServerErrorレスポンス
    """
    path = req_data.get('PATH_INFO')

    if PurePath(path).match('static/*/*'):
        return dispatch_static(path)
    return dispatch_api(path, req_data)


def dispatch_static(path):
    """静的ファイル割り当て

    @param path リクエストパス
    @return 正常レスポンス
    @return NotFoundレスポンス
    """
    try:
        if PurePath(path).suffix[1:]:
            return StaticResponse(path[1:], PurePath(path).suffix[1:])
        raise FileNotFoundError()
    except FileNotFoundError as err:
        LOGGER.error(err)
        return NotFound()


def dispatch_api(path, req_data):
    """API割り当て

    @param path リクエストパス
    @param req_data リクエストデータ
    @return 正常レスポンス
    @return NotFoundレスポンス
    @return BadRequestレスポンス
    @return InternalServerErrorレスポンス
    """
    req_api = END_POINT.get(path)
    if req_api is None:
        return NotFound()

    try:
        if req_data.get('REQUEST_METHOD') == 'POST':
            api = req_api(req_data.get('wsgi.input')\
                .read(int(req_data.get('CONTENT_LENGTH', 0))))
        else:
            api = req_api()
        return api.view()
    except FileNotFoundError as err:
        LOGGER.error(err)
        return NotFound()
    except ValueError as err:
        LOGGER.error(err)
        return BadRequest()
    except (DbOperationError, Exception) as err:
        LOGGER.error(err)
        return InternalServerError()
