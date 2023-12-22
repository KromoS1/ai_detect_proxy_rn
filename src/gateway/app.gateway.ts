import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { FaceDetectorService } from 'src/face-detector/application/face-detector.service';
import { LandmarksService } from 'src/face-detector/application/landmarks.service';
import { AngleDto } from 'src/face-detector/domain/dto/detection.dto';

const d1Positions = [
  { x: 1102.4587293602438, y: 2164.1555040478706 },
  { x: 1127.2647093944163, y: 2340.4480903744698 },
  { x: 1186.8049289546818, y: 2569.6342847943306 },
  { x: 1252.8783647976727, y: 2719.4058321118355 },
  { x: 1315.2679584883065, y: 2910.1342218518257 },
  { x: 1443.089436542234, y: 3062.4980447888374 },
  { x: 1584.4526001028628, y: 3142.01334553957 },
  { x: 1706.628853838882, y: 3280.290756046772 },
  { x: 1950.2290187887759, y: 3295.9425142407417 },
  { x: 2187.891577284774, y: 3231.4968336224556 },
  { x: 2418.192082207641, y: 3087.27506428957 },
  { x: 2558.27239875122, y: 2931.693723499775 },
  { x: 2680.566257994613, y: 2757.0475156903267 },
  { x: 2795.7934211306183, y: 2567.470578968525 },
  { x: 2845.7023063115685, y: 2395.1828954815865 },
  { x: 2903.2906135730354, y: 2158.1002176404 },
  { x: 2887.9247309975235, y: 1916.2706735730171 },
  //17
  { x: 1175.3414632938714, y: 1864.8694894909859 },
  { x: 1227.216049667439, y: 1736.4615438580513 },
  { x: 1319.031174760303, y: 1687.136350929737 },
  { x: 1403.8526112995953, y: 1631.9588010907173 },
  { x: 1506.8411553911776, y: 1646.978596508503 },
  { x: 1843.2356488518328, y: 1589.7403119206429 },
  { x: 1963.7365039996714, y: 1562.6963451504707 },
  { x: 2081.6299465112297, y: 1540.0328205227852 },
  { x: 2212.130597036323, y: 1545.2227790951729 },
  { x: 2358.7911912612526, y: 1658.7908390164375 },
  //27
  { x: 1677.9185853116126, y: 1917.810064136982 },
  { x: 1646.509340774259, y: 2028.8854206204414 },
  { x: 1593.8899621777148, y: 2101.2676761746407 },
  { x: 1587.5902612917037, y: 2222.7422617077827 },
  { x: 1596.550162922582, y: 2392.8410566449165 },
  { x: 1635.4955018274397, y: 2407.8422353863716 },
  { x: 1697.1422228626818, y: 2419.8171613812447 },
  { x: 1770.3223458044142, y: 2390.199342548847 },
  { x: 1834.841699730596, y: 2385.0807607769966 },
  { x: 1325.4349801950068, y: 2034.0010669827461 },
  { x: 1361.9040449224324, y: 1984.6705053448677 },
  { x: 1458.6136834435076, y: 1972.6054313778877 },
  { x: 1557.9090114943594, y: 1970.9666231274605 },
  { x: 1481.3170491270632, y: 2039.5245807766914 },
  { x: 1388.6153077594847, y: 2044.5050438046455 },
  { x: 1935.86764593049, y: 1938.4718711972237 },
  { x: 2004.5352493934245, y: 1874.7402675747871 },
  { x: 2094.1391286067574, y: 1855.7672479748726 },
  { x: 2201.5270336680023, y: 1879.8740671277046 },
  { x: 2092.0955569557755, y: 1937.2595470547676 },
  { x: 2015.9873896054835, y: 1935.3455827832222 },
  { x: 1579.8888921551318, y: 2777.9632356762886 },
  { x: 1581.0987316183657, y: 2641.559543430805 },
  { x: 1636.8930750004859, y: 2572.4494970440865 },
  { x: 1696.3590392880053, y: 2570.7369173169136 },
  { x: 1760.8203582875342, y: 2537.741060078144 },
  { x: 1888.4691712371916, y: 2626.5004289746284 },
  { x: 2058.399979453525, y: 2709.072572529316 },
  { x: 1947.4535160176367, y: 2801.1202180981636 },
  { x: 1857.442496519527, y: 2887.359151661396 },
  { x: 1764.965536516151, y: 2928.406219303608 },
  { x: 1716.9341803900809, y: 2950.3601472973824 },
  { x: 1638.8822589032263, y: 2890.044433414936 },
  { x: 1597.7272417656989, y: 2752.1867864727974 },
  { x: 1650.4155328385443, y: 2663.2474306225777 },
  { x: 1706.925746958694, y: 2658.1633012890816 },
  { x: 1777.2206318490119, y: 2655.178144276142 },
  { x: 2009.1008769087405, y: 2709.5422380566597 },
  { x: 1826.476544123134, y: 2796.6216257214546 },
  { x: 1754.0996322445483, y: 2828.2393854260445 },
  { x: 1705.1979441754431, y: 2823.3352430462837 },
];

