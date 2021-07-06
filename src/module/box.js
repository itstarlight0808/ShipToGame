
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
    if(!$("#lock_mechanism").length)
        $("body").append("<div id='lock_mechanism'></div>");
    $("#lock_mechanism").dialog({
        modal : true,
        width : "auto",
        height : "auto",
        minWidth : 400,
        minHeight : 400,
        show : "fade",
        closeOnEscape : true,
        open : (e, ui) =>{
            $(".ui-widget-overlay").addClass('modal-opened');
        },
        close : (e, ui) =>{
            $(".ui-widget-overlay").removeClass('modal-opened');
        }
    })
    var boxImage = $(e.target).parent().find(".box-image");
    $(lockImage).css('top', (intVal($(lockImage).css('top'))+15)+'px');
    $(lockImage).data('unlocked', '1');
    update_animation(boxImage, lockImage, 1);

    $(e.target).siblings("img[class='box-image']").attr('src', unlockBox_src);
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