const defaultCategories = {
  company: { label: "Firmen" },
  service: { label: "Service" },
  entry: { label: "Ein- / Ausgaenge" },
  roundflight: { label: "Rundfluege" },
};

const defaultLabels = {
  browseTitle: "Eintraege entdecken",
  collapsedHint: "Nach oben wischen oder tippen, um alle Eintraege zu sehen.",
  expandedHint: "Tippe auf einen Eintrag, um ihn zu fokussieren und das Menue wieder zu schliessen.",
  openList: "Oeffnen",
  collapse: "Schliessen",
  events: "Programm",
  places: "Orte",
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
  const tagName = linkedEntity ? "button" : "article";
  const actionAttributes = linkedEntity
    ? `type="button" data-event-entity-id="${escapeHtml(linkedEntity.id)}"`
    : "";

  return `
    <${tagName} class="event-list__item" ${actionAttributes}>
      <time>${escapeHtml(event.time)}</time>
      <div>
        <strong>${escapeHtml(event.title)}</strong>
        ${event.description ? `<p>${escapeHtml(event.description)}</p>` : ""}
        ${locationLine}
      </div>
    </${tagName}>
  `;
}

function eventDateLabel(events, date) {
  return events.find((event) => event.date === date)?.dateLabel || date;
}

export class EntitySheet extends HTMLElement {
  constructor() {
    super();
    this._entities = [];
    this._selectedEntity = null;
    this._events = [];
    this._eventDate = null;
    this._filter = "company";
    this._expanded = false;
    this._view = "places";
    this._categories = defaultCategories;
    this._labels = defaultLabels;
    this.dragStartY = null;
    this.dragHandled = false;
    this.handleEntityItemClick = this.handleEntityItemClick.bind(this);
    this.handleEventItemClick = this.handleEventItemClick.bind(this);
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
    const dates = this.eventDates;

    if (dates.length && !dates.includes(this._eventDate)) {
      this._eventDate = dates[0];
    }

    this.update();
  }

