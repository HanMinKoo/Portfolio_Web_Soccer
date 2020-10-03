function join_Progress(){
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
    form.submit(); 
}

function processLogin(){
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