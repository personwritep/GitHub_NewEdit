// ==UserScript==
// @name        GitHub NewEdit 🔵
// @namespace        http://tampermonkey.net/
// @version        0.1
// @description        連番付きの新規ファイルのファイル編集画面を開く「Shift+左Click」
// @author        personwritep
// @match        https://github.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=github.com
// @grant        none
// @updateURL        https://github.com/personwritep/GitHub_NewEdit/raw/main/GitHub_NewEdit.user.js
// @downloadURL        https://github.com/personwritep/GitHub_NewEdit/raw/main/GitHub_NewEdit.user.js
// ==/UserScript==


let target=document.querySelector('head');
let monitor0=new MutationObserver(main);
monitor0.observe(target, { childList: true });

main();

function main(){
    let q=window.location.search;
    if(q && !q.includes('search')){
        q=q.replace('?', '');
        input_filename(q); }
    else{
        to_edit(); }



    function input_filename(name){
        let index=name.lastIndexOf('_');
        if(index!=-1){
            let s_name=name.substring(0, index+1);
            let ver_n=name.substring(index+1);
            ver_n=(ver_n*1 + 0.1).toFixed(1);
            let new_name=s_name + ver_n;

            let input_name=document.querySelector('input[aria-label="File name"]');
            if(input_name){
                // JavaScriptのセッターの標準プロパティを取得
                let valueSetter=
                      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value").set;
                // Reactの内部状態をバイパスして値を強制的に書き込む
                valueSetter.call(input_name, new_name);
                //「ユーザーが入力した」というイベントを発生
                let event=new Event('input', { bubbles: true });
                input_name.dispatchEvent(event); }
        }

    } // input_filename()



    function to_edit(){
        let tr_s=document.querySelectorAll('.react-directory-row');
        for(let k=0; k<tr_s.length; k++){
            tr_s[k].addEventListener('click', function(event){
                if(event.shiftKey){
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    let svg=tr_s[k].querySelector('svg.octicon-file');
                    if(svg){ // ファイル名の行の場合
                        let link=tr_s[k].querySelector('.react-directory-row-name-cell-large-screen a');
                        if(link){
                            let edit_url;
                            let now_url=location.href.split('?')[0];
                            if(now_url.includes('/tree/main')){
                                edit_url=now_url.replace('/tree/main', '/new/main');
                                edit_url=edit_url + '?' + link.textContent; }
                            else{
                                edit_url=now_url + '/new/main?' + link.textContent; }

                            window.open(edit_url);
                            }}
                }}); }

    } // to_edit()

} // main()
