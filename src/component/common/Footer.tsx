import { BookOpen, Mail, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-medium mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              BookManager App
            </h3>
            <p className="text-gray-300 text-sm">
              A comprehensive solution for managing your book collection. Add,
              edit, and organize your books with ease.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                <a href="/dashboard" className="hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/books" className="hover:text-white">
                  Books
                </a>
              </li>
              <li>
                <a href="/profile" className="hover:text-white">
                  My Profile
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <div className="text-gray-300 text-sm space-y-2">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                <a
                  href="mailto:info@bookmanager.com"
                  className="hover:text-white"
                >
                  info@bookmanager.com
                </a>
              </div>
              <div className="flex items-center">
                <Github className="h-4 w-4 mr-2" />
                <a
                  href="https://github.com/bookmanager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  github.com/bookmanager
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} BookManager. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
