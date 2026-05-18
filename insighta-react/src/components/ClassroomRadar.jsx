const GRID_COLS = 8;
const GRID_ROWS = 7;

/** Desk grid: 1 = occupied, 0 = empty */
const DESK_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 0, 1, 1, 0, 1, 1],
  [1, 0, 1, 1, 1, 1, 0, 1],
  [1, 1, 1, 0, 1, 1, 1, 1],
  [1, 0, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1],
];

/** Confusion markers — only on occupied desks */
const CONFUSION_MARKERS = [
  { row: 0, col: 3, delay: 0 },
  { row: 1, col: 6, delay: 1 },
  { row: 2, col: 1, delay: 2 },
  { row: 3, col: 4, delay: 3.1 },
  { row: 4, col: 7, delay: 4.2 },
  { row: 5, col: 2, delay: 5 },
  { row: 6, col: 5, delay: 5.8 },
];

const gridStyle = {
  '--grid-cols': GRID_COLS,
  '--grid-rows': GRID_ROWS,
};

export default function ClassroomRadar() {
  return (
    <div
      className="classroom-radar"
      role="img"
      aria-label="Top-down classroom view with a sweeping radar and question marks appearing above desks where students are confused"
    >
      <div className="classroom-radar__arcs" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="classroom-radar__sweep" aria-hidden="true">
        <span className="classroom-radar__sweep-wedge" />
      </div>

      <div className="classroom-radar__stage">
        <div className="classroom-radar__podium" aria-hidden="true">
          <span className="classroom-radar__podium-bar" />
          <span className="classroom-radar__podium-desk" />
          <span className="classroom-radar__podium-dot" />
        </div>

        <div className="classroom-radar__floor">
          <div
            className="classroom-radar__grid-wrap"
            style={gridStyle}
            aria-hidden="true"
          >
            <div className="classroom-radar__desks">
              {DESK_GRID.map((row, rowIndex) =>
                row.map((occupied, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`classroom-radar__desk${occupied ? ' classroom-radar__desk--on' : ''}`}
                  >
                    <span className="classroom-radar__desk-screen" />
                  </div>
                )),
              )}
            </div>
            {CONFUSION_MARKERS.map((marker) => (
              <span
                key={`${marker.row}-${marker.col}`}
                className="classroom-radar__question"
                style={{
                  '--q-row': marker.row,
                  '--q-col': marker.col,
                  '--q-delay': `${marker.delay}s`,
                }}
                aria-hidden="true"
              >
                ?
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
