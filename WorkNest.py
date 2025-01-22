from flask import Flask, render_template, redirect, url_for, session,request,jsonify
from flask_socketio import SocketIO, join_room, leave_room, emit
from authlib.integrations.flask_client import OAuth
from hiden2 import myid, mysecret
import os
import mysql.connector
import bcrypt 
from werkzeug.security import generate_password_hash
from PIL import Image
import json
from werkzeug.utils import secure_filename
from datetime import datetime
import logging

logging.basicConfig(level=logging.INFO)


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")  # Allowing all origins for simplicity


oauth = OAuth(app)
google = oauth.register(
    name='google',
    client_id = myid,
    client_secret= mysecret,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    access_token_url='https://oauth2.googleapis.com/token',
    authorize_params=None,
    access_token_params=None,
    refresh_token_url=None,
    redirect_uri='http://127.0.0.1:5000/login/callback',
    client_kwargs={'scope': 'openid email profile'},
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
)

@app.route('/ty')
def index2():
    user = session.get('user')
    return render_template('accounton.html', user=user)


@app.route('/login')
def login():
    try:
        redirect_uri = url_for('authorize', _external=True)
        return redirect(google.authorize_redirect(redirect_uri).headers['Location'])
    
    except Exception as e:
        print(f"Error during login redirection: {str(e)}")
        return "An error occurred during login redirection."
    
@app.route('/login/callback')
def authorize():
    try:
        token = google.authorize_access_token()
        if not token:
            return 'Authorization failed.', 400

        resp = google.get('https://www.googleapis.com/oauth2/v1/userinfo')
        user_info = resp.json()
        session['user'] = user_info
        print(user_info)

        if user_info:
            # Ensure user insertion/update in the database before redirecting to the main page
            try:
                mycursor.execute(
                    """
                    INSERT INTO worknestusers (email, username, id, profile_pic) 
                    VALUES (%s, %s, %s, %s) 
                    ON DUPLICATE KEY UPDATE 
                    username = VALUES(username), 
                    profile_pic = VALUES(profile_pic)
                    """,
                    (user_info['email'], user_info['name'], user_info['id'], user_info['picture'])
                )
                mydb.commit()  # Commit the transaction

                msg = "LOGGED IN SUCCESSFULLY ✅"
                print(f"{user_info['email']} has been logged in successfully!")
                return render_template('Worknest.html', msg=msg, user=user_info)

            except Exception as db_err:
                # Handle and log database errors separately
                print(f"Database error while inserting user: {db_err}")
                return render_template('accounton.html', msg="Database error occurred. Please try again.", user=user_info)

        else:
            msg = "LOGIN FAILED ❌"
            print(f"Log in failed for {user_info['email']}!")
            return render_template('accounton.html', msg=msg, user=user_info)

    except Exception as err:
        # General error handling
        user = session.get('user')
        print(f" ERROR>>: {err}")
        return render_template('accounton.html', msg=str(err), user=user)

@app.route('/logout')
def logout():
    session.pop('user', None)
    msg ="LOGGED OUT!!"
    return render_template('accounton.html',msg=msg)



users = {}

@app.route('/')
def index():
    user = session.get('user')
    return render_template('loader.html',user=user)



import mysql.connector
mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="0000",
    database="worknest"
)
 
mycursor = mydb.cursor()


   
    
@app.route('/login/password', methods=['POST'])
def letmein():
    useremail = request.form.get('useremail')
    userpassword = request.form.get('userpassword')

    if not useremail or not userpassword:
        return jsonify({"error": "Missing email or password"}), 400
    try:
        mycursor.execute("SELECT email, password, username ,profile_pic, user_id FROM worknestusers WHERE email = %s", (useremail,))
        user = mycursor.fetchone()

        if user and bcrypt.checkpw(userpassword.encode('utf-8'), user[1].encode('utf-8')):
            user_data = {
                'email': user[0],
                'name': user[2],
                'picture':user[3],
                'id':user[4],
            }
            return render_template('worknest.html', message="User verified!",user = user_data)
        else:
            return jsonify({"error": "Invalid email or password"}), 401


    except Exception as e:
        return {"error": str(e)}

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password
    
