import { Alert, Badge, Button, Card, Container, Drawer, Grid, Group, Menu, Paper, Progress, Stack, Table, Text, Title } from '@mantine/core'
import { useMutation, useQuery } from '@tanstack/react-query';
import { AlertCircle, CheckCircle, Copy, Database, FileText, Info, Mail, Share2 } from 'lucide-react';
import { displayNotification } from '../../commonComponents/notifications/displayNotification';
import { getAllDataV4 } from '../../services/common.service';
import { postAPICall } from '../../services/apiCall';

const AnalyseDrawer = ({ rowId, opened, onClose }) => {

    const analyseQuery = useQuery({
        queryKey: ["analyse-data"],
        queryFn: () => getAllDataV4({ source: `report/readiness?id=${rowId}&page=1` }),
        select: (data) => {
            return data?.data[0]
        },
        enabled: !!rowId,
        refetchOnWindowFocus: true,
    })

//     const analyseMutation = useMutation({
//     mutationKey: ["analyse-data"],
//     mutationFn: (body) => postAPICall("analyze", { body, returnObject: true }),
//     onSuccess: (res) => {
//       if (res?.status === "success") {
//         setResultsData(res.data); // store API response
//         setActiveStep(2); // move to Results step
//         setAnalyse({
//           ...analyse,
//           report_Id: res?.data?.id
//         })
//       } else {
//         displayNotification({ message: res?.message || "Analysis failed", variant: "error" });
    //       }
    //     },
    //   });

    const sendMailMutate = useMutation({
        mutationFn: (body) => postAPICall("email/send", { body, returnObject: true }),
        onSuccess: (res) => {
            displayNotification({
                message: res?.message || "Email sent successfully",
                variant: "success",
            });
        },
        onError: (err) => {
            displayNotification({
                message: err || "Failed to send email",
                variant: "error",
            });
        }
    });

    const coverage = analyseQuery.data?.schemaMatch
  ? {
      matched: Object.entries(analyseQuery.data.schemaMatch)
        .filter(([_, status]) => status === "Matched")
        .map(([field]) => field),
      close: Object.entries(analyseQuery.data.schemaMatch)
        .filter(([_, status]) => status === "Close")
        .map(([field]) => field),
      missing: Object.entries(analyseQuery.data.schemaMatch)
        .filter(([_, status]) => status === "Missing")
        .map(([field]) => field),
    }
  : { matched: [], close: [], missing: [] };

    // Prepare rule findings array
    const ruleFindings = analyseQuery.data?.ruleChecks
  ? Object.entries(analyseQuery.data.ruleChecks).map(([rule, status]) => ({
      rule,
      ok: status === "Pass",
      description: `Rule ${rule} check ${status.toLowerCase()}`,
      exampleLine: null,
      expected: null,
      got: null,
      value: null,
    }))
  : [];

    const getReadinessLabel = (text) =>
        text === "High"
            ? { label: "High Readiness", color: "green" }
            : text === "Medium"
                ? { label: "Medium Readiness", color: "yellow" }
                : { label: "Low Readiness", color: "red" };

    const readiness = analyseQuery.data?.readinessLabel
        ? getReadinessLabel(analyseQuery.data.readinessLabel)
        : { label: "N/A", color: "gray" };

    const getScoreColor = (score) => (score >= 80 ? "green" : score >= 60 ? "yellow" : "red");

    return (
        <Drawer opened={opened} onClose={onClose} size="xl" position="right" overlayProps={{ backgroundOpacity: 0.2, blur: 2 }}>
            <Container size="xl">
                <Stack gap="xl">
                    {/* Header */}
                    <Group justify="space-between" align="flex-start">
                        <div>
                            <Title order={2} mb={4}>Analysis Results</Title>
                            <Text c="dimmed" size="sm">Report ID: {analyseQuery?.data?.id}</Text>
                        </div>
                        <Group>
                            {/* <Button variant="default" leftSection={<Download size={18} />} onClick={() => downLoadPdfMutate.mutate()}>
                                Download Report
                            </Button> */}
                            <Menu shadow="md" width={200}>
                                <Menu.Target>
                                    <Button leftSection={<Share2 size={18} />} variant="default">
                                        Share
                                    </Button>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    <Menu.Item
                                        icon={<Copy size={16} />}
                                        onClick={() => {
                                            if (analyseQuery?.data?.downloadUrl) {
                                                navigator.clipboard.writeText(analyseQuery?.data?.downloadUrl);
                                                displayNotification({
                                                    message: "Download link copied to clipboard",
                                                    variant: "success",
                                                });
                                            } else {
                                                displayNotification({
                                                    message: "Download link not available",
                                                    variant: "error",
                                                });
                                            }
                                        }}
                                    >
                                        Copy Link
                                    </Menu.Item>

                                    <Menu.Item
                                        icon={<Mail size={16} />}
                                        onClick={() => {
                                            if (analyseQuery?.data?.downloadUrl) {
                                                sendMailMutate.mutate({
                                                    to: "nitishcooper@gmail.com", 
                                                    subject: "Invoice Analysis Report",
                                                    body: `Please find the Invoice Analysis Report attached below. \n\nReport ID: ${analyseQuery?.data?.id}`,
                                                    attachments: [analyseQuery?.data?.downloadUrl],
                                                });
                                            }
                                        }}
                                    >
                                        Send Mail
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </Group>
                    </Group>

                    {/* Overall Score */}
                    <Paper p="xl" radius="md" style={{ background: 'linear-gradient(135deg, #e7f5ff 0%, #d0ebff 100%)' }} withBorder>
                        <Group justify="space-between" align="center">
                            <div>
                                <Text size="lg" fw={500} mb={4}>Overall Readiness Score</Text>
                                <Badge size="xl" color={readiness.color} variant="filled">
                                    {readiness?.label}
                                </Badge>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <Text size="3.5rem" fw={700} lh={1} c="blue">{analyseQuery?.data?.scores?.overall}</Text>
                                <Text c="dimmed">out of 100</Text>
                            </div>
                        </Group>
                    </Paper>

                    {/* Score Breakdown */}
                    <Grid>
                        {[
                            { key: 'data', label: 'Data Quality', weight: '25%' },
                            { key: 'coverage', label: 'Field Coverage', weight: '35%' },
                            { key: 'rules', label: 'Validation Rules', weight: '30%' },
                            { key: 'posture', label: 'Technical Posture', weight: '10%' }
                        ].map(({ key, label, weight }) => (
                            <Grid.Col key={key} span={{ base: 12, sm: 6 }}>
                                <Card shadow="sm" padding="md" radius="md" withBorder>
                                    <Group justify="space-between" mb="xs">
                                        <Text fw={500}>{label}</Text>
                                        <Text size="sm" c="dimmed">{weight}</Text>
                                    </Group>
                                    <Group gap="sm" align="center">
                                        <Progress
                                            value={analyseQuery?.data?.scores[key]}
                                            color={getScoreColor(analyseQuery?.data?.scores[key])}
                                            style={{ flex: 1 }}
                                            size="lg"
                                        />
                                        <Text fw={700} size="lg" style={{ minWidth: 40, textAlign: 'right' }}>
                                            {analyseQuery?.data?.scores[key]}
                                        </Text>
                                    </Group>
                                </Card>
                            </Grid.Col>
                        ))}
                    </Grid>

                    {/* Data Preview */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group mb="md">
                            <FileText size={20} />
                            <Text fw={600}>Data Preview (First 20 rows)</Text>
                        </Group>
                        <Table striped highlightOnHover withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>ID</Table.Th>
                                    <Table.Th>Date</Table.Th>
                                    <Table.Th>Seller</Table.Th>
                                    <Table.Th>Buyer</Table.Th>
                                    <Table.Th>Total</Table.Th>
                                    <Table.Th>Currency</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {analyseQuery?.data?.dataPreview.map((row, idx) => (
                                    <Table.Tr key={idx}>
                                        {/* ID */}
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Badge size="xs" color="gray" variant="light">text</Badge>
                                                <Text size="sm">{row.inv_id}</Text>
                                            </Group>
                                        </Table.Td>

                                        {/* Date */}
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Badge size="xs" color="blue" variant="light">date</Badge>
                                                <Text size="sm">{row.date}</Text>
                                            </Group>
                                        </Table.Td>

                                        {/* Seller */}
                                        <Table.Td>
                                            <Text size="sm">{row.seller_name}</Text>
                                        </Table.Td>

                                        {/* Buyer */}
                                        <Table.Td>
                                            <Text size="sm">{row.buyer_name}</Text>
                                        </Table.Td>

                                        {/* Total */}
                                        <Table.Td>
                                            <Group gap="xs">
                                                <Badge size="xs" color="green" variant="light">number</Badge>
                                                <Text size="sm">{row.total_incl_vat ? Number(row.total_incl_vat).toFixed(2) : "-"}</Text>
                                            </Group>
                                        </Table.Td>

                                        {/* Currency */}
                                        <Table.Td>
                                            <Text size="sm">{row.currency}</Text>
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Card>

                    {/* Coverage Panel */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group mb="md">
                            <Database size={20} />
                            <Text fw={600}>Field Coverage vs GETS Schema</Text>
                        </Group>
                        <Grid>
                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Stack gap="xs">
                                    <Group gap="xs">
                                        <CheckCircle size={18} color="green" />
                                        <Text fw={500}>Matched ({coverage.matched.length})</Text>
                                    </Group>
                                    {coverage.matched.map((field, idx) => (
                                        <Badge key={idx} color="green" variant="light" fullWidth style={{ justifyContent: 'flex-start' }}>
                                            {field || 'N/A'}
                                        </Badge>
                                    ))}
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Stack gap="xs">
                                    <Group gap="xs">
                                        <Info size={18} color="orange" />
                                        <Text fw={500}>Close Match ({coverage.close.length})</Text>
                                    </Group>
                                    {coverage.close.map((field, idx) => (
                                        <Badge key={idx} color="yellow" variant="light" fullWidth style={{ justifyContent: 'flex-start' }}>
                                            {field || 'N/A'}
                                        </Badge>
                                    ))}
                                </Stack>
                            </Grid.Col>

                            <Grid.Col span={{ base: 12, md: 4 }}>
                                <Stack gap="xs">
                                    <Group gap="xs">
                                        <AlertCircle size={18} color="red" />
                                        <Text fw={500}>Missing ({coverage.missing.length})</Text>
                                    </Group>
                                    {coverage.missing.map((field, idx) => (
                                        <Badge key={idx} color="red" variant="light" fullWidth style={{ justifyContent: 'flex-start' }}>
                                            {field || 'N/A'}
                                        </Badge>
                                    ))}
                                </Stack>
                            </Grid.Col>
                        </Grid>
                    </Card>

                    {/* Rule Findings */}
                    <Card shadow="sm" padding="lg" radius="md" withBorder>
                        <Group mb="md">
                            <CheckCircle size={20} />
                            <Text fw={600}>Validation Rules (5 checks)</Text>
                        </Group>
                        <Stack gap="sm">
                            {ruleFindings.map((finding, idx) => (
                                <Alert
                                    key={idx}
                                    color={finding.ok ? 'green' : 'red'}
                                    icon={finding.ok ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                                    title={
                                        <Group gap="xs">
                                            <Text fw={600}>{finding.rule}</Text>
                                            <Badge color={finding.ok ? 'green' : 'red'} size="sm">
                                                {finding.ok ? 'PASS' : 'FAIL'}
                                            </Badge>
                                        </Group>
                                    }
                                >
                                    <Text size="sm" mb={finding?.ok ? 0 : 'xs'}>{finding?.description}</Text>
                                </Alert>
                            ))}
                        </Stack>
                    </Card>
                </Stack>
            </Container>
        </Drawer>
    )
}

export default AnalyseDrawer