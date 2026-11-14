// クラス図のパネル (クラスのページの「クラス図」タブ)
//
// SOGH のデータモデルのクラスを SVG で描く。
// クラスのデータは class_diagram/CLASSES.js (src/js から生成したもの)、
// 配置は class_diagram/layout.js で計算する。
//
// 操作: ホイールで拡大・縮小、ドラッグで移動。
import React from 'react';

import { CLASSES, SOURCE } from './class_diagram/CLASSES.js';
import layout, { FONT } from './class_diagram/layout.js';

// iHub の配色 (src/config/COLORS.js) に合わせる。
const C = {
    base:   '#F4F1F6',
    main:   '#574C57',
    sub:    '#A6A5C4',
    accent: '#9D5B8B',
    paper:  '#FFFFFF',
    head:   '#F3E9F1',
    muted:  '#8A8A8A',
    deprecatedHead: '#EEEEEE',
};

const ZOOM_MIN = 0.05;
const ZOOM_MAX = 4;

// 左にはサイドメニューが重なるので、その分を空ける。
const INSET_LEFT = 88;

export default function ClassDiagram () {
    const [show, setShow] = React.useState({ fields: true, methods: true });
    const diagram = React.useMemo(()=> layout(CLASSES, show), [show]);

    const ref = React.useRef(null);
    const size = useElementSize(ref);
    const [view, setView] = React.useState(null);   // { x, y, k }
    const drag = React.useRef(null);
    const [dragging, setDragging] = React.useState(false);

    const fit = React.useCallback(()=> {
        if (!size) return;
        setView(fitView(diagram, size));
    }, [diagram, size]);

    // 最初と、表示を切り替えたときは、全体を表示する。
    React.useEffect(()=> { fit(); }, [diagram, size !== null]); // eslint-disable-line react-hooks/exhaustive-deps

    // ホイールで拡大・縮小 (カーソルの位置を中心にする)。
    // React の onWheel は passive なので preventDefault できない。自分で登録する。
    React.useEffect(()=> {
        const el = ref.current;
        if (!el) return undefined;

        const onWheel = (e)=> {
            e.preventDefault();
            const rect = el.getBoundingClientRect();
            const factor = Math.exp(-e.deltaY * 0.0015);
            setView(v=> v && zoomAt(v, factor, e.clientX - rect.left, e.clientY - rect.top));
        };

        el.addEventListener('wheel', onWheel, { passive: false });
        return ()=> el.removeEventListener('wheel', onWheel);
    }, []);

    const onPointerDown = (e)=> {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        drag.current = { x: e.clientX, y: e.clientY };
        setDragging(true);
    };
    const onPointerMove = (e)=> {
        if (!drag.current) return;
        const dx = e.clientX - drag.current.x;
        const dy = e.clientY - drag.current.y;
        drag.current = { x: e.clientX, y: e.clientY };
        setView(v=> v && { ...v, x: v.x + dx, y: v.y + dy });
    };
    const onPointerUp = ()=> { drag.current = null; setDragging(false); };

    const zoomCenter = (factor)=> {
        if (!size) return;
        setView(v=> v && zoomAt(v, factor, size.width / 2, size.height / 2));
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.base }}>
          {/* 線の端の記号は、ここで 1 度だけ定義する。(id が重ならないように) */}
          <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
            <Markers/>
          </svg>

          <Toolbar show={show}
                   onChangeShow={setShow}
                   zoom={view ? view.k : 1}
                   onFit={fit}
                   onZoomIn={()=> zoomCenter(1.25)}
                   onZoomOut={()=> zoomCenter(1 / 1.25)}/>

          <div ref={ref}
               style={{ flex: 1, minHeight: 0, overflow: 'hidden', cursor: dragging ? 'grabbing' : 'grab', touchAction: 'none' }}
               onPointerDown={onPointerDown}
               onPointerMove={onPointerMove}
               onPointerUp={onPointerUp}
               onPointerCancel={onPointerUp}>
            {size && view && (
                <svg width={size.width} height={size.height} style={{ display: 'block', userSelect: 'none' }}>
                  <g transform={`translate(${view.x},${view.y}) scale(${view.k})`}>
                    {diagram.packages.map(p=> <Package key={p.label} data={p}/>)}
                    {diagram.edges.map((e, i)=> <Edge key={i} data={e}/>)}
                    {Object.values(diagram.boxes).map(b=> <ClassBox key={b.cls.name} box={b} show={show}/>)}
                  </g>
                </svg>
            )}
          </div>
        </div>
    );
}

