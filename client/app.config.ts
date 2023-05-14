import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

module.exports = ({ config }: { config: ExpoConfig }) => {
    return {
        ...config,
        hooks: {
            postPublish: [
                {
                    file: 'sentry-expo/upload-sourcemaps',
                    config: {
                        organization: process.env.SENTRY_ORG,
                        project: process.env.SENTRY_PROJECT,
                    },
                },
            ],
        },
        extra: {
            eas: {
                projectId: process.env.EAS_PROJECT_ID,
            },
        },
    };
};
