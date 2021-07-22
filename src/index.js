$(document).ready(()=>{
    createCustomBox("#box-container", {
        boxImage : {
            lock_src : "./assets/images/locks_and_crates/crate-lock-2.png",
            unlock_src : "./assets/images/locks_and_crates/crate-unlock-2.png",
            width : 270,
            height : 170
        },
        lockImage : {
            src : "./assets/images/locks_and_crates/lock.png",
            width : 22,
            height : 22,
            position : [
                { x : 33, y : 47 },
                { x : 83, y : 50 },
                { x : 133, y : 53 },
            ]
        },
        unlockImage : {
            src : "./assets/images/locks_and_crates/unlock.png"
        }
    });
});