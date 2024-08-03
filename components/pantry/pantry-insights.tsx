import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export function PantryInsights({ items }: { items: { name: string, owner: string, quantity: number }[]}) {
  const pieData = {
    labels: items.map((item) => item.name),
    datasets: [
      {
        data: items.map((item) => item.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
      }
    ]
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { 
        position: 'right' as const
      },
      title: {
        display: true,
        text: 'Pantry Item Distribution'
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pantry Insights</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-8">
        <div className="w-full flex justify-center">
          <div className="w-3/5">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}