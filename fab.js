/* 凡人小幫手｜共用浮動選單（每頁右下角的小幫手，點一下展開）
   會自動排除「目前所在頁」，只顯示其他去處。 */
(function(){
  var API = "https://script.google.com/macros/s/AKfycbxw6eyMB_wjWSiUnX4U-7hbDfYrANT_NqWpPuJAzn5D3OZT51PE37gfeQxQIueQPsRN/exec";

  function jsonp(params){
    return new Promise(function(resolve, reject){
      var cb = "fcb_" + Date.now() + "_" + Math.floor(Math.random()*1e6);
      var s = document.createElement("script");
      var timer = setTimeout(function(){ cleanup(); reject(); }, 15000);
      function cleanup(){ clearTimeout(timer); try{ delete window[cb]; }catch(e){ window[cb]=undefined; } if(s.parentNode) s.parentNode.removeChild(s); }
      window[cb] = function(d){ cleanup(); resolve(d); };
      var qs = Object.keys(params).map(function(k){ return encodeURIComponent(k)+"="+encodeURIComponent(params[k]); }).join("&");
      s.onerror = function(){ cleanup(); reject(); };
      s.src = API + "?" + qs + "&callback=" + cb;
      document.head.appendChild(s);
    });
  }

  var PAGES = {
    home:  { href:"index.html",   label:"回到首頁", emoji:"🏠", grad:"linear-gradient(135deg,#9fd86a,#5fa320)" },
    qa:    { href:"qa.html",      label:"常見問題", emoji:"💬", grad:"linear-gradient(135deg,#ffb651,#ff7e3a)" },
    msg:   { href:"message.html", label:"留言詢問", emoji:"✏️", grad:"linear-gradient(135deg,#ff90b8,#e24f83)" },
    reply: { href:"reply.html",   label:"查詢回覆", emoji:"🔍", grad:"linear-gradient(135deg,#74bcf0,#3a82d2)" }
  };

  var path = location.pathname;
  var current = "home";
  if(/qa\.html/i.test(path)) current = "qa";
  else if(/message\.html/i.test(path)) current = "msg";
  else if(/reply\.html/i.test(path)) current = "reply";

  var order = ["home","qa","msg","reply"].filter(function(k){ return k !== current; });

  var css =
    ".ffab-wrap{position:fixed;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:9000;display:flex;flex-direction:column;align-items:flex-end;gap:12px;}" +
    ".ffab-menu{display:flex;flex-direction:column;align-items:flex-end;gap:10px;}" +
    ".ffab-item{display:inline-flex;align-items:center;gap:10px;text-decoration:none;align-self:flex-end;background:#fff;border-radius:999px;padding:7px 8px 7px 18px;box-shadow:0 6px 16px rgba(80,45,10,.24);font-weight:900;color:#5a2a10;font-size:16px;border:2px solid #fff;opacity:0;transform:translateY(14px) scale(.85);pointer-events:none;transition:opacity .22s ease,transform .24s cubic-bezier(.34,1.56,.64,1);font-family:'Noto Sans TC','Microsoft JhengHei',sans-serif;}" +
    ".ffab-item-tx{white-space:nowrap;}" +
    ".ffab-item-ic{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;color:#fff;box-shadow:0 2px 6px rgba(0,0,0,.18);}" +
    ".ffab-wrap.open .ffab-item{opacity:1;transform:none;pointer-events:auto;}" +
    ".ffab-wrap.open .ffab-item:nth-last-child(1){transition-delay:.04s;}" +
    ".ffab-wrap.open .ffab-item:nth-last-child(2){transition-delay:.10s;}" +
    ".ffab-wrap.open .ffab-item:nth-last-child(3){transition-delay:.16s;}" +
    ".ffab-btn{width:96px;height:96px;display:flex;align-items:center;justify-content:center;padding:0;background:transparent;border:none;cursor:pointer;animation:ffabPulse 2.6s ease-in-out infinite;-webkit-tap-highlight-color:transparent;transition:transform .25s ease;}" +
    ".ffab-btn:active{transform:scale(.94);}" +
    ".ffab-wrap.open .ffab-btn{animation:none;transform:rotate(-6deg) scale(1.05);}" +
    "@keyframes ffabPulse{0%,100%{transform:scale(1);}50%{transform:scale(1.07);}}" +
    ".ffab-img{width:100%;height:100%;object-fit:contain;display:block;filter:drop-shadow(0 6px 10px rgba(80,45,10,.38));}" +
    ".ffab-emoji{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:46px;border-radius:50%;color:#fff;background:linear-gradient(135deg,#ff8a2c,#e65a00);box-shadow:0 8px 20px rgba(120,70,10,.32);}" +
    "@media (max-width:780px){body{padding-bottom:130px;}.ffab-wrap{right:12px;}.ffab-btn{width:86px;height:86px;}.ffab-emoji{font-size:42px;}}";

  function init(){
    var style = document.createElement("style"); style.textContent = css; document.head.appendChild(style);

    var wrap = document.createElement("div"); wrap.className = "ffab-wrap";
    var menu = document.createElement("div"); menu.className = "ffab-menu";
    order.forEach(function(k){
      var p = PAGES[k];
      var a = document.createElement("a"); a.className = "ffab-item"; a.href = p.href;
      var tx = document.createElement("span"); tx.className = "ffab-item-tx"; tx.textContent = p.label;
      var ic = document.createElement("span"); ic.className = "ffab-item-ic"; ic.textContent = p.emoji; ic.style.background = p.grad;
      a.appendChild(tx); a.appendChild(ic); menu.appendChild(a);
    });
    var btn = document.createElement("button"); btn.className = "ffab-btn"; btn.type = "button";
    btn.setAttribute("aria-label","小幫手選單"); btn.setAttribute("aria-expanded","false");
    var emoji = document.createElement("span"); emoji.className = "ffab-emoji"; emoji.textContent = "💬"; btn.appendChild(emoji);

    wrap.appendChild(menu); wrap.appendChild(btn);
    document.body.appendChild(wrap);

    btn.addEventListener("click", function(e){
      e.preventDefault(); e.stopPropagation();
      var o = wrap.classList.toggle("open");
      btn.setAttribute("aria-expanded", o ? "true" : "false");
    });
    document.addEventListener("click", function(e){
      if(!wrap.contains(e.target)){ wrap.classList.remove("open"); btn.setAttribute("aria-expanded","false"); }
    });

    // 小幫手 logo：先用瀏覽器快取（秒顯示），再背景更新
    function setLogo(url){
      var im = document.createElement("img"); im.className = "ffab-img"; im.src = url; im.alt = "小幫手";
      im.addEventListener("load", function(){ btn.innerHTML = ""; btn.appendChild(im); });
    }
    var cachedLogo = null;
    try{ cachedLogo = localStorage.getItem("fanren_logo"); }catch(e){}
    if(cachedLogo && /^https:\/\//i.test(cachedLogo)) setLogo(cachedLogo);
    jsonp({ action:"getConfig" }).then(function(cfg){
      var img = cfg && cfg.settings && cfg.settings.qaButtonImageSafe;
      if(img && /^https:\/\//i.test(img)){
        try{ localStorage.setItem("fanren_logo", img); }catch(e){}
        if(img !== cachedLogo) setLogo(img);
      }
    }).catch(function(){});
  }

  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
