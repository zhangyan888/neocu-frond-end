/**
 * Created by ssehacker on 2017/3/21.
 */
import { error } from '../../../components/dialog';
import { Msg } from '../../../util';
import configUtil from '../configUtil';

const unescape = require('lodash.unescape');

const util = {};

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

util.genPoints = function (react) {
  const properties = ['x', 'y', 'width', 'height'];
  for (const i in properties) {
    if (Object.prototype.toString.call(react[properties[i]]) !== '[object Number]') {
      throw new Error(`${properties[i]} should be type of number: ${JSON.stringify(react)}`);
    }
  }
  const { x, y, width, height } = react;
  return [
    new Point(x + (width / 2), y),
    new Point(x, y + (height / 2)),
    new Point(x + width, y + (height / 2)),
    new Point(x + (width / 2), y + height),
  ];
};

util.distance = function (pointA, pointB) {
  const variance = Math.pow(pointA.x - pointB.x, 2) + Math.pow(pointA.y - pointB.y, 2);
  return Math.sqrt(variance);
};

// 线段和矩形相交(注不包括相切， 即仅有一点相交)
util.intersect = function (line, react) {
  const p1 = new Point(react.x, react.y);
  const p2 = new Point(react.x, react.y + react.height);
  const p3 = new Point(react.x + react.width, react.y + react.height);
  const p4 = new Point(react.x + react.width, react.y);
  const b = this.intersectSegment(line, [p1, p2]) || this.intersectSegment(line, [p2, p3])
  || this.intersectSegment(line, [p3, p4]) || this.intersectSegment(line, [p4, p1]);
  return b;
};

// 线段相交 (注不包括相切， 即仅有一点相交)
util.intersectSegment = function (line1, line2) {
  const b = !(this.inOneSide(line1, line2) || this.inOneSide(line2, line1));
  return b;
};

// line1 在 line2的一侧
util.inOneSide = function (line1, line2) {
  const x1 = line1[0].x;
  const y1 = line1[0].y;
  const x2 = line1[1].x;
  const y2 = line1[1].y;
  const a = (y2 - y1) / (x2 - x1);
  if (isFinite(a)) {
    const b = y1 - (((y2 - y2) / (x2 - x1)) * x1);
    const flag1 = ((line2[0].x * a) + b) - line2[0].y;
    const flag2 = ((line2[1].x * a) + b) - line2[1].y;
    return flag1 * flag2 >= 0;
  }
  return (line2[0].x - x1) * (line2[1].x - x1) >= 0;
};

// 判断该点位于矩形的上下边还是左右边，如果是左右边则返回true， 否则为false
util.getPointMode = function (react, point) {
  return point.x === react.x || point.x === react.x + react.width;
};

util.getMinValidDistance = function (react1, react2) {
  let minPoints = [];
  let minDistance;
  let p1;
  let p2;
  let d;
  let startMode;
  let endMode;
  const pointArr1 = this.genPoints(react1);
  const pointArr2 = this.genPoints(react2);

  for (let i = 0; i < pointArr1.length; i++) {
    for (let j = 0; j < pointArr2.length; j++) {
      p1 = pointArr1[i];
      p2 = pointArr2[j];
      d = this.distance(p1, p2);
      if (this.intersect([p1, p2], react1) || this.intersect([p1, p2], react2)) {
        continue;
      }
      if (minDistance === undefined) {
        minDistance = d;
        minPoints = [p1, p2];
        startMode = this.getPointMode(react1, p1);
        endMode = this.getPointMode(react2, p2);
      } else if (d < minDistance
        // && !this.intersect([p1, p2], react2)
      ) {
        minDistance = d;
        minPoints = [p1, p2];
        startMode = this.getPointMode(react1, p1);
        endMode = this.getPointMode(react2, p2);
      }
    }
  }
  return {
    minDistance,
    minPoints,
    startMode,
    endMode,
  };
};

// mode为true时，连线应该先水平走向，再在中点处垂直连接
util.getPathDesc = function (minPoints, startMode, endMode) {
  const start = minPoints[0];
  const end = minPoints[1];
  const width = end.x - start.x;
  const height = end.y - start.y;
  if (startMode === undefined) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  let d = `M ${start.x} ${start.y}`;
  if (startMode) {
    const midWidth = width / 2;
    d += ` h ${midWidth}`;
    if (endMode) {
      d += ` v ${height} h ${midWidth}`;
    } else {
      d += ` h ${midWidth} v ${height}`;
    }
  } else {
    const midHeight = height / 2;
    d += ` v ${midHeight}`;
    if (!endMode) {
      d += ` h ${width} v ${midHeight}`;
    } else {
      d += ` v ${midHeight} h ${width}`;
    }
  }
  d += `L ${end.x} ${end.y}`;
  return d;
};

