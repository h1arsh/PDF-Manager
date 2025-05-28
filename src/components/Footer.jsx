import { Link } from 'react-router-dom';
import { scrollToTop } from '../utils/scrollUtils';
import { useState } from 'react';

const Footer = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    setIsLoading(false);
    
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const footerLinks = [
    {
      title: "PDF Organizing Tools",
      links: [
        { name: "Edit PDF files", href: "/edit-pdf" },
        { name: "Merge PDF Files", href: "/merge-pdf" },
        { name: "Split PDF Files", href: "/split-pdf" },
        { name: "Compress PDF files", href: "/compress-pdf" },
        { name: "Rotate PDF Files", href: "/rotate-pdf" },
        { name: "Add Page Numbers", href: "/add-page-number" },
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
      <div className="pt-16 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Contact Us Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Have Questions? Contact Us</h2>
            <div className="bg-gradient-to-r from-gray-800 to-gray-700 p-8 rounded-xl shadow-lg">
              {isSubmitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                    <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">Message Sent Successfully</h3>
                  <p className="text-gray-300">Thank you for contacting us. We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Your Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Your Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="block w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="How can we help you?"
                    ></textarea>
                  </div>
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`px-8 py-3 rounded-lg font-medium text-white transition-all ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 shadow-lg hover:shadow-xl'}`}
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Message'
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 text-center mt-4">
                    By submitting this form, you agree to our <a href="#" className="text-blue-400 hover:underline">privacy policy</a>.
                  </p>
                </form>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700 my-8"></div>

          {/* Tools Links Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-8 text-center">PDF Tools</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {footerLinks.map((section, index) => (
                <div key={index}>
                  <h3 className="text-lg font-semibold mb-4 text-blue-300">{section.title}</h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link 
                          to={link.href} 
                          className="text-gray-400 hover:text-white transition-colors flex items-center"
                          onClick={scrollToTop}
                        >
                          <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                          </svg>
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className=" text-center border-t border-gray-800 pt-8">
            
                <p className="text-gray-400">
                  &copy; {new Date().getFullYear()} ArcPDF. All rights reserved.
                </p>
                <p className="text-gray-500 text-sm mt-1">
                  Designed with ❤️ by <a href="#" className="text-blue-400 hover:underline">ArcPDF Team</a>
                </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;