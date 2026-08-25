(function(){
  function cleanText(){
    const root=document.querySelector('main')||document.body;
    const clone=root.cloneNode(true);
    clone.querySelectorAll('.print-share-toolbar,.back,button,input,select,textarea,form,.actions,.section-actions,.compact-actions,.card-side-actions,.quick-add,.no-print').forEach(x=>x.remove());
    return (clone.innerText||clone.textContent||'').replace(/\n{3,}/g,'\n\n').trim();
  }
  function pageTitle(){return document.title.replace(/\s*\|.*$/,'').trim()||'الورشة الفنية'}
  function printPage(){window.print()}
  async function sharePage(){
    const title='الورشة الفنية — '+pageTitle();
    let text=cleanText();
    if(!text)text=title;
    if(text.length>7000)text=text.slice(0,7000)+'\n…';
    if(navigator.share){
      try{await navigator.share({title,text})}catch(e){if(e?.name!=='AbortError')copyFallback(text)}
    }else copyFallback(text);
  }
  function copyFallback(text){
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(text).then(()=>alert('تم نسخ محتوى الصفحة. يمكنك مشاركته من أي تطبيق.')).catch(()=>legacyCopy(text))}
    else legacyCopy(text)
  }
  function legacyCopy(text){const ta=document.createElement('textarea');ta.value=text;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();alert('تم نسخ محتوى الصفحة. يمكنك مشاركته من أي تطبيق.')}
  function mount(){
    if(document.querySelector('.print-share-toolbar'))return;
    const main=document.querySelector('main');if(!main)return;
    const bar=document.createElement('div');bar.className='print-share-toolbar no-print';
    bar.innerHTML='<button type="button" class="ps-btn ps-print">🖨️ طباعة</button><button type="button" class="ps-btn ps-share">📤 مشاركة</button><span class="print-share-title">طباعة أو مشاركة المحتوى الظاهر</span>';
    const first=main.firstElementChild;
    if(first?.classList.contains('back'))first.insertAdjacentElement('afterend',bar);else main.insertBefore(bar,main.firstChild);
    bar.querySelector('.ps-print').addEventListener('click',printPage);
    bar.querySelector('.ps-share').addEventListener('click',sharePage);
    const h=document.createElement('div');h.className='print-only-title';h.textContent=pageTitle();main.insertBefore(h,bar.nextSibling);
  }
  window.printWorkshopPage=printPage;window.shareWorkshopPage=sharePage;
  document.addEventListener('DOMContentLoaded',mount);
})();
