'use client';

const BackgroundImage = ({ url, className = '', style = {}, children }) => {
  return (
    <div
      className={`background ${className}`}
      style={{
        backgroundImage: `url(${url})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export default BackgroundImage;
