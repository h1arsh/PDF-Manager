import { Link } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollUtils';

const toolCategories = [
    {
      title: "PDF Organizing Tools",
      tools: [
        {
          title: "Edit PDF files",
          description: "Edit PDF online Without converting Your Document",
          icon: "bx bxs-file-pdf",
          href: "/edit-pdf"
        },
        {
          title: "Merge PDF Files",
          description: "Combine Multiple documents to make a single PDF with ease",
          icon: "bx bxs-file-pdf",
          href: "/merge-pdf"
        },
        {
          title: "Split PDF Files",
          description: "Split and Extract PDF information into multiple files.",
          icon: "bx bxs-file-pdf",
          href: "/split-pdf"
        },
        {
          title: "Compress PDF files",
          description: "Easily compress large PDF files in just a few clicks.",
          icon: "bx bxs-file-pdf",
          href: "/compress-pdf"
        },
        {
          title: "Rotate PDF Files",
          description: "Rotate One Several or all Pages of PDFs.",
          icon: "bx bxs-file-pdf",
          href: "/rotate-pdf"
        },
        {
          title: "Add Page Numbers",
          description: "Easily insert page numbers into your PDF online",
          icon: "bx bxs-file-pdf",
          href: "/add-page-number"
        },
        {
          title: "Add Watermark",
          description: "Add Watermark Image or text to Your PDF Document",
          icon: "bx bxs-file-pdf",
          href: "/watermark-pdf"
        },
        {
          title: "Delete PDF Pages",
          description: "Remove PDF pages online and save result as new PDF",
          icon: "bx bxs-file-pdf",
          href: "/delete-pdf-page"
        },
        // Add all other tools from your dropdown
      ]
    },
    {
      title: "PDF Converting Tools",
      tools: [
        {
          title: "PDF To Word Convert",
          description: "Transform PDF files into editable Word documents with ease",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-word"
        },
        {
          title: "PDF To Excel Convert",
          description: "Transform PDF files into editable Excel Sheet with ease.",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-excel"
        },
        {
          title: "PDF to PPT Convert ",
          description: "Transform PDF files into editable Powerpoint PPT with ease.",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-ppt"
        },
        {
          title: "PDF to JPG Convert ",
          description: "Convert each PDF page into a JPG and extract JPG.",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-jpg"
        },
        {
          title: "PDF to PNG Convert",
          description: "Convert each PDF page into a PNG and extract PNG.",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-png"
        },
        {
          title: "PDF to JSON Convert",
          description: "Convert PDF to JSON in seconds ans with ease.",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-json"
        },
        {
          title: "PDF to TIFF Convert",
          description: "Convert PDF to TIFF in seconds ans with ease",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-tiff"
        },
        {
          title: "PDF to Text Convert",
          description: "Convert PDF to Text in seconds ans with ease",
          icon: "bx bxs-file-pdf",
          href: "/pdf-to-txt"
        },
        // Add all other converting tools
      ]
    },
    {
      title: "PDF Creating Tools",
      tools: [
        {
          title: "Word To PDF Convert",
          description: "Transform editable Word documents into PDF with ease.",
          icon: "bx bxs-file-pdf",
          href: "/word-to-pdf"
        },
        {
          title: "Excel To PDF Convert",
          description: "Transform editable Excel Sheets into PDF with ease.",
          icon: "bx bxs-file-pdf",
          href: "/excel-to-pdf"
        },
        {
          title: "PPT To PDF Convert ",
          description: "Transform editable Powerpoint PPT into PDF files with ease.",
          icon: "bx bxs-file-pdf",
          href: "/ppt-to-pdf"
        },
        {
          title: "JPG To PDF Convert ",
          description: "Convert JPG to PDF effortlessly with our online tool.",
          icon: "bx bxs-file-pdf",
          href: "/jpg-to-pdf"
        },
        {
          title: "PNG To PDF Convert",
          description: "Transform JPG to PNG quickly with our free tool.",
          icon: "bx bxs-file-pdf",
          href: "/png-to-pdf"
        },
        {
          title: "TIFF to PDF Convert ",
          description: "Convert TIFF to PDF in seconds ans with ease",
          icon: "bx bxs-file-pdf",
          href: "/tiff-to-pdf"
        },
        {
          title: "Text To PDF Convert ",
          description: "Convert text To PDF in seconds ans with ease",
          icon: "bx bxs-file-pdf",
          href: "/text-to-pdf"
        },
        // Add all other converting tools
      ]
    },
    {
      title: "Sign and Security Tools",
      tools: [
        {
          title: "Unlock PDF ",
          description: "Remove Password, Protection and permission from your PDF",
          icon: "bx bxs-file-pdf",
          href: "/unlock-pdf"
        },
        {
          title: "Protect PDF",
          description: "Add Password, authentication and Encrypt your PDF Files",
          icon: "bx bxs-file-pdf",
          href: "/add-password"
        },
        // Add all other converting tools
      ]
    },
    // Add other categories
  ];

// Array of different color classes for hover effects
const colorClasses = [
  {
    shadow: 'hover:shadow-red-500/50',
    text: 'group-hover:text-red-600',
    icon: 'text-red-500'
  },
  {
    shadow: 'hover:shadow-blue-500/50',
    text: 'group-hover:text-blue-600',
    icon: 'text-blue-500'
  },
  {
    shadow: 'hover:shadow-green-500/50',
    text: 'group-hover:text-green-600',
    icon: 'text-green-500'
  },
  {
    shadow: 'hover:shadow-yellow-500/50',
    text: 'group-hover:text-yellow-600',
    icon: 'text-yellow-500'
  },
  {
    shadow: 'hover:shadow-purple-500/50',
    text: 'group-hover:text-purple-600',
    icon: 'text-purple-500'
  },
  {
    shadow: 'hover:shadow-pink-500/50',
    text: 'group-hover:text-pink-600',
    icon: 'text-pink-500'
  },
  {
    shadow: 'hover:shadow-indigo-500/50',
    text: 'group-hover:text-indigo-600',
    icon: 'text-indigo-500'
  },
  {
    shadow: 'hover:shadow-orange-500/50',
    text: 'group-hover:text-orange-600',
    icon: 'text-orange-500'
  },
  {
    shadow: 'hover:shadow-teal-500/50',
    text: 'group-hover:text-teal-600',
    icon: 'text-teal-500'
  },
];

const AllTools = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            One platform, <span className="text-blue-600">multiple tools</span>
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500">
            All the PDF tools you need, in one place
          </p>
        </div>

        {toolCategories.map((category, index) => (
          <div key={index} className="mb-16">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 pb-2 border-b border-gray-200">
              {category.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map((tool, toolIndex) => {
                const colorIndex = toolIndex % colorClasses.length;
                const { shadow, text, icon } = colorClasses[colorIndex];
                
                return (
                  <Link 
                    key={toolIndex} 
                    to={tool.href}
                    className={`group block bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow ${shadow}`}
                    onClick={scrollToTop}
                  >
                    <div className="p-6">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 rounded-lg p-3`}>
                          <i className={`${tool.icon} text-2xl mr-3 ${icon} mt-1 flex-shrink-0`}></i>
                        </div>
                        <div className="ml-4">
                          <h4 className={`text-lg font-medium text-gray-900 ${text} transition-colors`}>
                            {tool.title}
                            <i className={`fas fa-chevron-right ml-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity ${icon}`}></i>
                          </h4>
                          <p className="mt-1 text-sm text-gray-500">{tool.description}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AllTools;