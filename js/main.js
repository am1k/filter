/**
 * Created by v.bogoroditskiy on 8/14/2015.
 */

(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                "with(obj){p.push('" +
                str
                    .replace(/[\r\t\n]/g, " ")
                    .split("<%").join("\t")
                    .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                    .replace(/\t=(.*?)%>/g, "',$1,'")
                    .split("\t").join("');")
                    .split("%>").join("p.push('")
                    .split("\r").join("\\'")
                + "');}return p.join('');");
        return data ? fn( data ) : fn;
    };
})();


(function(module){

    var information = JSON.parse(module.list),
        keys = Object.keys(information[0]),
        content = document.querySelector('.select-template'),
        contentSecond = document.querySelector('.select-template-two'),
        info = document.querySelector('.info-template'),
        selectFirst,
        selectSecond;

    function selectContent(templates){
        content.innerHTML = tmpl(templates[0], {
            items: keys,
            selected: 'born'
        });
        selectFirst = document.querySelector('.select1');

        selectFirst.addEventListener('change', function(){
            render(templates);
        });
        render(templates);
    }

    function selectContentTwo(templates){
        contentSecond.innerHTML = tmpl(templates[2], {
            items: keys,
            selected: 'name'
        });
        selectSecond = document.querySelector('.select2');

        selectSecond.addEventListener('change', function(){
            render(templates);
        });
        render(templates);
    }

    function checkSelect() {
        return selectSecond.options[selectSecond.selectedIndex].innerText;
    }

    function key(keys, key){
        return keys.reduce(function(prev, stock){
            if(prev.indexOf(stock[key]) === -1){
                prev.push(stock[key]);
            }
            return prev;
        }, []);
    }

    function render(templates){
        console.log(information);
        info.innerHTML = tmpl(templates[1], {
            items: key(information, checkSelect())
        });
    }


    var urlArray = [
                    "templates/template-select-first.html",
                    "templates/template-information.html",
                    "templates/template-select-second.html"];

    var loadTemplate = Promise.all(Array.prototype.map.call(urlArray, function(urls){
        return new Promise(function(resolve, reject){
            var req = new XMLHttpRequest();
            req.open("GET", urls, true);
            req.addEventListener('load', function(){
                if (req.status == 200)
                    resolve(req.responseText);
                else
                    reject(new Error("request failed"))
            });
            req.send(null);
        });
    })).then(function(templates){
//        selectContent(templates);
        selectContentTwo(templates);
    });



}(connect));