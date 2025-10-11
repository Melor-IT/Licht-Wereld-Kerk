'use client';

import { useIntl } from 'react-intl';
import BackgroundImage from '../../components/BackgroundImage';

export default function AboutUsPage() {
  const { formatMessage } = useIntl();

  return (
    <div className="page about-us">
      {/* بخش بالایی با بنر */}
      <section>
        <BackgroundImage url="/images/about-us-banner.jpg" className="aboutus" />
       
      </section>

  
   

  
      
    </div>
  );
}
