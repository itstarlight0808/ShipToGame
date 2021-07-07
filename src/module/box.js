/**
 * Custom Box with three locks...
 * @author Fury
 * @date 07/01/2021
**/
var createCustomBox;

var style=`
        <style>
            .box-container{
                margin : auto;
                display : flex;
                position : relative;
                align-items : center;
            }
            .box-image{
                animation-duration : .6s;
                animation-timing-function: ease;
            }
            .lock-image{
                position : absolute;
                cursor : pointer;
                animation-duration : .6s;
            }
        </style>
    `;
$("head").append(style);
(function(){
    createCustomBox = (container, options) => {
        var opts = {
            boxImage : {
                lock_src : '',
                unlock_src : '',
                width : 270,
                height : 170
            },
            lockImage : {
                src : '',
                width : 60,
                height : 100,
                position :{
                        x : 100,
                        y : 20
                }
            },
            unlockImage : {

            }
        }
        opts.boxImage = {...opts.boxImage, ...options.boxImage};
        opts.lockImage = {...opts.lockImage, ...options.lockImage};

        var boxImage = `<img src='${opts.boxImage.lock_src}' width="${opts.boxImage.width}" height="${opts.boxImage.height}" class='box-image' alt='Crate with Locks'/>`;
        $(container).addClass("box-container")
                    .append(boxImage);
        $(container).append(`<img src="${opts.lockImage.src}" width="${opts.lockImage.width}" style="left:${opts.lockImage.position.x};top:${opts.lockImage.position.y}" class='lock-image'/>`);
        $(container+" .box-image").mouseover(hoverBox);
        $(container+" .lock-image").mouseover(hoverLock)
                                .click((e)=>{clickLock(e,opts.boxImage.unlock_src)});
    };
}());
var hoverLock = (e)=>{
    $(e.target).data('visit', '1');
}
var clickLock = (e, unlockBox_src)=>{
    var container = $(e.target).parent();
    var lockImage = container.find(".lock-image");
    if($(lockImage).data('unlocked'))
        return;
    if($("#lock_mechanism_dialog").length)
        $("#lock_mechanism_dialog").remove();
    buildLockMechanismDialog();

    $("#lock_mechanism_dialog").dialog({
        modal : true,
        width : "auto",
        height : "auto",
        minWidth : 400,
        minHeight : 350,
        show : "fade",
        closeOnEscape : true,
        open : (e, ui) =>{
            $(".ui-widget-overlay").addClass('modal-opened');
        },
        close : (e, ui) =>{
            $(".ui-widget-overlay").removeClass('modal-opened');
        }
    })
    $("#lock_mechanism_dialog").data('container', container)
                                .data('unlockBox_src', unlockBox_src);
}
var open_box = () => {
    let container = $("#lock_mechanism_dialog").data('container');
    let unlockBox_src = $("#lock_mechanism_dialog").data('unlockBox_src');
    
    var boxImage = $(container).find(".box-image");
    var lockImage = $(container).find(".lock-image");
    $(lockImage).css('top', (intVal($(lockImage).css('top'))+15)+'px');
    $(lockImage).data('unlocked', '1');
    update_animation(boxImage, lockImage, 1);

    $(boxImage).attr('src', unlockBox_src);
}
var hoverBox = (e)=>{
    let lockImage = $(e.target).parent().find('.lock-image');
    if($(lockImage).data('visit') == '1'){
        $(lockImage).data('visit', '0');
        return;
    }
    var boxImage = $(e.target);
    update_animation(boxImage, lockImage);

    $(boxImage).css('animation-name', 'animateBox');
    $(lockImage).css('animation-name', 'movelock');
    setTimeout(()=>{
        $(boxImage).css('animation-name', '');
        $(lockImage).css('animation-name', '');
    }, 1000);
}

var intVal = (value) => {
    return parseInt(value.substring(0, value.length-2));
}
var update_animation = (boxImage, lockImage, unlocked=0) => {
    let width = $(boxImage).width();
    let height = $(boxImage).height();
    
    let lock_top = intVal($(lockImage).css('top'));
    let lock_left = intVal($(lockImage).css('left'));

    var keyframe = `
        <style id="animateBox">
            @keyframes animateBox{
                0% {width : ${width+20}px; height : ${height-20}px;}
                50% {width : ${width-40}px; height : ${height+40}px;}
                100% {width : ${width+20}px; height : ${height-20}px;}
            }
            @keyframes movelock{
                50% {left : ${lock_left-13}px; top : ${lock_top+13}px;}
                100% {left : ${lock_left+5}px; top : ${lock_top-5}px;}
            }
        </style>`;
    if(!$("style[id='animateBox']").length)
        $("head").append(keyframe);
    if(unlocked==1){
        $("style[id='animateBox']").remove();
        $("head").append(keyframe);
    }
}

/**
 * Lock Mechanism Implementation...
 * @author Fury
 * @date 07/05/2021
**/
const lockLetters = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    ["A", "B", "C", "D"],
    [3, 4, 5, 6, 7]
]
const letter_height = 60;
const init_top_margin = -Math.floor(letter_height/2)
const focus_pos = { x : 34,  y : 65, space : 72 }

