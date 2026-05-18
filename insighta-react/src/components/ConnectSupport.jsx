import { useEffect, useRef, useState } from 'react';

const LOGO_SRC = '/logo/background-removed-logo.png';

const STUDENT_TYPING_MS = 2000;
const BOT_TYPING_DELAY_MS = 900;
const BOT_TYPING_MS = 2000;

const HELP_TYPES = [
  {
    id: 'office',
    label: 'Office hours',
    host: 'Prof. Chen',
    location: 'Room 312',
    defaultDay: 'Thu',
    schedule: {
      Tue: { date: '12', slots: ['1:00pm', '2:30pm'] },
      Thu: { date: '14', slots: ['2:00pm', '3:00pm', '3:45pm'] },
    },
  },
  {
    id: 'ta',
    label: 'TA session',
    host: 'Alex · TA',
    location: 'Help desk',
    defaultDay: 'Wed',
    schedule: {
      Wed: { date: '13', slots: ['11:00am', '11:30am', '12:15pm'] },
      Fri: { date: '15', slots: ['10:00am', '1:30pm', '2:15pm'] },
    },
  },
];

const CAL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function firstScheduleDay(help) {
  const days = CAL_DAYS.filter((day) => help.schedule[day]);
  return days.includes(help.defaultDay) ? help.defaultDay : days[0];
}

function selectHelpType(help, setActiveId, setActiveDay, setSelectedSlot) {
  const day = firstScheduleDay(help);
  const slots = help.schedule[day].slots;
  setActiveId(help.id);
  setActiveDay(day);
  setSelectedSlot(slots[0]);
}

function TypingBubble({ variant }) {
  return (
    <div
      className={[
        'connect-support__bubble',
        'connect-support__typing',
        `connect-support__typing--${variant}`,
      ].join(' ')}
    >
      <span className="connect-support__typing-dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
    </div>
  );
}

function BotAvatar() {
  return (
    <span className="connect-support__avatar connect-support__avatar--bot" aria-hidden="true">
      <img className="connect-support__avatar-logo" src={LOGO_SRC} alt="" decoding="async" />
    </span>
  );
}

export default function ConnectSupport() {
  const office = HELP_TYPES[0];
  const initialDay = firstScheduleDay(office);

  const rootRef = useRef(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [phase, setPhase] = useState('idle');
  const [activeId, setActiveId] = useState('office');
  const [activeDay, setActiveDay] = useState(initialDay);
  const [selectedSlot, setSelectedSlot] = useState(office.schedule[initialDay].slots[0]);

  const active = HELP_TYPES.find((h) => h.id === activeId) ?? HELP_TYPES[0];
  const dayData = active.schedule[activeDay];
  const detail = dayData
    ? `${activeDay} · ${selectedSlot} · ${active.location}`
    : active.location;

  const showStudentRow = phase !== 'idle';
  const showStudentMessage = phase !== 'student-typing' && phase !== 'idle';
  const showBotTyping = phase === 'bot-typing';
  const showBotMessage = phase === 'bot-message';

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.32, rootMargin: '0px 0px -6% 0px' },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return undefined;

    setPhase('student-typing');

    const studentDone = window.setTimeout(() => setPhase('student-message'), STUDENT_TYPING_MS);
    const botTyping = window.setTimeout(
      () => setPhase('bot-typing'),
      STUDENT_TYPING_MS + BOT_TYPING_DELAY_MS,
    );
    const botDone = window.setTimeout(
      () => setPhase('bot-message'),
      STUDENT_TYPING_MS + BOT_TYPING_DELAY_MS + BOT_TYPING_MS,
    );

    return () => {
      window.clearTimeout(studentDone);
      window.clearTimeout(botTyping);
      window.clearTimeout(botDone);
    };
  }, [hasStarted]);

  function selectDay(day) {
    if (!active.schedule[day]) return;
    setActiveDay(day);
    setSelectedSlot(active.schedule[day].slots[0]);
  }

  return (
    <div ref={rootRef} className="connect-support" aria-hidden="true">
      <header className="connect-support__header">
        <span className="connect-support__status" aria-hidden="true" />
        <p className="connect-support__header-title">Insighta · In-person help</p>
      </header>

      <div className="connect-support__thread">
        {showStudentRow && (
        <div
          className={[
            'connect-support__row',
            'connect-support__row--student',
            showStudentMessage ? 'connect-support__row--revealed' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <span className="connect-support__avatar connect-support__avatar--student" aria-hidden="true">
            M
          </span>
          {phase === 'student-typing' ? (
            <TypingBubble variant="student" />
          ) : (
            <div className="connect-support__bubble connect-support__bubble--student">
              <p>
                For <strong>f(x) = ln(sin(x²))</strong>, how many times do I apply the chain rule and which
                layer do I start with?
              </p>
            </div>
          )}
        </div>
        )}

        {(showBotTyping || showBotMessage) && (
          <div
            className={[
              'connect-support__row',
              'connect-support__row--bot',
              showBotTyping ? 'connect-support__row--typing' : '',
              showBotMessage ? 'connect-support__row--revealed' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            {showBotTyping ? (
              <>
                <TypingBubble variant="bot" />
                <BotAvatar />
              </>
            ) : (
              <>
                <div className="connect-support__bubble connect-support__bubble--bot">
                  <p className="connect-support__bot-lead">
                    You&apos;ve asked about this a few times. Here&apos;s the calendar — you can book{' '}
                    <strong>office hour</strong> or <strong>TA session</strong>.
                  </p>

                  <div className="connect-support__picker" role="tablist" aria-label="Help type">
                    {HELP_TYPES.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        role="tab"
                        aria-selected={activeId === opt.id}
                        className={[
                          'connect-support__picker-btn',
                          activeId === opt.id ? 'connect-support__picker-btn--active' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => selectHelpType(opt, setActiveId, setActiveDay, setSelectedSlot)}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  <div className="connect-support__calendar">
                    <div className="connect-support__cal-head">
                      <p className="connect-support__cal-host">{active.host}</p>
                      <p className="connect-support__cal-detail">{detail}</p>
                    </div>
                    <div className="connect-support__cal-grid">
                      {CAL_DAYS.map((day) => {
                        const schedule = active.schedule[day];
                        const isActive = day === activeDay;
                        const hasSlots = Boolean(schedule);

                        return (
                          <button
                            key={day}
                            type="button"
                            className={[
                              'connect-support__cal-day',
                              hasSlots ? 'connect-support__cal-day--available' : '',
                              isActive ? 'connect-support__cal-day--active' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            disabled={!hasSlots}
                            onClick={() => selectDay(day)}
                          >
                            <span className="connect-support__cal-day-label">{day}</span>
                            <span className="connect-support__cal-day-num">
                              {hasSlots ? schedule.date : '·'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {dayData && (
                      <div className="connect-support__cal-slots" aria-label="Available times">
                        {dayData.slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            className={[
                              'connect-support__cal-slot',
                              selectedSlot === slot ? 'connect-support__cal-slot--picked' : '',
                            ]
                              .filter(Boolean)
                              .join(' ')}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="button" className="connect-support__book-btn" tabIndex={-1}>
                    Book {active.label.toLowerCase()} · {selectedSlot}
                  </button>
                </div>
                <BotAvatar />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
