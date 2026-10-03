import { WebsiteContent } from '../types/content';
import { assetUrl } from '../lib/asset-url';
import styles from './About.module.css';

interface AboutProps {
  content: WebsiteContent;
}

export default function About({ content }: AboutProps) {
  const { about } = content;

  return (
    <div className="animate-fade-in">
      <section className={styles.heroSection}>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="eyebrow">{about.label}</span>
            <p className="lead">{about.lead}</p>
          </div>
        </div>
      </section>

      {about.image && (
        <section className={styles.imageSection}>
          <div className="container">
             <img src={assetUrl(about.image)} alt="Studio" className={styles.mainImage} loading="lazy" />
          </div>
        </section>
      )}

      <section className={styles.textSection}>
        <div className="container">
          <div className={styles.textContent}>
            <div dangerouslySetInnerHTML={{ __html: about.text1 }} />
            <div dangerouslySetInnerHTML={{ __html: about.text2 }} />
          </div>
        </div>
      </section>

      <section className={styles.statsSection}>
        <div className="container">
          <div className={styles.statsGrid}>
            {about.stats.map((stat, idx) => (
              <div key={idx} className={styles.statItem}>
                <div className={styles.statNumber}>{stat.number}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.principlesSection}>
        <div className="container">
          <div className={styles.principlesHeader}>
            <span className="eyebrow">{about.principles.label}</span>
            <h2 className="text-display-3">
              {about.principles.title_line1}{' '}
              <span className="text-em">{about.principles.title_em}</span>
            </h2>
          </div>

          <div className={styles.principlesGrid}>
            {about.principles.items.map((item, idx) => (
              <div key={idx} className={styles.principleItem}>
                <h3 className={styles.principleTitle}>{item.title}</h3>
                <p className={styles.principleText}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {about.team && about.team.length > 0 && (
        <section className={styles.teamSection}>
          <div className="container">
            <div className={styles.teamHeader}>
              <span className="eyebrow">Our Team</span>
              <h2 className="text-display-3">
                The People <span className="text-em">Behind It All</span>
              </h2>
            </div>
            
            <div className={styles.teamGrid}>
              {about.team.map((member, idx) => (
                <div key={idx} className={styles.teamCard}>
                  <div className={styles.teamImageWrapper}>
                    <img src={assetUrl(member.image)} alt={member.name} className={styles.teamImage} loading="lazy" />
                  </div>
                  <h3 className={styles.teamName}>{member.name}</h3>
                  <div className={styles.teamRole}>{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
