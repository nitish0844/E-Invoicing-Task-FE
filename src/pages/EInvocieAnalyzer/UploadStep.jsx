import {
    Container,
    Stack,
    Title,
    Text,
    Card,
    Paper,
    FileButton,
    Divider,
    Textarea,
    Button,
    Group,
} from "@mantine/core";
import { Upload, CheckCircle } from "lucide-react";
import { displayNotification } from "../../commonComponents/notifications/displayNotification";
import { useRef } from "react";

const UploadStep = ({
    file,
    setFile,
    uploadComplete,
    setUploadComplete,
    uploadDataMutation,
    jsonData,
    setJsonData,
    country,
    erp,
    setActiveStep,
    analyseMutation,
    analyse,
    technicalReadiness
}) => {
    const resetRef = useRef(null); // ✅ used to reset file input

    const handleUpload = (selectedFile) => {
        if (selectedFile) {
            setFile(selectedFile);

            const formData = new FormData();
            formData.append("file", selectedFile);

            uploadDataMutation.mutate(formData, {
                onSuccess: () => {
                    setUploadComplete(true);
                    resetRef.current?.(); // ✅ reset after success
                },
                onError: () => {
                    resetRef.current?.(); // ✅ reset after failure (so same file can be re-selected)
                },
            });
            return;
        }

        if (jsonData.trim()) {
            if (!country || !erp) {
                displayNotification({
                    message: "Country and ERP are required for inline data upload",
                    variant: "error",
                });
                return;
            }

            const body = { text: jsonData };
            uploadDataMutation.mutate(body, {
                onSuccess: () => {
                    setUploadComplete(true);
                    resetRef.current?.(); // ✅ reset after success
                },
                onError: () => {
                    resetRef.current?.(); // ✅ reset after failure (so same file can be re-selected)
                },
            });
            return;
        }

        displayNotification({
            message: "Please provide a file or paste your data",
            variant: "error",
        });
    };

    return (
        <Container size="md">
            <Stack gap="xl">
                <div>
                    <Title order={2} mb="xs">
                        Upload Invoice Data
                    </Title>
                    <Text c="dimmed" size="sm">
                        Upload CSV or JSON file (max 200 rows, 5MB limit)
                    </Text>
                </div>

                <Card shadow="sm" padding="xl" radius="md" withBorder>
                    {!uploadComplete ? (
                        <Stack align="center" gap="md">
                            <Paper
                                p="xl"
                                radius="md"
                                withBorder
                                style={{
                                    borderStyle: "dashed",
                                    borderWidth: 2,
                                    width: "100%",
                                    cursor: "pointer",
                                }}
                            >
                                <Stack align="center" gap="md">
                                    <Upload size={48} color="gray" />
                                    <div style={{ textAlign: "center" }}>
                                        <Text fw={500} mb={4}>
                                            Drop your file here or click to browse
                                        </Text>
                                        <Text size="sm" c="dimmed">
                                            Supports .csv and .json formats
                                        </Text>
                                    </div>
                                    <FileButton
                                        resetRef={resetRef}
                                        onChange={(selectedFile) => {
                                            handleUpload(selectedFile);
                                        }}
                                        accept=".csv,.json"
                                    >
                                        {(props) => <Button {...props} loading={uploadDataMutation.isPending}>Select File</Button>}
                                    </FileButton>
                                </Stack>
                            </Paper>
                        </Stack>
                    ) : (
                        <Stack align="center" gap="md">
                            <CheckCircle size={48} color="green" />
                            <div style={{ textAlign: "center" }}>
                                <Text fw={500} mb={4}>
                                    {file?.name} uploaded
                                </Text>
                                <Text size="sm" c="dimmed" mb="md">
                                    Upload completed successfully
                                </Text>
                            </div>
                        </Stack>
                    )}

                    <Divider my="xl" label="OR" labelPosition="center" />

                    <div>
                        <Text size="sm" fw={500} mb="xs">
                            Paste data directly:
                        </Text>
                        <Textarea
                            placeholder="Paste CSV or JSON content here..."
                            minRows={4}
                            value={jsonData}
                            onChange={(e) => setJsonData(e.target.value)}
                        />
                        <Button mt="md" fullWidth onClick={() => handleUpload()} disabled={!jsonData} loading={uploadDataMutation.isPending}>
                            Upload Pasted Data
                        </Button>
                    </div>
                </Card>

                <Group grow>
                    <Button variant="default" size="lg" onClick={() => setActiveStep(0)}>
                        Back
                    </Button>
                    <Button
                        size="lg"
                        loading={analyseMutation.isPending}
                        disabled={!uploadComplete}
                        onClick={() => {
                            if (!analyse?.uploadId) {
                                displayNotification({
                                    message: "Please upload data before analyzing",
                                    variant: "error",
                                });
                                return;
                            }

                            analyseMutation.mutate(
                                {
                                    uploadId: analyse.uploadId,
                                    country,
                                    technicalReadiness,
                                    erp,
                                },
                                {
                                    onSuccess: (res) => {
                                        displayNotification({
                                            message: res?.data?.message || "Data Analyzed successfully",
                                            variant: "success",
                                        });
                                        setActiveStep(2);
                                    },
                                    onError: (err) => {
                                        displayNotification({
                                            message: err?.message || "Failed to analyze data",
                                            variant: "error",
                                        });
                                    },
                                }
                            );
                        }}
                    >
                        {analyseMutation.isPending ? "Analyzing..." : "Analyze Data"}
                    </Button>

                </Group>
            </Stack>
        </Container>
    );
};

export default UploadStep;
