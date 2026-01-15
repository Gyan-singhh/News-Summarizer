import { Link } from "react-router-dom";
import Logo from "./Logo";

function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Logo h={7} w={7} />
             
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted source for verified news and AI-powered analysis.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Links</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <Link to="/" className="block hover:text-white">
                Home
              </Link>
              <Link to="/about" className="block hover:text-white">
                About
              </Link>
              <Link to="/chatbot" className="block hover:text-white">
                Verify News
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Features</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <div>News Verification</div>
              <div>AI Analysis</div>
              <div>Multiple Sources</div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-500 text-sm">
          © 2024 NewsOrbit. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
