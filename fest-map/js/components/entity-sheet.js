const defaultCategories = {
  all: { label: "Alle" },
  building: { label: "Gebaeude" },
  area: { label: "Bereiche" },
  service: { label: "Services" },
  entry: { label: "Ein- / Ausgaenge" },
};

const defaultLabels = {
  browseTitle: "Eintraege entdecken",
  collapsedHint: "Nach oben wischen oder tippen, um alle Eintraege zu sehen.",
  expandedHint: "Tippe auf einen Eintrag, um ihn zu fokussieren und das Menue wieder zu schliessen.",
  openList: "Liste",
  collapse: "Schliessen",
  call: "Anrufen",
  email: "E-Mail",
  website: "Website",
  program: "Programm",
  backToDetails: "Details",
  eventLocation: "Ort",
  emptyEvents: "Noch keine Programmpunkte eingetragen.",
  emptyState: "Noch keine Eintraege in dieser Kategorie.",
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character];
  });
}

function cardMarkup(entity, labels, categories) {
  if (!entity) {
    return "";
  }

  const categoryLabel = categories[entity.type]?.label ?? entity.type;
  const imagePath = entity.image || "/assets/logos/visitor-info.svg";
  const actions = [
    entity.website
      ? `<a class="entity-card__action" href="${escapeHtml(entity.website)}" target="_blank" rel="noreferrer">${escapeHtml(labels.website)}</a>`
      : "",
    entity.phone
      ? `<a class="entity-card__action" href="tel:${escapeHtml(entity.phone)}">${escapeHtml(labels.call)}</a>`
      : "",
    entity.email
      ? `<a class="entity-card__action" href="mailto:${escapeHtml(entity.email)}">${escapeHtml(labels.email)}</a>`
      : "",
  ]
    .filter(Boolean)
    .join("");

  return `
    <article class="entity-card">
      <div class="entity-card__logo">
        <img src="${escapeHtml(imagePath)}" alt="${escapeHtml(entity.name)} logo">
      </div>
      <div>
        <div class="entity-card__meta">
          <span class="pill" data-type="${escapeHtml(entity.type)}">${escapeHtml(categoryLabel)}</span>
          <span class="entity-card__location">${escapeHtml(entity.location)}</span>
        </div>
        <h2>${escapeHtml(entity.name)}</h2>
        <p>${escapeHtml(entity.description)}</p>
        <div class="entity-card__actions">${actions}</div>
      </div>
    </article>
  `;
}

function listItemMarkup(entity, selectedId, categories) {
  const isActive = entity.id === selectedId;
  const categoryLabel = categories[entity.type]?.label ?? entity.type;
  const imagePath = entity.image || "/assets/logos/visitor-info.svg";

  return `
    <button class="entity-list__item ${isActive ? "is-active" : ""}" type="button" data-entity-id="${escapeHtml(entity.id)}">
      <span class="entity-list__logo">
        <img src="${escapeHtml(imagePath)}" alt="">
      </span>
      <span class="entity-list__content">
        <strong>${escapeHtml(entity.name)}</strong>
        <span>${escapeHtml(entity.summary)}</span>
        <small>${escapeHtml(categoryLabel)} · ${escapeHtml(entity.location)}</small>
      </span>
      <span class="entity-list__arrow" aria-hidden="true">›</span>
    </button>
  `;
}

function eventMarkup(event, entities, labels) {
  const linkedEntity = entities.find(({ id }) => id === event.locationEntryId);
  const locationLine = linkedEntity
    ? `<small>${escapeHtml(labels.eventLocation)}: ${escapeHtml(linkedEntity.name)}</small>`
    : "";

  return `
    <article class="event-list__item">
      <time>${escapeHtml(event.time)}</time>
      <div>
        <strong>${escapeHtml(event.title)}</strong>
        ${event.description ? `<p>${escapeHtml(event.description)}</p>` : ""}
        ${locationLine}
      </div>
    </article>
  `;
}

