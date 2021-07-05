
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
                animation-duration : .5s;
            }
        </style>
    `;
$("head").append(style);
(function(){
    createCustomBox = (container, options) => {
        var opts = {
            boxImage : {
                src : '',
                width : 200,
                height : 200
            },
            lockImage : {
                src : '',
                width : 60,
                height : 100,
                position : [
                    {
                        x : 100,
                        y : 20
                    }
                ]
            },
            unlockImage : {

            }
        }
        opts.boxImage = {...opts.boxImage, ...options.boxImage};
        opts.lockImage = {...opts.lockImage, ...options.lockImage};
        opts.unlockImage = {...opts.unlockImage, ...options.unlockImage};
        var boxImage = `<img src='${opts.boxImage.lock_src}' width="${opts.boxImage.width}" height="${opts.boxImage.height}" class='box-image' alt='Crate with Locks'/>`;
        $(container).addClass("box-container")
                    .append(boxImage);
        for(var i=0;i<opts.lockImage.position.length; i++){
            let offset = opts.lockImage.position[i];
            $(container).append(`<img src="${opts.lockImage.src}" width="${opts.lockImage.width}" style="left:${offset.x};top:${offset.y}" class='lock-image'/>`);
        }
        $(container+" .box-image").mouseover(hoverBox);
        $(container+" .lock-image").mouseover(hoverLock)
        $(container+" .lock-image").click((e)=>{clickLock(e,opts.boxImage.unlock_src, opts.unlockImage.src)});
    };
}());
var hoverLock = (e)=>{
    $(e.target).data('visit', '1');
}
var clickLock = (e, unlockBox_src, unlockK_src)=>{
    $(e.target).attr('src', unlockK_src).data('unlock', '1').fadeOut(800);

    var lockImage = $(e.target).parent().find("img[class='lock-image']");
    var all_unlock=0;
    lockImage.each((idx, el)=>{
        if($(el).data('unlock')=='1')
            all_unlock++;
    })
    if(all_unlock==3)
        $(e.target).siblings("img[class='box-image']").attr('src', unlockBox_src);
}
var hoverBox = (e)=>{
    var visit=0;
    $(e.target).parent().find('.lock-image').each((index, el)=>{
        if($(el).data('visit')=="1")
            visit=1;
    })
    if(visit){
        $(e.target).parent().find('.lock-image').data('visit', '0');
        return;
    }
    var boxImage = $(e.target);
    let width = $(boxImage).width();
    let height = $(boxImage).height();
    let lockImage = $(boxImage).parent().find('.lock-image');
    let lock_top = intVal($(lockImage[0]).css('top'));
    let lock1_left = intVal($(lockImage[0]).css('left'));
    let lock2_left = intVal($(lockImage[1]).css('left'));
    let lock3_left = intVal($(lockImage[2]).css('left'));
    var keyframe = `
        <style id="animateBox">
            @keyframes animateBox{
                0% {width : ${width+20}px; height : ${height-20}px;}
                50% {width : ${width-40}px; height : ${height+40}px;}
                100% {width : ${width+20}px; height : ${height-20}px;}
            }
            @keyframes movelock-1{
                50% {left : ${lock1_left}px; top : ${lock_top+13}px;}
            }
            @keyframes movelock-2{
                50% {left : ${lock2_left-15}px; top : ${lock_top+16}px;}
            }
            @keyframes movelock-3{
                50% {left : ${lock3_left-23}px; top : ${lock_top+19}px;}
            }
        </style>`;
    if(!$("style[id='animateBox']").length)
        $("head").append(keyframe);
    $(boxImage).css('animation-name', 'animateBox');
    $(lockImage[0]).css('animation-name', 'movelock-1');
    $(lockImage[1]).css('animation-name', 'movelock-2');
    $(lockImage[2]).css('animation-name', 'movelock-3');
    setTimeout(()=>{
        $(boxImage).css('animation-name', '');
        $(lockImage[0]).css('animation-name', '');
        $(lockImage[1]).css('animation-name', '');
        $(lockImage[2]).css('animation-name', '');
    }, 1000);
}

var intVal = (value) => {
    return parseInt(value.substring(0, value.length-2));
}