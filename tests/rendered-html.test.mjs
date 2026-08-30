import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Quiet Stack Labs portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Quiet Stack Labs — José Queiroz<\/title>/i);
  assert.match(html, /Independent product practice by José Queiroz/i);
  assert.match(html, /Casa da Piedade/);
  assert.match(html, /NightShelf/);
  assert.match(html, /My5/);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site/);
});

test("keeps project storytelling and motion fallbacks in the source", async () => {
  const [page, component, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../components/cinematic-portfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<CinematicPortfolio \/>/);
  assert.match(layout, /metadataBase: new URL\("https:\/\/quiet-stack-labs\.vercel\.app"\)/);
  assert.match(component, /<dt>My role<\/dt>/);
  assert.match(component, /<dt>Defining decision<\/dt>/);
  assert.match(component, /href="https:\/\/www\.nightshelf\.pt"/);
  assert.match(component, /!reduced && !coarse/);
  assert.match(component, /rootMargin: "35% 0px"/);
  assert.match(css, /@media \(pointer:coarse\)/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(css, /\.project-copy__details/);
  assert.match(packageJson, /"gsap":/);
  assert.match(packageJson, /"lenis":/);
});