var buildLockMechanismDialog = () => {
    let lock_html = "";
    for(let i=0;i<lockLetters.length;i++){
        let topMargin =  init_top_margin - letter_height*Math.floor(lockLetters[i].length/2-1);
        lock_html += `<div class='one-lock'>`;
        for(let j=0;j<lockLetters[i].length;j++){
            let letter = lockLetters[i][j].toString();
            let isNumber = '0'<=letter && '9'>=letter;
            lock_html+=`<div class="lock-letter ${isNumber?'lock-number':'lock-alphabet'}"`;
            if(j==0)
                lock_html+=` style="margin-top:${topMargin}px"`;
            lock_html+=`>${lockLetters[i][j]}</div>`;
        }
        lock_html+="</div>";
    }
    var style=`
        <style>
            #lock_mechanism_dialog{
                display : flex;
                align-items : center;
            }
            .mechanism-container{
                position : relative;
                display : flex;
                background : linear-gradient(to bottom, #c4c4c4 0%,#676767 100%);
                border-radius : 5px;
            }
            .one-lock{
                height : 120px;
                overflow : hidden;
                margin : 10px;
                cursor : pointer;
            }
            .lock-letter{
                font-size : 40px;
                border-radius : 5px;
                background : linear-gradient(to bottom, #303030 0%,#b6babd 9%,#ccd2d6 18%,#ffffff 55%,#ccd2d6 82%,#b6babd 91%,#8c9093 100%);
                color : #414f6b
                font-weight : bold;
            }
            .lock-letter::selection{
                background : none;
                color : none;
            }
            .lock-alphabet{
                padding : 0px 11px;
            }
            .lock-number{
                padding : 0px 15px;
            }
            .unlock-btn {
                margin-top : 15px;
                font-weight : 700;
                color : red;
                border-radius : 5px;
                border : 2px dashed gray;
                transition : .2s;
                user-select : none;
            }
            .unlock-btn:focus {
                outline : none;
            }
            .locked:hover {
                background : #ff2e2e;
                color : white;
                border-color : white;
            }
            .unlocked{
                background : green;
                color : white;
                border-color : white;
            }
        </style>
    `;
    var html = `
        <div id='lock_mechanism_dialog'>
            <div align="center">
                <div class="mechanism-container">
                    ${lock_html}
                </div>
                <button class="unlock-btn locked" onclick="unlock()">Unlock</button>
            </div>
        </div>
    `;
    $("head").append(style);
    $("body").append(html);

    js_event_function();
}
var js_event_function = ()=>{
    // for PC users...
    $(".one-lock").on('wheel', (e)=>{
        let deltaY = e.originalEvent.deltaY;
        let direction = deltaY>0?"down":"up";
        let shift_cnt = Math.floor(Math.abs(deltaY/125));
        if(shift_cnt>3)
            shift_cnt=3;

        let lock_el = $(e.target).parent();
        let first_letter = $(lock_el).children().first();
        let margin_top = $(first_letter).css('margin-top');
        $(first_letter).removeAttr('style');

        if(direction=="down")
            moveLetterFromTop(lock_el, shift_cnt, margin_top);
        else
            moveLetterFromBottom(lock_el, shift_cnt, margin_top);
    });
    // for Phone users..
    $("#lock_mechanism_dialog").mousedown((e)=>{
        $(e.target).parent().data('start-pos', {x : e.clientX, y : e.clientY});
    }).mouseup((e)=>{
        $(".one-lock").data('start-pos', '');
    })
    $("#lock_mechanism_dialog").mousemove((e)=>{
        var lock_el;
        var start_pos;
        $(".one-lock").each((idx, el)=>{
            if(!$(el).data('start-pos'))
                return;
            lock_el = el;
            start_pos = $(el).data('start-pos');
        })
        if(!lock_el)
            return;
        let offsetY = e.clientY - start_pos.y;
        let direction = offsetY>0?"up":"down";
        let shift_cnt = Math.abs(offsetY)%10;
        if(shift_cnt!=0)
            return;

        let first_letter = $(lock_el).children().first();
        let margin_top = $(first_letter).css('margin-top');
        $(first_letter).removeAttr('style');

        if(direction=="down")
            moveLetterFromTop(lock_el, 1, margin_top);
        else
            moveLetterFromBottom(lock_el, 1, margin_top);
    })
}
var moveLetterFromTop = (lock_el, shift_cnt, margin_top) => {
    for(let i=0;i<shift_cnt;i++){
        $(lock_el).append($(lock_el).find('.lock-letter').first().detach());
    }
    $(lock_el).find('.lock-letter').first().css('margin-top', margin_top);
}
var moveLetterFromBottom = (lock_el, shift_cnt, margin_top) => {
    for(let i=0;i<shift_cnt;i++){
        $(lock_el).prepend($(lock_el).find('.lock-letter').last().detach());
    }
    $(lock_el).find('.lock-letter').first().css('margin-top', margin_top);
}

var unlock = () => {
    let x0 = $(".mechanism-container").offset().left;
    let y0 = $(".mechanism-container").offset().top;
    let letter = [];
    for(let i=0; i<3; i++){
        let el = document.elementFromPoint(x0+focus_pos.x+i*focus_pos.space, y0+focus_pos.y);
        letter.push($(el).text());
    }
    if(letter.join('') == "2B3"){
        $(".unlock-btn").removeClass('locked')
                        .addClass('unlocked')
                        .text("Success")
                        .unbind('click');
        open_box();
    }
    else{
        $(".unlock-btn").text("Failed");
        setTimeout(()=>{$(".unlock-btn").text('Unlock')}, 2000);
    }
}