/* ============================================
   HB SOLUÇÕES — script.js
   Fase atual: aprovação de estrutura e design.
   Botões de WhatsApp ficam com toda a estrutura
   pronta (inclusive lógica de UTM), porém
   DESATIVADOS propositalmente (ver ativarWhatsApp).
   ============================================ */

(function () {
  "use strict";

  /* ---------- menu mobile ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var navMobile = document.querySelector(".nav-mobile");

  if (toggle && navMobile) {
    toggle.addEventListener("click", function () {
      var isOpen = navMobile.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    navMobile.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMobile.classList.remove("is-open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- header com fundo ao rolar ---------- */
  var header = document.querySelector(".site-header");
  if (header) {
    window.addEventListener(
      "scroll",
      function () {
        header.style.borderBottomColor =
          window.scrollY > 30 ? "rgba(102,146,255,0.32)" : "rgba(102,146,255,0.16)";
      },
      { passive: true }
    );
  }

  /* ---------- marca link ativo no menu ---------- */
  var currentPage = (window.location.pathname.split("/").pop() || "index.html");
  document.querySelectorAll(".nav-desktop a, .nav-mobile a").forEach(function (link) {
    var href = link.getAttribute("href");
    if (href === currentPage || (currentPage === "" && href === "index.html")) {
      link.classList.add("active");
    }
  });

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* =========================================================
     BOTÕES DE WHATSAPP
     -----------------------------------------------------------
     Estrutura definida em conjunto com o cliente:
     - Mensagem varia conforme a origem do acesso (orgânico
       vs. campanha paga), detectada via parâmetros UTM na URL.
     - Nesta fase (aprovação de design/estrutura), os botões
       permanecem visualmente prontos, porém INATIVOS.
     - Para ativar: preencher WHATSAPP_NUMERO e chamar
       ativarWhatsApp() — ou simplesmente remover o
       preventDefault() abaixo.
     ========================================================= */

  var WHATSAPP_NUMERO = "55SEUNUMEROAQUI"; // TODO: inserir número real na ativação

  function getMensagemPorOrigem() {
    var params = new URLSearchParams(window.location.search);
    var utmSource = params.get("utm_source");
    var utmMedium = params.get("utm_medium");
    var vemDeCampanha =
      !!utmSource ||
      utmMedium === "cpc" ||
      utmMedium === "paid" ||
      utmMedium === "social-paid";

    if (vemDeCampanha) {
      return "Olá! Vim pelo anúncio e me interessei nos serviços da HB Soluções.";
    }
    return "Olá! Vim pelo site e me interessei nos serviços da HB Soluções.";
  }

  function montarLinkWhatsapp() {
    var texto = encodeURIComponent(getMensagemPorOrigem());
    return "https://wa.me/" + WHATSAPP_NUMERO + "?text=" + texto;
  }

  var waButtons = document.querySelectorAll("[data-wa-button]");
  waButtons.forEach(function (btn) {
    // estrutura pronta: já calcula e guarda o link correto no elemento
    btn.setAttribute("href", montarLinkWhatsapp());
    btn.setAttribute("target", "_blank");
    btn.setAttribute("rel", "noopener");

    // FASE DE APROVAÇÃO: clique não faz nada ainda.
    btn.addEventListener("click", function (e) {
      e.preventDefault();
    });
  });

  // Função exposta para ativação futura em uma linha:
  // basta chamar window.ativarWhatsApp("5534999999999")
  window.ativarWhatsApp = function (numero) {
    WHATSAPP_NUMERO = numero;
    waButtons.forEach(function (btn) {
      btn.setAttribute("href", montarLinkWhatsapp());
    });
  };
})();
