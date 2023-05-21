import 'dotenv/config';
import { ExpoConfig } from '@expo/config';

module.exports = ({ config }: { config: ExpoConfig }) => {
    return {
        ...config,
        extra: {
            eas: {
                projectId: process.env.EAS_PROJECT_ID,
            },
        },
    };
};
