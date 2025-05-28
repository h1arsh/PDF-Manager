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
    {
      title: "AI Tools",
      tools: [
        {
          title: "Summarize PDF ",
          description: "Summarize the content of your PDF",
          icon: "bx bxs-file-pdf",
          href: "/summarize-pdf"
        },
        // Add all other converting tools
      ]
    },
    // Add other categories
  ];

// Array of different color classes for hover effects
const colorClasses = [
  {
    bg: 'from-red-100 to-red-50',
    shadow: 'hover:shadow-red-200',
    text: 'group-hover:text-red-800',
    icon: 'text-red-500',
    border: 'border-red-200'
  },
  {
    bg: 'from-blue-100 to-blue-50',
    shadow: 'hover:shadow-blue-200',
    text: 'group-hover:text-blue-800',
    icon: 'text-blue-500',
    border: 'border-blue-200'
  },
  {
    bg: 'from-green-100 to-green-50',
    shadow: 'hover:shadow-green-200',
    text: 'group-hover:text-green-800',
    icon: 'text-green-500',
    border: 'border-green-200'
  },
  {
    bg: 'from-amber-100 to-amber-50',
    shadow: 'hover:shadow-amber-200',
    text: 'group-hover:text-amber-800',
    icon: 'text-amber-500',
    border: 'border-amber-200'
  },
  {
    bg: 'from-purple-100 to-purple-50',
    shadow: 'hover:shadow-purple-200',
    text: 'group-hover:text-purple-800',
    icon: 'text-purple-500',
    border: 'border-purple-200'
  },
  {
    bg: 'from-pink-100 to-pink-50',
    shadow: 'hover:shadow-pink-200',
    text: 'group-hover:text-pink-800',
    icon: 'text-pink-500',
    border: 'border-pink-200'
  },
  {
    bg: 'from-indigo-100 to-indigo-50',
    shadow: 'hover:shadow-indigo-200',
    text: 'group-hover:text-indigo-800',
    icon: 'text-indigo-500',
    border: 'border-indigo-200'
  },
  {
    bg: 'from-orange-100 to-orange-50',
    shadow: 'hover:shadow-orange-200',
    text: 'group-hover:text-orange-800',
    icon: 'text-orange-500',
    border: 'border-orange-200'
  },
  {
    bg: 'from-teal-100 to-teal-50',
    shadow: 'hover:shadow-teal-200',
    text: 'group-hover:text-teal-800',
    icon: 'text-teal-500',
    border: 'border-teal-200'
  },
];


const AllTools = () => {
  return (
    <section className="bg-gradient-to-b from-cyan-200 to-blue-200 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl sm:font-extrabold">
            One platform, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">multiple tools</span>
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600 font-medium">
            All the PDF tools you need, in one place
          </p>
        </div>

        {toolCategories.map((category, index) => (
          <div key={index} className="mb-16">
            <div className="flex items-center mb-6 pb-2 border-b border-gray-200">
              <i className={`${category.icon} text-2xl mr-3 text-blue-500`}></i>
              <h3 className="text-2xl font-semibold text-gray-800">
                {category.title}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.tools.map((tool, toolIndex) => {
                const colorIndex = toolIndex % colorClasses.length;
                const { bg, shadow, text, icon, border } = colorClasses[colorIndex];
                
                return (
                  <Link 
                    key={toolIndex} 
                    to={tool.href}
                    className={`group block bg-white/90 backdrop-blur-sm rounded-xl border ${border} overflow-hidden hover:shadow-lg transition-all duration-300 ${shadow} hover:-translate-y-1`}
                    onClick={scrollToTop}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    <div className="relative p-6">
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 rounded-lg p-3 bg-white/80 backdrop-blur-sm shadow-sm ${border}`}>
                          <i className={`${tool.icon} text-2xl ${icon}`}></i>
                        </div>
                        <div className="ml-4">
                          <h4 className={`text-lg font-semibold text-gray-800 ${text} transition-colors duration-300`}>
                            {tool.title}
                            <i className={`fas fa-arrow-right ml-2 text-xs opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-1 transition-all duration-300 ${icon}`}></i>
                          </h4>
                          <p className="mt-1 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300 font-medium">
                            {tool.description}
                          </p>
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