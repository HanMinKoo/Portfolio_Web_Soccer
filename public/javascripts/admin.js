function updateReservationState(changeState,id,currentState){
    //여기서 id 매개변수는 예약번호, 즉 ground_reservation_list 의 pk값
    
    if(currentState==='승인 완료'){ //혹시모를 예외처리
        alert('이미 승인 처리된 예약입니다.');
        return;
    }
    const data={
        state:changeState,
        id:id
    };
    alert(data.id);
    $.ajax({
        url:`/reservationstate`,
        type:'post',
        data:data,
        success: (data)=>{
            if(data==='ok')
                location.reload();
        },
        error:(err,status)=>{ //뭐넘겨주는거지
            alert(err);
            alert(status);
            return;
        }
    }); 
}