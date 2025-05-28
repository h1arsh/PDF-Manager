import { useEffect, useState } from 'react';
import { restoreScrollPosition } from '../utils/scrollUtils';
import { useDropzone } from 'react-dropzone';

const MergePDF = () => {
  useEffect(() => {
    restoreScrollPosition();
  }, []);

  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'application/pdf': [] },
    multiple: true,
    onDrop: (acceptedFiles) => {
      setFiles((prevFiles) => {
        const fileNames = new Set(prevFiles.map(file => file.name));
        const newFiles = acceptedFiles.filter(file => !fileNames.has(file.name));
        return [...prevFiles, ...newFiles];
      });
    },
  });

  const handleMerge = async () => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('files', file));

      const response = await fetch('http://localhost:5000/api/pdf/merge', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Merge failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'merged.pdf';
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error merging PDFs:', error);
    }
  };

  return (
    <div className="bg-gradient-to-t from-cyan-200 to-blue-200 mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Merge PDF
          </span>
        </h1>
        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
          Combine multiple files into a single PDF quickly and easily
        </p>
      </div>

      <div className="mt-12 max-w-3xl mx-auto">
        <div
          {...getRootProps()}
          className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
        >
          <input {...getInputProps()} />
          <div className="flex justify-center mb-4">
            <i className="bx bxs-cloud-upload text-5xl text-blue-500"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Drag and drop your files here</h3>
          <p className="mt-1 text-sm text-gray-500">or click to browse files (PDF only)</p>
        </div>

        {files.length > 0 && (
          <ul className="mt-8 space-y-3">
            {files.map((file, index) => (
              <li key={index} className="bg-white shadow-sm rounded-lg p-4 flex items-center">
                <i className="bx bxs-file-pdf text-3xl text-red-500 mr-4"></i>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex justify-center">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-10 rounded-lg transition-colors text-lg"
            onClick={handleMerge}
            disabled={files.length < 2}
          >
            Merge PDFs Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default MergePDF;
