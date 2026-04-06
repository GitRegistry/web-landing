const fs = require("fs");
const path = require("path");

const { HOME_CONTENT, LEGAL_CONTENT } = require("./content");
const { renderHomepage, renderLegalPage } = require("./templates");

const ROOT = path.resolve(__dirname, "..");

function writeFile(relativePath, contents) {
  const fullPath = path.join(ROOT, relativePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, contents, "utf8");
  process.stdout.write(`wrote ${relativePath}\n`);
}

function generateHomepages() {
  writeFile("index.html", renderHomepage("en", HOME_CONTENT.en));
  writeFile("en/index.html", renderHomepage("en", HOME_CONTENT.en));
  writeFile("de/index.html", renderHomepage("de", HOME_CONTENT.de));
}

function generateLegalPages() {
  writeFile(
    "en/imprint/index.html",
    renderLegalPage("en", LEGAL_CONTENT.en, "imprint", LEGAL_CONTENT.en.pages.imprint)
  );
  writeFile(
    "en/privacy/index.html",
    renderLegalPage("en", LEGAL_CONTENT.en, "privacy", LEGAL_CONTENT.en.pages.privacy)
  );
  writeFile(
    "de/impressum/index.html",
    renderLegalPage("de", LEGAL_CONTENT.de, "imprint", LEGAL_CONTENT.de.pages.imprint)
  );
  writeFile(
    "de/datenschutz/index.html",
    renderLegalPage("de", LEGAL_CONTENT.de, "privacy", LEGAL_CONTENT.de.pages.privacy)
  );
}

function main() {
  generateHomepages();
  generateLegalPages();
}

main();
