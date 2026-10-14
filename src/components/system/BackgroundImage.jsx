'use client';


const BackgroundImage = ({ url, className = '', style = {}, children }) => {
  return (
    <div
      className={`background ${className}`}
      style={{
        backgroundImage: `url(${url})`,
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundImage;
