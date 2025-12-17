"use client";

import { Button } from "@heroui/react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="space-y-8">
        <h1 className="text-white text-4xl font-bold text-center">
          Testing HeroUI Button
        </h1>
        
        <div className="flex gap-4 justify-center">
          <Button color="primary">Primary Button</Button>
          <Button color="secondary" variant="bordered">Bordered Button</Button>
          <Button color="success" variant="shadow">Shadow Button</Button>
        </div>
      </div>
    </div>
  );
}
