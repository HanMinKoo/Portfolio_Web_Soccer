'use strict';

/******회원가입 예외처리 ******/
function examineExceptionJoin(){
   
    const idRegExp=/^[a-zA-Z0-9]{6,12}/;
    const nameRegExp=/^[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const passwordRegExp=/^[a-z0-9]{8,20}/;
    const form=document.join_form;
    
    let returnVariable;
    
    if(form.userName.value==='')
        returnVariable=alertException("이름을 입력해주세요.",form.userName);
    else if(form.userPassword1.value==='')
        returnVariable=alertException("비밀번호를 입력해주세요.",form.userPassword1);
    else if(form.userPassword1.value==='')
        returnVariable=alertException("비밀번호 확인을 입력해주세요.",form.userPassword2);
    else if(form.userPassword1.value!==form.userPassword2.value)
        returnVariable=alertException("비밀번호를 일치시켜주세요.",form.userPassword2);
    else if(form.userId.value==='')
        returnVariable=alertException("아이디를 입력해주세요.(6~12글자)",form.userId);
    else if(!form.duplicationIdChk.checked)
        returnVariable=alertException("아이디 중복체크를 진행하세요.",form.userId);
    else if(!form.duplicationEmailChk.checked)
        returnVariable=alertException("이메일 중복체크를 진행하세요.",form.userEmail);
    else if(!(idRegExp.test(form.userId.value)))
        returnVariable=alertException("아이디를 영문+숫자 조합으로 해주세요.(6~12글자)",form.userId);
    else if(!(nameRegExp.test(form.userName.value)))
        returnVariable=alertException("이름은 한글만 가능합니다.",form.userName);
    else if(!(passwordRegExp.test(form.userPassword1.value)))
        returnVariable=alertException("비밀번호를 영문+숫자 조합으로 해주세요(8~20글자).",form.userPassword1);
       
    if(returnVariable===false)
        return;
    
    form.submit(); 
}

function alertException(text, element){
    alert(text);
    element.focus();
    return false;
}
function a(){
    alert('test');
}
 function checkDuplication(type){
   
     let element;

    if(type==='email')
        element=document.getElementById("userEmail");
    else if(type==='id')
        element=document.getElementById("userId");
   
    //alert(element.value);
    if(element.value === ''){ 
        alert(`${type}을 입력해주세요.`);
        return;
    }

    const data={
        type:element.type,
        value:element.value
    };
    
    $.ajax({
        url: "/join/checkduplication",
        type: 'POST',
        data: data,
        success: function (data) {
            let radioID;
            if(data==='1'){
                alert(`사용 가능한 ${type}입니다.`);
                if(type==='email')
                    radioID=document.getElementById('duplicationRadioEmail');
                else if(type==='id')
                    radioID=document.getElementById('duplicationRadioId');
            }
            else{
                alert(`이미 존재하는 ${type}입니다.`); 
                return; 
            }
                 
            radioID.checked=true;  
        },
        error: function (xhr, status) {
            alert(xhr + " : " + status);
        }
    });
}

//     if(type==='email')
//         const value=$("#userEmail").val();
//     else if(type==='id')
//         const value=$("#userId").val();

    // if(value === ''){ 
    //     alert(`${type}을 입력해주세요.`);
    //     return;
    // }

    // const data={value:value};
    
    // $.ajax({
    //     url: "/join/checkduplication",
    //     type: 'POST',
    //     data: data,
    //     success: function (data) {
    //         let radioID;
    //         if(data==='1'){
    //             alert(`사용 가능한 ${type}입니다.`);
    //             if(type==='email')
    //                 radioID=document.getElementById('duplicationRadioEmail');
    //             else if(type==='id')
    //                 radioID=document.getElementById('duplicationRadioId');
    //         }
    //         else{
    //             alert(`이미 존재하는 ${type}입니다.`); 
    //             return; 
    //         }
                 
    //         radioID.checked=true;  
    //     },
    //     error: function (xhr, status) {
    //         alert(xhr + " : " + status);
    //     }
    // });
//}

// function checkDuplicationID(){
//     const id=$("#userId").val();

//     const data={userID:id};
//     if(data.userID === ''){ //id 비 입력시 예외처리
//         alert('ID를 입력해주세요.');
//         return;
//     }

//     $.ajax({
//         url: "/join/checkid",
//         type: 'POST',
//         data: data,
//         success: function (data) {
//             (data==='1') ? alert('사용 가능한 ID입니다.'):alert('이미 존재하는 ID입니다.');
//             const radioID=document.getElementById('duplicationRadioId');
//             radioID.checked=true;
//         },
//         error: function (xhr, status) {
//             alert(xhr + " : " + status);
//         }
//     });
// }