self.addEventListener("install", (e) => {
  console.log("Service Worker v2");
});

self.addEventListener("fetch", (e) => {
  // só pra ativar mesmo, sem cache por enquanto
});

self.addEventListener("activate", () => {
  console.log("Nova versão ativa 🚀");
});
