"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Send, Loader2 } from "lucide-react";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    number:'',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate submission delay or use mailto
    setTimeout(() => {
      const emailTo = 'sayedewas1234@gmail.com';
      const { name, email, message, number } = formData;
      const emailContent = `Name: ${name}\nEmail: ${email}\nPhone: ${number}\nMessage: ${message}`;
      const mailtoLink = `mailto:${emailTo}?subject=Contact Form Submission&body=${encodeURIComponent(
        emailContent
      )}`;
      window.location.href = mailtoLink;
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="bg-background min-h-screen py-10 lg:py-20 mt-16 md:mt-24">
      <div className="container mx-auto px-6 lg:px-12 max-w-7xl">
        
        {/* Header Section */}
        <div className="text-center mb-16 lg:mb-24">
          <h1 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground mb-6">Get in Touch</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Have a question, a suggestion, or just want to say hello? Our team is here to help you. Reach out through the form below or our direct channels.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Contact Info & Details */}
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl font-heading font-bold text-foreground mb-8">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email</h3>
                    <p className="text-muted-foreground">sayedewas1234@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+20 123 456 7890</p>
                    <p className="text-xs text-muted-foreground mt-1">Sun - Thu: 9:00 AM - 6:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Location</h3>
                    <p className="text-muted-foreground">Cairo, Cairo Governorate, Egypt</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof / Trust Badge */}
            <div className="bg-muted/30 p-8 rounded-2xl border border-border">
              <h3 className="font-heading font-bold text-lg mb-4">Why Reach Out?</h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Avg. response time under 24 hours
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Dedicated customer success managers
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                  Personalized styling assistance
                </li>
              </ul>
            </div>
          </div>

          {/* Form Section */}
          <div className="bg-card border border-border shadow-2xl rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-heading font-bold mb-8">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="h-12 border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="h-12 border-border"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="number">Phone Number</Label>
                <Input
                  id="number"
                  name="number"
                  type="tel"
                  placeholder="+20"
                  value={formData.number}
                  onChange={handleChange}
                  required
                  className="h-12 border-border"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Your Message</Label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none resize-none"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 text-lg font-bold rounded-xl shadow-lg hover:shadow-primary/30 transition-all gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Send size={20} />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-24 rounded-3xl overflow-hidden shadow-md border border-border h-[450px]">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d55251.33663488578!2d31.21726478753403!3d30.05955631666764!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14583fa60b21beeb%3A0x79dfb296e8423bba!2sCairo%2C%20Cairo%20Governorate!5e0!3m2!1sen!2seg!4v1719916770466!5m2!1sen!2seg"
            width="100%"
            height="100%"
            className="border-0"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default Contacts;
