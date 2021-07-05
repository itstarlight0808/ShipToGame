$(document).ready(()=>{
    createCustomBox("#box-container", {
        boxImage : {
            lock_src : "./assets/images/locks_and_crates/crate-lock-2.png",
            unlock_src : "./assets/images/locks_and_crates/crate-unlock-2.png",
            width : 200,
            height : 130
        },
        lockImage : {
            src : "./assets/images/locks_and_crates/lock-2.png",
            width : 19,
            height : 19,
            position : [
                {
                    x : 23,
                    y : 35
                },
                {
                    x : 61,
                    y : 38
                },
                {
                    x : 98,
                    y : 40
                }
            ]
        },
        unlockImage : {
            src : "./assets/images/locks_and_crates/unlock-2.png"
        }
    });
});