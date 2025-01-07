import React from 'react';
import { ArrowRight, Recycle, Shield, Trophy, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const AboutPage = () => {
    const stats = [
        { number: '50K+', label: 'Parts Recycled', icon: Recycle },
        { number: '10K+', label: 'Happy Customers', icon: Users },
        { number: '99%', label: 'Quality Pass Rate', icon: Shield },
        { number: '5 Years', label: 'Industry Experience', icon: Trophy },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="relative bg-black text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-6">About TechCycle</h1>
                        <p className="text-xl max-w-2xl mx-auto">
                            Giving technology a second life while making quality computer parts accessible to everyone.
                        </p>
                    </div>
                </div>
            </div>

            {/* Mission Statement */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        At TechCycle, we're committed to reducing e-waste while providing reliable, tested, and
                        affordable computer parts to tech enthusiasts, businesses, and DIY builders.
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                                <CardContent className="pt-6">
                                    <IconComponent className="w-12 h-12 text-black-600 mx-auto mb-4" />
                                    <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Process Section */}
                <div className="mb-16">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Process</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-black-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-black-600">1</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Careful Sourcing</h3>
                            <p className="text-gray-600">
                                We partner with reliable suppliers and businesses to source quality used computer parts.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-black-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-black-600">2</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Rigorous Testing</h3>
                            <p className="text-gray-600">
                                Every part undergoes comprehensive testing to ensure reliability and performance.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-black-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-black-600">3</span>
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
                            <p className="text-gray-600">
                                We back every product with a warranty and excellent customer support.
                            </p>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-black rounded-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-100 mb-4">Ready to Build Sustainably?</h2>
                    <p className="text-gray-200 mb-6">
                        Join thousands of satisfied customers who choose TechCycle for reliable refurbished parts.
                    </p>
                    <button className="inline-flex items-center px-6 py-3 bg-black-600 text-white font-semibold rounded-lg hover:bg-black-700 transition-colors">
                        Browse Our Inventory
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;