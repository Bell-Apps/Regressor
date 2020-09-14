#!/usr/bin/env node

import program from 'commander';
import logger, { setupLogger } from '../logger';
import SnapShotter from './snapshotter';
import getScreenshots from '../get-screenshots';

setupLogger();

program
  .version('0.0.1')
  .command('snap')
  .action(async () => {
    const config = {
      scenarios: [
        {
          url: 'http://www.bellhelmets.com/',
          label: 'homepage'
        },
        {
          url: 'http://www.bellhelmets.com/motorcycle/',
          label: 'category-motorcycle'
        }
      ]
    };

    logger.info('run', 'Getting snapshots... 📸 ');

    await getScreenshots(SnapShotter, config);
  });

program.parse(process.argv);
