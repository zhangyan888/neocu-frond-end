import './PieChart.less';

const { PieChart, Pie, Tooltip, Cell } = Recharts;
class NeoPieChart extends React.Component {

  render() {
    const data02 = [{ name: 'used', value: 10 },
      { name: 'unused', value: 30 }];
    const COLORS = ['#0088FE', '#CCCCCC', '#FFBB28', '#FF8042'];
    return (
      <div className="neo-pieChart">
        <PieChart width={100} height={100}>
          <Pie data={data02} cx={50} cy={50} innerRadius={20} outerRadius={40} fill="#82ca9d">
            {
              data02.map((entry, index) =>
                (<Cell key={index} fill={COLORS[index % COLORS.length]} />))
            }
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    );
  }
}

export default NeoPieChart;
