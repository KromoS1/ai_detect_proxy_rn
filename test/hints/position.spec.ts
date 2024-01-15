import { PositionsHints } from 'src/hints/application/hints/positions.hints';

describe('PositionsHints', () => {
  const position = [
    { x: 864.7458242624998, y: 1457.9868128299713 },
    { x: 962.4280366152525, y: 1419.2607566714287 },
    { x: 1078.9160930812359, y: 1412.9177772402763 },
    { x: 1190.4696868360043, y: 1423.325476706028 },
    { x: 1289.6806723475456, y: 1459.6606006622314 },
    { x: 1588.903449177742, y: 1467.1212887763977 },
    { x: 1687.9688934087753, y: 1437.473909854889 },
    { x: 1797.4202766418457, y: 1428.4518638849258 },
    { x: 1918.4424983263016, y: 1443.1226402521133 },
    { x: 2007.5335763692856, y: 1481.86630153656 },
  ];

  const positionTemplate = [
    { x: 1237.650740146637, y: 2020.294670701027 },
    { x: 1338.6914405822754, y: 2284.1614839434624 },
    { x: 1483.2584710121155, y: 2147.1735971570015 },
    { x: 1483.1667165756226, y: 1791.5274617671967 },
    { x: 1438.6925411224365, y: 1821.2855704426765 },
    { x: 1693.476056098938, y: 1941.8409014344215 },
    { x: 1823.2762398719788, y: 1808.2305209636688 },
    { x: 1718.7218041419983, y: 1765.9145127236843 },
    { x: 1160.2054846286774, y: 1421.7550960481167 },
    { x: 1155.856511592865, y: 1511.4945995807648 },
  ];

  let hintsPosition;
  let updateHints;

  it('_defineHintsEachPoint', () => {
    const positionsHins = new PositionsHints();

    hintsPosition = positionsHins._defineHintsEachPoint(
      position,
      positionTemplate,
    );

    const expectation = [
      'right',
      'up',
      'right',
      'up',
      'right',
      'up',
      'up',
      'up',
      'up',
      'up',
      'up',
      'left',
      'left',
    ];

    expect(hintsPosition.length).toEqual(expectation.length);
    expect(hintsPosition[0]).toEqual(expectation[0]);
    expect(hintsPosition[4]).toEqual(expectation[4]);
  });

  it('_countValuesHints', () => {
    const positionsHins = new PositionsHints();

    updateHints = positionsHins._countValuesHints(hintsPosition);

    expect(updateHints.right).toEqual(3);
    expect(updateHints.up).toEqual(8);
    expect(updateHints.left).toEqual(2);
  });

  it('_updateDirection when different data', () => {
    const positionsHins = new PositionsHints();

    const testData = {
      left: 2,
      right: 3,
      up: 4,
      down: 5,
    };

    const hintsUpdated = positionsHins._updateDirection(testData);

    expect(hintsUpdated.right).toEqual(3);
    expect(hintsUpdated.up).toEqual(undefined);
    expect(hintsUpdated.left).toEqual(undefined);
    expect(hintsUpdated.down).toEqual(5);
  });

  it('_updateDirection when same data', () => {
    const positionsHins = new PositionsHints();

    const testData = {
      left: 2,
      right: 2,
      up: 3,
      down: 3,
    };

    const hintsUpdated = positionsHins._updateDirection(testData);

    expect(hintsUpdated.right).toEqual(undefined);
    expect(hintsUpdated.up).toEqual(3);
    expect(hintsUpdated.left).toEqual(2);
    expect(hintsUpdated.down).toEqual(undefined);
  });

  it('_defineHints', () => {
    const positionsHins = new PositionsHints();

    const hints = positionsHins._defineHints(updateHints);

    expect(hints.length).toEqual(2);
    expect(hints[0]).toEqual('right');
    expect(hints[1]).toEqual('up');
  });
});
