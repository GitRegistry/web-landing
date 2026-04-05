import { defaultMapView, sampleEntities } from "../data/entities.js";
import { airfieldOverlays } from "../data/airfield-overlays.js";
import { localizeEntities, localizeText, normalizeLocale, uiStrings } from "../i18n.js";
import { MapController } from "../map-controller.js";
import "./entity-sheet.js";

export class FestMapApp extends HTMLElement {
  constructor() {
    super();
    this.rawEntities = sampleEntities;
    this.rawOverlays = airfieldOverlays;
    this.entities = [];
    this.overlays = [];
    this.locale = "de";
    this.selectedEntityId = this.rawEntities[0]?.id ?? null;
    this.selectedEntity = null;
    this.handleEntitySelect = this.handleEntitySelect.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleViewportResize = this.handleViewportResize.bind(this);
  }

  connectedCallback() {
    if (this.isReady) {
      return;
    }

    this.locale = this.getInitialLocale();
    this.renderShell();

    this.sheetElement = this.querySelector("entity-sheet");
    this.mapElement = this.querySelector("[data-map]");
    this.eyebrowNode = this.querySelector('[data-role="header-eyebrow"]');
    this.descriptionNode = this.querySelector('[data-role="header-description"]');
    this.languageGroupNode = this.querySelector('[data-role="language-group"]');
    this.languageButtonNodes = this.querySelectorAll("[data-locale]");
    this.footerCreditNode = this.querySelector('[data-role="footer-credit"]');

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

    this.applyLocale(this.locale, { fitMap: true });

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
    const nextHeight = window.visualViewport?.height ?? window.innerHeight;

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
    this.selectedEntity =
      this.entities.find(({ id }) => id === this.selectedEntityId) ?? this.entities[0] ?? null;
    this.selectedEntityId = this.selectedEntity?.id ?? null;

    this.eyebrowNode.textContent = strings.headerEyebrow;
    this.descriptionNode.textContent = strings.headerDescription;
    this.languageGroupNode.setAttribute("aria-label", strings.languageSwitchLabel);
    this.footerCreditNode.firstChild.textContent = `${strings.footerCredit} `;
    this.updateLanguageButtons();

    this.mapController.setOverlays(this.overlays);
    this.sheetElement.categories = strings.categories;
    this.sheetElement.labels = strings.sheet;
    this.sheetElement.entities = this.entities;
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
        <header class="app-header glass-panel">
          <div class="app-header__top">
            <div>
              <p class="app-header__eyebrow" data-role="header-eyebrow"></p>
              <h1>Flugplatz Fest &amp; Brazzeltag</h1>
            </div>
            <div class="language-switch" data-role="language-group" role="group" aria-label="Sprache wechseln">
              <button class="language-switch__button" type="button" data-locale="de" aria-pressed="false">DE</button>
              <button class="language-switch__button" type="button" data-locale="en" aria-pressed="false">EN</button>
            </div>
          </div>
          <p class="app-header__description" data-role="header-description"></p>
        </header>
        <footer class="app-footer glass-panel">
          <span data-role="footer-credit">Powered by </span><a href="https://paluv.de" target="_blank" rel="noreferrer">Paluv.de</a>
        </footer>
        <entity-sheet></entity-sheet>
      </div>
    `;
  }
}

if (!customElements.get("fest-map-app")) {
  customElements.define("fest-map-app", FestMapApp);
}
