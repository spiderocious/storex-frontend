import { FileViewer } from "@/components";
import { ROUTES } from "@/configs";
import {
  BucketDetailsPage,
  BucketsPage,
  CreateBucketPage,
  DashboardPage,
  LoginPage,
  SignupPage,
} from "@/pages";
import FileDetailsPage from "@/pages/file/file-details";
import { AuthProvider } from "@/providers";
import { AuthGuard, ProtectedRoute } from "@/routes";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes
} from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-primary">
          <Routes>
            {/* Auth Routes - redirect if already authenticated */}
            <Route
              path={ROUTES.LOGIN}
              element={
                <AuthGuard>
                  <LoginPage />
                </AuthGuard>
              }
            />
            <Route
              path={ROUTES.SIGNUP}
              element={
                <AuthGuard>
                  <SignupPage />
                </AuthGuard>
              }
            />

            {/* Protected App Routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BUCKETS}
              element={
                <ProtectedRoute>
                  <BucketsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BUCKET_CREATE}
              element={
                <ProtectedRoute>
                  <CreateBucketPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.BUCKET_DETAILS}
              element={
                <ProtectedRoute>
                  <BucketDetailsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.FILE_DETAILS}
              element={
                <ProtectedRoute>
                  <FileDetailsPage />
                </ProtectedRoute>
              }
            />

            {/* Public route for file access */}
            <Route
              path="/file/:fileId"
              element={
                <div className="container mx-auto p-8">
                  <FileViewer
                    fileId={window.location.pathname.split("/").pop() || ""}
                    showDetails={true}
                  />
                </div>
              }
            />

            {/* Default route */}
            <Route
              path="/"
              element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-3xl font-bold text-secondary mb-4">
                      File Service App
                    </h1>
                    <p className="text-text-secondary mb-6">
                      A simple file storage and sharing service
                    </p>
                    <div className="space-y-4">
                      <div>
                        <a
                          href="/login"
                          className="text-secondary hover:underline"
                        >
                          Login
                        </a>
                        {" | "}
                        <a
                          href="/signup"
                          className="text-secondary hover:underline"
                        >
                          Sign Up
                        </a>
                        {" | "}
                        <a
                          href="/dashboard"
                          className="text-secondary hover:underline"
                        >
                          Dashboard
                        </a>
                      </div>
                      <p className="text-sm text-text-tertiary">
                        Test FileViewer: /test/YOUR_FILE_ID
                      </p>
                    </div>
                  </div>
                </div>
              }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
