import { Link } from 'react-router-dom';
import { WebsiteContent } from '../types/content';
import styles from './SiteFooter.module.css';

interface SiteFooterProps {
  content: WebsiteContent;
}

export function SiteFooter({ content }: SiteFooterProps) {
  const { footer } = content;

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.container}`}>
        <div className={styles.topSection}>
          <div className={styles.brandInfo}>
            <Link to="/" className={styles.logo}>
              <img src="/logo.svg" alt="Architecture Logo" className={styles.logoImage} />
              <span>{footer.logo}</span>
            </Link>
            <p className={styles.tagline}>{footer.tagline}</p>
          </div>
          
          <div className={styles.grid}>
            <div className={styles.column}>
              <h3 className="eyebrow">Connect</h3>
              <a href={`mailto:${footer.email}`} className={styles.link}>{footer.email}</a>
              <a href={`tel:${footer.phone.replace(/[^0-9+]/g, '')}`} className={styles.link}>{footer.phone}</a>
              <div className={styles.socials}>
                {footer.social.map((socialLink, idx) => {
                  let domain = socialLink;
                  let href = socialLink;
                  try {
                    href = socialLink.startsWith('http') ? socialLink : `https://${socialLink}`;
                    domain = new URL(href).hostname.replace('www.', '').split('.')[0];
                  } catch (e) {
                    // Fallback if it's still not a valid URL
                  }
                  return (
                    <a key={idx} href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                      {domain}
                    </a>
                  );
                })}
              </div>
            </div>
            
            <div className={styles.column}>
              <h3 className="eyebrow">Studios</h3>
              <div className={styles.locations} dangerouslySetInnerHTML={{ __html: footer.locations }} />
            </div>

            <div className={styles.column}>
              <h3 className="eyebrow">Navigation</h3>
              <Link to="/projects" className={styles.link}>Work</Link>
              <Link to="/about" className={styles.link}>Studio</Link>
              <Link to="/services" className={styles.link}>Expertise</Link>
              <Link to="/contact" className={styles.link}>Contact</Link>
            </div>
          </div>
        </div>

        <div className={styles.bottomSection}>
          <p className={styles.copyright}>{footer.copyright}</p>
          <p className={styles.crafted}>{footer.crafted}</p>
        </div>
      </div>
    </footer>
  );
}
