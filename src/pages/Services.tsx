import { Link } from 'react-router-dom';
import { WebsiteContent } from '../types/content';
import { assetUrl } from '../lib/asset-url';
import styles from './Services.module.css';

interface ServicesProps {
  content: WebsiteContent;
}

export default function Services({ content }: ServicesProps) {
  const { services } = content;

  return (
    <div className="animate-fade-in">
      <section className={styles.headerSection}>
        <div className="container">
          <div className={styles.headerContent}>
            <span className="eyebrow">{services.label}</span>
            <h1 className="text-display-2">
              {services.title_line1}{' '}
              <span className="text-em">{services.title_em}</span>
            </h1>
            <p className="lead">{services.description}</p>
          </div>
        </div>
      </section>

      <section className={styles.servicesSection}>
        <div className="container">
          <div className={styles.servicesGrid}>
            {services.items.map((service, idx) => (
              <div key={idx} className={styles.serviceCard}>
                <div className={styles.serviceHeader}>
                  <div className={styles.serviceIcon}>
                    {service.icon && (
                      <img src={assetUrl(service.icon)} alt="" aria-hidden="true" />
                    )}
                  </div>
                  <span className={styles.serviceNumber}>{service.number}</span>
                </div>
                <h2 className="text-display-4">{service.title}</h2>
                <p className={styles.serviceText}>{service.text}</p>
                <ul className={styles.featureList}>
                  {service.features.map((feature, fIdx) => (
                    <li key={fIdx}>{feature}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaContent}>
            <span className="eyebrow">{services.cta.label}</span>
            <h2 className="text-display-3">
              {services.cta.title_line1}<br />
              {services.cta.title_line2}{' '}
              <span className="text-em">{services.cta.title_em}</span>
            </h2>
            <p className="lead">{services.cta.text}</p>
            <Link to="/contact" className="btn-primary">{services.cta.button}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
