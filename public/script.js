document.addEventListener('DOMContentLoaded', () => {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            const labels = ['Mercado', 'Concorrência', 'Financeiro'];
            const datasets = data.map(item => ({
                label: item.projectName,
                data: [
                    parseInt(item.dimensionMarket),
                    parseInt(item.dimensionCompetition),
                    parseInt(item.dimensionFinance)
                ],
                borderColor: getRandomColor(),
                backgroundColor: getRandomColor(0.2)
            }));

            const projectNames = [...new Set(data.map(item => item.projectName))];
            const projectFilter = document.getElementById('projectFilter');
            projectNames.forEach(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                projectFilter.appendChild(option);
            });

            const ctxRadar = document.getElementById('radarChart').getContext('2d');
            const radarChart = new Chart(ctxRadar, {
                type: 'radar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    scales: {
                        r: {
                            min: 0,
                            max: 5
                        }
                    }
                }
            });

            const averageScore = calculateAverageScore(data);
            document.getElementById('averageScore').textContent = averageScore.toFixed(2);

            const averageCategoryData = calculateAverageCategoryData(data);
            const ctxBar = document.getElementById('averageCategoryChart').getContext('2d');
            const barChart = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Nota Média por Categoria',
                        data: averageCategoryData,
                        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5
                        }
                    }
                }
            });

            const ctxBCG = document.getElementById('bcgMatrixChart').getContext('2d');
            const bcgMatrixChart = new Chart(ctxBCG, {
                type: 'scatter',
                data: {
                    datasets: calculateBCGData(data)
                },
                options: {
                    scales: {
                        x: {
                            type: 'linear',
                            position: 'bottom',
                            title: {
                                display: true,
                                text: 'Participação Relativa de Mercado'
                            },
                            min: 0,
                            max: 5
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Taxa de Crescimento do Mercado'
                            },
                            min: 0,
                            max: 5
                        }
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.raw.label;
                                }
                            }
                        }
                    }
                }
            });

            projectFilter.addEventListener('change', (event) => {
                const selectedProjects = Array.from(event.target.selectedOptions).map(option => option.value);
                const filteredData = selectedProjects.length > 0 ? data.filter(item => selectedProjects.includes(item.projectName)) : data;
                const filteredDatasets = filteredData.map(item => ({
                    label: item.projectName,
                    data: [
                        parseInt(item.dimensionMarket),
                        parseInt(item.dimensionCompetition),
                        parseInt(item.dimensionFinance)
                    ],
                    borderColor: getRandomColor(),
                    backgroundColor: getRandomColor(0.2)
                }));

                radarChart.data.datasets = filteredDatasets;
                radarChart.update();

                const filteredAverageScore = calculateAverageScore(filteredData);
                document.getElementById('averageScore').textContent = filteredAverageScore.toFixed(2);

                const filteredAverageCategoryData = calculateAverageCategoryData(filteredData);
                barChart.data.datasets[0].data = filteredAverageCategoryData;
                barChart.update();

                bcgMatrixChart.data.datasets = calculateBCGData(filteredData);
                bcgMatrixChart.update();
            });
        });
});

// Função para calcular a nota média geral
function calculateAverageScore(data) {
    const totalScores = data.reduce((acc, item) => {
        return acc + parseInt(item.dimensionMarket) + parseInt(item.dimensionCompetition) + parseInt(item.dimensionFinance);
    }, 0);
    const numberOfScores = data.length * 3;
    return totalScores / numberOfScores;
}

// Função para calcular a nota média por categoria
function calculateAverageCategoryData(data) {
    const totalMarket = data.reduce((acc, item) => acc + parseInt(item.dimensionMarket), 0);
    const totalCompetition = data.reduce((acc, item) => acc + parseInt(item.dimensionCompetition), 0);
    const totalFinance = data.reduce((acc, item) => acc + parseInt(item.dimensionFinance), 0);
    return [
        totalMarket / data.length,
        totalCompetition / data.length,
        totalFinance / data.length
    ];
}

// Função para calcular os dados para a matriz BCG
function calculateBCGData(data) {
    return data.map(item => ({
        label: item.projectName,
        data: [{
            x: parseInt(item.dimensionMarket),
            y: parseInt(item.dimensionCompetition)
        }],
        backgroundColor: getRandomColor(0.6),
        borderColor: getRandomColor(1),
        borderWidth: 1
    }));
}

// Função para gerar cores aleatórias
function getRandomColor(alpha = 1) {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