@app.route('/signup/password', methods=['POST'])
def registerme():
    useremail = request.form.get('useremail')
    username = request.form.get('username')
    userpassword = request.form.get('userpassword')
    confirmedpassword = request.form.get('userconfirmpassword')

    if not useremail or not username or not userpassword or not confirmedpassword:
        return jsonify({"error": "Missing email, username, or password"}), 400

    mycursor.execute("SELECT email FROM worknestusers WHERE email = %s", (useremail,))
    user = mycursor.fetchone()

    if user:
        return jsonify({"error": "Email already registered!"}), 409

    if userpassword != confirmedpassword:
        return jsonify({"error": "Passwords do not match"}), 400

    hashed_password = (hash_password(confirmedpassword))
    profilepic = '../static/images/nouser.png'
    try:
        mycursor.execute(
            "INSERT INTO worknestusers (email, username, password, profile_pic) VALUES (%s, %s, %s, %s)",
            (useremail, username, hashed_password, profilepic)
        )
        mydb.commit()

        mycursor.execute('SELECT user_id FROM worknestusers WHERE email = %s', (useremail,))
        useridin = mycursor.fetchone()

        if useridin:
            userid = useridin[0]
            mycursor.execute(
                "UPDATE worknestusers SET id = %s WHERE email = %s",
                (userid, useremail)
            )
            mydb.commit()
            print(f"{useremail} has been logged in successfully!!")
            return render_template('accounton.html',message= "User registered successfully!")

        else:
            msg = "LOGGEDIN FAILED,❌"
            print(f"{useremail} log in FAILED!!")
            return render_template('Worknest.html',msg=msg)
        

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


@app.route('/WorkNest', methods=['POST']) 
def toindex():
    user = session.get('user')
    return render_template('accounton.html',user=user)

@app.route('/WorkNest_Home') 
def tohome():
    user = session.get('user')
    return render_template('Worknest.html',user=user)

#web socket section


connected_users = {}

@socketio.on('joinworknest')
def handle_join(data):
    try:
        username = data['username'] 
        userid = data['prvtroom']
        connected_users[username] = True

        # Join the common room
        room = "worknest2024"
        join_room(room)

        # Join the private room
        join_room(userid)

        emit('roomJoined', {
            'mystate': '<i class="fas fa-circle text-success"></i>', 
            'room': room,
            'users': list(connected_users.keys())
        }, room=room)

        print("Connected users:", list(connected_users.keys()))
        
        try:
            useremail = data.get('useremail')
            if useremail and userid:
                mycursor.execute("SELECT id, gender, birthdate, phone FROM worknestusers WHERE email = %s", (useremail,))
                user = mycursor.fetchone()
                if user:
                    emit('worknestin', {
                        'id': user[0],
                        'gender': user[1],
                        'dob':user[2].strftime('%Y-%m-%d'),
                        'phone': user[3]
                    })
                else:
                    emit('error', {'message': 'User not found!'},room = userid)
            else:
                emit('error', {'message': 'Email is required!'},room = userid)
        except Exception as err:
            print('ERROR:', err)
            emit('error', {'message': 'An error occurred.'},room = userid)

    except Exception as err:
        print("Error:", str(err))
        emit('roomJoined', {'mystate': str(err)})





app.config['UPLOAD_FOLDER'] = os.path.join('static', 'uploads')
app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'mp4'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        print("working on file...")
        if 'jobLogo' not in request.files:
            return jsonify(success=False, message='No file part')
        
        file = request.files['jobLogo']
        
        if file.filename == '':
            return jsonify(success=False, message='No selected file')

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            return jsonify(success=True, filePath=f'/static/uploads/{filename}')

        return jsonify(success=False, message='Invalid file format')
    except Exception as err:
        print("ERROR:", err)
        return jsonify(success=False, message='An error occurred')
    
