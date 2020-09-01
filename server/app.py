from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import pymssql
from itsdangerous import TimedJSONWebSignatureSerializer as Serializer
import functools
from app_utils import getRandomID, getRandom

app = Flask(__name__)
# 解决中文乱码的问题，将json数据内的中文正常显示
app.config['JSON_AS_ASCII'] = False
# 开启debug模式
app.config['DEBUG'] = True
# 设置跨域
CORS(app, supports_credentials=True)

conn = pymssql.connect(host='127.0.0.1:1433', user='sa', password='111111', database='ShanBay', charset="UTF-8")

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
    appId = 'appid'
    appSecret = 'appsecret'
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

@app.route('/goaldata', methods=['GET'])
def getgoal():
    cursor = conn.cursor()
    sql = 'select * from "goal"'
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
    sql = '''
        select punchday,asset,num.booknum,num.userid 
        from "user",(select userid,count(bookid) as booknum 
            from(select "user".userid,"desktop".bookid 
                from "user" full outer join "desktop" on "user".userid = "desktop".userid)temp
            group by userid)num
        where "user".userid =
        ''' + "'" + userid + "' and num.userid=" + "'" + userid + "'"
    cursor.execute(sql)
    column_names = [col[0] for col in cursor.description] + ['']
    dict_res = [
        dict(zip(column_names, row))
        for row in cursor.fetchall()
    ]
    cursor.close()
    return jsonify(dict_res)

@app.route('/addbook', methods=['GET'])
@login_required
def addbook():
    token = request.headers["token"]
    s = Serializer(SECRET_KEY)
    data = s.loads(token)
    userid = data['id']
    bookid = request.args.get("bookid")
    index = request.args.get("goalIndex")
    cursor = conn.cursor()
    sql = 'select * from "desktop" where userid = ' + "'" + userid + "'"
    cursor.execute(sql)
    data = cursor.fetchall()
    if len(data) >= 10:
        return jsonify(code=10000, msg="大于10本书")
    elif len(data) == 0:
        sql = 'insert into "desktop" values (' + "'" + userid + "'," + bookid + ",1," + index + ")"
        cursor.execute(sql)
        conn.commit()
        sql4 = 'insert into "learninglist" (userid,bookid,word,learntype,wordid) select ' + "'" + userid + "'," + bookid + ",word,0,wordid from" + ' "words" where bookid=' + bookid
        cursor.execute(sql4)
        conn.commit()
    else:
        sql = 'select * from "desktop" where userid = ' + "'" + userid + "' and bookid = "+bookid
        cursor.execute(sql)
        info = cursor.fetchall()
        if len(info) == 0:
            sql = 'insert into "desktop" values (' + "'" + userid + "'," + bookid + ",1," + index + ")"
            cursor.execute(sql)
            conn.commit()
            sql2 = 'update "desktop" set islearn = 0 where userid = ' + "'" + userid + "' and bookid != "+bookid
            cursor.execute(sql2)
            conn.commit()
            sql3 = 'delete from "learninglist" where userid = ' + "'" + userid + "' and bookid != " + bookid
            cursor.execute(sql3)
            sql4 = 'insert into "learninglist" (userid,bookid,word,learntype,wordid) select ' + "'" + userid + "'," + bookid + ",word,0,wordid from" + ' "words" where bookid=' + bookid
            cursor.execute(sql4)
            conn.commit()
        else:
            sql = 'update "desktop" set goalid =' + index + ' where userid = ' + "'" + userid + "' and bookid = "+bookid
            cursor.execute(sql)
            conn.commit()
            sql2 = 'update "desktop" set islearn = 0 where userid = ' + "'" + userid + "' and bookid != "+bookid
            cursor.execute(sql2)
            conn.commit()
    return ('OK')

