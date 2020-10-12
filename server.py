"""
サーバ
"""
from wsgiref.simple_server import make_server

from module.urls import dispatch


def run(environ, start_response):
    """WSGI

    @param environ HTTPS環境変数
    @param start_response ステータスコード、レスポンスヘッダーを受け取るオブジェクト
    @return レスポンスデータ
    """
    response = dispatch(environ)
    start_response(
        response.status,
        [('Content-Type', '{}'.format(response.content_type))])
    return [response.body.encode('UTF-8')]


if __name__ == '__main__':
    with make_server('', 8000, run) as httpd:
        print('Serving HTTP on 0.0.0.0 port 8000 ...')
        httpd.serve_forever()