const angleg1: AngleDto = {
  roll: 4,
  pitch: 16,
  yaw: 638,
};

const d1_2Post = [
  { x: 663.2850868403912, y: 1415.7745683829796 },
  { x: 616.2538426220417, y: 1436.4667428772461 },
  { x: 951.885893702507, y: 1981.6340186338437 },
  { x: 1138.2497841715813, y: 2161.8055925707827 },
  { x: 1267.8085592985153, y: 2327.6077808480272 },
  { x: 1466.0111370682716, y: 2541.3156181316385 },
  { x: 1651.054021537304, y: 2726.611936841489 },
  { x: 1858.0459707975388, y: 2873.612873468877 },
  { x: 2227.964797616005, y: 2803.0975482206354 },
  { x: 2572.777408838272, y: 2425.0716221671114 },
  { x: 2682.0436482429504, y: 2377.677617047311 },
  { x: 2635.95844578743, y: 2400.2261618118296 },
  { x: 2334.7579337358475, y: 2422.251600537778 },
  { x: 2500.79301571846, y: 2185.947708700181 },
  { x: 2899.3004620075226, y: 2093.534191225053 },
  { x: 2987.04558968544, y: 1668.1331975202572 },
  { x: 3138.206434726715, y: 1622.7390887479794 },
  //17
  { x: 1014.5369331240654, y: 1025.28446567464 },
  { x: 1247.1137455105782, y: 920.2153203825962 },
  { x: 1476.263000190258, y: 947.5140135030758 },
  { x: 1738.8932180404663, y: 1031.7580067257893 },
  { x: 1914.412972331047, y: 1051.2655927281392 },
  { x: 2377.1677874326706, y: 1070.069751445533 },
  { x: 2485.6591881513596, y: 1103.449614558698 },
  { x: 2629.532922267914, y: 1040.834203813554 },
  { x: 2698.2748361825943, y: 1011.0306982438576 },
  { x: 2777.8548772335052, y: 1165.2149156968605 },
  //27
  { x: 2191.2366572618484, y: 1302.939316753627 },
  { x: 2159.693337082863, y: 1424.4990102987301 },
  { x: 2107.1074434518814, y: 1384.597597990514 },
  { x: 2209.5277448892593, y: 1506.2824615578663 },
  { x: 2137.05825817585, y: 1664.3206199746144 },
  { x: 2177.6476998329163, y: 1694.0343386869442 },
  { x: 2247.0857886075974, y: 1736.5359983186734 },
  { x: 2235.3976551294327, y: 1738.599019561292 },
  { x: 2308.9841681718826, y: 1740.1527225713742 },
  { x: 1401.7693402767181, y: 1297.8562676351082 },
  { x: 1464.9835908412933, y: 1189.566008452655 },
  { x: 1661.2506014704704, y: 1216.1895974318993 },
  { x: 1861.3553142547607, y: 1338.3925004343998 },
  { x: 1779.3907759785652, y: 1428.1877467672837 },
  { x: 1499.464567899704, y: 1296.0107781033528 },
  { x: 2439.313521027565, y: 1476.717667762519 },
  { x: 2498.9544672966003, y: 1218.2085973660958 },
  { x: 2611.9248988628387, y: 1229.7745732109559 },
  { x: 2625.0082226991653, y: 1446.260653410436 },
  { x: 2606.7059910297394, y: 1436.681201402427 },
  { x: 2460.306929588318, y: 1448.852179531337 },
  { x: 2078.1849397420883, y: 2100.9460506181726 },
  { x: 2069.3016086816788, y: 1843.8014746646893 },
  { x: 2146.3388415575027, y: 1815.6426217894566 },
  { x: 2247.6978368759155, y: 1837.2793440561306 },
  { x: 2316.00688123703, y: 1815.1333035569203 },
  { x: 2342.654907822609, y: 1916.8504338603032 },
  { x: 2514.0022016763687, y: 2043.4887743930828 },
  { x: 2434.659900188446, y: 2019.8446804623616 },
  { x: 2285.0773574113846, y: 2194.6973175148973 },
  { x: 2200.7766127586365, y: 2183.695312772275 },
  { x: 2205.06226170063, y: 2170.057843659402 },
  { x: 2112.5549134016037, y: 2107.1636866669664 },
  { x: 2105.5872650146484, y: 2049.957082722665 },
  { x: 2127.0028361082077, y: 1846.3269688229573 },
  { x: 2240.2737197875977, y: 1901.7064392905247 },
  { x: 2267.9271137714386, y: 1930.2300876121533 },
  { x: 2464.2960596084595, y: 2007.333990726949 },
  { x: 2277.961558818817, y: 2065.4314862828264 },
  { x: 2224.175167798996, y: 2066.8248852829943 },
  { x: 2197.3516771793365, y: 2071.014052663327 },
];

