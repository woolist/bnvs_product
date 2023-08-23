// 채팅창과 입력창의 DOM 요소 가져오기
// const { Configuration, OpenAIApi } = require('openai');
import { Configuration, OpenAIApi } from 'https://cdn.skypack.dev/openai'
const chatMessages = document.getElementById("chating-container");
const userInput = document.getElementById("input");
const userInput_click1 = document.getElementById("send");
const userInput_click = document.querySelector('#bugfix-send');


// 사용자 메시지를 화면에 추가하는 함수
function addUserMessage(message) {
    var template = `
    <div class="line">
        <span class="chat-box mine">${message}</span>
    </div>
    `
    chatMessages.insertAdjacentHTML('beforeend',template)
}

// 챗봇 메시지를 화면에 추가하는 함수
function addBotMessage(message) {
    var template = `
    <div class="line">
        <span class="chat-box">${message}</span>
    </div>
    `
    chatMessages.insertAdjacentHTML('beforeend',template)
}

function user_chatGPT35(message) {
    //chatgpt 응답 받아오기
    const configuration = new Configuration({
        apiKey: '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',
    });
    const openai = new OpenAIApi(configuration);

    const response = openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "system", "content": "너는 초보자를 위한 코딩 튜터야. 파이썬을 처음 배우는 사람 눈높이에 맞게 질문에 대한 응답을 해주면돼. 컴퓨터 언어관련 질문만 응답하고 이 외 질문에는 '코드에 대한 질문만 입력해주세요!'라고만 출력해"},
            {
                "role": "user",
                "content": message,
            }
        ]
    });

    return response.data.choices[0].message.content;
}

// 사용자가 입력한 메시지를 처리하는 함수
function handleUserInput() {
    //사용자 입력을 화면에 출력
    const message = userInput.value;
    addUserMessage(message);

    //사용자 입력 응답처리
    const gpt_return = user_chatGPT35(message)
    addBotMessage(gpt_return)
}

userInput_click.addEventListener("click", function() {
    handleUserInput();
});

