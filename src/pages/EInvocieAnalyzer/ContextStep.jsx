import { Container, Stack, Title, Text, Card, Select, TextInput, Divider, Checkbox, Button } from "@mantine/core";

const ContextStep = ({ country, setCountry, erp, setErp, technicalReadiness, setTechnicalReadiness, setActiveStep }) => {
    return (
        <Container size="md">
            <Stack gap="xl">
                <div>
                    <Title order={2} mb="xs">Invoice Context</Title>
                    <Text c="dimmed" size="sm">Help us understand your invoice data for better analysis</Text>
                </div>

                <Card shadow="sm" padding="lg" radius="md" withBorder>
                    <Stack gap="md">
                        <Select
                            label="Country / Region"
                            placeholder="Select country"
                            data={[
                                { value: 'UAE (United Arab Emirates)', label: 'UAE (United Arab Emirates)' },
                                { value: 'KSA (Saudi Arabia)', label: 'KSA (Saudi Arabia)' },
                                { value: 'Malaysia', label: 'Malaysia' },
                                { value: 'other', label: 'Other' }
                            ]}
                            value={country}
                            onChange={setCountry}
                            required
                        />

                        <TextInput
                            label="ERP System"
                            placeholder="e.g., SAP, Oracle, QuickBooks"
                            value={erp}
                            onChange={(e) => setErp(e.target.value)}
                            required
                        />

                        <Divider />

                        <div>
                            <Text fw={500} size="sm" mb="sm">Technical Readiness (optional)</Text>
                            <Stack gap="xs">
                                <Checkbox
                                    label="Webhook support available"
                                    checked={technicalReadiness.webhook}
                                    onChange={(e) =>
                                        setTechnicalReadiness((tr) => ({ ...tr, webhook: e.currentTarget.checked }))
                                    }
                                />
                                <Checkbox
                                    label="Sandbox environment configured"
                                    checked={technicalReadiness.sandbox}
                                    onChange={(e) =>
                                        setTechnicalReadiness((tr) => ({ ...tr, sandbox: e.currentTarget.checked }))
                                    }
                                />
                                <Checkbox
                                    label="Automatic retry mechanism"
                                    checked={technicalReadiness.retry}
                                    onChange={(e) =>
                                        setTechnicalReadiness((tr) => ({ ...tr, retry: e.currentTarget.checked }))
                                    }
                                />
                            </Stack>
                        </div>
                    </Stack>
                </Card>

                <Button fullWidth size="lg" onClick={() => setActiveStep(1)} disabled={!country || !erp}>
                    Continue to Upload
                </Button>
            </Stack>
        </Container>
    );
};

export default ContextStep;
