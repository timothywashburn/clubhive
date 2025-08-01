import React from 'react';
import { Chart as ChartJS, RadialLinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import { PolarArea } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);
Chart.register(...registerables);

const MyPolarChart = ({ data }) => {
    const chartData = {
        labels: data.map(item => item.major),
        datasets: [
            {
                label: 'Major Distribution',
                data: data.map(item => item.count),
                backgroundColor: [
                    'rgba(153, 50, 22, 0.5)',
                    'hsla(23, 84%, 45%, 0.82)',
                    'rgba(168, 94, 29, 0.88)',
                    'rgba(223, 141, 69, 0.85)',
                    'rgba(246, 174, 106, 0.91)',
                    'rgba(244, 231, 133, 0.89)',
                ],
                borderWidth: 1,
                borderColor: 'rgba(63, 20, 2, 1)',
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectratio: false,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: 'Major Distribution',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return <PolarArea data={chartData} options={options} />;
};

export default MyPolarChart;
