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
  const actions = [
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
        <img src="${escapeHtml(entity.logo)}" alt="${escapeHtml(entity.name)} logo">
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

  return `
    <button class="entity-list__item ${isActive ? "is-active" : ""}" type="button" data-entity-id="${escapeHtml(entity.id)}">
      <span class="entity-list__logo">
        <img src="${escapeHtml(entity.logo)}" alt="">
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

export class EntitySheet extends HTMLElement {
  constructor() {
    super();
    this._entities = [];
    this._selectedEntity = null;
    this._filter = "all";
    this._expanded = false;
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
        <div class="sheet-grabber" data-action="toggle-sheet">
          <span class="sheet-grabber__bar" aria-hidden="true"></span>
          <div class="sheet-grabber__copy">
            <strong data-role="browse-title">${escapeHtml(this._labels.browseTitle)}</strong>
            <span data-role="status-copy">${escapeHtml(this._labels.collapsedHint)}</span>
          </div>
          <button class="sheet-grabber__button" type="button" data-action="toggle-sheet" aria-expanded="false">
            ${escapeHtml(this._labels.openList)}
          </button>
        </div>
        <div class="sheet-preview" data-role="preview"></div>
        <div class="sheet-directory">
          <div class="sheet-directory__inner">
            <div class="sheet-filters" data-role="filters"></div>
            <div class="entity-list" data-role="list"></div>
          </div>
        </div>
      </section>
    `;

    this.previewNode = this.querySelector('[data-role="preview"]');
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

    this.previewNode.innerHTML = cardMarkup(entityForCard, this._labels, this._categories);
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
