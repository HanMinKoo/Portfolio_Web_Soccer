function inquire_Form_Chk(){
    const form=document.request_form;

    if(form.userName.value===''){
        alert('회사 이름을 입력해주세요.');
        form.companyName.focus(); 
        return;
    }
    else if(form.phoneNumber.value===''){
        alert('휴대폰 번호를 입력해주세요.');
        form.phoneNumber.focus(); 
        return;
    }
    else if(form.content.value===''){
        alert('내용을 입력해주세요.');
        form.content.focus(); 
        return;
    }
    else if(!form.infoChk.checked){
        alert('개인정보 수집 및 이용 동의를 체크해주세요.');
        form.infoChk.focus(); 
        return;
    }
    form.submit(); 
}