import { useState } from 'react';
import AfterClassMap from '../components/AfterClassMap.jsx';
import ClassroomRadar from '../components/ClassroomRadar.jsx';
import ConnectSupport from '../components/ConnectSupport.jsx';

const FORMSPREE_WAITLIST_URL = 'https://formspree.io/f/xojbvdeo';

function IconQuestion() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 18h.01M8.5 8.5a3.5 3.5 0 1 1 6.2 2.2c-.8.6-1.2 1.1-1.2 2.3V14"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconCluster() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="8" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="14" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16" cy="14" r="2.5" stroke="currentColor" strokeWidth="1.75" />
      <path d="M10 10.5 12.5 9.5M12 10.5 14 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function IconAlert() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 8v5M12 16.5h.01" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path
        d="M10.3 4.5 2.8 17.2A1.5 1.5 0 0 0 4.1 19.5h15.8a1.5 1.5 0 0 0 1.3-2.3L13.7 4.5a1.5 1.5 0 0 0-2.6 0Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconTimeline() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 18h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
      <path d="M7 18V12M12 18V8M17 18V14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconThemes() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h10M4 17h14" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

function IconFollowUp() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M5 12h9l-3-3M14 12l3 3M19 6v12"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconNudge() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3v3M5.6 5.6l2.1 2.1M3 12h3M5.6 18.4l2.1-2.1M12 18v3M18.4 18.4l-2.1-2.1M18 12h3M18.4 5.6l-2.1 2.1"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconOfficeHours() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 8h16v11a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 19V8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
      <path d="M8 6V4.5A1.5 1.5 0 0 1 9.5 3h5A1.5 1.5 0 0 1 16 4.5V6" stroke="currentColor" strokeWidth="1.75" />
      <path d="M4 11h16" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

function IconHandshake() {
  return (
    <svg className="home__mini-icon-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 11.5 10 14.5l2-2 5 5M9 8.5 11.5 6l2.5 2.5M14.5 9 17 6.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8" cy="9" r="2" stroke="currentColor" strokeWidth="1.75" />
      <circle cx="16" cy="7" r="2" stroke="currentColor" strokeWidth="1.75" />
    </svg>
  );
}

