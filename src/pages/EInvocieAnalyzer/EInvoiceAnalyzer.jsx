import { useEffect, useState } from "react";
import { Stepper, Container } from "@mantine/core";
import ContextStep from "./ContextStep";
import UploadStep from "./UploadStep";
import ResultsStep from "./ResultsStep";
import { useMutation } from "@tanstack/react-query";
import { bulkUploadAPI } from "../../services/common.service";
import useAnalyseStore from "../../store/analyseStore";
import { displayNotification } from "../../commonComponents/notifications/displayNotification";
import { postAPICall } from "../../services/apiCall";

const EInvoiceAnalyzer = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [file, setFile] = useState(null);
  const [country, setCountry] = useState("");
  const [erp, setErp] = useState("");
  const [technicalReadiness, setTechnicalReadiness] = useState({ webhook: false, sandbox: false, retry: false });
  const [jsonData, setJsonData] = useState("");

  const { analyse, setAnalyse, resetAnalyse } = useAnalyseStore();
  const [resultsData, setResultsData] = useState(null);
  // const [pagination, setPagination] = useState({ page: 1, search: '' })

  useEffect(() => {
    if (Object.keys(analyse || {}).length > 0) {
      resetAnalyse();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const uploadDataMutation = useMutation({
    mutationKey: "upload-data",
    mutationFn: (body) => bulkUploadAPI({ body, returnErrorObject: true }),
    onSuccess: (e) => setAnalyse({
      ...analyse,
      fileName: file?.name,
      uploadId: e?.uploadId,
      country,
      erp,
      technicalReadiness,
    }),
    onError: (e) => displayNotification({ message: e?.message || "Upload failed", variant: "error" }),
  });

  const analyseMutation = useMutation({
    mutationKey: ["analyse-data"],
    mutationFn: (body) => postAPICall("analyze", { body, returnObject: true }),
    onSuccess: (res) => {
      if (res?.status === "success") {
        setResultsData(res.data); // store API response
        setActiveStep(2); // move to Results step
        setAnalyse({
          ...analyse,
          report_Id: res?.data?.id
        })
      } else {
        displayNotification({ message: res?.message || "Analysis failed", variant: "error" });
      }
    },
  });

  const getScoreColor = (score) => (score >= 80 ? "green" : score >= 60 ? "yellow" : "red");

  const getReadinessLabel = (text) =>
    text === "High"
      ? { label: "High Readiness", color: "green" }
      : text === "Medium"
        ? { label: "Medium Readiness", color: "yellow" }
        : { label: "Low Readiness", color: "red" };

  return (
    <Container size="xl" py="xl">
      <Stepper active={activeStep} mb="xl">
        <Stepper.Step label="Context" description="Setup">
          <ContextStep
            country={country}
            setCountry={setCountry}
            erp={erp}
            setErp={setErp}
            technicalReadiness={technicalReadiness}
            setTechnicalReadiness={setTechnicalReadiness}
            setActiveStep={setActiveStep}
          />
        </Stepper.Step>

        <Stepper.Step label="Upload" description="Data">
          <UploadStep
            file={file}
            setFile={setFile}
            uploadComplete={uploadComplete}
            setUploadComplete={setUploadComplete}
            uploadDataMutation={uploadDataMutation}
            jsonData={jsonData}
            setJsonData={setJsonData}
            country={country}
            erp={erp}
            setActiveStep={setActiveStep}
            analyseMutation={analyseMutation}
            technicalReadiness={technicalReadiness}
            analyse={analyse}
          />
        </Stepper.Step>

        <Stepper.Step label="Results" description="Analysis">
          <ResultsStep
            mockResults={resultsData} // <-- use API data
            mockTableData={resultsData?.dataPreview || []} // <-- table data
            getScoreColor={getScoreColor}
            getReadinessLabel={getReadinessLabel}
            setActiveStep={setActiveStep}
            setUploadComplete={setUploadComplete}
          />
        </Stepper.Step>
      </Stepper>
    </Container>
  );
};

export default EInvoiceAnalyzer;
