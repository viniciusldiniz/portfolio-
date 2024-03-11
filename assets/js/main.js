(function() {
  "use strict";
  /**
   * Easy selector helper function
   * Seleciona elementos do DOM de maneira simplificada.
   */
  function select(el, all = false) {
    el = el.trim(); // Remove espaços em branco
    if (all) {
      return [...document.querySelectorAll(el)]; // Retorna uma lista de elementos
    } else {
      return document.querySelector(el); // Retorna o primeiro elemento encontrado
    }
  }
// Obter o seletor de idioma
const languageSelector = document.getElementById('language-selector');

// Adicionar um evento de mudança de idioma

  /**
   * Easy event listener function
   * Adiciona facilmente ouvintes de eventos aos elementos do DOM.
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach(e => e.addEventListener(type, listener)); // Adiciona o ouvinte de eventos a todos os elementos
      } else {
        selectEl.addEventListener(type, listener); // Adiciona o ouvinte de eventos ao elemento
      }
    }
  };

  /**
   * Easy on scroll event listener 
   * Adiciona um ouvinte de eventos de rolagem a um elemento do DOM.
   */
  const onscroll = (el, listener) => {
    el.addEventListener('scroll', listener); // Adiciona o ouvinte de eventos de rolagem ao elemento
  };

  /**
   * Navbar links active state on scroll
   * Ativa o estado ativo nos links da barra de navegação ao rolar.
   */
  let navbarlinks = select('#navbar .scrollto', true); // Seleciona os links da barra de navegação
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach(navbarlink => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash); // Seleciona a seção associada ao link
      if (!section) return;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        navbarlink.classList.add('active'); // Adiciona a classe 'active' ao link na rolagem
      } else {
        navbarlink.classList.remove('active'); // Remove a classe 'active' do link
      }
    });
  };
  window.addEventListener('load', navbarlinksActive); // Ativa o estado ativo dos links na barra de navegação ao carregar a página
  onscroll(document, navbarlinksActive); // Ativa o estado ativo dos links na barra de navegação ao rolar

  /**
   * Scrolls to an element with header offset
   * Realiza uma rolagem suave até um elemento com um deslocamento do cabeçalho.
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop; // Obtém a posição superior do elemento
    window.scrollTo({
      top: elementPos,
      behavior: 'smooth'
    });
  };

  /**
   * Back to top button
   * Adiciona um botão de "voltar ao topo" e o ativa ao rolar para baixo.
   */
  let backtotop = select('.back-to-top'); // Seleciona o botão de voltar ao topo
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add('active'); // Adiciona a classe 'active' ao botão ao rolar para baixo
      } else {
        backtotop.classList.remove('active'); // Remove a classe 'active' ao botão ao rolar para cima
      }
    };
    window.addEventListener('load', toggleBacktotop);
    onscroll(document, toggleBacktotop); // Ativa o botão de voltar ao topo ao rolar
  }

  /**
   * Mobile nav toggle
   * Adiciona uma classe para mostrar/ocultar a navegação móvel e alterna entre ícones de menu.
   */
  on('click', '.mobile-nav-toggle', function(e) {
    select('body').classList.toggle('mobile-nav-active'); // Adiciona ou remove a classe 'mobile-nav-active' ao corpo
    this.classList.toggle('bi-list'); // Alterna entre as classes 'bi-list' e 'bi-x' no botão de alternância
    this.classList.toggle('bi-x');
  });

  /**
   * Scroll with offset on links with a class name .scrollto
   * Realiza uma rolagem suave até o elemento associado ao link clicado.
   */
  on('click', '.scrollto', function(e) {
    if (select(this.hash)) {
      e.preventDefault();

      let body = select('body');
      if (body.classList.contains('mobile-nav-active')) {
        body.classList.remove('mobile-nav-active');
        let navbarToggle = select('.mobile-nav-toggle');
        navbarToggle.classList.toggle('bi-list');
        navbarToggle.classList.toggle('bi-x');
      }
      scrollto(this.hash);
    }
  }, true);

  /**
   * Scroll with offset on page load with hash links in the URL
   * Realiza uma rolagem suave ao carregar a página para as âncoras na URL.
   */
  window.addEventListener('load', () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Hero type effect
   * Adiciona um efeito de digitação automática a um elemento do DOM.
   */
  const typed = select('.typed');
  if (typed) {
    let typed_strings = typed.getAttribute('data-typed-items');
    typed_strings = typed_strings.split(',');
    new Typed('.typed', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }

  /**
   * Skills animation
   * Adiciona uma animação de habilidades ao rolar para a seção de habilidades.
   */
  let skillsContent = select('.skills-content');
  if (skillsContent) {
    new Waypoint({
      element: skillsContent,
      offset: '80%',
      handler: function(direction) {
        let progress = select('.progress .progress-bar', true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  }

  /**
   * Portfolio isotope and filter
   * Inicializa o Isotope para filtrar os itens do portfólio.
   */
  window.addEventListener('load', () => {
    let portfolioContainer = select('.portfolio-container');
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: '.portfolio-item'
      });

      let portfolioFilters = select('#portfolio-flters li', true);

      on('click', '#portfolio-flters li', function(e) {
        e.preventDefault();
        portfolioFilters.forEach(function(el) {
          el.classList.remove('filter-active');
        });
        this.classList.add('filter-active');

        portfolioIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        portfolioIsotope.on('arrangeComplete', function() {
          AOS.refresh();
        });
      }, true);
    }

  });

  /**
   * Initiate portfolio lightbox 
   * Inicializa o lightbox para exibir detalhes do portfólio.
   */
  const portfolioLightbox = GLightbox({
    selector: '.portfolio-lightbox'
  });

  /**
   * Portfolio details slider
   * Inicializa o slider de detalhes do portfólio.
   */
  new Swiper('.portfolio-details-slider', {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false
    },
    pagination: {
      el: '.swiper-pagination',
      type: 'bullets',
      clickable: true
    }
  });


  /**
   * Animation on scroll
   * Inicializa a biblioteca AOS para animações ao rolar.
   */
  window.addEventListener('load', () => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  });

  /**
   * Initiate Pure Counter 
   * Inicializa o contador puro para animações de contagem.
   */
  new PureCounter();

})();
