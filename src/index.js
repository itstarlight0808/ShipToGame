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
            width : 40,
            height : 40,
            position : {
                x : 75,
                y : 50
            }
        }
    });
});