@app.route('/like', methods=['POST'])
def like_post():
    data = request.get_json()
    post_id = data.get('post_id')
    email = data.get("useremail")
    like = data.get("like")

    if not post_id or not email or like is None:
        return jsonify({'success': False, 'error': 'Post ID, user email, and like status are required'}), 400

    try:
        user = get_user_by_email(email)
        if not user:
            print(":::>",email)
            return jsonify({'success': False, 'error': 'User not found'}), 404

        user_id = user['id']
        logging.info(f"Liking user id: {user_id}")

        if like:
            mycursor.execute(
                "INSERT INTO likes (postid, user_id) VALUES (%s, %s) ON DUPLICATE KEY UPDATE user_id=user_id",
                (post_id, user_id)
            )
            logging.info("LIKE status ✅✅")
            host = get_user_by_postid(post_id)
            new = get_user_by_id(user_id)
            
            mycursor.execute("SELECT like_id, postid, registration_date FROM likes WHERE postid=%s AND user_id=%s LIMIT 1", (post_id, user_id))
            likeinfo = mycursor.fetchone()
            
            if host['id'] != user_id:
                current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S") 
                print(f"Current date and time: {current_time}") 
                socketio.emit('notifier', {
                    'username': new['username'],
                    'profile_pic': new['profile_pic'],
                    'type': 'like',
                    'time': likeinfo[2].isoformat() if isinstance(likeinfo[2], datetime) else str(likeinfo[2]),
                    'likeid': likeinfo[0],
                    'postid': likeinfo[1],
                    'state':"unread"
                }, room=host['id'])
                savenotification(user_id, host['id'], post_id, 'like')
        else:
            mycursor.execute(
                "DELETE FROM likes WHERE postid = %s AND user_id = %s",
                (post_id, user_id)
            )
            logging.info("LIKE status ❌❌")
        
        mydb.commit()
        return jsonify({'success': True})

    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        return jsonify({'success': False, 'error': str(err)}), 500


@app.route('/update/noty', methods=['POST'])
def updatenotifications():
    try:
        data = request.get_json()
        userid = data.get('userid')
        notyid = data.get('notyid')
        postid = data.get('postid')
        
        # Fetch post info
        mycursor.execute("SELECT * FROM worknestposts WHERE postid=%s AND user_id=%s", (postid, userid))
        postinfo = mycursor.fetchone()
        postbackinfo = []
        if postinfo:
            posting = {
                'postid': postinfo[0],
                'userid': postinfo[1],
                'postcontent': postinfo[2],
                'postfiles': postinfo[3],
                'time': postinfo[4]
            }
            postbackinfo.append(posting)
           
        # Update notification
        
        mycursor.execute("UPDATE notifications SET state=%s WHERE notyid=%s AND hostid=%s AND postid=%s", ('read', notyid, userid, postid))
        mydb.commit()

        # Fetch updated notification
        mycursor.execute("SELECT * FROM notifications WHERE notyid=%s AND hostid=%s AND postid=%s", (notyid, userid, postid))
        updt = mycursor.fetchone()
        
        if updt:
            new = get_user_by_id(userid)
            if new:
                socketio.emit('notifier', {
                    'username': new['username'],
                    'profile_pic': new['profile_pic'],
                    'type': updt[4],
                    'time': updt[8].isoformat() if isinstance(updt[8], datetime) else str(updt[8]),
                    'notyid': updt[0],
                    'postid': updt[3],
                    'state':'read'
                }, room=userid)
        
        return jsonify({'success': True, 'open_post': postbackinfo})
                 
    except Exception as err:
        print("❌❌:", err)
        return jsonify({'success': False, 'error': str(err)}), 500



    
@app.route('/loadposts', methods=['POST'])
def homepostload():
    try:
        data = request.get_json()
        offset = data.get('offset', 0)
        limit = data.get('limit', 15)  # Default to chunk size of 15

        try:
            offset = int(offset)
            limit = int(limit)
        except ValueError:
            raise ValueError("Invalid offset or limit value")

        # Fetch posts with pagination
        mycursor.execute("SELECT * FROM worknestposts ORDER BY registration_date DESC LIMIT %s OFFSET %s", (limit, offset))
        posts = mycursor.fetchall()

        post_list = []
        for post in posts:
            mycursor.execute("SELECT like_id, user_id FROM likes WHERE postid = %s", (post[0],))
            likes = mycursor.fetchall()
            
            alllikes = [like[0] for like in likes]
            userslike = [like[1] for like in likes]
            
            posterinfo = get_user_by_id(post[1])
            postfiles = []
            try:
                postfiles = json.loads(post[3])
            except (json.JSONDecodeError, TypeError) as json_err:
                logging.error(f"Error decoding JSON for post {post[0]}: {json_err}")
                postfiles = []
            
            post_list.append({
                'postid': post[0],
                'userid': post[1],
                'postcontent': post[2],
                'postfiles': postfiles,
                'postdate': post[4].isoformat() if isinstance(post[4], datetime) else str(post[4]),
                'postername': posterinfo['username'],
                'posteremail': posterinfo['email'],
                'posterprofile': posterinfo['profile_pic'],
                'alllikes': alllikes,
                'likedusers': userslike,
            })

        return jsonify(post_list)
    except Exception as e:
        logging.error(f"Error loading posts: {e}")
        return jsonify({"error": str(e)}), 500
    
    
    
