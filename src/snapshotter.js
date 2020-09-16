import webdriver, { By, until } from 'selenium-webdriver';
import fs from 'fs';
import logger from './logger';

export default class SnapShotter {
  constructor({
    latest,
    gridUrl,
    width = 700,
    height = 1024,
    browser = 'chrome'
  }) {
    this.latest = latest;
    const browserCapability = browser.includes('chrome')
      ? webdriver.Capabilities.chrome
      : webdriver.Capabilities.firefox;

    this._driver = new webdriver.Builder()
      .usingServer(gridUrl)
      .withCapabilities(browserCapability())
      .build();

    this._driver
      .manage()
      .window()
      .setRect({ width, height });
  }

  get driver() {
    return this._driver;
  }

  async removeSelectors(selectors) {
    for (let i = 0; i < selectors.length; i++) {
      const script = `document.querySelectorAll('${selectors[i]}').forEach(element => element.style.display = "none")`;

      await this._driver.executeScript(script);
    }
  }

  async takeSnap(scenario, fileName) {
    if (!fileName) {
      fileName = scenario.label;
    }
    const timeout = 10000;
    logger.info(`Scenario: ${fileName}`, `Url: ${scenario.url}`);
    await this.driver.get(scenario.url);

    if (scenario.cookies) {
      for (let i = 0; i < scenario.cookies.length; i++) {
        const { name, value } = scenario.cookies[i];

        await this.driver.manage().addCookie({ name, value });
      }

      await this.driver.get(scenario.url);
    }

    if (scenario.removeSelectors) {
      await this.removeSelectors(scenario.removeSelectors);
    }

    if (scenario.waitForSelector) {
      const element = await this.driver.findElement(
        By.css(scenario.waitForSelector.toString())
      );
      try {
        await this.driver.wait(until.elementIsVisible(element), timeout);
      } catch (error) {
        logger.error(
          'snapshotter',
          `❌  Unable to find the specified waitForSelector element on the page! ❌ ${error}`
        );
      }
    }

    const screenShot = await this._driver.takeScreenshot();
    fs.writeFileSync(`${this.latest}/${fileName}.png`, screenShot, 'base64');
    await this.driver.quit();
  }
}
