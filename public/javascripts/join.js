
/******회원가입 예외처리 ******/
function examineExceptionJoin(){
    const form=document.join_form;

    if(form.userName.value===''){
        alert("이름을 입력해주세요.");
        form.userName.focus();
        return;
    }
    else if(form.userPassword1.value===''){
        alert("비밀번호를 입력해주세요.");
        form.userPassword1.focus();
        return;
    }
    else if(form.userPassword2.value===''){
        alert("비밀번호 확인을 입력해주세요");
        form.userPassword2.focus();
        return;
    }
    else if(form.userId.value===''){
        alert("아이디를 입력해주세요.");
        form.userId.focus();
        return;
    }
    else if(form.userPassword1.value!==form.userPassword2.value){
        alert("비밀번호를 일치시켜주세요.");
        form.userPassword2.focus();
        return;
    }
    form.submit(); 
}

function checkID(){
    const id=$("#userId").val();

    const data={userID:id};
    if(data.userID === ''){ //id 비 입력시 예외처리
        alert('ID를 입력해주세요.');
        return;
    }

    $.ajax({
        url: "/join/checkid",
        type: 'POST',
        data: data,
        success: function (data) {
            (data==='1') ? alert('사용 가능한 ID입니다.'):alert('이미 존재하는 ID입니다.');
            
        },
        error: function (xhr, status) {
            alert(xhr + " : " + status);
        }
    });
}

function checkEmail(){
    const email=$("#userEmail").val();
    if(email === ''){ 
        alert('email을 입력해주세요.');
        return;
    }
    const data={email:email};
    
    $.ajax({
        url: "/join/checkemail",
        type: 'POST',
        data: data,
        success: function (data) {
            (data==='1') ? alert('사용 가능한 email입니다.'):alert('이미 존재하는 email입니다.');       
        },
        error: function (xhr, status) {
            alert(xhr + " : " + status);
        }
    });
}
