'use strict'

var timer = 0,
    interval1 = 0,
    change_body = true,
    chk_big_timer = 0;

window.onload = function() {
    polling();
}

async function polling() {
    let response = await fetch("/");
    if (response.status == 502) {
        await polling();
    } else if (response.status != 200) {
        console.log(response.statusText);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await polling();
    } else {
        let message = await response.text();
        //console.log(message);
        if (document.getElementById('big-timer').classList.contains('show') && chk_big_timer != 1) {
            chk_big_timer = 1;
            change_body = false;
            startTimer();
        }
        if (message.indexOf('big-timer hide') >= 0 && chk_big_timer == 1) {
            clearInterval(interval1);
            chk_big_timer = 0;
            change_body = true;
            document.getElementById("main").classList.remove("kicked");
            document.getElementById("big-timer").style = "";
        }
        if (change_body) {
            document.body.innerHTML = message;
        }
        await polling();
    }
}

function startTimer() {
    if (!timer && parseInt(document.getElementById('kicks').innerText) > 0) {
        document.getElementById("main").classList.add("kicked");
        document.getElementById("big-timer").style = "display: block !important;"
        timer = 59;
        interval1 = setInterval(function () {
            let seconds = timer;
            seconds = seconds < 10 ? "0" + seconds : seconds;
            document.getElementById("timer-inner").innerText = seconds;
            if (timer < 0) {
                clearInterval(interval1);
                chk_big_timer = 0;
                change_body = true;
                document.getElementById("main").classList.remove("kicked");
                document.getElementById("big-timer").style = "";
            }
            timer--;
        }, 1000);
    }
}