/* **************************************************************** *
 *  表示の位置と倍率
 * **************************************************************** */
function fitView (diagram, size) {
    const pad = 16;
    const width = size.width - INSET_LEFT - pad;
    const k = clamp(Math.min(
        width / diagram.width,
        (size.height - pad * 2) / diagram.height,
        1,
    ), ZOOM_MIN, ZOOM_MAX);

    return {
        k,
        x: INSET_LEFT + (width - diagram.width * k) / 2,
        y: pad,
    };
}

function zoomAt (v, factor, px, py) {
    const k = clamp(v.k * factor, ZOOM_MIN, ZOOM_MAX);
    const r = k / v.k;

    return { k, x: px - (px - v.x) * r, y: py - (py - v.y) * r };
}

function clamp (v, min, max) {
    return Math.min(max, Math.max(min, v));
}

function useElementSize (ref) {
    const [size, setSize] = React.useState(null);

    React.useEffect(()=> {
        const el = ref.current;
        if (!el) return undefined;

        const observer = new ResizeObserver(([entry])=> {
            const { width, height } = entry.contentRect;
            if (width > 0 && height > 0)
                setSize({ width, height });
        });

        observer.observe(el);
        return ()=> observer.disconnect();
    }, [ref]);

    return size;
}

/* **************************************************************** *
 *  ツールバー
 * **************************************************************** */
function Toolbar ({ show, onChangeShow, zoom, onFit, onZoomIn, onZoomOut }) {
    const toggle = (key)=> onChangeShow({ ...show, [key]: !show[key] });

    const button = { padding: '2px 10px', border: `1px solid ${C.sub}`, borderRadius: 4, background: C.paper, color: C.main, cursor: 'pointer', fontSize: 13 };

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 16, padding: `8px 16px 8px ${INSET_LEFT}px`, color: C.main, fontSize: 13, borderBottom: `1px solid ${C.sub}` }}>
          <label style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={show.fields} onChange={()=> toggle('fields')}/> 属性
          </label>
          <label style={{ cursor: 'pointer' }}>
            <input type="checkbox" checked={show.methods} onChange={()=> toggle('methods')}/> メソッド
          </label>

          <span style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
            <button type="button" style={button} onClick={onZoomOut} title="縮小">−</button>
            <span style={{ minWidth: 44, textAlign: 'center' }}>{Math.round(zoom * 100)}%</span>
            <button type="button" style={button} onClick={onZoomIn} title="拡大">＋</button>
            <button type="button" style={button} onClick={onFit}>全体を表示</button>
          </span>

          <Legend/>

          <span style={{ marginLeft: 'auto', color: C.muted, fontSize: 12 }}>
            {CLASSES.length} クラス ・ 生成元 {SOURCE.path} (コミット {SOURCE.commit})
          </span>
        </div>
    );
}

function Legend () {
    const item = (type, label)=> (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <svg width="44" height="14">
            <Edge data={{ type, points: type==='composition' || type==='aggregation' ? [[4, 7], [40, 7]] : [[2, 7], [40, 7]] }}/>
          </svg>
          {label}
        </span>
    );

    return (
        <span style={{ display: 'flex', gap: 12, alignItems: 'center', color: C.main, fontSize: 12 }}>
          {item('generalization', '継承')}
          {item('composition', 'コンポジション')}
          {item('aggregation', '集約')}
          {item('association', '関連')}
        </span>
    );
}

/* **************************************************************** *
 *  図の部品
 * **************************************************************** */
function Markers () {
    // 線の端の記号。markerUnits を userSpaceOnUse にして、線の太さで大きさが変わらないようにする。
    return (
        <defs>
          <marker id="cd-generalization" viewBox="0 0 14 14" refX="13" refY="7" markerWidth="14" markerHeight="14" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M1,1 L13,7 L1,13 z" fill={C.paper} stroke={C.main} strokeWidth="1.2"/>
          </marker>
          <marker id="cd-association" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="12" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M1,1 L11,6 L1,11" fill="none" stroke={C.main} strokeWidth="1.2"/>
          </marker>
          <marker id="cd-composition" viewBox="0 0 18 12" refX="1" refY="6" markerWidth="18" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M1,6 L9,1 L17,6 L9,11 z" fill={C.main} stroke={C.main} strokeWidth="1"/>
          </marker>
          <marker id="cd-aggregation" viewBox="0 0 18 12" refX="1" refY="6" markerWidth="18" markerHeight="12" markerUnits="userSpaceOnUse" orient="auto">
            <path d="M1,6 L9,1 L17,6 L9,11 z" fill={C.paper} stroke={C.main} strokeWidth="1"/>
          </marker>
        </defs>
    );
}

