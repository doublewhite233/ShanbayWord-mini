from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pymssql
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import functools
from app_utils import getRandomID

app = Flask(__name__)
# 解决中文乱码的问题，将json数据内的中文正常显示
app.config['JSON_AS_ASCII'] = False
# 开启debug模式
app.config['DEBUG'] = True
# 设置跨域
CORS(app, supports_credentials=True)

conn = pymssql.connect(host='127.0.0.1:1433', user='sa', password='123456', database='ShanBay', charset="UTF-8")

# token密钥
SECRET_KEY = 'doublewhite'

def create_token(userid):
    s = Serializer(SECRET_KEY, expires_in=3600)
    token = s.dumps({"id": userid}).decode("utf-8")
    return token

def login_required(view_func):
    @functools.wraps(view_func)
    def verify_token(*args, **kwargs):
        try:
            token = request.headers["token"]
        except Exception:
            # 没接收的到token,给前端抛出错误
            return jsonify(code=4103, msg='缺少参数token')

        s = Serializer(SECRET_KEY)
        try:
            s.loads(token)
        except Exception:
            return jsonify(code=4101, msg="登录已过期")
        return view_func(*args, **kwargs)
    return verify_token

@app.route('/login', methods=['GET'])
def login():
    code = request.args.get("code")
    appId = 'appID'
    appSecret = 'appSecret'
    params = {
        'appid': appId,
        'secret': appSecret,
        'js_code': code,
        'grant_type': 'authorization_code'
    }
    wx_login_api = 'https://api.weixin.qq.com/sns/jscode2session'
    response_data = requests.get(wx_login_api, params=params)
    data = response_data.json()
    openid = data['openid']
    session_key = data['session_key']
    # 添加或查找数据库用户信息
    if openid and session_key:
        cursor = conn.cursor()
        sql = 'select * from "user" where openid = ' + "'" + openid + "'"
        cursor.execute(sql)
        info = cursor.fetchall()
        if info == []:
            userid = '-'
            auth = '-'
            while auth != []:
                userid = getRandomID(5)
                auth_sql = 'select * from "user" where userid = ' + "'" + userid + "'"
                cursor.execute(auth_sql)
                auth = cursor.fetchall()
            add_info = 'insert into "user" values (' + "'" + openid + "','" + userid + "',0,0)"
            print(add_info)
            cursor.execute(add_info)
            conn.commit()
        cursor.execute('select userid from "user" where openid = ' + "'" + openid + "'")
        userid = cursor.fetchall()
        userid = userid[0][0]
        res = {}
        res['token'] = create_token(userid)
        cursor.close()
    return(res)

@app.route('/auth', methods=['GET'])
def auth():
    try:
        token = request.headers["token"]
    except Exception:
        # 没接收的到token,给前端抛出错误
        return jsonify(code=4103, msg='缺少参数token')

    s = Serializer(SECRET_KEY)
    try:
        s.loads(token)
    except Exception:
        return jsonify(code=4101, msg="登录已过期")
    return ('OK')

@app.route('/booktype')
def gettype():
    cursor = conn.cursor()
    sql = 'select * from "type"'
    cursor.execute(sql)
    column_names = [col[0] for col in cursor.description]
    dict_res = [
        dict(zip(column_names, row))
        for row in cursor.fetchall()
    ]
    cursor.close()
    return jsonify(dict_res)

@app.route('/showbook', methods=['GET'])
def getbook():
    index = request.args.get("currentIndex")
    cursor = conn.cursor()
    sql = 'select * from "books" where typeid = '+ index
    cursor.execute(sql)
    column_names = [col[0] for col in cursor.description]
    dict_res = [
        dict(zip(column_names, row))
        for row in cursor.fetchall()
    ]
    cursor.close()
    return jsonify(dict_res)

@app.route('/userinfo', methods=['GET'])
@login_required
def getuserinfo():
    token = request.headers["token"]
    s = Serializer(SECRET_KEY)
    data = s.loads(token)
    userid = data['id']
    cursor = conn.cursor()
    sql = 'select userid,punchday,asset from "user" where userid = ' + "'" + userid + "'"
    cursor.execute(sql)
    column_names = [col[0] for col in cursor.description]
    dict_res = [
        dict(zip(column_names, row))
        for row in cursor.fetchall()
    ]
    cursor.close()
    return jsonify(dict_res)

app.run(host='0.0.0.0', port=5000)