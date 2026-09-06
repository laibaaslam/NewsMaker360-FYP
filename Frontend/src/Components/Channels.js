import '../../src/index.css';
import C1 from '../Cs/1.png';
import C2 from '../Cs/2.png';
import C3 from '../Cs/3.png';
import C4 from '../Cs/4.png';
import C5 from '../Cs/5.jpg';
import C6 from '../Cs/6.png';
import C7 from '../Cs/7.png';
import C8 from '../Cs/8.jpg';
import C9 from '../Cs/9.jpg';
import C10 from '../Cs/10.png';

const channelLogos = [
  { src: C1, href: 'https://arynews.tv/', alt: 'ARY News' },
  { src: C2, href: 'https://www.geo.tv/', alt: 'Geo News' },
  { src: C3, href: 'https://www.express.pk/', alt: 'Express News' },
  { src: C4, href: 'https://dunyanews.tv/', alt: 'Dunya News' },
  { src: C5, href: 'https://humnews.pk/', alt: 'HUM News' },
  { src: C6, href: 'https://92newshd.tv/', alt: '92 News' },
  { src: C7, href: 'https://ptv.com.pk/ptvNews', alt: 'PTV News' },
  { src: C8, href: 'https://www.dawn.com/', alt: 'Dawn' },
  { src: C9, href: 'https://www.samaa.tv/', alt: 'Samaa TV' },
  { src: C10, href: 'https://www.bolnews.com/', alt: 'BOL News' },
];

const LogoTrack = () => (
  <div className="logos-slide">
    {channelLogos.map((channel) => (
      <a key={channel.alt} href={channel.href} target="_blank" rel="noopener noreferrer">
        <img src={channel.src} alt={channel.alt} />
      </a>
    ))}
  </div>
);

const Channels = () => {
  return (
    <div className="logos">
      {/* Duplicate tracks so logos loop seamlessly left → right */}
      <LogoTrack />
      <LogoTrack />
    </div>
  );
};

export default Channels;
