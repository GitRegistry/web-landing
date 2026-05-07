import { dataEndpoints, defaultMapView } from "../config.js";
import { localizeEntities, localizeEvents, localizeText, normalizeLocale, uiStrings } from "../i18n.js";
import { MapController } from "../map-controller.js";
import "./entity-sheet.js";

export class FestMapApp extends HTMLElement {
  constructor() {
    super();
    this.rawEntities = [];
    this.rawOverlays = [];
    this.rawEvents = [];
    this.entities = [];
    this.overlays = [];
    this.events = [];
    this.locale = "de";
    this.selectedEntityId = null;
    this.selectedEntity = null;
    this.status = "idle";
    this.handleEntitySelect = this.handleEntitySelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleViewportResize = this.handleViewportResize.bind(this);
  }

  async connectedCallback() {
    if (this.isReady) {
      return;
    }

    this.locale = this.getInitialLocale();
    this.renderShell();

    this.sheetElement = this.querySelector("entity-sheet");
    this.mapElement = this.querySelector("[data-map]");
    this.languageGroupNode = this.querySelector('[data-role="language-group"]');
    this.languageButtonNodes = this.querySelectorAll("[data-locale]");
    this.footerCreditNode = this.querySelector('[data-role="footer-credit"]');
    this.statusNode = this.querySelector('[data-role="app-status"]');

    this.mapController = new MapController(this.mapElement, {
      center: defaultMapView.center,
      zoom: defaultMapView.zoom,
      onSelect: (entityId) => {
        this.selectEntity(entityId, { flyTo: true });
      },
    });

    this.mapController.init();
    this.syncViewportHeight();

    this.addEventListener("entity-select", this.handleEntitySelect);
    this.addEventListener("click", this.handleClick);
    window.addEventListener("resize", this.handleResize);
    window.visualViewport?.addEventListener("resize", this.handleViewportResize);
    window.visualViewport?.addEventListener("scroll", this.handleViewportResize);

    this.setStatus("loading");

    try {
      await this.loadData();
      this.applyLocale(this.locale, { fitMap: true });
      this.setStatus("ready");
    } catch (error) {
      console.error(error);
      this.setStatus("error");
    }

    this.mapController.invalidateSize();
    requestAnimationFrame(() => {
      this.mapController.invalidateSize();
    });

    this.isReady = true;
  }

  disconnectedCallback() {
    this.removeEventListener("entity-select", this.handleEntitySelect);
    this.removeEventListener("click", this.handleClick);
    window.removeEventListener("resize", this.handleResize);
    window.visualViewport?.removeEventListener("resize", this.handleViewportResize);
    window.visualViewport?.removeEventListener("scroll", this.handleViewportResize);
    this.mapController?.destroy();
  }

  handleResize = () => {
    this.syncViewportHeight();
    this.mapController?.invalidateSize();
  };

  handleViewportResize() {
    this.syncViewportHeight();
    this.mapController?.invalidateSize();
  }

  syncViewportHeight() {
    const nextHeight = Math.max(window.innerHeight || 0, window.visualViewport?.height ?? 0);

    if (!nextHeight) {
      return;
    }

    document.documentElement.style.setProperty("--app-height", `${nextHeight}px`);
  }

  getInitialLocale() {
    return normalizeLocale(this.dataset.language || document.documentElement.lang || "de");
  }

  handleClick(event) {
    const localeTrigger = event.target.closest("[data-locale]");

    if (!localeTrigger) {
      return;
    }

    this.applyLocale(localeTrigger.dataset.locale, { fitMap: false });
  }

  handleEntitySelect(event) {
    const entityId = event.detail?.entityId;
    this.selectEntity(entityId, { flyTo: true });
  }

  async loadData() {
    const [entitiesResponse, overlaysResponse, eventsResponse] = await Promise.all([
      fetch(dataEndpoints.entities, { cache: "no-store" }),
      fetch(dataEndpoints.overlays, { cache: "no-store" }),
      fetch(dataEndpoints.events, { cache: "no-store" }),
    ]);

    if (!entitiesResponse.ok || !overlaysResponse.ok || !eventsResponse.ok) {
      throw new Error(
        `Failed to load Fest Map data (${entitiesResponse.status}/${overlaysResponse.status}/${eventsResponse.status})`,
      );
    }

    const [entities, overlays, events] = await Promise.all([
      entitiesResponse.json(),
      overlaysResponse.json(),
      eventsResponse.json(),
    ]);

    this.rawEntities = Array.isArray(entities) ? entities : [];
    this.rawOverlays = Array.isArray(overlays) ? overlays : [];
    this.rawEvents = Array.isArray(events) ? events : [];
    this.selectedEntityId = this.rawEntities[0]?.id ?? null;
  }

