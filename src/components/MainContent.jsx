import { useEffect } from 'react';
import { restoreScrollPosition } from '../utils/scrollUtils';

const MainContent = () => {

   useEffect(() => {
    // Only restore scroll position if we're coming from a back/forward navigation
    restoreScrollPosition();
  }, []);
  
  return (
    <div className="bg-gradient-to-t from-cyan-200 to-blue-200 mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
            ArcPDF
          </span>
        </h1>
        <p className="mt-3 text-xl text-black max-w-2xl mx-auto">
          Combine multiple files into a single PDF quickly and easily
        </p>
      </div>

      {/* File Upload Area */}
      <div className=" mt-12 max-w-3xl mx-auto">
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center hover:border-blue-400 transition-colors">
          <div className="flex justify-center mb-4">
            <i className="bx bxs-cloud-upload text-5xl text-blue-500"></i>
          </div>
          <h3 className="text-lg font-medium text-gray-900">Drag and drop your files here</h3>
          <p className="mt-1 text-sm text-gray-500">or click to browse files</p>
          <button className="mt-6 bg-blue-600 hover:bg-blue-800 text-white font-medium py-2 px-6 rounded-lg transition-colors">
            Select Files
          </button>
        </div>

        {/* Uploaded Files List */}
        <ul className="mt-8 space-y-3">
          {/* Example file item */}
          <li className="bg-white shadow-sm rounded-lg p-4 flex items-center">
            <i className="bx bxs-file-pdf text-3xl text-red-500 mr-4"></i>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">document.pdf</p>
              <p className="text-xs text-gray-500">2.4 MB</p>
            </div>
            <button className="text-gray-400 hover:text-red-500">
              <i className="bx bx-x text-xl"></i>
            </button>
          </li>
        </ul>

        
      </div>
    </div>
  );
};

export default MainContent;