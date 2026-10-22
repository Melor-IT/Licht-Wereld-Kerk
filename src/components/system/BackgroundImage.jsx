import Image from 'next/image';

const BackgroundImage = ({ url, className = '', style = {}, preload = false, children }) => {
  return (
    <div className={`background ${className}`} style={style}>
      <Image src={url} alt="" fill sizes="100vw" preload={preload} className="background-image" />
      {children}
    </div>
  );
};

export default BackgroundImage;
