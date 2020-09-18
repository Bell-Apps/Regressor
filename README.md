# Regressor
Visual Regression Tool to catch css bugs

Regressor is a high performance visual regression tool. Created to fit in with an existing cloud infrastructure and distribute tests using selenium grid for large performance gains.

In order to get the most out of Regressor I recommend using a selenium grid and cloud storage (current supports Amazon S3). However if you wish to run locally that is also supported but the performance gains will be less significant.

## Inspiration

I have taken inspiration for this project existing projects such as Wraith and BackstopJS.

Visual regression testing is a great tool to have in the pipeline but current solutions on the market are missing on key component I felt was essential for a great developer experience...performance!

With the correct setup you can expect your tests using Regressor to take under a minute.


## Setup

In order to use the remote functionality you will need to export some aws credentials:

```
export AWS_SECRET_ACCESS_KEY=secretkey
export AWS_ACCESS_KEY_ID=keyid
```

Create an S3 bucket to store your images. It will also need to have the correct permissions set up.

Example config:

```
{
    "gridUrl": "http://selenium-grid:4444/wd/hub",
    "baseline": "./baseline",
    "latest": "./latest",
    "generatedDiffs": "./generatedDiffs",
    "report": "./reports",
    "remoteBucketName": "regressor-example",
    "remoteRegion": "us-west-1",
    "scenarios": [
      {
        "url": "http://www.bellhelmets.com/",
        "label": "homepage",
        "removeSelectors": [".header-banner"],
        "viewports": [{"height": 2400, "width": 1024, "label": "large"}],
        "cookies": [
          {
            "name": "cookie_name",
            "value": "cookie_value"
          }
        ],
        "waitForSelector": ["footer"],
        "onReadyScript": './scripts/clickSelector.js'
      }
    ]
  }
```

## Custom Scripts

For scenarios where you need to interact with the page before taking a screenshot, a custom script can be used which contains the selenium webdriver actions. The onReadyScript property takes a string path to the script to be executed.

Example script:

```
const By = require('selenium-webdriver').By;
const clickElement = async browser => {
  await browser.findElement(By.css('#buttonId"]')).click();
};
module.exports = clickElement;
```

## Running

Take the screenshots for comparison:

`regressor snap --browser chrome --config config.json --remote`

Set your most recent screenshots as the baselines for future comparisons:

`regressor update-baseline --browser chrome --config config.json --remote`

Run the comparison:

`regressor compare --browser chrome --config config.json --remote`

Generate the comparison report: 

`regressor generate-report --browser chrome --config config.json --remote`