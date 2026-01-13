const view = document.querySelector('#view');
const searchInput = document.querySelector('#search');
const clearButton = document.querySelector('#clear-search');

let contentData = null;
let currentQuery = '';

const loadContent = async () => {
  const response = await fetch('data/content.json');
  return response.json();
};

const normalizeText = (value) => value.toLowerCase();

const matchesQuery = (text, query) =>
  normalizeText(text).includes(normalizeText(query));

const buildPillarCard = (pillar) => `
  <article class="card">
    <div class="card__image">
      <img src="${pillar.image}" alt="${pillar.title}" loading="lazy" />
    </div>
    <div>
      <h3 class="card__title">${pillar.title}</h3>
      <p class="card__text">${pillar.description}</p>
    </div>
    <div class="card__footer">
      <span class="tag">${pillar.topics.length} tópicos</span>
      <button class="primary-button" data-route="#/pillar/${pillar.id}">
        Ver contenidos
      </button>
    </div>
  </article>
`;

const buildTopicCard = (pillar, topic) => `
  <article class="card">
    <div class="card__image">
      <img src="${topic.image}" alt="${topic.title}" loading="lazy" />
    </div>
    <div>
      <h3 class="card__title">${topic.title}</h3>
      <p class="card__text">${topic.summary}</p>
    </div>
    <div class="card__footer">
      <span class="tag">${pillar.title}</span>
      <button class="secondary-button" data-route="#/pillar/${pillar.id}/topic/${topic.id}">
        Abrir
      </button>
    </div>
  </article>
`;

const attachRouteHandlers = () => {
  document.querySelectorAll('[data-route]').forEach((button) => {
    button.addEventListener('click', () => {
      const route = button.getAttribute('data-route');
      window.location.hash = route;
    });
  });
};

const renderHome = () => {
  const pillars = contentData.pillars;
  const query = currentQuery.trim();
  const results = [];

  if (query) {
    pillars.forEach((pillar) => {
      if (matchesQuery(pillar.title, query) || matchesQuery(pillar.description, query)) {
        results.push({ pillar, topic: null });
      }
      pillar.topics.forEach((topic) => {
        if (
          matchesQuery(topic.title, query) ||
          matchesQuery(topic.summary, query) ||
          matchesQuery(topic.text, query)
        ) {
          results.push({ pillar, topic });
        }
      });
    });
  }

  const resultsSection = query
    ? `
      <div class="section-title">
        <div>
          <h2>Resultados de búsqueda</h2>
          <p>${results.length} coincidencias para "${query}".</p>
        </div>
      </div>
      <div class="grid topics">
        ${
          results.length
            ? results
                .map(({ pillar, topic }) =>
                  topic ? buildTopicCard(pillar, topic) : buildPillarCard(pillar)
                )
                .join('')
            : '<div class="empty-state">No encontramos resultados. Prueba con otra palabra.</div>'
        }
      </div>
    `
    : '';

  view.innerHTML = `
    ${resultsSection}
    <div class="section-title">
      <div>
        <h2>Pilares principales</h2>
        <p>Elige un pilar para revisar sus contenidos.</p>
      </div>
    </div>
    <div class="grid pillars">
      ${pillars.map(buildPillarCard).join('')}
    </div>
  `;

  attachRouteHandlers();
};

const renderPillar = (pillarId) => {
  const pillar = contentData.pillars.find((item) => item.id === pillarId);

  if (!pillar) {
    view.innerHTML = `<div class="empty-state">No encontramos este pilar.</div>`;
    return;
  }

  view.innerHTML = `
    <div class="breadcrumbs">
      <button data-route="#/">Inicio</button>
      <span>·</span>
      <span>${pillar.title}</span>
    </div>

    <section class="banner">
      <div class="banner__content">
        <h2>${pillar.title}</h2>
        <p>${pillar.description}</p>
        <div class="tag-list">
          ${pillar.topics.map((topic) => `<span class="tag">${topic.title}</span>`).join('')}
        </div>
      </div>
      <div class="card__image">
        <img src="${pillar.image}" alt="${pillar.title}" loading="lazy" />
      </div>
    </section>

    <div class="section-title">
      <div>
        <h2>Tópicos disponibles</h2>
        <p>Haz clic para abrir el detalle.</p>
      </div>
      <button class="secondary-button" data-route="#/">Volver al inicio</button>
    </div>

    <div class="grid topics">
      ${pillar.topics.map((topic) => buildTopicCard(pillar, topic)).join('')}
    </div>
  `;

  attachRouteHandlers();
};

