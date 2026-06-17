import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const heroTarget = document.getElementById("hero-model");
if (heroTarget) {
  // Placeholder hook for the future hero model loader.
  heroTarget.dataset.ready = "true";
}

const preloader = document.getElementById("model-preloader");
const preloaderLabel = preloader
  ? preloader.querySelector(".model-preloader__label")
  : null;
const preloaderLoadingText =
  preloader?.dataset.loadingText || preloaderLabel?.textContent || "Loading model";
const preloaderErrorText =
  preloader?.dataset.errorText || "Model failed to load";

function markModelFailed(error) {
  console.error("Hero model unavailable", error);
  if (preloader) {
    preloader.setAttribute("aria-busy", "false");
  }
  if (preloaderLabel) {
    preloaderLabel.textContent = preloaderErrorText;
  }
  document.body.classList.add("model-failed");
}

const container = document.getElementById("engine-background");

if (!container) {
  console.warn("Engine background container not found.");
} else {
  // Renderer + scene setup for the full-page background model.
  let renderer = null;

  try {
    renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.physicallyCorrectLights = true;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);
  } catch (error) {
    markModelFailed(error);
  }

if (renderer) {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    42,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(0, 0.1, 56);

  // Balanced lighting to keep the model readable without crushing texture detail.
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x4a4a4a, 1.35);
  scene.add(hemisphereLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(4, 6, 2);
  scene.add(directionalLight);

  const loader = new GLTFLoader();
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const blendContainer = document.querySelector(".blend-text");
  const splitSelector =
    "h1, h2, h3, h4, h5, h6, p, a, button, li, dt, dd, span, small, label";
  const skipSelector = ".no-blend, [data-no-blend]";
  const mobileSkipSelector = "[data-no-blend-mobile]";
  const letterElements = [];
  const letterMetrics = new Map();
  const fallbackColor = getComputedStyle(document.body).backgroundColor;
  const fallbackMatch = fallbackColor.match(/\d+/g) || ["247", "247", "245"];
  const fallbackRgb = fallbackMatch.slice(0, 3).map((value) => Number(value));

  const engineLook = {
    opacity: 0.9,
    tint: new THREE.Color(0x2b2b2b),
    tintStrength: 0.15,
  };

  // We interpolate between hero, products, services, and contact.
  const heroSection = document.querySelector(".hero");
  const productsSection = document.querySelector("#products");
  const servicesSection = document.querySelector("#services");
  const contactSection = document.querySelector("#contact");

  // Hero state: vertical engine, zoomed in, positioned to the left.
  const heroState = {
    fov: 28,
    camPos: new THREE.Vector3(0.2, 0.15, 56),
    lookAt: new THREE.Vector3(-0.6, -0.1, 0),
    modelPos: new THREE.Vector3(-1.25, -1.2, 0),
    modelRot: new THREE.Euler(1.45, 0.9, 0.5),
    modelScale: 3.5,
  };

  const heroStateMobile = {
    fov: 34,
    camPos: new THREE.Vector3(0, 0.05, 58),
    lookAt: new THREE.Vector3(0, -0.1, 0),
    modelPos: new THREE.Vector3(0, -0.4, 0),
    modelRot: new THREE.Euler(2.9, 0.9, 0),
    modelScale: 3.5,
  };

  // Products state: horizontal engine, less zoom, centered.
  const productsState = {
    fov: 42,
    camPos: new THREE.Vector3(0, 0.05, 66),
    lookAt: new THREE.Vector3(0, -0.2, 0),
    modelPos: new THREE.Vector3(1.7, -0.35, 0),
    modelRot: new THREE.Euler(0.15, -0.6, 0),
    modelScale: 3.2,
  };

  const servicesState = {
    fov: 38,
    camPos: new THREE.Vector3(-0.2, 0.1, 60),
    lookAt: new THREE.Vector3(0.4, -0.15, 0),
    modelPos: new THREE.Vector3(0.6, -0.2, -0.2),
    modelRot: new THREE.Euler(0.35, 0.2, 0.1),
    modelScale: 2.8,
  };

  const contactState = {
    fov: 48,
    camPos: new THREE.Vector3(0, 0.2, 72),
    lookAt: new THREE.Vector3(0, -0.1, 0),
    modelPos: new THREE.Vector3(-0.4, -0.55, 0),
    modelRot: new THREE.Euler(0.1, -1.1, 0),
    modelScale: 2.3,
  };

  const states = [heroState, productsState, servicesState, contactState];

  // Precompute quaternions for smooth rotation blending.
  const heroQuat = new THREE.Quaternion().setFromEuler(heroState.modelRot);
  const heroMobileQuat = new THREE.Quaternion().setFromEuler(
    heroStateMobile.modelRot
  );
  const productsQuat = new THREE.Quaternion().setFromEuler(productsState.modelRot);
  const servicesQuat = new THREE.Quaternion().setFromEuler(servicesState.modelRot);
  const contactQuat = new THREE.Quaternion().setFromEuler(contactState.modelRot);
  const quats = [heroQuat, productsQuat, servicesQuat, contactQuat];
  const targetQuat = new THREE.Quaternion().copy(heroQuat);
  const currentQuat = new THREE.Quaternion().copy(heroQuat);

  // Target values we interpolate toward on scroll.
  const initialHeroState = window.matchMedia("(max-width: 900px)").matches
    ? heroStateMobile
    : heroState;

  const target = {
    fov: initialHeroState.fov,
    camPos: initialHeroState.camPos.clone(),
    lookAt: initialHeroState.lookAt.clone(),
    modelPos: initialHeroState.modelPos.clone(),
    modelScale: initialHeroState.modelScale,
  };

  const currentLookAt = initialHeroState.lookAt.clone();
  const targetScale = new THREE.Vector3(
    initialHeroState.modelScale,
    initialHeroState.modelScale,
    initialHeroState.modelScale
  );
  const spinAxis = new THREE.Vector3(0, 1, 0);
  let spinAngle = 0;
  let scrollSpinAngle = 0;
  let targetScrollSpinAngle = 0;
  let currentSegmentIndex = 0;
  let engine = null;
  let engineModel = null;
  const contrastColors = {
    dark: [18, 18, 18],
    light: [245, 245, 242],
    low: 0.35,
    high: 0.7,
  };

  const sampleState = {
    width: 128,
    height: 72,
    target: new THREE.WebGLRenderTarget(128, 72, {
      format: THREE.RGBAFormat,
      type: THREE.UnsignedByteType,
      depthBuffer: false,
      stencilBuffer: false,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
    }),
    buffer: new Uint8Array(128 * 72 * 4),
    lastSampleTime: -180,
    interval: 180,
  };

  const scrollState = {
    points: [0, 1, 2, 3],
    max: 1,
  };

  // Compute the scroll anchors for each section.
  function updateScrollBounds() {
    const sections = [
      heroSection,
      productsSection,
      servicesSection,
      contactSection,
    ];
    scrollState.points = sections.map((section, index) => {
      if (section && typeof section.offsetTop === "number") {
        return section.offsetTop;
      }
      return index * window.innerHeight;
    });
    scrollState.max = Math.max(
      document.body.scrollHeight - window.innerHeight,
      1
    );
  }

  // Update target camera/model values based on scroll progress.
  function updateTargets() {
    const points = scrollState.points;
    const totalSegments = points.length - 1;
    let segmentIndex = 0;

    for (let i = 0; i < totalSegments; i += 1) {
      if (window.scrollY < points[i + 1]) {
        segmentIndex = i;
        break;
      }
      segmentIndex = i;
    }

    const segmentStart = points[segmentIndex];
    const rawSegmentEnd = points[segmentIndex + 1] || segmentStart + 1;
    const segmentEnd = Math.max(rawSegmentEnd, segmentStart + window.innerHeight * 0.6);
    const segmentProgress = THREE.MathUtils.clamp(
      (window.scrollY - segmentStart) / (segmentEnd - segmentStart),
      0,
      1
    );
    currentSegmentIndex = segmentIndex;
    const overallProgress = THREE.MathUtils.clamp(
      window.scrollY / scrollState.max,
      0,
      1
    );

    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const fromState =
      segmentIndex === 0 ? (isMobile ? heroStateMobile : heroState) : states[segmentIndex];
    const toState =
      segmentIndex === 0
        ? states[1]
        : states[Math.min(segmentIndex + 1, states.length - 1)];

    target.fov = THREE.MathUtils.lerp(fromState.fov, toState.fov, segmentProgress);
    target.camPos.lerpVectors(fromState.camPos, toState.camPos, segmentProgress);
    target.lookAt.lerpVectors(fromState.lookAt, toState.lookAt, segmentProgress);
    target.modelPos.lerpVectors(fromState.modelPos, toState.modelPos, segmentProgress);

    const travel = THREE.MathUtils.lerp(-0.5, 0.5, overallProgress) * 0.35;
    target.modelPos.y += travel;

    target.modelScale = THREE.MathUtils.lerp(
      fromState.modelScale,
      toState.modelScale,
      segmentProgress
    );

    if (segmentIndex === 0 && isMobile) {
      targetQuat.slerpQuaternions(heroMobileQuat, quats[1], segmentProgress);
    } else {
      targetQuat.slerpQuaternions(
        quats[segmentIndex],
        quats[Math.min(segmentIndex + 1, quats.length - 1)],
        segmentProgress
      );
    }

    if (segmentIndex >= 1) {
      const heroEnd = scrollState.points[1] ?? 0;
      const remaining = Math.max(scrollState.max - heroEnd, 1);
      const postHeroProgress = THREE.MathUtils.clamp(
        (window.scrollY - heroEnd) / remaining,
        0,
        1
      );
      targetScrollSpinAngle = postHeroProgress * Math.PI * 2;
    } else {
      targetScrollSpinAngle = 0;
    }
  }

  function resizeSampleTarget() {
    const aspect = container.clientWidth / container.clientHeight || 1;
    const width = 128;
    const height = Math.max(72, Math.round(width / aspect));
    sampleState.width = width;
    sampleState.height = height;
    sampleState.target.setSize(width, height);
    sampleState.buffer = new Uint8Array(width * height * 4);
  }

  function sampleScene() {
    renderer.setRenderTarget(sampleState.target);
    renderer.render(scene, camera);
    renderer.readRenderTargetPixels(
      sampleState.target,
      0,
      0,
      sampleState.width,
      sampleState.height,
      sampleState.buffer
    );
    renderer.setRenderTarget(null);
  }

  // Smoothly ease the model toward the targets and apply a constant spin.
  function syncEngine() {
    if (!engine) return;

    engine.position.lerp(target.modelPos, 0.08);
    targetScale.setScalar(target.modelScale);
    engine.scale.lerp(targetScale, 0.08);

    currentQuat.slerp(targetQuat, 0.08);
    scrollSpinAngle += (targetScrollSpinAngle - scrollSpinAngle) * 0.08;
    if (!prefersReducedMotion && currentSegmentIndex === 0) {
      spinAngle += 0.0005;
    }
    const spinQuat = new THREE.Quaternion().setFromAxisAngle(
      spinAxis,
      spinAngle + scrollSpinAngle
    );
    engine.quaternion.copy(currentQuat).multiply(spinQuat);
  }

  // Smoothly ease the camera toward the targets.
  function syncCamera() {
    camera.position.lerp(target.camPos, 0.08);
    camera.fov += (target.fov - camera.fov) * 0.08;
    camera.updateProjectionMatrix();
    currentLookAt.lerp(target.lookAt, 0.08);
    camera.lookAt(currentLookAt);
  }

  // Update per-letter color by sampling the rendered background.
  function updateTextContrast() {
    if (!engine || !blendContainer || letterElements.length === 0) {
      return;
    }

    const now = performance.now();
    if (now - sampleState.lastSampleTime < sampleState.interval) return;
    sampleState.lastSampleTime = now;

    sampleScene();

    const canvasRect = renderer.domElement.getBoundingClientRect();
    const buffer = sampleState.buffer;
    const bufferWidth = sampleState.width;
    const bufferHeight = sampleState.height;

    for (const letter of letterElements) {
      const metrics = letterMetrics.get(letter);
      if (!metrics) {
        letter.style.removeProperty("color");
        letter.dataset.color = "";
        continue;
      }

      const left = metrics.x - window.scrollX;
      const top = metrics.y - window.scrollY;
      const width = metrics.width;
      const height = metrics.height;

      if (
        width === 0 ||
        height === 0 ||
        top + height <= 0 ||
        top >= window.innerHeight
      ) {
        letter.style.removeProperty("color");
        letter.dataset.color = "";
        continue;
      }

      const sampleX = left + width * 0.5;
      const sampleY = top + height * 0.5;
      const u =
        (sampleX - canvasRect.left) / Math.max(canvasRect.width, 1);
      const v =
        1 - (sampleY - canvasRect.top) / Math.max(canvasRect.height, 1);
      const ix = Math.floor(u * (bufferWidth - 1));
      const iy = Math.floor(v * (bufferHeight - 1));

      if (ix < 0 || iy < 0 || ix >= bufferWidth || iy >= bufferHeight) {
        letter.style.removeProperty("color");
        letter.dataset.color = "";
        continue;
      }

      const idx = (iy * bufferWidth + ix) * 4;
      let r = buffer[idx];
      let g = buffer[idx + 1];
      let b = buffer[idx + 2];
      const a = buffer[idx + 3];
      const alpha = a / 255;

      if (alpha < 0.05) {
        [r, g, b] = fallbackRgb;
      } else if (alpha < 1) {
        const invAlpha = 1 / alpha;
        r = Math.min(255, r * invAlpha);
        g = Math.min(255, g * invAlpha);
        b = Math.min(255, b * invAlpha);
      }

      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const t = THREE.MathUtils.clamp(
        (contrastColors.high - luminance) /
          (contrastColors.high - contrastColors.low),
        0,
        1
      );
      const outR = Math.round(
        contrastColors.dark[0] +
          (contrastColors.light[0] - contrastColors.dark[0]) * t
      );
      const outG = Math.round(
        contrastColors.dark[1] +
          (contrastColors.light[1] - contrastColors.dark[1]) * t
      );
      const outB = Math.round(
        contrastColors.dark[2] +
          (contrastColors.light[2] - contrastColors.dark[2]) * t
      );
      const nextColor = `rgb(${outR}, ${outG}, ${outB})`;

      if (letter.dataset.color !== nextColor) {
        letter.style.color = nextColor;
        letter.dataset.color = nextColor;
      }
    }
  }

  // Apply tint/opacity and ensure textures use the correct color space.
  function applyMaterial(material) {
    if (!material) return;
    material.transparent = engineLook.opacity < 1;
    material.opacity = engineLook.opacity;
    if (material.color) {
      material.color.lerp(engineLook.tint, engineLook.tintStrength);
    }
    if (material.map) {
      material.map.colorSpace = THREE.SRGBColorSpace;
      material.map.needsUpdate = true;
    }
    material.needsUpdate = true;
  }

  // Load the GLTF model and apply the material adjustments.
  loader.load(
    "/assets/glb/jet_engine/scene.gltf",
    (gltf) => {
      engineModel = gltf.scene;
      engineModel.traverse((child) => {
        if (!child.isMesh) return;
        if (Array.isArray(child.material)) {
          child.material.forEach(applyMaterial);
        } else {
          applyMaterial(child.material);
        }
      });
      const bounds = new THREE.Box3().setFromObject(engineModel);
      const center = bounds.getCenter(new THREE.Vector3());
      engineModel.position.sub(center);
      engine = new THREE.Group();
      engine.add(engineModel);
      engine.position.copy(initialHeroState.modelPos);
      engine.scale.setScalar(initialHeroState.modelScale);
      engine.quaternion.copy(
        window.matchMedia("(max-width: 900px)").matches ? heroMobileQuat : heroQuat
      );
      scene.add(engine);
      if (preloader) {
        preloader.setAttribute("aria-busy", "false");
      }
      document.body.classList.add("model-ready");
    },
    (xhr) => {
      if (!preloaderLabel || !xhr.total) return;
      const percent = Math.round((xhr.loaded / xhr.total) * 100);
      preloaderLabel.textContent = `${preloaderLoadingText} ${percent}%`;
    },
    (error) => {
      markModelFailed(error);
    }
  );

  // Keep the renderer and camera in sync with the viewport.
  function onResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    resizeSampleTarget();
    updateScrollBounds();
    updateTargets();
    cacheLetterMetrics();
  }

  // Render loop.
  function animate() {
    requestAnimationFrame(animate);
    syncEngine();
    syncCamera();
    renderer.render(scene, camera);
    updateTextContrast();
  }

  updateScrollBounds();
  updateTargets();
  resizeSampleTarget();
  window.addEventListener("scroll", updateTargets, { passive: true });
  let viewportRaf = null;
  const handleViewportChange = () => {
    if (viewportRaf) return;
    viewportRaf = window.requestAnimationFrame(() => {
      viewportRaf = null;
      onResize();
    });
  };

  window.addEventListener("resize", handleViewportChange);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleViewportChange);
    window.visualViewport.addEventListener("scroll", handleViewportChange);
  }

  function splitAllText() {
    if (!blendContainer) return;
    const isMobileNoBlend = window.matchMedia("(max-width: 720px)").matches;

    const elements = Array.from(blendContainer.querySelectorAll(splitSelector));

    for (const element of elements) {
      if (element.closest(skipSelector)) continue;
      if (isMobileNoBlend && element.closest(mobileSkipSelector)) continue;
      if (!element || element.dataset.split === "true") continue;
      if (element.children.length > 0) continue;

      const text = element.textContent || "";
      if (!text.trim()) continue;

      element.dataset.split = "true";
      element.setAttribute("aria-label", text);
      element.textContent = "";

      const fragment = document.createDocumentFragment();
      let currentWord = "";

      const appendWord = (word) => {
        if (!word) return;
        const wordSpan = document.createElement("span");
        wordSpan.className = "word";
        wordSpan.setAttribute("aria-hidden", "true");

        for (const char of word) {
          const span = document.createElement("span");
          span.className = "letter";
          span.setAttribute("aria-hidden", "true");
          span.textContent = char;
          letterElements.push(span);
          wordSpan.appendChild(span);
        }

        fragment.appendChild(wordSpan);
      };

      for (let i = 0; i < text.length; i += 1) {
        const char = text[i];

        if (char === "\r") {
          continue;
        }

        if (char === "\n") {
          appendWord(currentWord);
          currentWord = "";
          fragment.appendChild(document.createElement("br"));
          continue;
        }

        if (/\s/.test(char)) {
          appendWord(currentWord);
          currentWord = "";
          fragment.appendChild(document.createTextNode(" "));
          continue;
        }

        currentWord += char;
      }

      appendWord(currentWord);
      element.appendChild(fragment);
    }
  }

  function cacheLetterMetrics() {
    letterMetrics.clear();
    for (const letter of letterElements) {
      const rect = letter.getBoundingClientRect();
      letterMetrics.set(letter, {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
      });
    }
  }

  // Split all visible text into individually colorable letters.
  splitAllText();
  cacheLetterMetrics();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(cacheLetterMetrics).catch(() => {});
  }
  window.addEventListener("load", () => {
    splitAllText();
    cacheLetterMetrics();
  });

  animate();
}
}
