const IconContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center gap-2 bg-primary/30 rounded-full p-2 text-white ">
      {children}
    </div>
  );
};

export default IconContainer;
