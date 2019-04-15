export function urlParse() {
    let url = window.location.search;
    let obj = {};
    let reg = /[?&][^?&]+=[^?&]+/g;
    let arr = url.match(reg);
    arr.forEach((str) => {
        let tempArr = str.substring(1).split('=');
        let key = encodeURIComponent(tempArr[0]);
        let val = encodeURIComponent(tempArr[1]);
        obj[key] = val;
    });
    return obj;
}