import { ReactElement } from "react";

const Grid = ({ elements }: { elements: ReactElement[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {elements.map((element, index) => (
        <div key={index} className="w-full h-full">
          {element}
        </div>
      ))}
    </div>
  );
};

export default Grid;
