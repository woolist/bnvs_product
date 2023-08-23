// import "static/css/styles.css";
const resizable = function (resizer) {
  const direction = resizer.getAttribute("data-direction") || "horizontal";
  const prevSibling = resizer.previousElementSibling;
  const nextSibling = resizer.nextElementSibling;

  //  마우스의 위치값 저장을 위해 선언
  let x = 0;
  let y = 0;
  let prevSiblingHeight = 0;
  let prevSiblingWidth = 0;

  // resizer에 마우스 이벤트가 발생하면 실행하는 Handler
  const mouseDownHandler = function (e) {
    // 마우스 위치값을 가져와 x, y에 할당
    x = e.clientX;
    y = e.clientY;
    // 대상 Element에 위치 정보를 가져옴
    const rect = prevSibling.getBoundingClientRect();
    // 기존 높이와 너비를 각각 할당함
    prevSiblingHeight = rect.height;
    prevSiblingWidth = rect.width;

    // 마우스 이동과 해제 이벤트를 등록
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // 마우스가 움직이면 기존 초기 마우스 위치에서 현재 위치값과의 차이를 계산
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    // 이동 방향에 따라서 별도 동작
    // 기본 동작은 동일하게 기존 크기에 마우스 드래그 거리를 더한 뒤 상위요소(container)를 이용해 퍼센티지를 구함
    // 계산 대상이 x 또는 y인지에 차이가 있음
    switch (direction) {
      case "vertical":
        const h =
          ((prevSiblingHeight + dy) * 100) /
          resizer.parentNode.getBoundingClientRect().height;
        prevSibling.style.height = `${h}%`;
        break;
      case "horizontal":
      default:
        const w =
          ((prevSiblingWidth + dx) * 100) /
          resizer.parentNode.getBoundingClientRect().width;
        prevSibling.style.width = `${w}%`;
        break;
    }

    // 크기 조절 중 마우스 커서를 변경함
    // class="resizer"에 적용하면 위치가 변경되면서 커서가 해제되기 때문에 body에 적용
    const cursor = direction === "horizontal" ? "col-resize" : "row-resize";
    resizer.style.cursor = cursor;
    document.body.style.cursor = cursor;

    prevSibling.style.userSelect = "none";
    prevSibling.style.pointerEvents = "none";

    nextSibling.style.userSelect = "none";
    nextSibling.style.pointerEvents = "none";
  };

  const mouseUpHandler = function () {
    // 모든 커서 관련 사항은 마우스 이동이 끝나면 제거됨
    resizer.style.removeProperty("cursor");
    document.body.style.removeProperty("cursor");

    prevSibling.style.removeProperty("user-select");
    prevSibling.style.removeProperty("pointer-events");

    nextSibling.style.removeProperty("user-select");
    nextSibling.style.removeProperty("pointer-events");

    // 등록한 마우스 이벤트를 제거
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  // 마우스 down 이벤트를 등록
  resizer.addEventListener("mousedown", mouseDownHandler);
};

// 모든 resizer에 만들어진 resizable을 적용
document.querySelectorAll(".resizer").forEach(function (ele) {
  resizable(ele);
});

// AI-chatbot pop-up
function showPopup(){window.open("/popup","AI-chabot","width=517,height=530,left=70,top=30")}

// <!-- editor design-->
   
var editor = ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.session.setMode("ace/mode/python");
// 초기 텍스트 설정
editor.setValue("코드를 입력하세요..");

// 에디터에 포커스가 생길 때의 동작을 정의
editor.on('focus', function() {
    if (editor.getValue() === "코드를 입력하세요..") {
        editor.setValue(""); // 텍스트 삭제
    }
});

// 에디터에서 포커스가 사라질 때의 동작을 정의
editor.on('blur', function() {
    if (editor.getValue().trim() === "") {
        editor.setValue("코드를 입력하세요..");
    }
});
// <!--code 실행-->

$(document).ready(function() {
    $('#run').click(function() {
        let code = editor.getValue();
        
        $.ajax({
            url: '/execute',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ 'code': code }),
            success: function(response) {
                $('#output').text(response.output);
                $('#error').text(response.error);
            },
            error: function() {
                $('#output').text('');
                $('#error').text('An error occurred.');
            }
        });
    });
});

$(document).ready(function() {
  $('#check').click(function() {
      let code = editor.getValue();
      
      $.ajax({
          url: '/execute',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify({ 'code': code }),
          success: function(response) {
              $('#output').text(response.output);
              $('#error').text(response.error);
          },
          error: function() {
              $('#output').text('');
              $('#error').text('An error occurred.');
          }
      });
  });
});


// <!-- contents -->

$(document).ready(function(){           //웹 페이지가 완전히 로드된 후에 실행
    // 챕터를 선택하면 챕터에 맞게 교재 부분을 변경
    $(".dropdown-item").click(function(event){
        event.preventDefault();         // 기본 클릭 동작이 되지않도록 제어

        var href = $(this).attr('href');            // 클릭된 링크의 href 값을 가져옴

        // href 값을 서버에 전달
        $.ajax({
            url: "/content/render_template",
            type: "POST",
            data: JSON.stringify({title: href}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                // JSON에서 교재와 문제 내용을 가져옴
                var html_content = data['html'];
                var exam_html = data['exam_html'];

                // 기존의 내용을 지우고 새로운 내용을 추가
                $(".book-section").html(html_content);
                $("#exam-box").html(exam_html);
            }
        });
    });

    // 문제 정오답 체크 - 문제와 사용자 입력을 전달해 정오답 알림 띄우기
    $("#chek").click(function(){
        // id를 통해 값 가져오기
        var plob = $("#exam").val();
        var answer = $("#answer").val();

        // 서버에 전달
        $.ajax({
            url: "/content/check_answer",
            type: "POST",
            data: JSON.stringify({answer: answer, plob:plob}),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                // 서버에서 반환한 메시지를 팝업으로 띄움
                alert(data['message']);
            }
        });
    });

    // 다음 문제 출력
    $("#next").click(function(){
        $.ajax({
            url: "/content/next_plob",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                var exam_html = data['exam_html'];
                $("#exam-box").html(exam_html);     // 서버에서 받아온 문제 출력
                $("#answer").val('');               // textarea 리셋
            }
        });                    
    });                
});

// // code input 클릭시 클씨 사라짐
// $(document).ready(function() {
//   $('#editor').on('click', function() {
//       var content = $(this).text().trim();

//       if(content === "코드를 입력하세요..") {
//           $(this).text(''); // 내용을 지움
//       }
//   });

//   // 포커스가 사라졌을 때 내용이 없으면 기본 텍스트를 다시 설정
//   $('#editor').on('blur', function() {
//       if($(this).text().trim() === '') {
//           $(this).text('코드를 입력하세요..');
//       }
//   });
// });
