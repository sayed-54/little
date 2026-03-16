// pages/Contacts/layout.tsx

import { ReactNode } from 'react';
import { Metadata } from 'next';

interface ContactsLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
    title: "Contact Us - Little Locals",
    description: "Get in touch with us for any inquiries or support.",
  };

const ContactsLayout = ({ children }: ContactsLayoutProps) => {
  return (
    <div className="contacts-layout">
      {children}
    </div>
  );
};

export default ContactsLayout;
