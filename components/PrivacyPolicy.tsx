import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-white text-black p-8 md:p-16 font-sans">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Privacy Policy for Shrestha Consolidated</h1>
                <p className="mb-8 text-sm text-gray-600">Last Updated: February 2026</p>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">1. Introduction</h2>
                    <p className="leading-relaxed">
                        Shrestha Consolidated ("we," "us") is committed to protecting the operational and financial data of our clients. This policy explains how we handle your information.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">2. Data Collection</h2>
                    <p className="leading-relaxed">
                        We collect personal information (Name, Email, Phone) and Operational Data (CRM logs, Financial records, Staff activity) strictly for the purpose of conducting audits.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">3. Data Usage & Non-Disclosure</h2>
                    <p className="leading-relaxed">
                        Client Data is Isolated. We do not share, sell, or distribute your student leads or financial data to third parties. Your data is used solely to generate Audit Reports and Financial Strategy for your specific business.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">4. Data Security</h2>
                    <p className="leading-relaxed">
                        We employ industry-standard encryption and security protocols to ensure your financial insights remain confidential.
                    </p>
                </section>

                <section className="mb-8">
                    <h2 className="text-xl font-bold mb-4">5. Contact</h2>
                    <p className="leading-relaxed">
                        For privacy concerns, contact us at: <a href="mailto:shresthaconsolidated@gmail.com" className="text-blue-600 underline">shresthaconsolidated@gmail.com</a>
                    </p>
                </section>

                <div className="mt-12 pt-8 border-t border-gray-200">
                    <a href="/#/" className="text-blue-600 underline hover:text-blue-800">
                        &larr; Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
