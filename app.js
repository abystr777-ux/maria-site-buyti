(() => {
  const {services, contacts} = window.MARIA_CONTENT;
  const list = document.querySelector('#service-list');
  const escape = value => String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  list.innerHTML = services.map(s => `<details class="service" data-group="${s.group}" id="service-${s.id}"><summary><span class="service-label"><span class="service-title">${escape(s.title)}</span><span class="service-subtitle">${escape(s.subtitle)}</span></span><span class="service-price">${escape(s.price)}</span><span class="plus" aria-hidden="true"></span></summary><div class="service-detail"><div><p class="detail-description">${escape(s.description)}</p><span class="detail-label">ПРЕДВАРИТЕЛЬНЫЙ СОСТАВ</span><ul>${s.includes.map(i=>`<li>${escape(i)}</li>`).join('')}</ul></div><div class="service-aside"><span class="detail-label">ПРИМЕР СТОИМОСТИ</span>${s.variants ? s.variants.map(v=>`<div class="variant"><span>${escape(v[0])}</span><strong>${escape(v[1])}</strong></div>`).join('') : `<p class="detail-price">${escape(s.price)}<small>${escape(s.unit)}</small></p>`}<p class="detail-note">${escape(s.note)}</p><button class="button button-small" data-book="${escape(s.title)}">Обсудить процедуру</button></div></div></details>`).join('');
  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    document.querySelectorAll('[data-filter]').forEach(b => {b.classList.toggle('active', b===button); b.setAttribute('aria-pressed',String(b===button));});
    list.querySelectorAll('.service').forEach(row => {row.hidden=button.dataset.filter !== 'all' && row.dataset.group !== button.dataset.filter; if(row.hidden) row.open=false;});
  }));
  list.addEventListener('toggle', event => {if(event.target.open) list.querySelectorAll('details').forEach(d=>{if(d!==event.target)d.open=false;});},true);
  const menuButton=document.querySelector('.menu-button'), menu=document.querySelector('#mobile-menu');
  const closeMenu=()=>{menu.hidden=true;menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');};
  menuButton.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeMenu();});
  const dialog=document.querySelector('#booking-dialog'), message=document.querySelector('#booking-message'), notice=document.querySelector('.dialog-notice');
  let focusedBeforeDialog;
  function openBooking(service='') {
    focusedBeforeDialog=document.activeElement;
    message.value=service ? `Здравствуйте, Мария! Меня интересует услуга «${service}». Подскажите, пожалуйста, подробности, стоимость и свободное время.` : 'Здравствуйте, Мария! Хочу узнать подробнее об услугах и обсудить запись.';
    notice.textContent='Это макет. Контакты Марии ещё не добавлены, сообщения никуда не отправляются.';
    dialog.showModal();document.body.classList.add('modal-open');
  }
  document.addEventListener('click',event=>{const button=event.target.closest('[data-book]');if(button)openBooking(button.dataset.book);});
  document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');focusedBeforeDialog?.focus();});
  let toastTimer;
  function toast(text){const element=document.querySelector('.toast');element.textContent=text;element.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>element.hidden=true,5500);}
  document.querySelectorAll('[data-channel]').forEach(button=>button.addEventListener('click',()=>{
    const channel=button.dataset.channel, destination=contacts[channel];
    if(!destination){const text=channel==='phone'?'Номер Марии пока не добавлен в макет.':`Ссылка на ${channel==='telegram'?'Telegram':'WhatsApp'} Марии пока не добавлена. ${dialog.open?'Вы можете скопировать сообщение.':'Выберите «Связаться с Марией», чтобы подготовить сообщение.'}`;if(dialog.open)notice.textContent=text;else toast(text);return;}
    if(channel==='phone'){window.location.href=`tel:${destination.replace(/[^+\d]/g,'')}`;return;}
    const url=new URL(destination);if(url.protocol!=='https:')return;
    if(dialog.open)url.searchParams.set('text',message.value);
    window.open(url.href,'_blank','noopener,noreferrer');
  }));
  document.querySelector('[data-social]').addEventListener('click',()=>{if(contacts.social)window.open(contacts.social,'_blank','noopener,noreferrer');else toast('Здесь будут рабочие социальные сети Марии. Ссылки добавим после согласования.');});
  document.querySelector('.copy-message').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(message.value);notice.textContent='Сообщение скопировано. Его можно вставить в переписку с Марией.';}catch{message.focus();message.select();notice.textContent='Выделили сообщение. Скопируйте его через меню устройства или сочетанием Ctrl+C.';}});
  document.querySelector('#year').textContent=new Date().getFullYear();
})();
