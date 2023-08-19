import openai
import os 
#메인페이지 처리 함수

#레벨 처리 함수

#챕터에 맞는 컨텐츠 출력 함수
def choice_problem(url):
    #url에서 파일명만 선택
    file_name = os.path.basename(url)
    chap_name = os.path.splitext(file_name)[0]
    #문제 url 만들기
    new_url = f'static/sorce/problume/{chap_name}.txt'
    #문제를 list로 저장 후 전달
    with open(new_url, encoding='utf-8', mode='r') as file:
        lines = file.read()
    problem_list = lines.split("\n\n")
    print(chap_name,new_url,problem_list[1])
    return problem_list
    
#문제 정/오답처리 함수
def check_ploblem(plob,user_answer):
    mes=[
    {
      "role": "system",
      "content": "너는 주어진 조건에 맞게 파이썬 연습 문제를 체점해야하는 코딩 선생님이야.\n1.답부분이 코드가 아닌걸로 보이면 체점하지말고 \"코드를 입력해주세요!\"라고 출력.\n2.조건이 모두 맞으면 정답. 둘 중 하나라도 안맞으면 오답.\n- 문제에서 주어진 조건에 맞게 코드를 작성하고 결과가 출력되는지\n- 코드가 제대로 동작되는지\n3.정답이면 아래 조건으로 이어서 출력.\n- 다음 줄에 코드에 보완할 점이 있으면 보완할 부분 파이썬 {level} 에 맞게 설명하기.\n- 보완할 점이 없으면 \"완벽한 코드입니다!\"와 같은 칭찬문구 출력.\n4. 오답이면 아래조건으로 이어서 출력.\n- 오답인 부분을 고칠 수 있는 힌트 알려주기\n- 파이썬 초급자에 맞게 설명하기\n- 답은 알려주지 않는다.\n 5. 답변 출력형식을 지정한데로 출력\n 정답일때 출력형식\n 체점 결과: 정답\n보완할 점 OR 칭찬문구\n -----------\n 오답일때 출력\n체점 결과: 오답\n힌트: 오답인 부분을 고칠 수 있는 힌트"
    }]
    prompt = f'문제:{plob} \n답:\n {user_answer}'
    print(prompt)
    try:
        mes.append({"role": "user", "content": prompt})
        
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= mes
        )       
        reply = response.choices[0].message.content
        mes.append({"role": "assistant", "content": reply})       
        return reply

    except Exception as e:
        return str(e)
    
#gpt 응답처리 함수
def chat_with_gpt3(prompt,chat_log):
    try:
        mes = chat_log
        mes.append({"role": "user", "content": prompt})
     
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= mes
        )       
        reply = response.choices[0].message.content
        mes.append({"role": "assistant", "content": reply})       
        return reply,mes

    except Exception as e:
        return str(e),str(e)
    
    
# 문제 생성 함수
def make_exam(mes):
    try:
        mes.append({"role": "user", "content": "문제 만들어줘"})
        
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= mes
        )       
        reply = response.choices[0].message.content
        mes.append({"role": "assistant", "content": reply})       
        return reply,mes

    except Exception as e:
        return str(e),str(e)
    
def code_info(user_answer):
    mes=[
    {
      "role": "system",
      "content": "입력된 코드를 설명해줘. 설명은 코드 한줄씩 간략하게 설명해주고 파이썬을 처음 배우는 사람이 어려울거같은 부분은 자세하게 설명해줘."
    }]
    prompt = f'코드:\n {user_answer}'

    try:
        mes.append({"role": "user", "content": prompt})
        
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= mes
        )       
        reply = response.choices[0].message.content   
        return reply
    
    except Exception as e:
        return str(e),str(e)
    
def bug_fixed(user_answer):
    mes=[
    {
      "role": "system",
      "content": "코드에서 버그가 발생했어. 입력된 코드에서 수정해야되는 부분을 찾아줘. 오류가 왜 발생한지 설명은 자세하게 설명해줘."
    }]
    prompt = f'코드:\n {user_answer}'

    try:
        mes.append({"role": "user", "content": prompt})
        
        response = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages= mes
        )       
        reply = response.choices[0].message.content   
        return reply
    
    except Exception as e:
        return str(e),str(e)    
    
    
    
