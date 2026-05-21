'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { CONTACT } from '@/lib/constants';

export default function FloatingButton() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.2, type: 'spring', stiffness: 220, damping: 18 }}
      className="fixed bottom-6 right-6 z-50"
    >
      <a
        href={CONTACT.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Kontaktiraj nas na WhatsApp-u"
        className="flex items-center justify-center w-14 h-14 rounded-full bg-gold hover:bg-gold-dark text-white shadow-lg transition-colors duration-300"
      >
        <MessageCircle size={22} strokeWidth={1.8} />
      </a>
    </motion.div>
  );
}