@app.route('/sendmessaege', methods=['POST'])
def savechats():
    data = request.get_json()
    userid = data.get('userid')
    chat = data.get('message')
    postid = data.get('post_id')

    try:
        mycursor.execute('INSERT INTO comments (postid, user_id, comment_text) VALUES (%s, %s, %s)', (postid, userid, chat))
        mydb.commit()
        logging.info(f"Saved chat {postid}, userid: {userid}, content: {chat}")
        
        host = get_user_by_postid(postid)
        new = get_user_by_id(userid)
        
        notid,time,sapostid =savenotification(userid, host['id'], postid,'comment' )
        if host['id'] != userid:
            socketio.emit('notifier', {
                'username': new['username'],
                'profile_pic': new['profile_pic'],
                "type": "comment",
                'time':time.isoformat() if isinstance(time, datetime) else str(time),
                'notyid':notid,
                'postyid':sapostid,
                'state':'unread'
            }, room=host['id'])
           
            
    except mysql.connector.Error as err:
        logging.error(f"Error: {err}")
        return jsonify({'success': False, 'error': str(err)}), 500
    
    return jsonify({'success': True})



@app.route('/fetchmessages', methods=['POST'])
def loadchats():
    try:
        data = request.get_json()
        postid = data.get('post_id')
        
        mycursor.execute("SELECT * FROM comments WHERE postid = %s", (postid,))
        comments = mycursor.fetchall()
        
        chats = []
        for allchats in comments:
            user = get_user_by_id( allchats[2])
            chat = {
                'userid': allchats[2],
                'username':user['username'],
                'profilepic':user['profile_pic'],
                'postid': allchats[1],
                'availchats': allchats[3],
                'commentid': allchats[0],
                'timestamp': allchats[4]
            }
            chats.append(chat)
        
        return jsonify({'success': True, 'chats': chats})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)})
    
    
@app.route('/fetchjobs', methods=['POST'])
def getjobs():
    data = request.get_json()
    job_type = data.get('type')

    try:
        if job_type == "all":
            mycursor.execute("SELECT * FROM worknestjobs ORDER BY registration_date LIMIT 50")
        else:
            mycursor.execute("SELECT * FROM worknestjobs WHERE type = %s ORDER BY registration_date LIMIT 50", (job_type,))
        
        jobs = mycursor.fetchall()
        
        job_list = []

        for job in jobs:
            if job:
                posterinfo = get_user_by_id(job[0])
                
                print("Poster info for job:", job[0], posterinfo)
                
                preferences = {}
                try:
                    preferences = json.loads(job[16]) if job[16] else {}
                except (json.JSONDecodeError, TypeError) as e:
                    print(f"Error decoding preferences for job {job[0]}:", e)

                print("Preferences for job:", job[0], preferences)
                
                
                job_list.append({
                    'jobposter': posterinfo['username'],
                    'jobposteremail': posterinfo['email'],
                    'jobposterprofilepic': posterinfo['profile_pic'],
                    'jobcompany': job[2] if job[2] else '',
                    'joblink': job[3] if job[3] else '',
                    'joblogo': job[4] if job[4] else '',
                    'jobposition': job[5] if job[5] else '',
                    'jobcategory': job[6] if job[6] else '',
                    'jobdescription': job[8] if job[8] else '',
                    'jobrequirement': job[9] if job[9] else '',
                    'jobexpiry': job[14].isoformat() if job[14] else '',
                    'minsalary': job[13].split(" - ")[0] if job[13] else '',
                    'maxsalary': job[13].split(" - ")[1] if job[13] else '',
                    'jobcountry': job[12] if job[12] else '', 
                    'jobcity': job[11] if job[11] else '',
                    'requirementattach': "",
                    'jobtypes': job[7] if job[7] else '',
                    'jobexperience':job[15] if job[15] else ''
                })

        return jsonify({'success': True, 'jobs': job_list})

    except Exception as e:
        print("Error:", e)
        return jsonify({'success': False, 'error': str(e)})

