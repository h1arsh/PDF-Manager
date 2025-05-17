import { useState, useRef, useEffect } from 'react';
import 'boxicons/css/boxicons.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Link } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollUtils';

const Navbar = () => {

  // Close dropdown when clicking outside
  const [showDropdown, setShowDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const hoverTimer = useRef(null);

  // Close dropdown when clicking outside or when mobile menu opens
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimer.current) clearTimeout(hoverTimer.current);
    };
  }, []);

   // Mobile menu toggle effect
  useEffect(() => {
    if (!mobileMenuOpen) {
      setShowDropdown(false);
    }
  }, [mobileMenuOpen]);

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowDropdown(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => {
      setShowDropdown(false);
    }, 100); // 100ms delay before closing
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
  };

  const handleDropdownMouseLeave = () => {
    handleMouseLeave();
  };



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
          icon: "fas fa-sort-numeric-up",
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

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img 
              src="https://i.ibb.co/8mT8MT1/pdf-verse-removebg-preview.png" 
              className="h-40 w-auto" 
              alt="PDF Verse Logo"
            />
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button 
                ref={buttonRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors relative group"
              >
                <i className="fas fa-border-all mr-2"></i>
                Tools <i className={`bx bx-chevron-down ml-1 transition-transform ${showDropdown ? 'rotate-180' : ''}`}></i>
                {/* Animated underline */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </button>

              {/* Tools Dropdown */}
              {showDropdown && (
                <div 
                  ref={dropdownRef}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                  className="absolute right-0 mt-0 w-[800px] bg-white shadow-xl rounded-b-lg border border-gray-200 overflow-hidden animate-fadeIn"
                >
                  <div className="grid grid-cols-3 divide-x divide-gray-100">
                    {/* Left Section - About */}
                    <div className="p-6 bg-gray-50">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">About PDF Verse</h3>
                      <p className="text-gray-600 text-sm mb-4">
                        PDF Verse is an easy-to-use web-based PDF editing tool that allows users to merge, split, compress, and convert PDFs into various formats.
                      </p>
                      
                    </div>
                    
                    {/* Right Section - Tools */}
                    <div className="col-span-2 p-6 overflow-y-auto max-h-[70vh]">
                      {toolCategories.map((category, index) => (
                        <div key={index} className="mb-8">
                          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                            {category.title}
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            {category.tools.map((tool, toolIndex) => (
                              <Link 
                                key={toolIndex} 
                                to={tool.href}
                                className="flex items-start p-3 hover:bg-gray-50 rounded-lg transition-colors group"
                                onClick={() => 
                                 { scrollToTop();
                                  setShowDropdown(false);}}
                              >
                                <i className={`${tool.icon} text-2xl mr-3 text-red-500 mt-1 flex-shrink-0`}></i>
                                <div>
                                  <h5 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {tool.title}
                                  </h5>
                                  <p className="text-gray-500 text-sm mt-1">{tool.description}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Other Navigation Links */}
            {/* ... (keep your other nav links) */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-500 hover:text-gray-900 focus:outline-none"
            >
              <i className={`bx ${mobileMenuOpen ? 'bx-x' : 'bx-menu'} text-3xl`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4 px-4 animate-slideDown">
          <div className="space-y-2">
            <button 
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-full flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="flex items-center">
                <i className="fas fa-border-all mr-2"></i>
                Tools
              </span>
              <i className={`bx bx-chevron-down ${showDropdown ? 'rotate-180' : ''}`}></i>
            </button>

            {/* Mobile Dropdown Content */}
            {showDropdown && (
              <div className="pl-4 mt-2 space-y-4 animate-fadeIn">
                {toolCategories.map((category, index) => (
                  <div key={index} className="mb-6">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
                      {category.title}
                    </h4>
                    <div className="space-y-2">
                      {category.tools.map((tool, toolIndex) => (
                        <Link
                          key={toolIndex}
                          to={tool.href}
                          className="flex items-center px-3 py-3 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setShowDropdown(false);
                          }}
                        >
                          <i className={`${tool.icon} text-xl mr-3 text-red-500`}></i>
                          <div>
                            <div className="font-medium">{tool.title}</div>
                            <div className="text-xs text-gray-500 mt-1">{tool.description}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
                
              </div>
            )}

            
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;