@WebSocketGateway({
  transports: ['websocket'],
  maxHttpBufferSize: 1e8,
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;

  private logger: Logger = new Logger('GATEWAY');

  constructor(
    private fdService: FaceDetectorService,
    private landmarksService: LandmarksService,
  ) {}

  afterInit() {
    this.logger.log(`${Server.name} initialized`);
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    this.logger.warn(`open Client_id: ${socket.id}`);
  }

  handleDisconnect(socket: Socket) {
    this.disconnectSocket(socket);
    this.logger.warn(`close Client_id: ${socket.id}`);
  }

  private disconnectSocket(socket: Socket) {
    socket.disconnect();
  }

  defineHints(positions, positionTemplate) {
    const hints = [];
    console.log(positions);
    console.log(positionTemplate);

    for (let i = 0; i < positions.length; i++) {
      const { x: tx, y: ty } = positionTemplate[i];
      const { x, y } = positions[i];

      const distance = 300;

      // console.log('плюс x ', x, ' tx ', tx + 250);
      // console.log('минус x ', x, ' tx ', tx - 250);
      // console.log('плюс y ', y, ' ty ', ty + 150);
      // console.log('минус y ', y, ' ty ', ty - 150);

      if (
        tx < x + distance &&
        tx > x - distance &&
        ty < y + distance &&
        ty > y - distance
      ) {
        hints.push('ok');
        continue;
      }

      if (tx > x + distance) {
        hints.push('right');
      } else if (tx < x - distance) {
        hints.push('left');
      }

      if (ty > y + distance) {
        hints.push('up');
      } else if (ty < y - distance) {
        hints.push('down');
      }
    }

    return hints;
  }

  countValues(arr) {
    return arr.reduce((count, value) => {
      count[value] = (count[value] || 0) + 1;
      return count;
    }, {});
  }

  @SubscribeMessage('server/detection')
  async handleDataTensor(
    socket: Socket,
    dataString: string,
  ): Promise<WsResponse<any>> {
    const data = JSON.parse(dataString);

    const base64 = data.base64.replace(`data:${data.fileType};base64,`, '');

    const buffer = Buffer.from(base64, 'base64');

    const detectData = await this.fdService.templateDetection(buffer);

    if (!detectData)
      return { event: 'client/detection', data: JSON.stringify([]) };

    const { positions, angle } = this.landmarksService.getLandmarksData(
      'EYEBROWS',
      detectData,
    );

    const positionTemplate = this.landmarksService.getPosition(
      'EYEBROWS',
      d1Positions,
    );

    const hints = [];
    //@ts-ignore
    console.log(JSON.stringify(detectData?.landmarks._shift, null, 2));

    const leftHints = this.defineHints(
      positions.slice(0, 5),
      positionTemplate.slice(0, 5),
    );
    const rightHints = this.defineHints(
      positions.slice(5, 10),
      positionTemplate.slice(5, 10),
    );

    const defineH = (hintsCount) => {
      const { ok, ...resthint } = hintsCount;
      if (!ok) return Object.keys(resthint);

      const res = [];

      Object.entries(resthint).forEach((h) =>
        ok >= h[1] ? res.push(h[0]) : undefined,
      );

      if (res.length) return res;

      return ['ok'];
    };

    const l = this.countValues(leftHints);
    const r = this.countValues(rightHints);

    const lH = defineH(l);
    const rH = defineH(r);

    console.log(l, lH);
    console.log(r, rH);

    return {
      event: 'client/detection',
      data: JSON.stringify({
        left: lH,
        right: rH,
      }),
    };
  }
}