// common
util.indexBy = function (object, key) {
  return Object.keys(object).reduce((result, k) => {
    const value = object[k];
    result[value[key]] = value;
    return result;
  }, {});
};

// 简单pojo的克隆，涉及正则/DOM对象的clone请不要使用此方法。
function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// 这个为妥协的做法，最好让后端去修改block type的判断策略，当前后端是根据id上的前缀判断的，很不科学。
// 正常的做法应该是根据id去blocks数组中遍历查询其block的详情。
util.addPrefixForBlockId = (pojo, originBlocks) => {
  if (originBlocks === undefined) {
    originBlocks = clone(pojo);
  }

  const blocks = util.indexBy(originBlocks, 'id');
  for (const prop in pojo) {
    const obj = pojo[prop];
    if (Object.prototype.toString.call(obj) === '[object Object]'
      || Object.prototype.toString.call(obj) === '[object Array]') {
      util.addPrefixForBlockId(obj, originBlocks);
    }
    if (pojo.hasOwnProperty(prop) && blocks[obj]) {
      pojo[prop] = `ui${blocks[obj].type}_${blocks[obj].id}`;
    }
  }
};

function convertBlocks(blocks) {
  return blocks.map((item) => {
    const form = clone(item.form);
    util.addPrefixForBlockId(form, blocks);
    return {
      blockClass: `ui${item.type}`,
      blockId: `ui${item.type}_${item.id}`,
      blockParams: form,
      originData: item,
    };
  });
}

function convertConnections(blocks, connections) {
  const bks = util.indexBy(blocks, 'id');
  return connections.map((item) => {
    const fromBlock = bks[item.from];
    const toBlock = bks[item.to];
    return {
      pageSourceId: `ui${fromBlock.type}_${fromBlock.id}`,
      pageTargetId: `ui${toBlock.type}_${toBlock.id}`,
    };
  });
}

function parseBlocks(blocks) {
  return blocks.map(item => item.originData);
}

function parseConnections(connections) {
  return connections.map((item) => {
    const from = item.pageSourceId.split('_')[1];
    const to = item.pageTargetId.split('_')[1];
    return {
      from,
      to,
    };
  });
}

util.convertForms = function (blocks, connections) {
  return {
    connections: convertConnections(blocks, connections),
    blocks: convertBlocks(blocks),
  };
};

function parseOldConnections(connections) {
  return connections.map((item) => {
    const from = item.pageSourceId.replace('_', '');
    const to = item.pageTargetId.replace('_', '');
    return {
      from,
      to,
    };
  });
}

function parseOldBlocks(blocks) {
  return blocks.map((item) => {
    const type = item.blockClass.replace('ui', '');
    return {
      ...configUtil.getBlock(type),
      name: item.blockParams.name || item.blockText,
      id: item.blockId.replace('_', ''),
      x: item.blockX,
      y: item.blockY,
      form: item.blockParams,
    };
  });
}

util.parseOldForms = function (data) {
  const tmpl = data.template;
  const blockConn = tmpl.split('&');
  let connections = JSON.parse(blockConn[0]);
  let blocks = JSON.parse(blockConn[1]);

  connections = parseOldConnections(connections);
  blocks = parseOldBlocks(blocks);
  return {
    blocks,
    connections,
  };
};

util.parseForms = function (data) {
  const tmpl = data.template;
  const blockConn = tmpl.split('&');
  const connections = JSON.parse(blockConn[0]);
  let blocks = JSON.parse(blockConn[1]);
  const panel = JSON.parse(blockConn[2]);
  // 兼容老版本的资源编排数据格式
  if (panel.length) {
    return this.parseOldForms(data);
  }
  blocks = parseBlocks(blocks);
  return {
    blocks,
    connections: parseConnections(connections),
  };
};

util.getSource = function () {
  const source =  window.orchestrateConfig;
  if (source && source.template) {
    source.template = unescape(source.template);
  }
  return source;
};

util.isReadOnly = function () {
  const source = this.getSource();
  return !!source && source.status === 'CREATE_COMPLETE';
};

util.getAppListLink = function () {
  const source = this.getSource();
  if (source.isAdmin) {
    return '/platformapplication/';
  }
  return '/project/application/';
};

util.handleResError = function (err) {
  const msg = err.responseJSON;
  error(msg || Msg.OPERATE_ERROR);
};

util.saveLocal = function (state) {
  const time = Date.now();
  const data = { ...state, time };
  localStorage.setItem('ra', JSON.stringify(data));
};

util.restoreLocal = function () {
  const data = localStorage.getItem('ra');
  let state;
  try {
    state = JSON.parse(data);
  } catch (e) {
    console.error(e);
  }
  return state;
};

util.clearStore = function () {
  localStorage.removeItem('ra');
};

export default util;
