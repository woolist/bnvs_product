from flask import Flask, request, render_template, jsonify
import sys
import io
import contextlib
import subprocess
import openai
from function import *

app = Flask(__name__)

@app.route("/")
def login():
    return render_template('login.html')

# 레벨 체크
@app.route('/level',methods=['GET'])   
def level():
     levels = ['Easy', 'Medium', 'Hard']               
     return render_template('level.html',levels=levels) 

@app.route('/content',methods=['POST'])   
def content():
     if request.method == 'POST':
          selected_level = request.form['level']
          #레벨에 맞는 html가져오는 함수
          if selected_level == "Easy":
               return render_template('main.html')
          elif selected_level == "Medium":
               return render_template('main.html')
          else :    
               return render_template('main.html')

# 챕터별 html rendering
@app.route('/content/render_template',methods=['GET','POST'])   
def contents_change():
     if request.method == 'POST':
          # 챕터가 바뀌면 문제로 리셋
          global exam_list
          global exam_num
          exam_num = 0
          #요청에 따라 컨텐츠 호출
          data = request.get_json()     # html에서 json형식으로 데이터 가져오기  
          exam_list = choice_problem(data.get('title'))    #문제 리스트 출력
          exam = exam_list[0] #문제 중 1번 문제
          html_content = render_template(data.get('title'))     #template의 챕터 내용 가져오기
          # html과 txt를 JSON으로 변환 후 전달
          return jsonify({'html': html_content,'exam_html': exam})
# @app.route("/main")
# def index():
#     return render_template('main.html')

@app.route("/popup")
def popup():
    return render_template('popup.html')

@app.route("/test")
def test():
    return render_template('editortest.html')

# text code input -> output
@app.route('/execute', methods=['POST'])
def execute_code():
    code = request.json['code']
    
    try:
        result = subprocess.check_output(['python', '-c', code], stderr=subprocess.STDOUT, timeout=5, universal_newlines=True)
        return jsonify({'output': result, 'error': None})
    except subprocess.CalledProcessError as e:
        return jsonify({'output': e.output, 'error': 'Execution Error'})
    except subprocess.TimeoutExpired:
        return jsonify({'output': None, 'error': 'Timeout'})


#chatbot
@app.route('/chatbot',methods=['GET','POST'])   
def chatbot():
     global chat_log
     if request.method == 'POST':
          user_input = request.json.get('user_input')
          if user_input:
               gpt_responses,chat_log =chat_with_gpt3(user_input,chat_log)     
               return jsonify({'response': gpt_responses})
          else:
               return jsonify({'response': ''})
     return render_template('main_code_chatbot.html')

# bug fix
@app.route('/bugfix', methods=['GET','POST'])
def big_fix():
     if request.method == 'POST':
          data = request.get_json()
          print(data)
          message=bug_fixed(data.get('answer'))
          print(message)          
          return jsonify({'message': message})

     return render_template('main_bugfix.html')
# code review
@app.route('/codedescription', methods=['GET','POST'])
def code_description():
     if request.method == 'POST':
          data = request.get_json()
          print(data)
          message=code_info(data.get('answer'))
          print(message)          
          return jsonify({'message': message})
          
     return render_template('main_code_descrip.html')



if __name__ == '__main__':
     openai.api_key = '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'
     chat_log = [{"role": "system", "content": "너는 초보자를 위한 코딩 튜터야. 파이썬을 처음 배우는 사람 눈높이에 맞게 질문에 대한 응답을 해주면돼. 컴퓨터 언어관련 질문만 응답하고 이 외 질문에는 '코드에 대한 질문만 입력해주세요!'라고만 출력해"}]
     app.run(debug=True)