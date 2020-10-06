/*****로그인 예외처리*****/
function examineExceptionLogin(){
    const form=document.login_form;

    if(form.id.value===''){
        alert("아이디를 입력해주세요.");
        form.id.focus();
        return;
    }
    else if(form.password.value===''){
        alert("비밀번호를 입력해주세요.");
        form.password.focus();
        return;
    }
    form.submit(); 
}