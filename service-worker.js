"use strict";

const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/Filme.js",
  "/CtrlManterFilmes.js",
  "/CtrlSessao.js",
  "/DaoFilme.js",
  "/ModelError.js",
  "/ViewerFilme.js",
  "/ViewerError.js",
  "/favicon.ico",
  "/manifest.json",
  "/style.css"
];

//--------------------------------------------------------------------------------//

// * self se refere à janela do navegador
self.addEventListener("install", evt =>  {
  console.log("[App]Instalação");
  // * caches é uma variável global que retorna o CacheStorage do contexto atual
  // * caches.keys retorna uma Promise que retornará um array com o nome de 
  //   todos objetos armazenados no cache
  caches.keys().then(keyList => {
    return Promise.all(
      keyList.map(key => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
          console.log("[App] Removendo cache antigo", key);
          return caches.delete(key);
        }
      })
    );
  });

  evt.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("[App] Pré-caching dos arquivos" + cache);
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

//--------------------------------------------------------------------------------//

self.addEventListener("activate", evt => {
  console.log("[App] Activate");
  evt.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("[App] Removendo cache antigo", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

//--------------------------------------------------------------------------------//
