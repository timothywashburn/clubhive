import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

const getChartLabels = (data, view) => {
    switch (view) {
        case 'yearly':
            return data.map(item => item.year);
        case 'last-30-days':
            return data.map(item => new Date(item.date).toLocaleString('en-US', { month: 'short', day: 'numeric' }));
        case 'last-12-months':
        case 'all-time':
        default:
            return data.map(item => new Date(item.date).toLocaleString('en-US', { month: 'short', year: 'numeric' }));
    }
};

const getChartTitle = view => {
    switch (view) {
        case 'all-time':
            return 'All Time Member Count';
        case 'last-12-months':
            return 'Last 12 Months Member Count';
        case 'last-30-days':
            return 'Last 30 Days Member Count';
        case 'yearly':
            return 'Yearly Member Count';
        default:
            return 'Member Count';
    }
};

const MyLineChart = ({ data, view }) => {
    const chartLabels = useMemo(() => getChartLabels(data, view), [data, view]);
    const chartTitle = useMemo(() => getChartTitle(view), [view]);

    const [minY, maxY] = useMemo(() => {
        if (!data || data.length === 0) {
            return [0, 10];
        }
        const values =
            view === 'last-12-months' || view === 'last-30-days'
                ? data.map(item => item.monthlyChange)
                : data.map(item => item.totalMembers);

        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);

        if (minVal === maxVal) {
            return [minVal - 1, maxVal + 1];
        }

        const buffer = (maxVal - minVal) * 0.1;
        return [minVal - buffer, maxVal + buffer];
    }, [data, view]);

    const chartData = {
        labels: chartLabels,
        datasets: [
            {
                label: view === 'last-12-months' || view === 'last-30-days' ? 'Monthly Net Change' : 'Total Members',
                data:
                    view === 'last-12-months' || view === 'last-30-days'
                        ? data.map(item => item.monthlyChange)
                        : data.map(item => item.totalMembers),
                fill: true,
                backgroundColor: 'rgba(247, 178, 135, 1)',
                borderColor: 'rgba(63, 20, 2, 1)',
                tension: 0.1,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: chartTitle,
            },
        },
        scales: {
            y: {
                min: minY,
                max: maxY,
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default MyLineChart;