def savenotification(userid, hostid, postid, type):
    try:
        # Use parameterized query to avoid SQL injection and syntax errors
        mycursor.execute("""
            INSERT INTO notifications (user_id, hostid, postid, type) 
            VALUES (%s, %s, %s, %s)
        """, (userid, hostid, postid, type))

        mydb.commit()
        # Ensure to get the latest inserted notification for the user and post
        mycursor.execute('SELECT notyid, registration_date,postid FROM notifications WHERE user_id = %s AND postid = %s ORDER BY notyid DESC LIMIT 1', (userid, postid))
        out = mycursor.fetchone()
        return out[0], out[1],out[2]
    except Exception as err:
        print(err)
        return None, None

@app.route('/fetchnotifications', methods=['POST'])
def getnotifications():
    data = request.get_json()
    instate = data.get('state')
    userid = data.get('userid')
    
    mycursor.execute("SELECT * FROM notifications WHERE state=%s AND hostid=%s", (instate, userid))
    nots = mycursor.fetchall()
    
    allnots = []
    for noty in nots:
        user = get_user_by_id(noty[1])  
        unnoty = {
            'username': user['username'],
            'profile_pic': user['profile_pic'],
            'notyid':noty[0],
            'postid': noty[3], 
            'type': noty[4],    
            'state': noty[5],
            'time': noty[10].isoformat() if isinstance(noty[10], datetime) else str(noty[10]),
        }
        allnots.append(unnoty)
    return jsonify(allnots)

    
@socketio.on('thispost')
def thispost(data):
    try:
        allinpost = data.get('jobdata', {})
        post_info = allinpost.get('postinfo', '')
        useremail = allinpost.get('useremail', '')
        files = allinpost.get('files', [])

        if not useremail or not post_info:
            logging.error("Missing email or post info")
            return

        user = get_user_by_email(useremail)           
        if not user:
            logging.error("User not found!")
            return

        post_id, registration_date = save_post(user['id'], post_info, files)

        if post_id and registration_date:           
           emit_new_post(user, post_info, post_id,registration_date, files)
           
        else:
            logging.error("Failed to save post")
            return

    except Exception as err:
        logging.error("ERROR: %s", err)



def get_user_by_email(email):
    mycursor.execute("SELECT id, username, profile_pic FROM worknestusers WHERE email=%s", (email,))
    user = mycursor.fetchone()
    return {'id': user[0], 'username': user[1], 'profile_pic': user[2]} if user else None

def get_user_by_id(userid):
    mycursor.execute("SELECT email, username, profile_pic FROM worknestusers WHERE id=%s", (userid,))
    user = mycursor.fetchone()
    return {'email': user[0], 'username': user[1], 'profile_pic': user[2]} if user else None

def get_user_by_postid(postid):
    mycursor.execute("SELECT user_id FROM  worknestposts WHERE postid=%s", (postid,))
    user = mycursor.fetchone()
    return {'id': user[0]} if user else None


def save_post(user_id, post_info, files):
    try:
        mycursor.execute(
            "INSERT INTO worknestposts (user_id, posts, files) VALUES (%s, %s, %s)",
            (user_id, post_info, json.dumps(files))
        )
        mydb.commit()

        # Fetch the last inserted post ID and registration date
        mycursor.execute(
            "SELECT LAST_INSERT_ID(), registration_date FROM worknestposts WHERE postid = LAST_INSERT_ID()"
        )
        post_id_and_date = mycursor.fetchone()

        if post_id_and_date:
            post_id = post_id_and_date[0]
            registration_date = post_id_and_date[1]

            if isinstance(registration_date, datetime):
              registration_date = registration_date.isoformat()
            #registration_date = format_datetime(registration_date)
            return post_id, registration_date
        else:
            return None, None  
    except Exception as e:
        print(f"An error occurred: {e}")
        return None, None

