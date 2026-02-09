
import React from 'react';
import { BarChart3, Linkedin, Mail, MapPin, Phone, MessageSquare, Calendar } from 'lucide-react';
import { BOOKING_LINK } from '../constants';

const Footer: React.FC = () => {
  const phoneNumber = "9851312671";
  const email = "ashish@shresthaconsolidated.com";
  const whatsappUrl = `https://wa.me/977${phoneNumber}`;

  return (
    <footer className="bg-white border-t border-slate-200 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-slate-900 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 block leading-none">SHRESTHA</span>
                <span className="text-[9px] uppercase tracking-[0.2em] text-slate-500 font-semibold">Consolidated</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Specializing in operational control and financial clarity for educational consultancies in Nepal. We bridge the gap between historical accounting and future growth.
            </p>
            <div className="flex gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-green-600 hover:text-white transition-all" title="Chat on WhatsApp">
                <MessageSquare className="h-4 w-4" />
              </a>
              <a href={`mailto:${email}`} className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white transition-all" title="Email Us">
                <Mail className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-blue-700 hover:text-white transition-all" title="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Services</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#pricing" className="hover:text-indigo-600">Process Audit</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600">Lead Verification</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600">Commission Tracking</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600">Staff Efficiency</a></li>
              <li><a href="#pricing" className="hover:text-indigo-600">Fractional CFO Services</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Consult</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <a href={BOOKING_LINK} target="_blank" rel="noopener noreferrer" className="font-bold text-indigo-600 hover:underline">Book 30 Min Call</a>
              </li>
              <li><a href="#about" className="hover:text-indigo-600">About Ashish</a></li>
              <li><a href="#" className="hover:text-indigo-600">Success Stories</a></li>
              <li><a href="#" className="hover:text-indigo-600">Privacy Policy</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                <span>Kathmandu, Nepal</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                <a href={`tel:+977${phoneNumber}`} className="hover:text-indigo-600 transition-colors">+977 {phoneNumber}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-indigo-600 transition-colors break-all">{email}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500">
          <p>© 2026 Shrestha Consolidated Holdings. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900">Legal</a>
            <a href="#" className="hover:text-slate-900">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
