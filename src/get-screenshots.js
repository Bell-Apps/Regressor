export default (SnapShotter, config) =>
  Promise.all(
    config.scenarios.map(scenario => {
      const snap = new SnapShotter('http://localhost:4444/wd/hub');

      const promises = [];
      promises.push(snap.takeSnap(scenario.url, scenario.label));
      return Promise.all(promises);
    })
  );