@app.route('/getmybook', methods=['GET'])
@login_required
def getmybook():
    token = request.headers["token"]
    s = Serializer(SECRET_KEY)
    data = s.loads(token)
    userid = data['id']
    cursor = conn.cursor()
    sql = 'select "desktop".bookid,bookname,imgURL,count,newnum,islearn from "desktop","books","goal" where userid = '+ "'" + userid+ "'" 'and "desktop".bookid = "books".bookid and "desktop".goalid = "goal".goalid'
    cursor.execute(sql)
    column_names = [col[0] for col in cursor.description]
    dict_res = [
        dict(zip(column_names, row))
        for row in cursor.fetchall()
    ]
    cursor.close()
    return jsonify(dict_res)

@app.route('/delbook', methods=['GET'])
@login_required
def delbook():
    token = request.headers["token"]
    s = Serializer(SECRET_KEY)
    data = s.loads(token)
    userid = data['id']
    bookid = request.args.get("bookid")
    cursor = conn.cursor()
    sql = 'delete from "desktop" where userid = ' + "'" + userid + "'" 'and bookid = ' + bookid
    cursor.execute(sql)
    conn.commit()
    cursor.close()
    return jsonify('OK')

@app.route('/changelearn', methods=['GET'])
@login_required
def changelearn():
    token = request.headers["token"]
    s = Serializer(SECRET_KEY)
    data = s.loads(token)
    userid = data['id']
    bookid = request.args.get("bookid")
    cursor = conn.cursor()
    sql = 'update "desktop" set islearn = 1 where userid = ' + "'" + userid + "' and bookid = "+bookid
    cursor.execute(sql)
    sql2 = 'update "desktop" set islearn = 0 where userid = ' + "'" + userid + "' and bookid != "+bookid
    cursor.execute(sql2)
    sql3 = 'delete from "learninglist" where userid = ' + "'" + userid + "' and bookid != "+bookid
    cursor.execute(sql3)
    sql4 = 'insert into "learninglist" (userid,bookid,word,learntype,wordid) select ' + "'" + userid + "',"+ bookid +",word,0,wordid from" + ' "words" where bookid='+ bookid
    cursor.execute(sql4)
    conn.commit()
    cursor.close()
    return jsonify('OK')

@app.route('/getstudyinfo', methods=['GET'])
@login_required
def getstudyinfo():
    token = request.headers["token"]
    s = Serializer(SECRET_KEY)
    data = s.loads(token)
    userid = data['id']
    cursor = conn.cursor()
    sql = '''
    select "desktop".bookid,bookname,count,newnum,reviewnum,
	(select count(*) from "learninglist" where learntype=0 and userid='''+ "'" + userid + "'" +''') as unlearnnum
		from "books","desktop","goal" 
		where "books".bookid="desktop".bookid and "desktop".userid='''+ "'" + userid + "'" +'''
			and islearn=1 and "desktop".goalid="goal".goalid
    '''
    cursor.execute(sql)
    column_names = [col[0] for col in cursor.description]
    dict_res = [
        dict(zip(column_names, row))
        for row in cursor.fetchall()
    ]
    cursor.close()
    return jsonify(dict_res)

@app.route('/getstudyword', methods=['GET'])
@login_required
def getstudyword():
    token = request.headers["token"]
    s = Serializer(SECRET_KEY)
    data = s.loads(token)
    userid = data['id']
    cursor = conn.cursor()
    sql = 'select count(*) from "learninglist" where learntype=0 and userid='+"'"+userid+"'"
    cursor.execute(sql)
    num = cursor.fetchone()[0]
    rand = getRandom(num)
    sql2 = '''
    select top(1) * from(
	select top('''+str(rand)+''') "words".word,example,"words".wordid from "learninglist","words" 
		where learntype=0 and "words".wordid="learninglist".wordid and "words".bookid="learninglist".bookid and userid='''+"'"+userid+"'"+'''
		order by "words".wordid)as temp 
	order by wordid desc 
    '''
    cursor.execute(sql2)
    column_names = [col[0] for col in cursor.description]
    dict_res = [
        dict(zip(column_names, row))
        for row in cursor.fetchall()
    ]
    cursor.close()
    return jsonify(dict_res)

app.run(host='0.0.0.0', port=5000)