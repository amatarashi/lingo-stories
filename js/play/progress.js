export function branchTarget(beat, flags) {
  return flags?.[beat.flag] && (!beat.unless || !flags[beat.unless]) ? beat.goto : undefined;
}

function stepsFor(beat) {
  switch (beat.type) {
    case 'interrogate':
      return beat.rounds.reduce((sum, round) => sum + round.statements.reduce(
        (count, row) => count + (row.lie ? 1 + row.after.length : 0), 0), 0);
    case 'accuse': return 2 + beat.proofs.length;
    case 'explore': return beat.need.length;
    case 'task': return beat.steps.length;
    case 'chat': return beat.msgs.length;
    case 'recap': return beat.frames.length;
    case 'branch': case 'scene': case 'fx': case 'recall': case 'stamp': case 'end': return 0;
    default: return 1;
  }
}

export function episodeProgress(beats, flags, paint) {
  const labels = new Map(beats.flatMap((beat, i) => beat.label ? [[beat.label, i]] : []));
  const next = (i, label) => label ? labels.get(label) : i + 1;
  const weights = beats.map(stepsFor);
  const remaining = new Map();
  function left(i) {
    const beat = beats[i];
    if (!beat || beat.type === 'end') return 0;
    if (!remaining.has(i)) {
      const rest = beat.type === 'choice'
        ? Math.max(...beat.options.map(o => left(next(i, o.goto))))
        : left(next(i, beat.type === 'branch' ? branchTarget(beat, flags) : beat.goto));
      remaining.set(i, weights[i] + rest);
    }
    return remaining.get(i);
  }

  let completed = 0, percent = 0;
  function render(done, total) {
    const measured = total > 0 ? Math.floor(100 * done / total) : 0;
    const value = Math.max(percent, Math.min(99, measured));
    if (value !== percent) { percent = value; paint(percent); }
  }
  paint(0);
  return {
    next,
    start(i) {
      let withinBeat = 0;
      render(completed, completed + left(i));
      return (steps = 1) => {
        withinBeat = Math.min(weights[i], withinBeat + steps);
        render(completed + withinBeat, completed + left(i));
      };
    },
    complete(i) { completed += weights[i]; },
    finish() { paint(100); },
  };
}
