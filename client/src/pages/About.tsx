import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Users, Award, Lightbulb } from 'lucide-react';

const About: React.FC = () => {
  const { t } = useTranslation();

  const values = [
    {
      icon: Heart,
      title: t('about.values.quality'),
      description: 'We are committed to serving the highest quality coffee and food, using only the finest ingredients.'
    },
    {
      icon: Users,
      title: t('about.values.passion'),
      description: 'Our passion for coffee drives everything we do, from bean selection to brewing techniques.'
    },
    {
      icon: Award,
      title: t('about.values.community'),
      description: 'We believe in building strong relationships with our customers and local community.'
    },
    {
      icon: Lightbulb,
      title: t('about.values.innovation'),
      description: 'We continuously innovate to bring you unique and exciting coffee experiences.'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="bg-background-secondary py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {t('about.title')}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('about.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {t('about.description')}
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Founded in 2020, our coffee shop has been serving the community with passion and dedication. 
                We started with a simple dream: to create a space where people could enjoy exceptional coffee 
                in a warm, welcoming atmosphere.
              </p>
              <p className="text-lg text-gray-600">
                Today, we continue to uphold our founding principles while embracing innovation and growth. 
                Our commitment to quality, community, and sustainability remains at the heart of everything we do.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Coffee Shop Interior"
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary-color rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind our coffee shop
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Ahmed Al-Rashid',
                role: 'Founder & CEO',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Passionate about creating exceptional coffee experiences.'
              },
              {
                name: 'Sarah Johnson',
                role: 'Head Barista',
                image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Expert in coffee brewing and customer service.'
              },
              {
                name: 'Mohammed Hassan',
                role: 'Kitchen Manager',
                image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
                description: 'Ensuring every dish meets our high standards.'
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-primary-color font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary-color text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">3+</div>
              <div className="text-lg opacity-90">Years of Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-lg opacity-90">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Menu Items</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Quality Guaranteed</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;