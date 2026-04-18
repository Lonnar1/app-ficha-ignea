self.addEventListener("install", (e) => {
  console.log("Service Worker instalado");
});

self.addEventListener("fetch", (e) => {
  // só pra ativar mesmo, sem cache por enquanto
});