  set categories(value) {
    this._categories = value ?? defaultCategories;
    if (this._filter !== "all" && !this._categories[this._filter]) {
      this._filter = Object.keys(this._categories)[0] ?? "all";
    }
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

  get eventDates() {
    return [...new Set(this._events.map((event) => event.date).filter(Boolean))].sort();
  }

  get visibleEvents() {
    const dates = this.eventDates;

    if (dates.length <= 1) {
      return this._events;
    }

    return this._events.filter((event) => event.date === this._eventDate);
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
            <button class="sheet-grabber__button sheet-grabber__button--secondary" type="button" data-view="events">
              ${escapeHtml(this._labels.events)}
            </button>
            <button class="sheet-grabber__button sheet-grabber__button--secondary" type="button" data-view="places">
              ${escapeHtml(this._labels.places)}
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
            <div class="event-day-tabs" data-role="event-date-tabs"></div>
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
    this.eventDateTabsNode = this.querySelector('[data-role="event-date-tabs"]');
    this.filtersNode = this.querySelector('[data-role="filters"]');
    this.listNode = this.querySelector('[data-role="list"]');
    this.browseTitleNode = this.querySelector('[data-role="browse-title"]');
    this.statusCopyNode = this.querySelector('[data-role="status-copy"]');
    this.toggleButtonNode = this.querySelector('[data-action="toggle-sheet"].sheet-grabber__button');
    this.grabberNode = this.querySelector(".sheet-grabber");
  }

  attachEvents() {
    this.addEventListener("click", (event) => {
      const eventDateTrigger = event.target.closest("[data-event-date]");

      if (eventDateTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this._eventDate = eventDateTrigger.dataset.eventDate;
        this.update();
        return;
      }

      const toggleTrigger = event.target.closest('[data-action="toggle-sheet"]');

      if (toggleTrigger) {
        if (this.dragHandled) {
          this.dragHandled = false;
          return;
        }

        this.setExpanded(!this._expanded);
        return;
      }

      const viewTrigger = event.target.closest("[data-view]");

      if (viewTrigger) {
        this._view = viewTrigger.dataset.view === "events" ? "events" : "places";
        if (this._view === "events") {
          this.setExpanded(true);
          this.update();
          return;
        }
        this.update();
        return;
      }

      const filterTrigger = event.target.closest("[data-filter]");

      if (filterTrigger) {
        event.preventDefault();
        event.stopPropagation();
        this._filter = filterTrigger.dataset.filter ?? "all";
        this.update();
        return;
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

    this.browseTitleNode.textContent = this._view === "events" ? this._labels.events : this._labels.places;
    this.statusCopyNode.textContent = this._expanded ? this._labels.expandedHint : this._labels.collapsedHint;
    this.toggleButtonNode.textContent = this._expanded ? this._labels.collapse : this._labels.openList;
    this.toggleButtonNode.setAttribute("aria-expanded", String(this._expanded));
  }

  handleEntityItemClick(event) {
    const entityId = event.currentTarget?.dataset.entityId;

    if (!entityId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("entity-select", {
        bubbles: true,
        detail: { entityId },
      }),
    );
    this._view = "places";
    this.update();
  }

  handleEventItemClick(event) {
    const entityId = event.currentTarget?.dataset.eventEntityId;

    if (!entityId) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    this.dispatchEvent(
      new CustomEvent("entity-select", {
        bubbles: true,
        detail: { entityId },
      }),
    );
    this.update();
  }

  update() {
    if (!this.isReady) {
      return;
    }

    const entityForCard = this._selectedEntity ?? this.filteredEntities[0] ?? this._entities[0] ?? null;

    this.dataset.view = this._view;
    this.previewNode.innerHTML = cardMarkup(entityForCard, this._labels, this._categories);
    this.detailsViewNode.hidden = this._view !== "places";
    this.eventsViewNode.hidden = this._view !== "events";
    this.querySelector(".sheet-events__header h2").textContent = this._labels.program;
    this.querySelector('[data-view="events"]').textContent = this._labels.events;
    this.querySelector('[data-view="places"]').textContent = this._labels.places;
    this.querySelector('[data-view="events"]').classList.toggle("is-active", this._view === "events");
    this.querySelector('[data-view="places"]').classList.toggle("is-active", this._view === "places");

    const eventDates = this.eventDates;
    this.eventDateTabsNode.hidden = eventDates.length <= 1;
    this.eventDateTabsNode.innerHTML = eventDates
      .map((date) => {
        const isActive = date === this._eventDate;

        return `
          <button class="event-day-tab ${isActive ? "is-active" : ""}" type="button" data-event-date="${escapeHtml(date)}">
            ${escapeHtml(eventDateLabel(this._events, date))}
          </button>
        `;
      })
      .join("");
    this.eventDateTabsNode.querySelectorAll("[data-event-date]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._eventDate = button.dataset.eventDate;
        this.update();
      });
    });

    const visibleEvents = this.visibleEvents;
    this.eventsNode.innerHTML = visibleEvents.length
      ? visibleEvents.map((event) => eventMarkup(event, this._entities, this._labels)).join("")
      : `<div class="event-list__empty">${escapeHtml(this._labels.emptyEvents)}</div>`;
    this.eventsNode
      .querySelectorAll("[data-event-entity-id]")
      .forEach((button) => button.addEventListener("click", this.handleEventItemClick));

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
    this.filtersNode.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        this._filter = button.dataset.filter ?? "all";
        this.update();
      });
    });

    if (this.filteredEntities.length === 0) {
      this.listNode.innerHTML = `<div class="entity-list__empty">${escapeHtml(this._labels.emptyState)}</div>`;
    } else {
      this.listNode.innerHTML = this.filteredEntities
        .map((entity) => listItemMarkup(entity, this._selectedEntity?.id, this._categories))
        .join("");
      this.listNode
        .querySelectorAll("[data-entity-id]")
        .forEach((button) => button.addEventListener("click", this.handleEntityItemClick));
    }

    this.updateStatusCopy();
  }
}

if (!customElements.get("entity-sheet")) {
  customElements.define("entity-sheet", EntitySheet);
}