export class EntitySheet extends HTMLElement {
  constructor() {
    super();
    this._entities = [];
    this._selectedEntity = null;
    this._events = [];
    this._filter = "all";
    this._expanded = false;
    this._view = "details";
    this._categories = defaultCategories;
    this._labels = defaultLabels;
    this.dragStartY = null;
    this.dragHandled = false;
  }

  connectedCallback() {
    if (!this.isReady) {
      this.renderShell();
      this.attachEvents();
      this.isReady = true;
    }

    this.update();
  }

  set entities(value) {
    this._entities = Array.isArray(value) ? value : [];
    this.update();
  }

  set selectedEntity(value) {
    this._selectedEntity = value ?? null;
    this.update();
  }

  set events(value) {
    this._events = Array.isArray(value) ? value : [];
    this.update();
  }

  set categories(value) {
    this._categories = value ?? defaultCategories;
    this.update();
  }

  set labels(value) {
    this._labels = value ?? defaultLabels;
    this.update();
  }

  get expanded() {
    return this._expanded;
  }

  set expanded(nextValue) {
    this.setExpanded(Boolean(nextValue));
  }

  get filteredEntities() {
    if (this._filter === "all") {
      return this._entities;
    }

    return this._entities.filter(({ type }) => type === this._filter);
  }

  renderShell() {
    this.dataset.state = "collapsed";
    this.innerHTML = `
      <section class="bottom-sheet glass-panel">
        <div class="sheet-grabber">
          <span class="sheet-grabber__bar" aria-hidden="true"></span>
          <button class="sheet-grabber__copy" type="button" data-action="toggle-sheet">
            <strong data-role="browse-title">${escapeHtml(this._labels.browseTitle)}</strong>
            <span data-role="status-copy">${escapeHtml(this._labels.collapsedHint)}</span>
          </button>
          <div class="sheet-grabber__actions">
            <button class="sheet-grabber__button sheet-grabber__button--secondary" type="button" data-action="toggle-events">
              ${escapeHtml(this._labels.program)}
            </button>
            <button class="sheet-grabber__button" type="button" data-action="toggle-sheet" aria-expanded="false">
              ${escapeHtml(this._labels.openList)}
            </button>
          </div>
        </div>
        <div class="sheet-view sheet-view--details" data-role="details-view">
          <div class="sheet-preview" data-role="preview"></div>
        </div>
        <div class="sheet-view sheet-view--events" data-role="events-view" hidden>
          <div class="sheet-events__header">
            <h2>${escapeHtml(this._labels.program)}</h2>
          </div>
          <div class="event-list" data-role="events"></div>
        </div>
        <div class="sheet-directory">
          <div class="sheet-directory__inner">
            <div class="sheet-filters" data-role="filters"></div>
            <div class="entity-list" data-role="list"></div>
          </div>
        </div>
      </section>
    `;

    this.previewNode = this.querySelector('[data-role="preview"]');
    this.detailsViewNode = this.querySelector('[data-role="details-view"]');
    this.eventsViewNode = this.querySelector('[data-role="events-view"]');
    this.eventsNode = this.querySelector('[data-role="events"]');
    this.filtersNode = this.querySelector('[data-role="filters"]');
    this.listNode = this.querySelector('[data-role="list"]');
    this.browseTitleNode = this.querySelector('[data-role="browse-title"]');
    this.statusCopyNode = this.querySelector('[data-role="status-copy"]');
    this.toggleButtonNode = this.querySelector(".sheet-grabber__button");
    this.grabberNode = this.querySelector(".sheet-grabber");
  }

