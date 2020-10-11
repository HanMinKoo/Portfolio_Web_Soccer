function submitReservationInfo(){
    const form=document.calendarForm;
 
    if(form.day.value==='선택'){
        alert("날짜를 선택해주세요.");
        form.day.focus();
        return;
    }
    if(form.groundTime.value===''){
        alert("시간을 선택해주세요.");
        form.groundTime.focus();
        return;
    }
    
    form.submit();
}

function chanegeCalendar(){
    const year=$("#year").val();
    const month=$("#month").val();
    const day=$("#day").val();
    const ground_id= $("#groundNumber").val();
   
    if(year==='선택'|| month==='선택'|| day==='선택')
    {
        alert('날짜를 선택하세요.');
        return;
    }
    const data={
        year:year,
        month:month,
        day:day,
        ground_id:ground_id
    };
    
    $.ajax({
        url: "/reservation/process",
        type: 'post',
        data: data,
        success: function (data) {
            const div=document.getElementById('ImpossibleTime');
            let text='';
            for(let i=0; i<data.length; i++)
                text+=data[i].time+", ";  //가능 시간대 문자열로 가공
         
            div.innerHTML=`<strong>${text}</strong>`;     
        },
        error: function (xhr, status) {
            alert(xhr + " : " + status);
        }
    });
}