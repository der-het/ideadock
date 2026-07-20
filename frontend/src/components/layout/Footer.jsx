import { Brain, ArrowUpRight, Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand block */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div className="bg-black text-white p-1.5 rounded-lg">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-base font-extrabold tracking-tight text-gray-900">
                StartupConnect
              </span>
            </Link>
            <p className="text-gray-500 text-sm max-w-sm mb-6 leading-relaxed">
              Fostering synergies between deep-tech pioneers, skilled architects, and visionary builders. Elevating collaborations to drive real-world transformation.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all" title="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 text-gray-400 hover:text-black hover:bg-gray-50 rounded-lg transition-all" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 font-mono">
              Venture Directory
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/browse?category=AI" className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 group">
                  Neural & AI <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Green" className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 group">
                  Green Energy <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/browse?category=Biotech" className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 group">
                  Synthetic Biology <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/browse" className="text-gray-500 hover:text-black transition-colors flex items-center gap-1 group">
                  Full Catalog <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h5 className="text-xs font-bold uppercase tracking-widest text-gray-900 mb-4 font-mono">
              Join Ecosystem
            </h5>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/register" className="text-gray-500 hover:text-black transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-500 hover:text-black transition-colors">
                  Login Access
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black transition-colors">
                  Security Guild
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-500 hover:text-black transition-colors">
                  Terms of Syndicate
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400 font-medium font-mono">
            &copy; {currentYear} StartupConnect. Fully integrated client build.
          </p>
          <p className="text-xs text-gray-400 flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for visionaries worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}