  setStatus(nextStatus) {
    this.status = nextStatus;
    const strings = uiStrings[this.locale];

    this.dataset.status = nextStatus;

    if (!this.statusNode) {
      return;
    }

    if (nextStatus === "loading") {
      this.statusNode.textContent = strings.status.loading;
      this.statusNode.hidden = false;
      return;
    }

    if (nextStatus === "error") {
      this.statusNode.textContent = strings.status.error;
      this.statusNode.hidden = false;
      return;
    }

    this.statusNode.hidden = true;
    this.statusNode.textContent = "";
  }

  applyLocale(nextLocale, { fitMap = false } = {}) {
    this.locale = normalizeLocale(nextLocale);
    const strings = uiStrings[this.locale];
    const descriptionMeta = document.querySelector('meta[name="description"]');

    document.documentElement.lang = this.locale;
    document.title = strings.pageTitle;

    if (descriptionMeta) {
      descriptionMeta.setAttribute("content", strings.metaDescription);
    }

    this.entities = localizeEntities(this.rawEntities, this.locale);
    this.overlays = this.rawOverlays.map((overlay) => ({
      ...overlay,
      label: overlay.label ? localizeText(overlay.label, this.locale) : null,
    }));
    this.events = localizeEvents(this.rawEvents, this.locale);
    this.selectedEntity =
      this.entities.find(({ id }) => id === this.selectedEntityId) ?? this.entities[0] ?? null;
    this.selectedEntityId = this.selectedEntity?.id ?? null;

    this.languageGroupNode.setAttribute("aria-label", strings.languageSwitchLabel);
    this.footerCreditNode.firstChild.textContent = `${strings.footerCredit} `;
    this.updateLanguageButtons();
    this.setStatus(this.status);

    this.mapController.setOverlays(this.overlays);
    this.sheetElement.categories = strings.categories;
    this.sheetElement.labels = strings.sheet;
    this.sheetElement.entities = this.entities;
    this.sheetElement.events = this.events;
    this.sheetElement.selectedEntity = this.selectedEntity;

    this.mapController.setEntities(this.entities, { fit: fitMap });

    if (this.selectedEntity) {
      this.mapController.focusEntity(this.selectedEntity, { flyTo: false });
    }
  }

  updateLanguageButtons() {
    this.languageButtonNodes.forEach((button) => {
      const buttonLocale = button.dataset.locale;
      const isActive = buttonLocale === this.locale;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  selectEntity(entityId, { flyTo }) {
    const entity = this.entities.find(({ id }) => id === entityId) ?? null;

    if (!entity) {
      return;
    }

    this.selectedEntityId = entity.id;
    this.selectedEntity = entity;
    this.sheetElement.selectedEntity = entity;
    this.mapController.focusEntity(entity, { flyTo });
  }

  renderShell() {
    this.innerHTML = `
      <div class="app-shell">
        <div class="map-canvas" data-map></div>
        <div class="map-overlay"></div>
        <div class="app-language-float language-switch glass-panel" data-role="language-group" role="group" aria-label="Sprache wechseln">
          <button class="language-switch__button" type="button" data-locale="de" aria-pressed="false">DE</button>
          <button class="language-switch__button" type="button" data-locale="en" aria-pressed="false">EN</button>
        </div>
        <footer class="app-footer glass-panel">
          <span data-role="footer-credit">Powered by </span><a href="https://paluv.de" target="_blank" rel="noreferrer">Paluv.de</a>
        </footer>
        <div class="app-status glass-panel" data-role="app-status" hidden></div>
        <entity-sheet></entity-sheet>
      </div>
    `;
  }
}

if (!customElements.get("fest-map-app")) {
  customElements.define("fest-map-app", FestMapApp);
}
