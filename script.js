/* =========================================================
   1. ANIMAÇÃO DE FUNDO (NÉVOA & CINZAS / CHUVA NOTURNA)
   ========================================================= */
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

let largura = (canvas.width = window.innerWidth);
let altura = (canvas.height = window.innerHeight);

// Modos: 'nevoa' (névoa gótica + cinzas) ou 'chuva' (tempestade noturna)
let modoClima = 'nevoa';
let cinzas = [];
let nuvensNevoa = [];

const mouse = { x: largura / 2, y: altura / 2 };

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener('resize', () => {
  largura = canvas.width = window.innerWidth;
  altura = canvas.height = window.innerHeight;
  iniciarEfeitos();
});

// Nuvens de névoa lenta no fundo
class NuvemNevoa {
  constructor() {
    this.x = Math.random() * largura;
    this.y = Math.random() * altura;
    this.raio = Math.random() * 240 + 160;
    this.velX = (Math.random() - 0.5) * 0.25;
    this.velY = (Math.random() - 0.5) * 0.15;
    this.opacidade = Math.random() * 0.08 + 0.03;
  }

  atualizar() {
    this.x += this.velX;
    this.y += this.velY;

    if (this.x < -this.raio) this.x = largura + this.raio;
    if (this.x > largura + this.raio) this.x = -this.raio;
    if (this.y < -this.raio) this.y = altura + this.raio;
    if (this.y > altura + this.raio) this.y = -this.raio;

    const corNevoa =
      getComputedStyle(document.body).getPropertyValue('--cor-nevoa').trim() ||
      '90, 82, 105';

    const gradiente = ctx.createRadialGradient(
      this.x,
      this.y,
      10,
      this.x,
      this.y,
      this.raio
    );
    gradiente.addColorStop(0, `rgba(${corNevoa}, ${this.opacidade})`);
    gradiente.addColorStop(1, `rgba(${corNevoa}, 0)`);

    ctx.fillStyle = gradiente;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
    ctx.fill();
  }
}

// Cinzas / brasas sombrias ou gotas de chuva
class Particula {
  constructor() {
    this.reset(true);
  }

  reset(inicio = false) {
    this.x = Math.random() * largura;
    this.y = inicio ? Math.random() * altura : -10;

    if (modoClima === 'nevoa') {
      this.y = Math.random() * altura;
      this.raio = Math.random() * 2.2 + 0.6;
      this.velX = (Math.random() - 0.5) * 0.4;
      this.velY = -Math.random() * 0.35 - 0.08;
      this.opacidade = Math.random() * 0.55 + 0.12;
      this.pulso = Math.random() * Math.PI * 2;
    } else {
      this.comprimento = Math.random() * 22 + 12;
      this.velX = -1.4;
      this.velY = Math.random() * 7 + 5;
      this.opacidade = Math.random() * 0.3 + 0.08;
    }
  }

  atualizar() {
    const corCinzas =
      getComputedStyle(document.body).getPropertyValue('--cor-cinzas').trim() ||
      '190, 65, 80';

    if (modoClima === 'nevoa') {
      this.pulso += 0.02;
      const brilho = Math.max(0.05, this.opacidade + Math.sin(this.pulso) * 0.15);

      const dx = (mouse.x - largura / 2) * 0.0002;
      this.x += this.velX + dx;
      this.y += this.velY;

      if (this.y < -10) this.y = altura + 10;
      if (this.x < -10) this.x = largura + 10;
      if (this.x > largura + 10) this.x = -10;

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${corCinzas}, ${brilho})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `rgba(${corCinzas}, 0.6)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    } else {
      this.x += this.velX;
      this.y += this.velY;

      if (this.y > altura + 20 || this.x < -20) {
        this.reset(false);
        this.x = Math.random() * (largura + 120);
      }

      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + this.velX * 2, this.y + this.comprimento);
      ctx.strokeStyle = `rgba(${corCinzas}, ${this.opacidade})`;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }
  }
}

function iniciarEfeitos() {
  nuvensNevoa = [];
  cinzas = [];

  if (modoClima === 'nevoa') {
    for (let i = 0; i < 8; i++) {
      nuvensNevoa.push(new NuvemNevoa());
    }
    for (let i = 0; i < 65; i++) {
      cinzas.push(new Particula());
    }
  } else {
    for (let i = 0; i < 130; i++) {
      cinzas.push(new Particula());
    }
  }
}

function animar() {
  ctx.clearRect(0, 0, largura, altura);

  if (modoClima === 'nevoa') {
    for (const nuvem of nuvensNevoa) {
      nuvem.atualizar();
    }
  }

  for (const p of cinzas) {
    p.atualizar();
  }

  requestAnimationFrame(animar);
}

iniciarEfeitos();
animar();

/* =========================================================
   2. BOTÕES DE CONTROLE (CLIMA E MODO ZINE)
   ========================================================= */
const btnClima = document.getElementById('btn-clima');
btnClima.addEventListener('click', () => {
  modoClima = modoClima === 'nevoa' ? 'chuva' : 'nevoa';
  btnClima.textContent =
    modoClima === 'nevoa' ? '☠ Fundo: Névoa & Cinzas' : '⛈ Fundo: Chuva Noturna';
  iniciarEfeitos();
});

const btnTema = document.getElementById('btn-tema');
btnTema.addEventListener('click', () => {
  document.body.classList.toggle('tema-zine');
  const ehZine = document.body.classList.contains('tema-zine');
  btnTema.textContent = ehZine ? '☾ Modo Sombrio' : '◐ Modo Zine Xerocado';
});

/* =========================================================
   3. REVELAÇÃO AO ROLAR E DESTAQUE NO MENU
   ========================================================= */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visivel');
      }
    });
  },
  { threshold: 0.15 }
);

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

const capitulos = document.querySelectorAll('.capitulo');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let idAtual = '';
  capitulos.forEach((cap) => {
    const topo = cap.offsetTop - 220;
    if (window.scrollY >= topo) {
      idAtual = cap.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove('ativo');
    if (link.getAttribute('href') === `#${idAtual}`) {
      link.classList.add('ativo');
    }
  });
});