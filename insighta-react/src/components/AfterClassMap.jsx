import { useEffect, useMemo, useState } from 'react';

/** Confusion intensity per ~10 min segment (bar heights %) */
const SEGMENTS = [
  { h: 32, centerMin: 5, label: 'Syllabus' },
  { h: 48, centerMin: 15, label: 'Limits' },
  { h: 38, centerMin: 25, label: 'Derivatives' },
  { h: 56, centerMin: 35, label: 'Product rule' },
  { h: 92, peak: true, centerMin: 42, label: 'Chain rule' },
  { h: 44, centerMin: 55, label: 'U-substitution' },
];

/** Finer timeline samples: [minute, question count] */
const TIMELINE = [
  [0, 3],
  [5, 4],
  [10, 5],
  [15, 6],
  [20, 7],
  [25, 8],
  [30, 9],
  [35, 11],
  [40, 16],
  [42, 22],
  [45, 17],
  [50, 12],
  [55, 8],
  [60, 5],
];

const PEAK_INDEX = SEGMENTS.findIndex((s) => s.peak);
const SCAN_DURATION_MS = 10000;

const QUESTION_LAYOUT_3 = [
  { x: 22, y: 8, delay: 0 },
  { x: 50, y: 2, delay: 0.12 },
  { x: 78, y: 10, delay: 0.24 },
];

const QUESTION_LAYOUT_5 = [
  { x: 10, y: 12, delay: 0 },
  { x: 28, y: 4, delay: 0.08 },
  { x: 50, y: 0, delay: 0.16 },
  { x: 72, y: 4, delay: 0.24 },
  { x: 90, y: 12, delay: 0.32 },
];
const MAX_QUESTIONS = Math.max(...TIMELINE.map(([, q]) => q));

const CHART = {
  width: 272,
  height: 52,
  padLeft: 4,
  padRight: 4,
  padTop: 4,
  padBottom: 4,
};

function plotPoint(min, q) {
  const plotW = CHART.width - CHART.padLeft - CHART.padRight;
  const plotH = CHART.height - CHART.padTop - CHART.padBottom;
  const x = CHART.padLeft + (min / 60) * plotW;
  const y = CHART.padTop + plotH - (q / MAX_QUESTIONS) * plotH;
  return { x, y };
}