export default function Home() {
  const [waitlistStatus, setWaitlistStatus] = useState('idle');
  const [waitlistError, setWaitlistError] = useState('');

  async function handleWaitlistSubmit(e) {
    e.preventDefault();
    const form = e.currentTarget;

    setWaitlistStatus('submitting');
    setWaitlistError('');

    try {
      const response = await fetch(FORMSPREE_WAITLIST_URL, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(form),
      });

      if (response.ok) {
        setWaitlistStatus('success');
        form.reset();
        return;
      }

      const data = await response.json().catch(() => ({}));
      setWaitlistError(
        typeof data.error === 'string' ? data.error : 'Something went wrong. Please try again.',
      );
      setWaitlistStatus('error');
    } catch {
      setWaitlistError('Network error. Please check your connection and try again.');
      setWaitlistStatus('error');
    }
  }

  return (
    <main className="home" aria-label="Insighta home">
      <section className="home__hero" id="top">
        <div className="home__hero-inner">
          <div className="home__hero-shell">
            <div className="home__hero-copy">
              <p className="home__hero-eyebrow">Live learning intelligence</p>
              <h1 className="home__title">Insighta</h1>
              <p className="home__subtitle">Sail toward the future</p>

              <p className="home__body">
                Insighta shows professors where students are confused during live lectures.
              </p>

              <div className="home__buttons">
                <a className="home__btn home__btn--primary" href="#trial">
                  Start your journey <span aria-hidden="true">↗</span>
                </a>
                <a className="home__btn home__btn--ghost" href="#value" aria-label="See how it works">
                  <span className="home__play" aria-hidden="true">
                    ▶
                  </span>
                  See how it works
                </a>
              </div>

            </div>

            <div className="home__hero-media" aria-label="Illustration">
              <img
                className="home__hero-image"
                src="/refs/sailboat.png"
                alt="Sailboat on open water"
                decoding="async"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home__features" id="value">
        <div className="home__features-inner">
          <article
            className="home__feature home__feature--live"
            aria-labelledby="live-classroom-heading"
          >
            <div className="home__feature-shell">
              <div className="home__feature-main">
                <div className="home__feature-heading">
                  <span className="home__feature-index" aria-hidden="true">
                    01
                  </span>
                  <div>
                    <p className="home__feature-eyebrow">Live Classroom Intelligence</p>
                    <h2 id="live-classroom-heading" className="home__feature-headline">
                      A real-time pulse on student understanding.
                    </h2>
                  </div>
                </div>
                <p className="home__feature-body">
                  Students can ask questions quietly during class. Insighta groups similar confusion together and
                  surfaces the important patterns to the professor, without interrupting the lecture flow.
                </p>
                <div className="home__mini-grid">
                  <div className="home__mini home__mini--accent">
                    <span className="home__mini-icon" aria-hidden="true">
                      <IconQuestion />
                    </span>
                    <h3 className="home__mini-title">Private student questions</h3>
                    <p className="home__mini-text">Students can ask without raising their hand.</p>
                  </div>
                  <div className="home__mini">
                    <span className="home__mini-icon" aria-hidden="true">
                      <IconCluster />
                    </span>
                    <h3 className="home__mini-title">Confusion clusters</h3>
                    <p className="home__mini-text">Repeated questions are grouped into clear themes.</p>
                  </div>
                  <div className="home__mini">
                    <span className="home__mini-icon" aria-hidden="true">
                      <IconAlert />
                    </span>
                    <h3 className="home__mini-title">Professor alerts</h3>
                    <p className="home__mini-text">The instructor sees what needs clarification next.</p>
                  </div>
                </div>
              </div>

              <div className="home__feature-visual home__feature-visual--live">
                <ClassroomRadar />
              </div>
            </div>
          </article>

          <article
            className="home__feature home__feature--map"
            aria-labelledby="after-class-heading"
          >
            <div className="home__feature-shell home__feature-shell--reverse">
              <div className="home__feature-visual home__feature-visual--map" aria-hidden="true">
                <AfterClassMap />
              </div>

              <div className="home__feature-main">
                <div className="home__feature-heading">
                  <span className="home__feature-index home__feature-index--alt" aria-hidden="true">
                    02
                  </span>
                  <div>
                    <p className="home__feature-eyebrow">After-Class Learning Map</p>
                    <h2 id="after-class-heading" className="home__feature-headline">
                      Every lecture becomes a map of understanding.
                    </h2>
                  </div>
                </div>
                <p className="home__feature-body">
                  After class, Insighta shows where confusion peaked, what concepts caused the most questions, and what
                  should be revisited in the next lecture, tutorial, or office hour.
                </p>
                <div className="home__mini-grid home__mini-grid--map">
                  <div className="home__mini">
                    <span className="home__mini-icon home__mini-icon--map" aria-hidden="true">
                      <IconTimeline />
                    </span>
                    <h3 className="home__mini-title">Lecture timeline</h3>
                    <p className="home__mini-text">See when students struggled most.</p>
                  </div>
                  <div className="home__mini">
                    <span className="home__mini-icon home__mini-icon--map" aria-hidden="true">
                      <IconThemes />
                    </span>
                    <h3 className="home__mini-title">Top confusion themes</h3>
                    <p className="home__mini-text">Understand the main concepts students missed.</p>
                  </div>
                  <div className="home__mini">
                    <span className="home__mini-icon home__mini-icon--map" aria-hidden="true">
                      <IconFollowUp />
                    </span>
                    <h3 className="home__mini-title">Better follow-up</h3>
                    <p className="home__mini-text">Plan the next class with real student signals.</p>
                  </div>
                </div>
              </div>
            </div>
          </article>
          <article
            className="home__feature home__feature--connect"
            aria-labelledby="connect-heading"
          >
            <div className="home__feature-shell">
              <div className="home__feature-main">
                <div className="home__feature-heading">
                  <span className="home__feature-index" aria-hidden="true">
                    03
                  </span>
                  <div>
                    <p className="home__feature-eyebrow">Connect Students to Professors In Person</p>
                    <h2 id="connect-heading" className="home__feature-headline">
                      Foster person to person connections.
                    </h2>
                  </div>
                </div>
                <p className="home__feature-body">
                  When students are repeatedly stuck on the same concept, Insighta helps them take the next step.
                  Instead of leaving confusion buried in a chat thread, Insighta can guide students toward office
                  hours, TA sessions, study groups, or the right person to help.
                </p>
                <div className="home__mini-grid home__mini-grid--connect">
                  <div className="home__mini home__mini--accent">
                    <span className="home__mini-icon home__mini-icon--connect" aria-hidden="true">
                      <IconNudge />
                    </span>
                    <h3 className="home__mini-title">Smart support nudges</h3>
                    <p className="home__mini-text">
                      Insighta notices when a student keeps asking questions around the same concept and gently
                      suggests where to get help.
                    </p>
                  </div>
                  <div className="home__mini">
                    <span className="home__mini-icon home__mini-icon--connect" aria-hidden="true">
                      <IconOfficeHours />
                    </span>
                    <h3 className="home__mini-title">Office hour routing</h3>
                    <p className="home__mini-text">
                      Students can be pointed toward professor or TA office hours based on the topic they are
                      struggling with.
                    </p>
                  </div>
                  <div className="home__mini">
                    <span className="home__mini-icon home__mini-icon--connect" aria-hidden="true">
                      <IconHandshake />
                    </span>
                    <h3 className="home__mini-title">Human help, faster</h3>
                    <p className="home__mini-text">
                      The goal is not to replace the professor. It is to help students reach them at the right
                      moment.
                    </p>
                  </div>
                </div>
              </div>

              <div className="home__feature-visual home__feature-visual--connect">
                <ConnectSupport />
              </div>
            </div>
          </article>

        </div>
      </section>

      <section className="home__waitlist" id="trial" aria-labelledby="waitlist-heading">
        <div className="home__waitlist-band">
          <div className="home__waitlist-inner">
            <span className="home__waitlist-badge" aria-hidden="true">
              <img
                className="home__waitlist-badge-logo"
                src="/logo/insighta-logo.png"
                alt=""
                decoding="async"
              />
            </span>
            <h2 id="waitlist-heading" className="home__waitlist-title">
              Bring Insighta to your classroom.
            </h2>
            <p className="home__waitlist-sub">
              Join the waitlist to get early access, pilot opportunities, and updates as Insighta launches with
              professors and students.
            </p>
            <div className="home__waitlist-card">
              {waitlistStatus === 'success' ? (
                <p className="home__waitlist-message home__waitlist-message--success" role="status">
                  You&apos;re on the list! We&apos;ll be in touch soon.
                </p>
              ) : (
                <form className="home__waitlist-form" onSubmit={handleWaitlistSubmit} noValidate>
                  <label className="home__waitlist-label" htmlFor="waitlist-email">
                    Email
                  </label>
                  <div className="home__waitlist-row">
                    <input
                      id="waitlist-email"
                      className="home__waitlist-input"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@university.edu"
                      required
                      disabled={waitlistStatus === 'submitting'}
                    />
                    <button
                      type="submit"
                      className="home__waitlist-btn"
                      disabled={waitlistStatus === 'submitting'}
                    >
                      {waitlistStatus === 'submitting' ? 'Joining…' : 'Join the waitlist'}
                    </button>
                  </div>
                  {waitlistStatus === 'error' && waitlistError ? (
                    <p className="home__waitlist-message home__waitlist-message--error" role="alert">
                      {waitlistError}
                    </p>
                  ) : null}
                </form>
              )}
            </div>
            <p className="home__waitlist-note">
              For professors, students, and education builders interested in the future of live learning.
            </p>
            <p className="home__fineprint">© {new Date().getFullYear()} Insighta. All rights reserved.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
