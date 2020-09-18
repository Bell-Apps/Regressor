import logger from './logger';

function isValid(missingConfigFields) {
    if (missingConfigFields.length > 0) {
        logger.info(
            'configValidator',
            `❗️Please add missing mandatory fields to your config: \n${missingConfigFields.toString()}`
        );
        return false;
    }

    return true;
}

function isRemoteConfigValid(config) {
    const missingConfigFields = ['remoteBucketName', 'remoteRegion'].filter(
        field => !config[field]
    );

    if (!process.env.AWS_SECRET_ACCESS_KEY)
        missingConfigFields.push('env variable: AWS_SECRET_ACCESS_KEY');
    if (!process.env.AWS_ACCESS_KEY_ID)
        missingConfigFields.push('env variable: AWS_ACCESS_KEY_ID');

    return isValid(missingConfigFields);
}

function isLocalConfigValid(config) {
    const missingConfigFields = [
        'gridUrl',
        'baseline',
        'latest',
        'generatedDiffs',
        'report',
        'scenarios',
        'browser'
    ].filter(field => !config[field]);

    return isValid(missingConfigFields);
}

const validateConfig = (config, isRemote) =>
    new Promise(resolve => {
        let isRemoteConfigCorrect = true;

        if (isRemote) {
            isRemoteConfigCorrect = isRemoteConfigValid(config);
        }

        if (isLocalConfigValid(config) && isRemoteConfigCorrect) {
            logger.info('configValidator', 'Config validated ✅');
            resolve();
        } else {
            logger.info('config Validator', 'Exiting Regressor');
            process.exitCode = 1;
            process.exit();
        }
    });

export default validateConfig;
export { isLocalConfigValid, isRemoteConfigValid };
