import {
    Container, Stack, Title, Text, Group, Button, Badge, Paper, Card,
    Grid, Table, Alert, Progress,
    Menu
} from "@mantine/core";
import { FileText, Download, CheckCircle, Database, Info, AlertCircle, Share2, Copy, Mail } from "lucide-react";
import useAnalyseStore from "../../store/analyseStore";
import { useMutation } from "@tanstack/react-query";
import { getAllDataV4 } from "../../services/common.service";
import { displayNotification } from "../../commonComponents/notifications/displayNotification";
import exportData from '../../commonComponents/components/export/export';

const ResultsStep = ({ mockResults, mockTableData, getScoreColor, getReadinessLabel, setActiveStep, setUploadComplete }) => {
    const { resetAnalyse, analyse } = useAnalyseStore();

    // Prepare coverage arrays
    const coverage = {
        matched: Object.entries(mockResults.schemaMatch)
            .filter(([_, status]) => status === "Matched")
            .map(([field]) => field),
        close: Object.entries(mockResults.schemaMatch)
            .filter(([_, status]) => status === "Close")
            .map(([field]) => field),
        missing: Object.entries(mockResults.schemaMatch)
            .filter(([_, status]) => status === "Missing")
            .map(([field]) => field),
    };

    // Prepare rule findings array
    const ruleFindings = Object.entries(mockResults.ruleChecks).map(([rule, status]) => ({
        rule,
        ok: status === "Pass",
        description: `Rule ${rule} check ${status.toLowerCase()}`,
        exampleLine: null,
        expected: null,
        got: null,
        value: null,
    }));

    const readiness = mockResults?.readinessLabel
        ? getReadinessLabel(mockResults.readinessLabel)
        : { label: "N/A", color: "gray" };

    const downLoadPdfMutate = useMutation({
        mutationKey: 'download-data',
        mutationFn: () =>
            getAllDataV4({ source: `analyze/download/${analyse?.report_Id}` }),
        onSuccess: (res) => {
            exportData(res?.data?.downloadUrl);
            displayNotification({
                message: res?.data?.message || 'File Downloaded successfully',
                variant: 'success',
            });
        },
        onError: (err) => {
            displayNotification({
                message: err || 'Failed to Download',
                variant: 'error',
            });
        },
    });

    return (
        <Container size="xl">
            <Stack gap="xl">
                {/* Header */}
                <Group justify="space-between" align="flex-start">
                    <div>
                        <Title order={2} mb={4}>Analysis Results</Title>
                        <Text c="dimmed" size="sm">Report ID: {mockResults.id}</Text>
                    </div>
                    <Group>
                        <Button variant="default" leftSection={<Download size={18} />} onClick={() => downLoadPdfMutate.mutate()}>
                            Download Report
                        </Button>
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
                                        if (mockResults.downloadUrl) {
                                            navigator.clipboard.writeText(mockResults.downloadUrl);
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
                                        const subject = encodeURIComponent("Check out this report");
                                        const body = encodeURIComponent(`Here is the link to the report: ${window.location.href}`);
                                        window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
                                {readiness.label}
                            </Badge>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Text size="3.5rem" fw={700} lh={1} c="blue">{mockResults.scores.overall}</Text>
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
                                        value={mockResults.scores[key]}
                                        color={getScoreColor(mockResults.scores[key])}
                                        style={{ flex: 1 }}
                                        size="lg"
                                    />
                                    <Text fw={700} size="lg" style={{ minWidth: 40, textAlign: 'right' }}>
                                        {mockResults.scores[key]}
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
                            {mockTableData.map((row, idx) => (
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

                <Button
                    fullWidth
                    size="lg"
                    variant="default"
                    onClick={() => { setActiveStep(0); setUploadComplete(false); resetAnalyse(); }}
                >
                    Analyze Another File
                </Button>
            </Stack>
        </Container>
    );
};

export default ResultsStep;
