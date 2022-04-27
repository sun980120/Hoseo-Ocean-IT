'use strict';

(function () {
    const root = document.querySelector('#intro_card_body');
    const routes = {
      // hash: url
      '': '/introduction/introduction1.ejs',
      two: '/introduction/introduction2.ejs',
      three: '/introduction/introduction3.ejs',
      four: '/introduction/introduction4.ejs'
    };
  
    const render = async () => {
      try {
        // url의 hash를 취득
        const hash = location.hash.replace('#', '');
        const url = routes[hash];
        if (!url) {
          root.innerHTML = `${hash}는 존재하지 않습니다. 경로를 다시 확인하세요.`;
          return;
        }
  
        const res = await fetch(url);
        const contentType = res.headers.get('content-type');
  
        if (contentType?.includes('application/json')) {
          const json = await res.json();
          root.innerHTML = `<h1>${json.title}</h1><p>${json.content}</p>`;
        } else {
          root.innerHTML = await res.text();
        }
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener('hashchange', render);
    window.addEventListener('DOMContentLoaded', render);
  }());
  