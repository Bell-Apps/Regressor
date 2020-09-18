/* globals expect jest*/

import { execSync } from 'child_process';
import regressorConfig from './updateBaselineRemoteRegressorConfig';
import {
    createRemote,
    deleteRemoteBucket,
    deleteRemoteKeys,
    listRemoteKeys
} from '../../lib/remoteActions';

jest.unmock('aws-sdk');

describe('e2e Tests updating baseline shots remotely', () => {
    beforeEach(async () => {
        //create the bucket on s3 ready for the test to upload the new baseline images
        await createRemote(regressorConfig);
    });

    afterEach(async () => {
        //delete the specific folder from the bucket
        await deleteRemoteKeys('baseline', regressorConfig);
        //delete the empty bucket itself
        await deleteRemoteBucket(regressorConfig);
    });

    it('Uploads the local latest images to the remote baseline folder', async () => {
        // uploads your local latest images to the remote baseline folder
        const stdout = await execSync(
            'node ./lib/bin/run.js update-baseline --browser chrome --remote --config e2eTests/updateBaseline/updateBaselineRemoteRegressorConfig.json'
        ).toString();

        // pipe stdout to Jest console
        console.log(stdout);

        //list the contents of the bucket based on the filter
        const bucketObjects = await listRemoteKeys(
            'baseline/testImage.png',
            regressorConfig
        );
        const firstBucketImage = bucketObjects[0].Key;
        expect(firstBucketImage).toEqual('chrome/baseline/testImage.png');
    });
});