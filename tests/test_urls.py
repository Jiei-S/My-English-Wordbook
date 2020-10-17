"""pytest

urls.py
"""
from io import BufferedReader
import os
import pytest
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from module import api
from module import urls
from module import util


@pytest.mark.parametrize('input', [
    ({'PATH_INFO': '/static/css/main.js'}),
    ({'PATH_INFO': '/'}),
])
def test_dispatch_001(input, monkeypatch):
    """割り当て
    正常ケース

    in:
      {'PATH_INFO': '/static/css/main.js'}
    expect:
      ''
    in:
      {'PATH_INFO': '/'}
    expect:
      ''
    """
    path = input['PATH_INFO']
    expect = ''
    def mock_dispatch_static(path):
        return expect

    def mock_dispatch_api(path, input):
        return expect

    monkeypatch.setattr(urls, 'dispatch_static', mock_dispatch_static)
    monkeypatch.setattr(urls, 'dispatch_api', mock_dispatch_api)
    assert urls.dispatch(input) == expect


@pytest.mark.parametrize('input, expect_status, expect_content_type', [
    (
        '/static/js/main.js',
        '200 OK',
        'text/javascript'
    ),
    (
        '/static/css/component.css',
        '200 OK',
        'text/css'
    ),
])
def test_dispatch_static_001(input, expect_status, expect_content_type):
    """静的ファイル割り当て
    正常ケース

    in:
      '/static/js/main.js'
    expect_status:
      '200 OK'
    expect_content_type:
      'text/javascript'
    expect_body:
      静的コード
    in:
      '/static/css/component.css'
    expect_status:
      '200 OK'
    expect_content_type:
      'text/css'
    expect_body:
      静的コード
    """
    result = urls.dispatch_static(input)
    with open(input[1:], 'r') as file:
        expect_body = file.read()

    assert isinstance(result, api.StaticResponse)
    assert result.status == expect_status
    assert result.content_type == expect_content_type
    assert result.body == expect_body


@pytest.mark.parametrize('input, expect_status, expect_content_type', [
    (
        '/static/js/NotFound.js',
        '404 Not Found',
        'text/html'
    ),
    (
        '/static/css/NotFound.css',
        '404 Not Found',
        'text/html'
    ),
    (
        '/static/js/main',
        '404 Not Found',
        'text/html'
    ),
    (
        '/static/css/component',
        '404 Not Found',
        'text/html'
    ),
])
def test_dispatch_static_002(input, expect_status, expect_content_type):
    """静的ファイル割り当て
    エラーケース

    in:
      '/static/js/NotFound.js'
    expect_status:
      '404 Not Found'
    expect_content_type:
      'text/html'
    expect_body:
      404.htmlコード
    in:
      '/static/css/NotFound.css'
    expect_status:
      '404 Not Found'
    expect_content_type:
      'text/html'
    expect_body:
      404.htmlコード
    in:
      '/static/js/main'
    expect_status:
      '404 Not Found'
    expect_content_type:
      'text/html'
    expect_body:
      404.htmlコード
    in:
      '/static/css/component'
    expect_status:
      '404 Not Found'
    expect_content_type:
      'text/html'
    expect_body:
      404.htmlコード
    """
    result = urls.dispatch_static(input)
    with open('404.html', 'r') as file:
        expect_body = file.read()

    assert isinstance(result, api.NotFound)
    assert result.status == expect_status
    assert result.content_type == expect_content_type
    assert result.body == expect_body


@pytest.mark.parametrize('input_01, input_02, expect_inst_type, expect_status, expect_content_type', [
    (
        '/',
        {'REQUEST_METHOD': 'GET'},
        api.HtmlResponse,
        '200 OK',
        'text/html'
    ),
    (
        '/learning',
        {'REQUEST_METHOD': 'GET'},
        api.JsonResponse,
        '200 OK',
        'application/json'
    ),
])
def test_dispatch_api_001(input_01, input_02, expect_inst_type, expect_status, expect_content_type):
    """API割り当て(GET)
    正常ケース

    in_01:
      '/'
    in_02:
      {'REQUEST_METHOD': 'GET'}
    expect_inst_type:
      HtmlResponse
    expect_status:
      '200 OK'
    expect_content_type:
      'text/html'
    in_01:
      '/learning'
    in_02:
      {'REQUEST_METHOD': 'GET'}
    expect_inst_type:
      JsonResponse
    expect_status:
      '200 OK'
    expect_content_type:
      'application/json'
    """
    result = urls.dispatch_api(input_01, input_02)

    assert isinstance(result, expect_inst_type)
    assert result.status == expect_status
    assert result.content_type == expect_content_type


@pytest.mark.parametrize('input_01, input_02, expect_inst_type, expect_status, expect_content_type', [
    (
        '/update/is_correct',
        {
            'REQUEST_METHOD': 'POST',
            'wsgi.input': BufferedReader(open('tests/testfile','rb')),
            'CONTENT_LENGTH': 32
        },
        api.JsonResponse,
        '200 OK',
        'application/json'
    ),
])
def test_dispatch_api_002(input_01, input_02, expect_inst_type, expect_status, expect_content_type):
    """API割り当て(POST)
    正常ケース

    in_01:
      '/update/is_correct'
    in_02:
      {
        'REQUEST_METHOD': 'POST',
        'wsgi.input': BufferedReader(f),
        'CONTENT_LENGTH': 32
      }
    expect_inst_type:
      JsonResponse
    expect_status:
      '200 OK'
    expect_content_type:
      'application/json'
    """
    result = urls.dispatch_api(input_01, input_02)
    
    assert isinstance(result, expect_inst_type)
    assert result.status == expect_status
    assert result.content_type == expect_content_type


@pytest.mark.parametrize('input_01, input_02, expect_inst_type, expect_status, expect_content_type', [
    (
        '/update/is_correct',
        {
            'REQUEST_METHOD': 'POST',
            'wsgi.input': BufferedReader(open('tests/testfile_BadRequest','rb')),
            'CONTENT_LENGTH': 32
        },
        api.BadRequest,
        '400 Bad Request',
        'application/json'
    ),
    (
        '/update/is_correct',
        {
            'REQUEST_METHOD': 'POST',
            'wsgi.input': {},
            'CONTENT_LENGTH': 32
        },
        api.InternalServerError,
        '500 Internal Server Error',
        'application/json'
    ),
])
def test_dispatch_api_003(input_01, input_02, expect_inst_type, expect_status, expect_content_type):
    """API割り当て(POST)
    エラーケース

    in_01:
      '/update/is_correct'
    in_02:
      {
        'REQUEST_METHOD': 'POST',
        'wsgi.input': BufferedReader(f_BadRequest),
        'CONTENT_LENGTH': 32
      }
    expect_inst_type:
      BadRequest
    expect_status:
      '400 Bad Request'
    expect_content_type:
      'application/json'
    in_01:
      '/update/is_correct'
    in_02:
      {
        'REQUEST_METHOD': 'POST',
        'wsgi.input': {},
        'CONTENT_LENGTH': 32
      }
    expect_inst_type:
      InternalServerError
    expect_status:
      '500 Internal Server Error'
    expect_content_type:
      'application/json'
    """
    result = urls.dispatch_api(input_01, input_02)
    
    assert isinstance(result, expect_inst_type)
    assert result.status == expect_status
    assert result.content_type == expect_content_type
