import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/configs';
import { FileViewer } from '@/components';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-primary">
        <Routes>
          {/* Temporary route to test FileViewer */}
          <Route 
            path="/test/:fileId" 
            element={
              <div className="container mx-auto p-8">
                <h1 className="text-2xl font-bold text-secondary mb-6">File Viewer Test</h1>
                <FileViewer 
                  fileId={window.location.pathname.split('/').pop() || ''} 
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
                  <div className="space-y-2">
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
  );
}

export default App;