function buildTimelinePath(points) {
  return points
    .map(([min, q], i) => {
      const { x, y } = plotPoint(min, q);
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

function buildAreaPath(linePath) {
  const baseline = CHART.height - CHART.padBottom;
  const endX = CHART.width - CHART.padRight;
  return `${linePath} L ${endX.toFixed(2)} ${baseline} L ${CHART.padLeft} ${baseline} Z`;
}

function questionsAtMinute(min) {
  for (let i = 0; i < TIMELINE.length - 1; i += 1) {
    const [m0, q0] = TIMELINE[i];
    const [m1, q1] = TIMELINE[i + 1];
    if (min >= m0 && min <= m1) {
      const t = (min - m0) / (m1 - m0);
      return q0 + t * (q1 - q0);
    }
  }
  return TIMELINE[TIMELINE.length - 1][1];
}

function playheadPosition(min) {
  const plotW = CHART.width - CHART.padLeft - CHART.padRight;
  const plotH = CHART.height - CHART.padTop - CHART.padBottom;
  const xPct = ((CHART.padLeft + (min / 60) * plotW) / CHART.width) * 100;
  const q = questionsAtMinute(min);
  const yPct = ((CHART.padTop + plotH - (q / MAX_QUESTIONS) * plotH) / CHART.height) * 100;
  return { xPct, yPct };
}

function segmentIndexForMinute(min) {
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;

  SEGMENTS.forEach((seg, index) => {
    const distance = Math.abs(seg.centerMin - min);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });

  return bestIndex;
}

export default function AfterClassMap() {
  const [currentMinute, setCurrentMinute] = useState(0);
  const [hasEntered, setHasEntered] = useState(false);

  const linePath = useMemo(() => buildTimelinePath(TIMELINE), []);
  const areaPath = useMemo(() => buildAreaPath(linePath), [linePath]);

  const activeIndex = segmentIndexForMinute(currentMinute);
  const { xPct: playheadPct, yPct: playheadYPct } = playheadPosition(currentMinute);
  const isPeakActive = currentMinute >= 38 && currentMinute <= 46;

  useEffect(() => {
    const enterTimer = window.setTimeout(() => setHasEntered(true), 80);
    return () => window.clearTimeout(enterTimer);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      setCurrentMinute(SEGMENTS[PEAK_INDEX].centerMin);
      return undefined;
    }

    const start = performance.now();
    let frame = 0;

    const tick = (now) => {
      const elapsed = (now - start) % SCAN_DURATION_MS;
      setCurrentMinute((elapsed / SCAN_DURATION_MS) * 60);
      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`after-class-map${hasEntered ? ' after-class-map--entered' : ''}`}
      aria-hidden="true"
    >
      <div className="after-class-map__header">
        <span className="after-class-map__label">After-class map</span>
      </div>

      <div className="after-class-map__bars">
        {SEGMENTS.map((seg, index) => (
          <div
            key={seg.centerMin}
            className={[
              'after-class-map__bar-col',
              index === activeIndex ? 'after-class-map__bar-col--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div
              className="after-class-map__bar-track"
              style={{ '--h': `${seg.h}%` }}
            >
              {index === activeIndex && (
                <div
                  className={[
                    'after-class-map__bar-questions',
                    'after-class-map__bar-questions--live',
                    seg.peak ? 'after-class-map__bar-questions--peak' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  aria-hidden="true"
                >
                  {(seg.peak ? QUESTION_LAYOUT_5 : QUESTION_LAYOUT_3).map((mark, qi) => (
                    <span
                      key={qi}
                      className="after-class-map__question"
                      style={{
                        '--q-x': `${mark.x}%`,
                        '--q-y': `${mark.y}px`,
                        '--q-delay': `${mark.delay}s`,
                      }}
                    >
                      ?
                    </span>
                  ))}
                </div>
              )}
              <span
                className={[
                  'after-class-map__bar',
                  seg.peak ? 'after-class-map__bar--peak' : '',
                  index === activeIndex ? 'after-class-map__bar--active' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{ '--h': `${seg.h}%`, '--i': index }}
              />
            </div>
            <span className="after-class-map__bar-label">{seg.label}</span>
          </div>
        ))}
      </div>

      <div className="after-class-map__tags">
        <span className={isPeakActive ? 'after-class-map__tag--pulse' : ''}>
          Peak confusion · 42 min
        </span>
        <span>Top theme · Chain rule</span>
      </div>

      <div className="after-class-map__timeline">
        <p className="after-class-map__timeline-title">Questions over time</p>
        <div className="after-class-map__plot">
          <div className="after-class-map__y-axis" aria-hidden="true">
            <span>{MAX_QUESTIONS}</span>
            <span>{Math.round(MAX_QUESTIONS / 2)}</span>
            <span>0</span>
            <span className="after-class-map__axis-title">Questions</span>
          </div>

          <div className="after-class-map__chart">
            <svg
              className="after-class-map__svg"
              viewBox={`0 0 ${CHART.width} ${CHART.height}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <line
                className="after-class-map__grid-line"
                x1={CHART.padLeft}
                y1={CHART.padTop}
                x2={CHART.width - CHART.padRight}
                y2={CHART.padTop}
              />
              <line
                className="after-class-map__grid-line"
                x1={CHART.padLeft}
                y1={CHART.height / 2}
                x2={CHART.width - CHART.padRight}
                y2={CHART.height / 2}
              />
              <line
                className="after-class-map__grid-line"
                x1={CHART.padLeft}
                y1={CHART.height - CHART.padBottom}
                x2={CHART.width - CHART.padRight}
                y2={CHART.height - CHART.padBottom}
              />
              <path className="after-class-map__area" d={areaPath} />
              <path className="after-class-map__line" d={linePath} />
            </svg>
            <span
              className="after-class-map__playhead"
              style={{ '--playhead': `${playheadPct}%` }}
            />
            <span
              className="after-class-map__playhead-dot"
              style={{
                '--playhead': `${playheadPct}%`,
                '--playhead-y': `${playheadYPct}%`,
              }}
            />
          </div>
        </div>

        <div className="after-class-map__x-axis">
          <div className="after-class-map__x-axis-spacer" aria-hidden="true" />
          <div className="after-class-map__x-axis-body">
            <div className="after-class-map__x-ticks">
              <span>0m</span>
              <span>15m</span>
              <span>30m</span>
              <span>45m</span>
              <span>60m</span>
            </div>
            <span className="after-class-map__axis-title after-class-map__axis-title--x">Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}