  attachEvents() {
    this.addEventListener("click", (event) => {
      const toggleTrigger = event.target.closest('[data-action="toggle-sheet"]');

      if (toggleTrigger) {
        if (this.dragHandled) {
          this.dragHandled = false;
          return;
        }

        this.setExpanded(!this._expanded);
        return;
      }

      const eventsTrigger = event.target.closest('[data-action="toggle-events"]');

      if (eventsTrigger) {
        this._view = this._view === "events" ? "details" : "events";
        this.setExpanded(false);
        this.update();
        return;
      }

      const filterTrigger = event.target.closest("[data-filter]");

      if (filterTrigger) {
        this._filter = filterTrigger.dataset.filter ?? "all";
        this.update();
        return;
      }

      const entityTrigger = event.target.closest("[data-entity-id]");

      if (entityTrigger) {
        const entityId = entityTrigger.dataset.entityId;
        this.dispatchEvent(
          new CustomEvent("entity-select", {
            bubbles: true,
            detail: { entityId },
          }),
        );
        this.setExpanded(false);
      }
    });

    this.grabberNode.addEventListener("pointerdown", (event) => {
      this.dragStartY = event.clientY;
      this.dragHandled = false;
    });

    this.grabberNode.addEventListener("pointerup", (event) => {
      if (this.dragStartY === null) {
        return;
      }

      const deltaY = this.dragStartY - event.clientY;

      if (Math.abs(deltaY) > 36) {
        this.setExpanded(deltaY > 0);
        this.dragHandled = true;
      }

      this.dragStartY = null;
    });

    this.grabberNode.addEventListener("pointercancel", () => {
      this.dragStartY = null;
    });
  }

  setExpanded(nextValue) {
    if (this._expanded === nextValue) {
      return;
    }

    this._expanded = nextValue;
    this.dataset.state = this._expanded ? "expanded" : "collapsed";
    this.updateStatusCopy();
    this.dispatchEvent(
      new CustomEvent("sheet-toggle", {
        bubbles: true,
        detail: { expanded: this._expanded },
      }),
    );
  }

  updateStatusCopy() {
    if (!this.statusCopyNode || !this.toggleButtonNode || !this.browseTitleNode) {
      return;
    }

    this.browseTitleNode.textContent = this._labels.browseTitle;
    this.statusCopyNode.textContent = this._expanded ? this._labels.expandedHint : this._labels.collapsedHint;
    this.toggleButtonNode.textContent = this._expanded ? this._labels.collapse : this._labels.openList;
    this.toggleButtonNode.setAttribute("aria-expanded", String(this._expanded));
  }

  update() {
    if (!this.isReady) {
      return;
    }

    const entityForCard = this._selectedEntity ?? this.filteredEntities[0] ?? this._entities[0] ?? null;

    this.dataset.view = this._view;
    this.previewNode.innerHTML = cardMarkup(entityForCard, this._labels, this._categories);
    this.detailsViewNode.hidden = this._view !== "details";
    this.eventsViewNode.hidden = this._view !== "events";
    this.querySelector('[data-action="toggle-events"]').textContent =
      this._view === "events" ? this._labels.backToDetails : this._labels.program;
    this.querySelector(".sheet-events__header h2").textContent = this._labels.program;

    this.eventsNode.innerHTML = this._events.length
      ? this._events.map((event) => eventMarkup(event, this._entities, this._labels)).join("")
      : `<div class="event-list__empty">${escapeHtml(this._labels.emptyEvents)}</div>`;

    this.filtersNode.innerHTML = Object.entries(this._categories)
      .map(([categoryKey, definition]) => {
        const isActive = this._filter === categoryKey;

        return `
          <button
            class="filter-chip ${isActive ? "is-active" : ""}"
            type="button"
            data-filter="${escapeHtml(categoryKey)}"
          >
            ${escapeHtml(definition.label)}
          </button>
        `;
      })
      .join("");

    if (this.filteredEntities.length === 0) {
      this.listNode.innerHTML = `<div class="entity-list__empty">${escapeHtml(this._labels.emptyState)}</div>`;
    } else {
      this.listNode.innerHTML = this.filteredEntities
        .map((entity) => listItemMarkup(entity, this._selectedEntity?.id, this._categories))
        .join("");
    }

    this.updateStatusCopy();
  }
}

if (!customElements.get("entity-sheet")) {
  customElements.define("entity-sheet", EntitySheet);
}
