import { useState, useEffect } from "react";
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface GasolineDataProps {
    Date: string;
    Price: number;
}

function GasolineData() {
    const [miles95Data, setMiles95Data] = useState<GasolineDataProps[]>([]);
    const [dieselData, setDieselData] = useState<GasolineDataProps[]>([]);

    const fetchGasolineData = async (API_URL: string) => {
        const response = await fetch(API_URL);
        const data = await response.json();
        return data.map((item: { Date: string, Price: string }) => ({
            Date: item.Date,
            Price: parseFloat(item.Price)
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            const miles95 = await fetchGasolineData('https://magsapi.onrender.com/api/miles95');
            setMiles95Data(miles95);

            const diesel = await fetchGasolineData('https://magsapi.onrender.com/api/diesel');
            setDieselData(diesel);
        };

        fetchData();
    }, []);


    const chartOptions: ApexOptions = {
        chart: {
            type: 'line',
        },
        xaxis: {
            categories: miles95Data.map(data => data.Date),
        },
        yaxis: {
            title: {
                text: 'Price',
            },
        },
    };

    const series = [
        {
            name: 'Miles 95',
            data: miles95Data.map(data => data.Price),
        },
        {
            name: 'Diesel',
            data: dieselData.map(data => data.Price),
        }
    ];

    return (
        <div>
            <h1>Gasoline Data</h1>
            <ReactApexChart
                options={chartOptions}
                series={series}
                height={500}
                width={1000}
            />
        </div>
    );
}

export default GasolineData;