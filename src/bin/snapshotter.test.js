/* globals jest expect */

import webdriver from 'selenium-webdriver';
import SnapShotter from './snapshotter';

jest.mock('fs');
jest.mock('selenium-webdriver');

describe('The snapshotter', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Takes navigates to a page and snaps', async () => {
    const config = {
      gridUrl: 'https://lol.com'
    };

    const mockSnapshot = new SnapShotter(config);

    for (let i = 0; i < 20; i++) {
      const scenario = {
        label: `test-${i}`,
        url: `http://lolcats-${i}.com`
      };
      await mockSnapshot.takeSnap(scenario);
    }

    expect(mockSnapshot.driver.get.mock.calls.length).toBe(20);
    expect(mockSnapshot.driver.takeScreenshot.mock.calls.length).toBe(20);
  });

  it('Sets default values for height and width', () => {
    const config = {
      gridUrl: 'https://lol.com'
    };

    const mockSnapshot = new SnapShotter(config);
    expect(mockSnapshot.driver.setRect).toBeCalledWith({
      height: 1024,
      width: 700
    });
  });

  it('Uses chrome and firefox', () => {
    new SnapShotter({
      gridUrl: 'https://lol.com',
      browser: 'firefox'
    });

    new SnapShotter({
      gridUrl: 'https://lol.com',
      browser: 'chrome'
    });

    expect(webdriver.Capabilities.chrome.mock.calls.length).toBe(1);
    expect(webdriver.Capabilities.firefox.mock.calls.length).toBe(1);
  });
});
