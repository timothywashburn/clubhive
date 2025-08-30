import { ClubhiveConfigModel, ClubhiveConfigDoc } from '@/models/clubhive-config-schema';

export class ConfigManager {
    static async getConfig(): Promise<ClubhiveConfigDoc> {
        const config = await ClubhiveConfigModel.findOne();
        if (!config) throw new Error('No configuration found in database');
        return config;
    }
}
