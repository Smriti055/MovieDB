import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-4 text-center">
      <div className="flex justify-center space-x-4 mb-2">
        <a href="#" className="hover:text-yellow-400"><Facebook className="w-5 h-5" /></a>
        <a href="#" className="hover:text-yellow-400"><Twitter className="w-5 h-5" /></a>
        <a href="#" className="hover:text-yellow-400"><Instagram className="w-5 h-5" /></a>
        <a href="#" className="hover:text-yellow-400"><Youtube className="w-5 h-5" /></a>
      </div>
      <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} MovieDB. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
