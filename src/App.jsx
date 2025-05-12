import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import MainContent from './components/MainContent';
import AllTools from './components/AllTools';
import Footer from './components/Footer';
import AddPageNumber from './pages/AddPageNumber';
import PDFCompressor from './pages/PDFCompressor';
import DeletePDFPages from './pages/Delete';
import PDFToJPG from './pages/PDFToJPG';
import PDFToJSON from './pages/PDFToJSON';
import PDFToPNG from './pages/PDFToPNG';
import PDFToTIFF from './pages/PDFToTIFF';
import PDFToTXT from './pages/PDFToTXT';
import PDFToWord from './pages/PDFToWORD';
import EditPDF from './pages/EditPDF';
import PDFToExcel from './pages/PDFToExcel';
import PDFToPPT from './pages/PDFToPPT';
import RotatePDF from './pages/Rotate';
import SplitPDF from './pages/Split';
import WatermarkPDF from './pages/Watermark';
import WordToPDF from './pages/WordToPDF';
import ExcelToPDF from './pages/ExcelToPDF';
import PPTToPDF from './pages/PPTToPDF';
import JPGToPDF from './pages/JPGToPDF';
import PNGToPDF from './pages/PNGToPDF';
import TextToPDF from './pages/TextToPDF';
import TIFFToPDF from './pages/TiffToPDF';
import AddPassword from './pages/AddPassword';
import UnlockPDF from './pages/UnlockPDF';
import MergePDF from './pages/MergePDF';

// Scroll restoration component
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes except when coming from back/forward navigation
    if (!window.history.state?.usr?.preserveScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={
            <>
              <MainContent />
            </>
          } />
          <Route path="/add-page-number" element={<AddPageNumber />} />
          <Route path="/compress-pdf" element={<PDFCompressor />} />
          <Route path="/delete-pdf-page" element={<DeletePDFPages />} />
          <Route path="/pdf-to-jpg" element={<PDFToJPG />} />
          <Route path="/pdf-to-json" element={<PDFToJSON />} />
          <Route path="/pdf-to-png" element={<PDFToPNG />} />
          <Route path="/pdf-to-tiff" element={<PDFToTIFF />} />
          <Route path="/pdf-to-txt" element={<PDFToTXT />} />
          <Route path="/pdf-to-word" element={<PDFToWord />} />
          <Route path="/edit-pdf" element={<EditPDF />} />
          <Route path="/pdf-to-excel" element={<PDFToExcel />} />
          <Route path="/pdf-to-ppt" element={<PDFToPPT />} />
          <Route path="/rotate-pdf" element={<RotatePDF />} />
          <Route path="/split-pdf" element={<SplitPDF />} />
          <Route path="/watermark-pdf" element={<WatermarkPDF />} />
          <Route path="/word-to-pdf" element={<WordToPDF />} />
          <Route path="/excel-to-pdf" element={<ExcelToPDF />} />
          <Route path="/ppt-to-pdf" element={<PPTToPDF />} />
          <Route path="/jpg-to-pdf" element={<JPGToPDF />} />
          <Route path="/png-to-pdf" element={<PNGToPDF />} />
          <Route path="/text-to-pdf" element={<TextToPDF />} />
          <Route path="/tiff-to-pdf" element={<TIFFToPDF />} />
          <Route path="/add-password" element={<AddPassword />} />
          <Route path="/unlock-pdf" element={<UnlockPDF/>} />
          <Route path="/merge-pdf" element={<MergePDF/>} />
        </Routes>
        <AllTools />
        <Footer />
      </div>
    </Router>
  );
}

export default App;