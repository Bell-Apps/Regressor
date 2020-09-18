/* globals jest expect */

import {
  createDirectories,
  fetchRemoteComparisonImages,
  clearDirectory,
  createComparisons
} from './comparisonActions';
import { deleteRemote, fetchRemote } from './remoteActions';
import createDiffImage from './createDiffs';

jest.mock('fs');
jest.mock('./remoteActions');
jest.mock('./reporter');
jest.mock('./comparisonDataConstructor');
jest.mock('./comparer');
jest.mock('./createDiffs');

describe('The comparisons actions', () => {
  let mockFs;

  beforeEach(() => {
    mockFs = {
      readdirSync: () => ['1', '2', '3', '4', '5', '6'],
      access: jest.fn(),
      mkdirSync: () => {},
      copyFileSync: () => {}
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Creates directories checks the directories exist before creating', async () => {
    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest'
    };

    await createDirectories(mockFs, config).catch(err => console.log(err));
    expect(mockFs.access.mock.calls.length).toBe(3);
  });

  it('Creates directories for diff, latest and baseline', async () => {
    mockFs = {
      access: (path, callback) => callback('err'),
      mkdirSync: jest.fn()
    };

    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest'
    };

    await createDirectories(mockFs, config).catch(err => console.log(err));
    expect(mockFs.mkdirSync.mock.calls.length).toBe(3);
  });

  it('deletes generated differences from the remote bucket before fetching baseline images', async () => {
    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest',
      remote: 'yes',
      scenarios: [
        {
          viewports: [
            { height: 2400, width: 1024, label: 'large' },
            { height: 2400, width: 500, label: 'mobile' }
          ],
          label: 'test1'
        }
      ]
    };

    await fetchRemoteComparisonImages(mockFs, config).catch(err =>
        console.log(err)
    );
    expect(deleteRemote.mock.calls.length).toBe(1);
    expect(fetchRemote.mock.calls.length).toBe(2);
  });

  it('clears the generated diffs directory', async () => {
    mockFs = {
      readdirSync: () => ['1', '2', '3', '4', '5', '6'],
      unlinkSync: jest.fn()
    };

    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest'
    };

    await clearDirectory(mockFs, config);
    expect(mockFs.unlinkSync.mock.calls.length).toBe(6);
  });

  it('creates a diff image when comparison fails', async () => {
    const config = {
      baseline: './baselineTest',
      latest: './latestTest',
      generatedDiffs: './generatedDiffsTest',
      scenarios: [
        {
          viewports: [{ height: 2400, width: 1024, label: 'large' }],
          label: 'test1'
        }
      ]
    };

    mockFs = {
      readdirSync: () => ['1', '2', '3', '4', '5', '6'],
      unlinkSync: jest.fn()
    };

    await createComparisons(mockFs, config);
    expect(createDiffImage.mock.calls.length).toBe(1);
  });
});
