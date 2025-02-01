import puppeteer from "puppeteer";

async function getUrlsFromBaseUrl(
  baseUrl: string,
  filterPrefix: string = baseUrl,
): Promise<Set<string>> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const urls: Set<string> = new Set();

  async function crawl(url: string) {
    if (urls.has(url)) {
      return;
    }
    urls.add(url);

    await page.goto(url, { waitUntil: "networkidle0" });

    const urlsOnPage = await page.$$eval("a", (anchors: HTMLAnchorElement[]) =>
      anchors.map((anchor) => anchor.href),
    );

    for (const urlOnPage of urlsOnPage) {
      let baseUrlOnPage = urlOnPage;
      if (urlOnPage.includes("#")) {
        baseUrlOnPage = urlOnPage.split("#")[0];
      }
      if (baseUrlOnPage.startsWith(filterPrefix)) {
        await crawl(baseUrlOnPage);
      }
    }
  }

  await crawl(baseUrl);

  await browser.close();
  return urls;
}

const urls = new Set([
  ...(await getUrlsFromBaseUrl("http://localhost:8080/")),
  ...(await getUrlsFromBaseUrl(
    "http://localhost:8080/epk.html",
    "http://localhost:8080/",
  )),
]);

console.log(Array.from(urls).join(" "));