def format_datetime(dt):
    """
    Formats a datetime object to the format "Wed, 31 Jul 2024 01:56:48"
    
    :param dt: datetime object
    :return: formatted date string
    """
    if not isinstance(dt, datetime):
        raise ValueError("Input must be a datetime object")

    return dt.strftime("%a, %d %b %Y %H:%M:%S")

def emit_new_post(user, post_info, post_id, timestamp, files):
    print("DATE:👌👌", timestamp)
    emit('newposts', {
        'username': user['username'],
        'userprofilepic': user['profile_pic'],
        'postinfo': post_info,
        'postid': post_id,
        'posttime':timestamp,
        'files': files
    }, room="worknest2024")


@socketio.on('jobpost')
def postajob(data):
    try:
        join_room('worknest2024')
        job = data.get('jobdata', {})
        pic = data.get('jobLogo', 'default_logo.png')

        print("Job Data:", job)
        print("Job Logo:", pic)

        my = get_user_by_email(job.get('useremail', ''))
        userid = my['id']

        # Emit job data to the room
        emit('updatingjob', {
            'jobposter': job.get('username', ''),
            'jobposteremail': job.get('useremail', ''),
            'jobposterprofilepic': job.get('userprofilepic', ''),
            'jobcompany': job.get('jobCompany', ''),
            'joblink': job.get('jobLink', ''),
            'joblogo': pic,
            'jobposition': job.get('jobPosition', ''),
            'jobcategory': job.get('jobCategory', ''),
            'jobdescription': job.get('jobDescription', ''),
            'jobrequirement': job.get('jobRequirement', ''),
            'jobexpiry': job.get('jobExpiry', ''),
            'minsalary': f"{int(job.get('minSalary', 0)):,}",
            'maxsalary': f"{int(job.get('maxSalary', 0)):,}",
            'jobcountry': job.get('country', ''),
            'jobcity': job.get('city', ''),
            'requirementattach': job.get('fileContents', ""),
            'jobtypes': job.get('jobTypes', ""),
            'jobexperience': job.get('experienceLevels', "")
        }, room='worknest2024')

        # Insert job data into the database
        mycursor.execute("""
            INSERT INTO worknestjobs (
                user_id, company_name, company_url, company_logo, position, category,
                type, description, requirements, address, city, country, salary_range,
                application_deadline, experience, requirement_attach
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (
            userid, job.get('jobCompany', ''), job.get('jobLink', ''), pic,
            job.get('jobPosition', ''), job.get('jobCategory', ''),
            ','.join(job.get('jobTypes', [])), job.get('jobDescription', ''),
            job.get('jobRequirement', ''), job.get('address', ''),
            job.get('city', ''), job.get('country', ''),
            f"{int(job.get('minSalary', 0)):,} - {int(job.get('maxSalary', 0)):,}",
            job.get('jobExpiry', None), ','.join(job.get('experienceLevels', [])),
            json.dumps(job.get('fileContents', []))
        ))

        mydb.commit()
    except Exception as e:
        print("Error:", e)
        mydb.rollback() 
        emit('jobpost_error', {'error': str(e)}, room='worknest2024')




@socketio.on('updatemydetails')
def updatemydetails(data):
    print("Updating...")

    formone = data.get('formone')
    formtwo = data.get('formtwo')
    lastform = data.get('lastform')
    
    try:
        # Form One personal data
        useremail = formone.get('userEmail')
        print("My Email:" ,useremail)
        mycursor.execute('SELECT id FROM worknestusers WHERE email = %s', (useremail,))
        userinid = mycursor.fetchone()
        print("HERE IS NY ID ::",userinid)
        if userinid:
            if formone :
            
                userid = userinid[0]
                userimage = formone.get('filePath')
                print("user image is :", userimage)
                userphone = formone.get('userPhone')
                userdob = formone.get('dob')
                usergender = formone.get('selectedGender')
                selectedLanguages = ','.join(formone.get('selectedLanguages', []))
                
            if formtwo:
                # Form Two data
                usercountry = formtwo.get('myCountry')
                usercity = formtwo.get('city')
                userinterests = ','.join(formtwo.get('myInterests', []))
                userskills = ','.join(formtwo.get('mySkills', []))
                userlinkedin = formtwo.get('myLinkedIn')
                userwhatsapp = formtwo.get('myWhatsApp')
                userfacebook = formtwo.get('myFacebook')
                usertiktok = formtwo.get('myTikTok')
                
                user_info_sql = """
                    UPDATE worknestusers SET
                        profile_pic = %s, phone = %s, birthdate = %s, gender = %s,
                        userLanguages = %s, country = %s, city = %s,
                        intrest = %s, linkedinUrl = %s,
                        whatsappUrl = %s, facebookUrl = %s, tiktokUrl = %s
                    WHERE id = %s
                """

                user_info_values = (
                    userimage, userphone, userdob, usergender, 
                    json.dumps(selectedLanguages),  # Convert to JSON string
                    usercountry, usercity,json.dumps(userinterests), userlinkedin, 
                    userwhatsapp, userfacebook, usertiktok, userid
                )

                mycursor.execute(user_info_sql, user_info_values)
                mydb.commit()
                emit('userinfoupdate',{'profile':userimage,'phone':userphone, 'dob':userdob, 'gender':usergender},room = userinid)
                print("Personal info saved!")
               
            if lastform:
                    # Loop through institutions, organizations, and projects
                    userinstitutions = lastform.get('institutionData', [])
                    userorganisations = lastform.get('organisationData', [])
                    userprojects = lastform.get('projectsData', [])

                    # Initialize lists to store data
                    institutions_data = []
                    organisations_data = []
                    projects_data = []

                    for institution in userinstitutions:
                        inst_name = institution.get('university')
                        startd = institution.get('from')
                        endd = institution.get('to')
                        achieve = institution.get('achievements')
                        
                        startd = startd if startd else None
                        endd = endd if endd else None

                        institutions_data.append({
                            'name': inst_name,
                            'start': startd,
                            'end': endd,
                            'achievements': achieve
                        })


                    for organization in userorganisations:
                        org_name = organization.get('organization')
                        orgstartd = organization.get('from')
                        orgendd = organization.get('to')
                        position = organization.get('position')
                        
                        orgstartd = startd if startd else None
                        orgendd = endd if endd else None
                        
                        organisations_data.append({
                            'name': org_name,
                            'start': orgstartd,
                            'end': orgendd,
                            'position': position
                        })

                    for project in userprojects:
                        prjct_name = project.get('projectName')
                        desc = project.get('description')
                        projects_data.append({
                            'name': prjct_name,
                            'description': desc
                        })

                    # Check if there's any data collected
                    if institutions_data or organisations_data or projects_data:
                   

                        for skills in userskills:
                            skills_sql = """
                            INSERT INTO  worknestusersskills (user_id, skills)
                            VALUES (%s, %s)
                            """
                            skills_values = (
                                userid,
                                skills,
                            )
                            mycursor.execute(skills_sql, skills_values)
                            mydb.commit()     
                            
                        for project in userprojects:
                            project_sql = """
                            INSERT INTO worknestusersbackground (user_id, projectname, description)
                            VALUES (%s, %s, %s)
                            """
                            project_values = (
                                userid, 
                                project.get('projectName'),
                                project.get('description')
                            )
                            mycursor.execute(project_sql, project_values)
                            mydb.commit()
                        
                        print("set one complete..........")
                        # Insert institution data
                        for institution in userinstitutions:
                            institution_sql = """
                            INSERT INTO worknestusersbackground (user_id, university, start_date, end_date, achievements)
                            VALUES (%s, %s, %s, %s, %s)
                            """
                            institution_values = (
                                userid,
                                institution.get('university'),
                                institution.get('from'),
                                institution.get('to'),
                                institution.get('achievements')
                            )
                            mycursor.execute(institution_sql, institution_values)
                            mydb.commit()
                            

                        for organization in userorganisations:
                            organization_sql = """
                            INSERT INTO worknestusersbackground (user_id, organisation, start_date, end_date, position)
                            VALUES (%s, %s, %s, %s, %s)
                            """
                            organization_values = (
                                userid,
                                organization.get('organization'),
                                organization.get('from'),
                                organization.get('to'),
                                organization.get('position')
                            )
                            mycursor.execute(organization_sql, organization_values)
                            
                        mydb.commit()    
                        print("Details updated successfully.")
                    
                    else:
                        print("institution info not found!!!!!")
            else:
                print("user not found")
                return "User not found"

    except Exception as err:
        mydb.rollback()
        print("Error:", err)




#get universities in the world    

from SPARQLWrapper import SPARQLWrapper, JSON

# Define the SPARQL endpoint and query
sparql = SPARQLWrapper("https://query.wikidata.org/sparql")

# Define the query
query = """
SELECT ?university ?universityLabel WHERE {
  ?university wdt:P31 wd:Q3918.
  SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
}
LIMIT 100
"""

# Set up the query and headers
sparql.setQuery(query)
sparql.setReturnFormat(JSON)
sparql.addCustomHttpHeader('User-Agent', 'YourAppName/1.0 (YourContactInfo@example.com)')

# Execute the query and handle potential errors
try:
    # Send the query
    results = sparql.query().convert()

    # Debug print to inspect the raw results
    #print("Raw Results:", results)

    # Parse and extract universities' names
    universities = [result["universityLabel"]["value"] for result in results["results"]["bindings"]]
    #print("Universities:", universities)

except Exception as e:
    print("Error:", e)

#print(universities)

#get countries and phonenumbers in the world
import pycountry
import phonenumbers
from flask_socketio import SocketIO, emit
import requests


@socketio.on('getCountry')
def get_countries(data):
    try:
        countries = list(pycountry.countries)
        country_list = []
        privateroom = data['prvtroom']
        join_room(privateroom)
        print(privateroom)
        for country in countries:
            try:
                dialing_code = phonenumbers.country_code_for_region(country.alpha_2)
            except Exception as e:
                dialing_code = None

            country_list.append({
                'name': country.name,
                'alpha_2': country.alpha_2,
                'alpha_3': country.alpha_3,
                'dialing_code': dialing_code
            })
        
        emit('getCounties', {'countries': country_list},room =privateroom)
    except Exception as err:
        print(err)

def get_country_info(country_name):
    url = f"https://restcountries.com/v3.1/name/{country_name}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return None

@socketio.on('getcounty')
def get_counties_for_country(data):
    print('Working...')
    country_name = data.get('country')
    country_info = get_country_info(country_name)
    
    if country_info:
        print("Country found:", country_name)
        
        if 'cities' in country_info:
            cities = country_info['cities']
            print("Cities in", country_name)
            for city in cities:
                print(city)  
            emit('counties', {'cities': cities}) 
        else:
            print("No cities found for", country_name)
    else:
        print(f"Country '{country_name}' not found or API error.")


######################################################(Handle chats)
users = {}
@socketio.on('join')
def on_join(data):
    username = data['username']
    room = data['room']
    join_room(room)
    users[username] = {
        'sid': request.sid,
        'room': room
    }
    emit('message', {'sender':'', 'msg': f'{username} has entered the room.', 'room': room}, room=room)

@socketio.on('leave')
def on_leave(data):
    username = data['username']
    user_data = users.pop(username, None)
    if user_data:
        room = user_data['room']
        leave_room(room)
        emit('message', {'sender': 'System', 'msg': f'{username} has left the room.', 'room': room}, room=room)

@socketio.on('group_message')
def handle_group_message(data):
    room = data['room']
    msg = data['msg']
    sender = data['sender']
    file_data = data.get('file')
    
    emit('message', {'sender': sender, 'msg': msg, 'room': room, 'file': file_data}, room=room)

@socketio.on('private_message')
def handle_private_message(data):
    sender = data['sender']
    recipient = data['recipient']
    message = data['msg']
    file_data = data.get('file') 
    
    
    
    
    recipient_data = users.get(recipient)
    if recipient_data:
        recipient_sid = recipient_data['sid']
        emit('message', {'sender': sender, 'msg': message, 'recipient': recipient, 'file': file_data}, room=recipient_sid)
###END OF CHAT

if __name__ == '__main__':
    socketio.run(app, debug=True)
