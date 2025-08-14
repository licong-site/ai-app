import { ScrollAreaProps } from "../types";

const ScrollArea: React.FC<ScrollAreaProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="h-full w-full overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default ScrollArea;
