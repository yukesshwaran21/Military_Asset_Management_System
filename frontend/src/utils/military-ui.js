// src/utils/military-ui.js

export function initMilitaryUI() {
  /* Theme init */
  (function(){
    const saved = localStorage.getItem('mil-theme') || 'dark';
    if(saved === 'light') document.documentElement.setAttribute('data-theme','light');
  })();

  /* Button ripple */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.mil-btn');
    if(!btn) return;
    btn.classList.remove('rippling');
    void btn.offsetWidth;
    btn.classList.add('rippling');
    setTimeout(()=> btn.classList.remove('rippling'), 520);
  });

  /* Simple modal toggler */
  document.addEventListener('click', (e) => {
    const open = e.target.closest('[data-open-modal]');
    if(open){
      const id = open.getAttribute('data-open-modal');
      document.querySelector(id + '-backdrop')?.classList.add('show');
    }
    const close = e.target.closest('[data-close-modal]');
    if(close){
      close.closest('.mil-modal-backdrop')?.classList.remove('show');
    }
  });
}
