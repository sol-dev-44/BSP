import React from 'react';
import { Wind, Anchor, Award, Navigation, Shield, Heart, Star } from 'lucide-react';

type CrewMemberProps = {
  name: string;
  experience: number;
  specialties: string[];
  heroicDeeds: string[];
  image: string;
};

const CrewMember: React.FC<CrewMemberProps> = ({ 
  name, 
  experience, 
  specialties, 
  heroicDeeds,
  image
}) => {
  return (
    <div className="bg-blue-50 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={image} 
          alt={`${name} - Parasail Expert`} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-900 to-transparent p-4">
          <h2 className="text-2xl font-bold text-white">{name}</h2>
          <div className="flex items-center text-yellow-300">
            <Star className="w-4 h-4 mr-1" />
            <Star className="w-4 h-4 mr-1" />
            <Star className="w-4 h-4 mr-1" />
            <Star className="w-4 h-4 mr-1" />
            <Star className="w-4 h-4" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center mb-4">
          <Anchor className="text-blue-600 mr-2" />
          <p className="text-gray-700">
            <span className="font-semibold">{experience} years</span> of parasailing expertise
          </p>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Award className="text-blue-600 mr-2" />
          Specialties
        </h3>
        <ul className="mb-4 space-y-1">
          {specialties.map((specialty, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-gray-700">{specialty}</span>
            </li>
          ))}
        </ul>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center">
          <Shield className="text-blue-600 mr-2" />
          Acts of Heroism
        </h3>
        <ul className="space-y-2">
          {heroicDeeds.map((deed, index) => (
            <li key={index} className="flex items-start">
              <span className="text-blue-600 mr-2">•</span>
              <span className="text-gray-700">{deed}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ParasailCrew = () => {
  return (
    <div className="bg-gradient-to-br from-blue-500 to-cyan-600 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Meet Our Legendary Parasail Crew</h1>
          <div className="flex items-center justify-center text-white">
            <Wind className="w-6 h-6 mr-2" />
            <p className="text-xl">Masters of the Sky & Sea</p>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CrewMember 
            name="Alan Seabreeze"
            experience={12}
            specialties={[
              "High-altitude parasailing maneuvers",
              "Weather pattern prediction",
              "Emergency water landings",
              "First aid and water rescue"
            ]}
            heroicDeeds={[
              "Rescued a family of four when their boat capsized during sudden squall",
              "Guided a parasailer safely through unexpected storm clouds",
              "Developed new safety protocols now used across the industry"
            ]}
            image="/api/placeholder/400/320"
          />
          
          <CrewMember 
            name="Dylan Wavecrest"
            experience={9}
            specialties={[
              "Tandem parasailing instruction",
              "Equipment maintenance and safety checks",
              "Ocean current navigation",
              "Aerial photography during flights"
            ]}
            heroicDeeds={[
              "Spotted and rescued a stranded swimmer a mile offshore",
              "Safely landed a parasail with a damaged line during high winds",
              "Performed emergency CPR on a tourist who collapsed on the beach"
            ]}
            image="/api/placeholder/400/320"
          />
        </div>
        
        <div className="mt-12 bg-white rounded-lg p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-blue-800 mb-4 flex items-center">
            <Heart className="text-red-500 mr-2" />
            Why Our Guests Love Alan & Dylan
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="italic text-gray-700">"Alan and Dylan made us feel so safe during our first parasailing experience. Their expertise is matched only by their friendliness and good looks!"</p>
              <p className="text-right font-semibold text-gray-900 mt-2">— Maria T.</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="italic text-gray-700">"The way they handled that unexpected wind change was impressive. These guys aren't just handsome faces - they're true professionals with nerves of steel."</p>
              <p className="text-right font-semibold text-gray-900 mt-2">— James K.</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="italic text-gray-700">"My daughter was terrified to try parasailing until Dylan took the time to explain everything. His patience and charm completely put her at ease!"</p>
              <p className="text-right font-semibold text-gray-900 mt-2">— Sarah M.</p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="italic text-gray-700">"Alan's quick thinking during our trip likely saved us from a dangerous situation. His valor and expertise under pressure were remarkable."</p>
              <p className="text-right font-semibold text-gray-900 mt-2">— Robert D.</p>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-800">Experience the difference that courage, expertise, and dedication make.</p>
            <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center mx-auto">
              <Navigation className="mr-2" />
              Book Your Adventure Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParasailCrew;