'use client';

import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from 'lucide-react';

export default function CustomerFooter() {
  return (
    <footer className="bg-[#0A2540] text-white mt-16">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold">FixMate</h2>

            <p className="mt-4 text-slate-300 leading-7">
              Your trusted home service partner for electrical,
              plumbing, appliance repair, AC servicing, carpentry,
              painting and much more.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">
              Quick Links
            </h3>

            <ul className="space-y-3 text-slate-300">
              <li className="hover:text-white cursor-pointer">
                Home
              </li>

              <li className="hover:text-white cursor-pointer">
                Book Service
              </li>

              <li className="hover:text-white cursor-pointer">
                My Requests
              </li>

              <li className="hover:text-white cursor-pointer">
                Service History
              </li>

              <li className="hover:text-white cursor-pointer">
                Profile
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">
              Contact
            </h3>

            <div className="space-y-4 text-slate-300">
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>+91 98765 43210</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} />
                <span>support@fixmate.com</span>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={18} className="mt-1" />
                <span>
                  Mangalore,
                  <br />
                  Karnataka, India
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-5">
              Follow Us
            </h3>

            <div className="flex gap-4">
              <button className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white hover:text-[#0A2540] transition flex items-center justify-center">
                <Facebook size={20} />
              </button>

              <button className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white hover:text-[#0A2540] transition flex items-center justify-center">
                <Instagram size={20} />
              </button>

              <button className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white hover:text-[#0A2540] transition flex items-center justify-center">
                <Linkedin size={20} />
              </button>

              <button className="w-11 h-11 rounded-xl bg-white/10 hover:bg-white hover:text-[#0A2540] transition flex items-center justify-center">
                <Twitter size={20} />
              </button>
            </div>

            <p className="mt-6 text-slate-300 text-sm leading-6">
              Available 24×7 for emergency repair services and
              customer support.
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © {new Date().getFullYear()} FixMate. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-slate-400">
            <span className="hover:text-white cursor-pointer">
              Privacy Policy
            </span>

            <span className="hover:text-white cursor-pointer">
              Terms & Conditions
            </span>

            <span className="hover:text-white cursor-pointer">
              Help Center
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
