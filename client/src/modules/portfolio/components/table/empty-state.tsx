import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, PlusCircle } from "lucide-react";

const EmptyState = () => {
  return (
    <Card className="flex flex-col items-center justify-center py-16 px-4 bg-gray-950 border-gray-800 rounded-none">
      <div className="text-center max-w-md">
        <Search className="mx-auto h-12 w-12 text-gray-500 mb-4" />
        <h3 className="text-xl font-medium text-white mb-2">
          No hay inversiones en tu portafolio
        </h3>
        <p className="text-gray-400 mb-6">
          Comienza a agregar activos a tu portafolio para monitorear su
          rendimiento en tiempo real.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          Agregar Inversión
        </Button>
      </div>
    </Card>
  );
};

export default EmptyState;
