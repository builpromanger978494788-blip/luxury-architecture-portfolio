import { Link } from 'react-router-dom';
import { WebsiteContent } from '../types/content';
import { assetUrl } from '../lib/asset-url';
import styles from './Home.module.css';

interface HomeProps {
  content: WebsiteContent;
}

export default function Home({ content }: HomeProps) {
  const { home } = content;

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <span className="eyebrow">{home.hero.badge}</span>
            <h1 className="text-display-1">
              {home.hero.title_line1}{' '}
              <span className="text-em">{home.hero.title_highlight}</span>
            </h1>
            <div className={styles.heroServices}>
              {home.hero.services.map((service, idx) => (
                <span key={idx} className={styles.heroServiceBadge}>{service}</span>
              ))}
            </div>
            <div className={styles.heroActions}>
              <Link to="/projects" className="btn-primary">{home.hero.btn_primary}</Link>
              <Link to="/contact" className="btn-secondary">{home.hero.btn_secondary}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={`container ${styles.statsContainer}`}>
          {home.stats.map((stat, idx) => (
            <div key={idx} className={styles.statItem}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Projects */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className="eyebrow">{home.featured.label}</span>
            <h2 className="text-display-3">
              {home.featured.title_line1}{' '}
              <span className="text-em">{home.featured.title_em}</span>
            </h2>
          </div>
          
          <div className={styles.featuredGrid}>
            {home.featured.cards.map((card, idx) => (
              <Link to="/projects" key={idx} className={styles.featuredCard}>
                <div className={styles.featuredImageWrapper}>
                  <img 
                    src={assetUrl(card.image)} 
                    alt={card.title}
                    loading="lazy"
                    className={styles.featuredImage}
                  />
                  <div className={styles.featuredOverlay}>
                    <span className={styles.featuredCategory}>{card.category}</span>
                    <h3 className={styles.featuredTitle}>{card.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className={styles.viewAllWrapper}>
             <Link to="/projects" className="btn-secondary">View All Projects</Link>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className={styles.philosophySection}>
        <div className={`container ${styles.philosophyContainer}`}>
          {home.philosophy.image && (
            <div className={styles.philosophyImage}>
              <img src={assetUrl(home.philosophy.image)} alt="Our Philosophy" loading="lazy" />
            </div>
          )}
          <div className={styles.philosophyContent}>
            <span className="eyebrow">{home.philosophy.label}</span>
            <h2 className="text-display-3">
              {home.philosophy.title_line1}{' '}
              <span className="text-em">{home.philosophy.title_em}</span>
            </h2>
            <p className="lead">{home.philosophy.text}</p>
            <Link to="/about" className="btn-secondary">Discover Our Studio</Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className={styles.processSection}>
        <div className="container">
          <div className={styles.sectionHeaderCentered}>
            <span className="eyebrow">{home.process.label}</span>
            <h2 className="text-display-3">
              {home.process.title_line1}{' '}
              <span className="text-em">{home.process.title_em}</span>
            </h2>
          </div>
          
          <div className={styles.processGrid}>
            {home.process.steps.map((step, idx) => (
              <div key={idx} className={styles.processStep}>
                <div className={styles.stepNumber}>{step.number}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepText}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className={styles.testimonialSection}>
        <div className={`container ${styles.testimonialContainer}`}>
          <span className="eyebrow">{home.testimonial.label}</span>
          <blockquote className={styles.quote}>
            "{home.testimonial.quote}"
          </blockquote>
          <cite className={styles.author}>&mdash; {home.testimonial.author}</cite>
        </div>
      </section>
    </div>
  );
}
