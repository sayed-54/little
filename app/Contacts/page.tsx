// pages/Contacts/index.tsx

"use client";

import React, { useState } from 'react';


const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    number:'',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const emailTo = 'sayedewas1234@gmail.com';
    const { name, email, message } = formData;
    const emailContent = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
    const mailtoLink = `mailto:${emailTo}?subject=Contact Form Submission&body=${encodeURIComponent(
      emailContent
    )}`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col mt-24">
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <h1 className="text-5xl font-bold mb-8">Contact Us</h1>
        <div className="bg-white shadow-md rounded-lg w-full max-w-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-medium text-gray-700">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-lg font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="number" className="block text-lg font-medium text-gray-700">phone </label>
              <input
                type="tel"
                id="number"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
                
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-lg font-medium text-gray-700">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <button
                type="submit"
                className="w-full py-3 bg-primary text-white font-semibold rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-gray-200 py-16 px-4">
        <div className="w-full max-w-3xl">
          <h2 className="text-3xl font-semibold mb-4">Our Location</h2>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55251.33663488578!2d31.21726478753403!3d30.05955631666764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1719916770466!5m2!1sen!2seg"
            width="100%"
            height="400"
            className="border-0 rounded-md shadow-md"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
     
    </div>
  );
};

export default Contacts;
