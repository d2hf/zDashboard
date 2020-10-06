export function allOverlaysOff(classNaming){
    let all = document.getElementsByClassName(classNaming);
    for (let i = 0; i < all.length; i++) {
        all[i].style.display = 'none';
    }

}