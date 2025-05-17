import { Link } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollUtils';

const Footer = () => {
  const footerLinks = [
    {
      title: "PDF Organizing Tools",
      links: [
        { name: "Edit PDF files", href: "/edit-pdf" },
        { name: "Merge PDF Files", href: "/merge-pdf" },
        { name: "Split PDF Files", href: "/split-pdf" },
        { name: "Compress PDF files", href: "/compress-pdf" },
        { name: "Rotate PDF Files", href: "/rotate-pdf" },
        { name: "Add Page Numbers", href: "/add-page-number" }, // Updated link
        { name: "Add Watermark", href: "/watermark-pdf" },
        { name: "Delete PDF Pages", href: "/delete-pdf-page" }
      ]
    },
    {
      title: "PDF Converting Tools",
      links: [
        { name: "PDF To Word Convert", href: "/pdf-to-word" },
        { name: "PDF To Excel Convert", href: "/pdf-to-excel" },
        { name: "PDF to PPT Convert", href: "/pdf-to-ppt" },
        { name: "PDF to JPG Convert", href: "/pdf-to-jpg" },
        { name: "PDF to PNG Convert", href: "/pdf-to-png" },
        { name: "PDF to JSON Convert", href: "/pdf-to-json" },
        { name: "PDF to TIFF Convert", href: "/pdf-to-tiff" },
        { name: "PDF to Text Convert", href: "/pdf-to-txt" }
      ]
    },
    {
      title: "PDF Creating Tools",
      links: [
        { name: "Word To PDF Convert", href: "/word-to-pdf" },
        { name: "Excel To PDF Convert", href: "/excel-to-pdf" },
        { name: "PPT To PDF Convert", href: "/ppt-to-pdf" },
        { name: "JPG To PDF Convert", href: "/jpg-to-pdf" },
        { name: "PNG To PDF Convert", href: "/png-to-pdf" },
        { name: "TIFF to PDF Convert", href: "/tiff-to-pdf" },
        { name: "Text To PDF Convert", href: "/text-to-pdf" }
      ]
    },
    {
      title: "Sign and Security Tools",
      links: [
        { name: "Unlock PDF", href: "/unlock-pdf" },
        { name: "Protect PDF", href: "/add-password" },
      ]
    },
    {
      title: "AI Tools",
      links: [
        { name: "Summarize PDF", href: "/summarize-pdf" },
      ]
    },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full">
        <path fill="#1f2937" fillOpacity="1" d="M0,288L80,256C160,224,320,160,480,149.3C640,139,800,181,960,186.7C1120,192,1280,160,1360,144L1440,128L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
      </svg>

      <div className="pt-12 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Newsletter */}
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold mb-4">Stay updated with our newsletter</h2>
            <div className="max-w-md mx-auto flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg font-medium transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {footerLinks.map((section, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link 
                        to={link.href} 
                        className="text-gray-400 hover:text-white transition-colors"
                         onClick={scrollToTop}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-center md:text-right">
                <p className="text-gray-400">
                  &copy; {new Date().getFullYear()} PDF Verse. All rights reserved.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Designed by <a href="#" className="hover:text-white">Your Name</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;