const buildResources = (resources) =>
  resources
    .map(
      (resource) => `
      <a class="resource-card" href="${resource.url}" target="_blank" rel="noopener noreferrer">
        <div>
          <span>${resource.title}</span>
          <small>${resource.type === 'video' ? 'Video recomendado' : 'Recurso externo'}</small>
        </div>
        <span>↗</span>
      </a>
    `
    )
    .join('');

const renderTopic = (pillarId, topicId) => {
  const pillar = contentData.pillars.find((item) => item.id === pillarId);
  const topic = pillar?.topics.find((item) => item.id === topicId);

  if (!pillar || !topic) {
    view.innerHTML = `<div class="empty-state">No encontramos este tópico.</div>`;
    return;
  }

  view.innerHTML = `
    <div class="breadcrumbs">
      <button data-route="#/">Inicio</button>
      <span>·</span>
      <button data-route="#/pillar/${pillar.id}">${pillar.title}</button>
      <span>·</span>
      <span>${topic.title}</span>
    </div>

    <section class="banner">
      <div class="banner__content">
        <h2>${topic.title}</h2>
        <p>${topic.summary}</p>
        <div class="tag-list">
          <span class="tag">${pillar.title}</span>
          <span class="tag">Checklist práctico</span>
          <span class="tag">Recursos multimedia</span>
        </div>
      </div>
      <div class="card__image">
        <img src="${topic.image}" alt="${topic.title}" loading="lazy" />
      </div>
    </section>

    <section class="topic-layout">
      <article class="panel">
        <h3>Explicación breve</h3>
        <p>${topic.text}</p>
      </article>
      <article class="panel">
        <h3>Checklist práctico</h3>
        <ul class="checklist">
          ${topic.checklist.map((item) => `<li>${item}</li>`).join('')}
        </ul>
      </article>
      <article class="panel">
        <h3>Infografía principal</h3>
        <img src="${topic.image}" alt="${topic.title}" />
      </article>
      <article class="panel">
        <h3>Videos y enlaces</h3>
        <div class="resource-list">
          ${buildResources(topic.resources)}
        </div>
      </article>
    </section>

    <section class="panel" style="margin-top: 20px;">
      <h3>Recomendación final</h3>
      <p>
        Si tienes dudas, consulta en tu CESFAM/APS. Si aparecen signos de alarma,
        acude a urgencias.
      </p>
      <div style="display: flex; flex-wrap: wrap; gap: 10px;">
        <button class="secondary-button" data-route="#/pillar/${pillar.id}">
          Volver al pilar
        </button>
        <button class="secondary-button" data-route="#/">Inicio</button>
        <button class="primary-button" id="share-topic" type="button">
          Compartir
        </button>
      </div>
      <div id="share-message" class="share-message" hidden>Enlace copiado ✅</div>
    </section>
  `;

  attachRouteHandlers();

  const shareButton = document.querySelector('#share-topic');
  const shareMessage = document.querySelector('#share-message');

  if (shareButton) {
    shareButton.addEventListener('click', async () => {
      await navigator.clipboard.writeText(window.location.href);
      shareMessage.hidden = false;
      setTimeout(() => {
        shareMessage.hidden = true;
      }, 2000);
    });
  }
};

const renderRoute = () => {
  if (!contentData) {
    return;
  }

  const hash = window.location.hash || '#/';
  const segments = hash.replace('#/', '').split('/').filter(Boolean);

  if (segments.length === 0) {
    renderHome();
    return;
  }

  if (segments[0] === 'pillar' && segments.length === 2) {
    renderPillar(segments[1]);
    return;
  }

  if (segments[0] === 'pillar' && segments[2] === 'topic') {
    renderTopic(segments[1], segments[3]);
    return;
  }

  renderHome();
};

const updateQuery = (value) => {
  currentQuery = value;
  if (window.location.hash && window.location.hash !== '#/') {
    window.location.hash = '#/';
  }
  renderRoute();
};

const init = async () => {
  contentData = await loadContent();
  renderRoute();
};

searchInput.addEventListener('input', (event) => {
  updateQuery(event.target.value);
});

clearButton.addEventListener('click', () => {
  searchInput.value = '';
  updateQuery('');
});

window.addEventListener('hashchange', renderRoute);
window.addEventListener('DOMContentLoaded', init);
