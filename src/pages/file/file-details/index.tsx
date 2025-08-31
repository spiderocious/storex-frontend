import { useParams } from "react-router-dom";
import { FileViewer } from "../../../components";

const FileDetailsPage = () => {
  const params = useParams();
  const fileId = params.fileId || "";

  return (
    <div className="min-h-screen bg-primary">
      <div className="container mx-auto p-8">
        <h1 className="text-2xl font-bold text-secondary mb-6">File Details</h1>
        <FileViewer fileId={fileId} showDetails={true} />
      </div>
    </div>
  );
};

export default FileDetailsPage;
