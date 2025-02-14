'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { toast } from "@/app/components/ui/use-toast";
import Navbar from './components/Navbar';
import RegistroLotes from './components/registro/RegistroLotes';
import DashboardContent from './components/Dashboard';

export default function DashboardPollo() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userData, setUserData] = useState(null);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />;
      case 'registro':
        return <RegistroLotes />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="p-8 pt-20">
        <h1 className="text-2xl font-bold mb-6">
          {activeTab === 'dashboard' ? 'Panel de Control' :
           activeTab === 'registro' ? 'Registro de Lotes' : 
           'Panel de Control'}
        </h1>
        
        {renderContent()}
      </main>
    </div>
  );
} 