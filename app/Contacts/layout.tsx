// pages/Contacts/layout.tsx

import { ReactNode } from 'react';
import Navbar from '../components/Navbar'; // Adjust the import based on your file structure
import { Metadata } from 'next';

interface ContactsLayoutProps {
  children: ReactNode;
}
export const metadata: Metadata = {
    title: "contacts",
    description: "Generated by create next app",
  };
const ContactsLayout = ({ children }: ContactsLayoutProps) => {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    
    </div>
  );
};

export default ContactsLayout;