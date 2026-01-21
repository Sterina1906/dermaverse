export default function Footer() {
  return (
    <footer className="mt-16 py-8 border-t border-gray-200">
      <div className="text-center text-sm text-white-500">
        <p>
          This tool is for educational purposes only and is not a substitute for professional medical advice, 
          diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider 
          with any questions you may have regarding a medical condition.
        </p>
        <p className="mt-2">
          &copy; {new Date().getFullYear()} Skin Lesion Detector. Not for medical use.
        </p>
      </div>
    </footer>
  );
}