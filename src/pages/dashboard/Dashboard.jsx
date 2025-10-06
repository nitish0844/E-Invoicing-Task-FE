import { Grid, Text, Card } from "@mantine/core";
import Body from "../../commonComponents/body/Body";
import Header from "../../commonComponents/layout/Header";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { getAllDataV4 } from "../../services/common.service";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

const Dashboard = () => {

  const fetchChartQuery = useQuery({
    queryKey: ["charts"],
    queryFn: () => getAllDataV4({
      source: "dashboard/charts",
    }),
  })

  return (
    <>
      <Header title={"Welcome,"} />
      <Body>
        <Grid gutter="lg" mt={20}>
          {/* Pie Chart: Countries */}
          <Grid.Col span={6}>
            <Card shadow="sm" padding="lg">
              <Text fw={500} mb="sm">
                Reports by Country
              </Text>
              <PieChart width={300} height={300}>
                {fetchChartQuery?.data?.data?.countryCounts?.length > 0 && (
                  <Pie
                    data={fetchChartQuery.data.data.countryCounts}
                    dataKey="count"
                    nameKey="country"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {fetchChartQuery.data.data.countryCounts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                )}
                <Tooltip />
                <Legend />
              </PieChart>

            </Card>
          </Grid.Col>

          {/* Bar Chart: Readiness */}
          <Grid.Col span={6}>
            <Card shadow="sm" padding="lg">
              <Text fw={500} mb="sm">
                Readiness Levels
              </Text>
              <BarChart width={400} height={300} data={fetchChartQuery?.data?.data?.readinessCounts || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="readinessLabel" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#82ca9d" />
              </BarChart>
            </Card>
          </Grid.Col>
        </Grid>
      </Body>
    </>
  );
};

export default Dashboard;
