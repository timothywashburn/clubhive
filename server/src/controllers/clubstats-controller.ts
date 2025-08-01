import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { getClubChartData } from '../services/clubStatsServices';
import { ErrorCode } from '@clubhive/shared';

export const getClubChartsData = async (req: Request, res: Response) => {
    try {
        const { clubId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(clubId)) {
            return res.status(400).json({ message: 'Invalid club ID format' });
        }

        const chartData = await getClubChartData(new mongoose.Types.ObjectId(clubId));

        res.json(chartData);
    } catch (error) {
        console.error('Error in getClubChartsData controller:', ErrorCode);
        res.status(500).json({ message: 'Server error fetching club chart data' });
    }
};
