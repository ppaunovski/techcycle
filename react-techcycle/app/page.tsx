"use client";
import React from 'react';
import { useState, useEffect } from 'react';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Cpu, HardDrive, MonitorUp, Microchip, Star, TrendingUp, BadgeDollarSign } from 'lucide-react';
import DisplayImage from "@/components/custom/img-display";
import Link from "next/link";

const LandingPage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    
    fetchFeaturedProducts();
    fetchBestSellers();
    fetchRecentlyViewed();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products/featured');
      const data = await response.json();
      setFeaturedProducts(data);
    } catch (error) {
      console.error('Error fetching featured products:', error);
    }
  };

  const fetchBestSellers = async () => {
    try {
      const response = await fetch('/api/products/bestsellers');
      const data = await response.json();
      setBestSellers(data);
    } catch (error) {
      console.error('Error fetching best sellers:', error);
    }
  };

  const fetchRecentlyViewed = async () => {
    try {
      const response = await fetch('/api/products/recently-viewed');
      const data = await response.json();
      setRecentlyViewed(data);
    } catch (error) {
      console.error('Error fetching recently viewed:', error);
    }
  };

  const ProductCard = ({ product }) => (
      <Link href={'/products/'+product.id}>
        <Card key={product.id} className="flex flex-col">
          <CardHeader>
            {/*<img*/}
            {/*    src={product.imageUrl || '/api/placeholder/300/200'}*/}
            {/*    alt={product.name}*/}
            {/*    className="w-full h-48 object-cover rounded-t-lg"*/}
            {/*/>*/}
            <DisplayImage className="w-full h-48 object-cover rounded-t-lg"  imageBytes={product.imageUrl}></DisplayImage>
          </CardHeader>
          <CardContent className="flex-grow">
            <CardTitle className="mb-2">{product.name}</CardTitle>
            <p className="text-gray-600 text-sm mb-2">{product.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {product.tags?.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                      {tag}
                    </span>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <span className="text-xl font-bold text-green-600">${product.price}</span>
            <Button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
              Add To Cart
            </Button>
          </CardFooter>
        </Card>
      </Link>
  );

  const CategoryCard = ({ icon: Icon, name, description }) => (
      <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <Icon className="h-12 w-12 mb-2" />
            <h3 className="font-medium text-lg">{name}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </CardContent>
      </Card>
  );

  return (
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative rounded-xl overflow-hidden mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-12 text-white">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold mb-4">
                Quality Used Computer Parts at Affordable Prices
              </h1>
              <p className="text-xl mb-6">
                Discover tested and verified components backed by our 30-day warranty
              </p>
              <Button size="lg" variant="secondary">
                Browse Products
              </Button>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <CategoryCard
                icon={Cpu}
                name="Processors"
                description="Intel & AMD CPUs"
            />
            <CategoryCard
                icon={Microchip}
                name="Graphics Cards"
                description="NVIDIA & AMD GPUs"
            />
            <CategoryCard
                icon={HardDrive}
                name="Storage"
                description="SSDs & Hard Drives"
            />
            <CategoryCard
                icon={MonitorUp}
                name="Displays"
                description="Monitors & Screens"
            />
          </div>
        </section>

        {/* Featured Products */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Button variant="outline">View All</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Value Propositions */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Star className="h-8 w-8 mb-2 text-yellow-500" />
                  <h3 className="font-medium mb-2">Quality Assured</h3>
                  <p className="text-sm text-gray-500">Every item thoroughly tested and verified</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <BadgeDollarSign className="h-8 w-8 mb-2 text-green-500" />
                  <h3 className="font-medium mb-2">Best Prices</h3>
                  <p className="text-sm text-gray-500">Competitive prices on all products</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <TrendingUp className="h-8 w-8 mb-2 text-blue-500" />
                  <h3 className="font-medium mb-2">30-Day Warranty</h3>
                  <p className="text-sm text-gray-500">All products covered by our warranty</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Best Sellers */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {recentlyViewed.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </section>
        )}
      </div>
  );
};

export default LandingPage;