function Edge ({ data }) {
    const points = data.points.map(([x, y])=> `${x},${y}`).join(' ');

    const marker_end   = (data.type==='generalization' || data.type==='association') ? `url(#cd-${data.type})` : undefined;
    const marker_start = (data.type==='composition'   || data.type==='aggregation') ? `url(#cd-${data.type})` : undefined;

    return (
        <g>
          <polyline points={points}
                    fill="none"
                    stroke={C.main}
                    strokeWidth={1.2}
                    markerEnd={marker_end}
                    markerStart={marker_start}/>
          {data.label && (
              <text x={data.label_at[0]}
                    y={data.label_at[1]}
                    textAnchor={data.label_anchor || 'middle'}
                    fontFamily={FONT.family}
                    fontSize={11}
                    fill={C.accent}>
                {data.label}
              </text>
          )}
        </g>
    );
}

function Package ({ data }) {
    return (
        <g>
          <rect x={data.x} y={data.y} width={data.w} height={data.h}
                rx={6}
                fill="none"
                stroke={C.sub}
                strokeWidth={1.2}
                strokeDasharray="6 4"/>
          <text x={data.x + 12} y={data.y + 16} fontSize={13} fontWeight="bold" fill={C.sub}>
            {data.label}
          </text>
        </g>
    );
}

function ClassBox ({ box, show }) {
    const { x, y, w, h, cls, deprecated } = box;

    const border = deprecated ? C.muted : C.main;
    const text   = deprecated ? C.muted : C.main;
    const line_y = (top, i)=> top + 6 + FONT.lineHeight * i + FONT.size;

    let top = y + box.head_h;
    const fields_top = top;
    top += box.fields_h;
    const methods_top = top;

    return (
        <g>
          <title>{`${cls.name}${cls.extends ? ' extends ' + cls.extends : ''}\n${cls.file}`}</title>

          <rect x={x} y={y} width={w} height={h}
                fill={C.paper}
                stroke={border}
                strokeWidth={1.2}
                strokeDasharray={deprecated ? '5 3' : undefined}/>
          <rect x={x} y={y} width={w} height={box.head_h}
                fill={deprecated ? C.deprecatedHead : C.head}
                stroke={border}
                strokeWidth={1.2}
                strokeDasharray={deprecated ? '5 3' : undefined}/>

          {deprecated && (
              <text x={x + w / 2} y={y + 13} textAnchor="middle" fontSize={10} fill={C.muted}>
                «classic・廃止予定»
              </text>
          )}
          <text x={x + w / 2} y={y + (deprecated ? 14 : 0) + 18}
                textAnchor="middle"
                fontFamily={FONT.family}
                fontSize={FONT.nameSize}
                fontWeight="bold"
                fill={text}>
            {cls.name}
          </text>
          <text x={x + w / 2} y={y + (deprecated ? 14 : 0) + 32}
                textAnchor="middle"
                fontFamily={FONT.family}
                fontSize={FONT.fileSize}
                fill={C.muted}>
            {cls.file}
          </text>

          {show.fields && (
              <>
                {box.fields.map((s, i)=> (
                    <text key={i} x={x + 10} y={line_y(fields_top, i)} fontFamily={FONT.family} fontSize={FONT.size} fill={text}>
                      {s}
                    </text>
                ))}
              </>
          )}

          {show.fields && show.methods && (
              <line x1={x} y1={methods_top} x2={x + w} y2={methods_top} stroke={border} strokeWidth={1}/>
          )}

          {show.methods && (
              <>
                {box.methods.map((s, i)=> (
                    <text key={i} x={x + 10} y={line_y(methods_top, i)} fontFamily={FONT.family} fontSize={FONT.size} fill={text}>
                      {s}
                    </text>
                ))}
              </>
          )}
        </g>
    );
}
