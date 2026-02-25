import React, { useEffect, useMemo, useRef } from "react";

type Pt = { x: number; y: number };
type Particle = {
  x: number; y: number; vx: number; vy: number;
  z: number; s: number; seed: number;
  tx: number; ty: number; warm: number; alpha: number;
};

function clamp(v: number, a: number, b: number) { return Math.max(a, Math.min(b, v)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function smoothstep(e0: number, e1: number, x: number) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
function rand(seed: number) { const x = Math.sin(seed) * 10000; return x - Math.floor(x); }

function buildHeadSilhouettePoints(count: number): Pt[] {
  const pts: Pt[] = [];
  let tries = 0;
  const inside = (x: number, y: number) => {
    const skull = ((x+.18)**2)/(.55**2)+((y+.05)**2)/(.70**2)<1;
    const jaw = ((x+.10)**2)/(.52**2)+((y-.38)**2)/(.50**2)<1;
    const facePlane = x<.58;
    const foreheadCarve = y<.78-.35*(x+.15);
    const neckCarve = !(x<-.62&&y<-.05);
    const underChin = !(((x-.28)**2)/(.22**2)+((y+.28)**2)/(.16**2)<1);
    const nose = ((x-.52)**2)/(.10**2)+((y+.02)**2)/(.10**2)<1;
    const lips = ((x-.50)**2)/(.11**2)+((y-.12)**2)/(.08**2)<1;
    const chin = ((x-.42)**2)/(.15**2)+((y-.28)**2)/(.12**2)<1;
    const base = (skull||jaw)&&facePlane&&foreheadCarve&&neckCarve&&underChin;
    return base&&(x<.35||nose||lips||chin);
  };
  while(pts.length<count&&tries<count*60){
    tries++;
    const x=lerp(-.85,.78,Math.random()), y=lerp(-.85,.85,Math.random());
    if(!inside(x,y)) continue;
    const brainBias=smoothstep(-.05,.65,y)*smoothstep(-.2,.55,x);
    const faceBias=smoothstep(.05,.75,x)*smoothstep(-.3,.35,-Math.abs(y-.05));
    if(Math.random()<clamp(.35+.45*brainBias+.25*faceBias,.12,.92)) pts.push({x,y});
  }
  while(pts.length<count) pts.push({x:lerp(-.6,.6,Math.random()),y:lerp(-.6,.6,Math.random())});
  return pts;
}

function buildEyeClusterPoints(count: number): Pt[] {
  const pts: Pt[]=[];
  for(let i=0;i<count;i++){
    const a=Math.random()*Math.PI*2, r=Math.pow(Math.random(),.55);
    pts.push({x:.40+Math.cos(a)*.11*r, y:-.02+Math.sin(a)*.06*r});
  }
  return pts;
}

function buildOrbitTargets(count: number){
  const coreCount=Math.floor(count*.22), ringCount=count-coreCount;
  const core: Pt[]=[];
  for(let i=0;i<coreCount;i++){
    const a=Math.random()*Math.PI*2, r=Math.pow(Math.random(),.6)*.12;
    core.push({x:Math.cos(a)*r,y:Math.sin(a)*r});
  }
  const rings: Pt[]=[];
  const ringMeta=[{r:.28,w:.06},{r:.42,w:.07},{r:.58,w:.08}];
  for(let i=0;i<ringCount;i++){
    const{r,w}=ringMeta[i%3];
    const a=Math.random()*Math.PI*2, rr=r+(Math.random()-.5)*w;
    rings.push({x:Math.cos(a)*rr,y:Math.sin(a)*rr});
  }
  return {core,rings};
}

export default function HeroSection(){
  const canvasRef=useRef<HTMLCanvasElement|null>(null);
  const wrapRef=useRef<HTMLDivElement|null>(null);

  const formations=useMemo(()=>({
    head:buildHeadSilhouettePoints(5200),
    eye:buildEyeClusterPoints(1100),
    orbits:buildOrbitTargets(5200),
  }),[]);

  useEffect(()=>{
    const canvas=canvasRef.current, wrap=wrapRef.current;
    if(!canvas||!wrap) return;
    const ctx=canvas.getContext("2d",{alpha:true});
    if(!ctx) return;

    const prefersReduced=window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let w=0,h=0;
    const resize=()=>{
      const rect=wrap.getBoundingClientRect();
      w=Math.max(1,Math.floor(rect.width));
      h=Math.max(1,Math.floor(rect.height));
      const dpr=Math.min(2,window.devicePixelRatio||1);
      canvas.width=Math.floor(w*dpr);
      canvas.height=Math.floor(h*dpr);
      canvas.style.width=`${w}px`;
      canvas.style.height=`${h}px`;
      ctx.setTransform(dpr,0,0,dpr,0,0);
    };
    resize();
    window.addEventListener("resize",resize);

    const area=w*h;
    const baseCount=prefersReduced?1400:2400;
    const maxCount=prefersReduced?2400:5200;
    const targetCount=clamp(Math.floor((area/(1100*700))*baseCount),baseCount,maxCount);

    const particles: Particle[]=Array.from({length:targetCount},(_,i)=>({
      x:(rand(i*1.7)-.5)*w, y:(rand(i*2.7)-.5)*h,
      vx:0, vy:0, z:rand(i*7.77)*2-1,
      s:.6+rand(i*11.3)*1.2, seed:i+1,
      tx:0, ty:0, warm:rand(i*19.1)>.56?1:0, alpha:.85,
    }));

    const ACT={
      entropy:{a:0,b:3}, field:{a:3,b:6}, converge:{a:6,b:11},
      aware:{a:11,b:15}, institutional:{a:15,b:20}, dissolve:{a:20,b:21.5},
    };
    const LOOP=ACT.dissolve.b;

    let camT=0,camX=0,camY=0;

    const headPts=formations.head.slice(0,targetCount);
    const eyePts=formations.eye.slice(0,Math.floor(targetCount*.22));
    const orbitCore=formations.orbits.core.slice(0,Math.floor(targetCount*.22));
    const orbitRings=formations.orbits.rings.slice(0,targetCount-orbitCore.length);

    const toScreen=(p:Pt,scale=.86,ox=0,oy=0)=>{
      const s=Math.min(w,h)*.52*scale;
      return {x:p.x*s+ox, y:p.y*s+oy};
    };

    const warmTarget=(t:number)=>clamp(
      smoothstep(ACT.converge.a,ACT.converge.b,t)*.55+
      smoothstep(ACT.aware.a,ACT.aware.b,t)*.25+
      smoothstep(ACT.institutional.a,ACT.institutional.b,t)*.25,0,1);

    const drawVignette=()=>{
      const g=ctx.createRadialGradient(w*.52,h*.52,Math.min(w,h)*.05,w*.52,h*.52,Math.min(w,h)*.78);
      g.addColorStop(0,"rgba(0,0,0,0)"); g.addColorStop(1,"rgba(0,0,0,0.55)");
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    };

    const drawGrid=(a:number)=>{
      if(a<=.001) return;
      ctx.save(); ctx.globalAlpha=a;
      ctx.strokeStyle="rgba(189,166,255,0.08)"; ctx.lineWidth=1;
      const step=Math.max(38,Math.min(64,Math.floor(Math.min(w,h)/16)));
      const dx=camX*.12, dy=camY*.08;
      for(let x=-step;x<w+step;x+=step){ctx.beginPath();ctx.moveTo(x+dx,0);ctx.lineTo(x+dx,h);ctx.stroke();}
      for(let y=-step;y<h+step;y+=step){ctx.beginPath();ctx.moveTo(0,y+dy);ctx.lineTo(w,y+dy);ctx.stroke();}
      ctx.restore();
    };

    const drawSoftHaze=(strength:number)=>{
      if(strength<=.001) return;
      ctx.save(); ctx.globalAlpha=strength;
      let g=ctx.createRadialGradient(w*.35+camX*.2,h*.55+camY*.2,0,w*.35,h*.55,Math.min(w,h)*.75);
      g.addColorStop(0,"rgba(123,97,255,0.18)"); g.addColorStop(1,"rgba(123,97,255,0)");
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      g=ctx.createRadialGradient(w*.72+camX*.15,h*.62+camY*.15,0,w*.72,h*.62,Math.min(w,h)*.80);
      g.addColorStop(0,"rgba(232,150,124,0.14)"); g.addColorStop(1,"rgba(232,150,124,0)");
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      ctx.restore();
    };

    const drawEyeGlow=(t:number,a:number)=>{
      if(a<=.001) return;
      const anchor=toScreen({x:.40,y:-.02},.88,w*.02,0);
      const pulse=.5+.5*Math.sin(t*2.1);
      const r=Math.min(w,h)*.10*(.75+.12*pulse);
      ctx.save(); ctx.globalAlpha=a;
      const g=ctx.createRadialGradient(anchor.x,anchor.y,0,anchor.x,anchor.y,r);
      g.addColorStop(0,"rgba(242,193,174,0.28)"); g.addColorStop(.35,"rgba(232,150,124,0.14)"); g.addColorStop(1,"rgba(189,166,255,0)");
      ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
      ctx.restore();
    };

    let raf=0;
    const start=performance.now();
    let last=start;

    const frame=(now:number)=>{
      const dt=Math.min(.033,(now-last)/1000);
      last=now;
      const elapsed=(now-start)/1000;
      const t=elapsed%LOOP;

      camT+=dt;
      const camEase=.65+.35*Math.sin(camT*.25);
      camX=Math.sin(camT*.18)*18*camEase;
      camY=Math.cos(camT*.14)*12*camEase;

      const aEntropy=smoothstep(ACT.entropy.a,ACT.entropy.b,t)*(1-smoothstep(ACT.field.a,ACT.field.b,t));
      const aField=smoothstep(ACT.field.a,ACT.field.b,t)*(1-smoothstep(ACT.converge.a,ACT.converge.b,t));
      const aConverge=smoothstep(ACT.converge.a,ACT.converge.b,t)*(1-smoothstep(ACT.aware.a,ACT.aware.b,t));
      const aAware=smoothstep(ACT.aware.a,ACT.aware.b,t)*(1-smoothstep(ACT.institutional.a,ACT.institutional.b,t));
      const aInstitutional=smoothstep(ACT.institutional.a,ACT.institutional.b,t)*(1-smoothstep(ACT.dissolve.a,ACT.dissolve.b,t));
      const aDissolve=smoothstep(ACT.dissolve.a,ACT.dissolve.b,t);

      ctx.clearRect(0,0,w,h);
      drawSoftHaze(.35+.25*aConverge+.25*aAware);
      drawGrid(.14*aField+.22*aConverge+.26*aAware+.18*aInstitutional);
      drawEyeGlow(t,.7*aAware);

      const temperature=1*(1-smoothstep(ACT.field.a,ACT.converge.b,t))+.35*smoothstep(ACT.field.a,ACT.converge.b,t)-.10*aInstitutional;
      const coherence=.05+.70*smoothstep(ACT.field.a,ACT.converge.b,t)+.18*aAware+.28*aInstitutional-.30*aDissolve;
      const driftOut=aDissolve;

      const centerX=w*.02, centerY=h*.06;
      const cols=30, rows=18;
      const padX=w*.10, padY=h*.18;
      const gx=(w-padX*2)/(cols-1), gy=(h-padY*2)/(rows-1);

      const wantMesh=!prefersReduced&&(aConverge+aAware+aInstitutional)>.15;
      const bucketSize=90;
      const buckets=wantMesh?new Map<string,number[]>():null;
      const keyFor=(x:number,y:number)=>`${Math.floor(x/bucketSize)}:${Math.floor(y/bucketSize)}`;
      const warmAmp=warmTarget(t);

      ctx.save();
      ctx.globalCompositeOperation="lighter";

      for(let i=0;i<particles.length;i++){
        const p=particles[i];
        const jj=(rand(p.seed*3.1+elapsed)-.5)*2;
        const kk=(rand(p.seed*8.7+elapsed*1.33)-.5)*2;

        const gi=i%(cols*rows);
        const fieldX=padX+(gi%cols)*gx-w/2+centerX;
        const fieldY=padY+(Math.floor(gi/cols)%rows)*gy-h/2+centerY;

        const hp=headPts[i]||headPts[i%headPts.length];
        const hs=toScreen(hp,.88,centerX,centerY);

        const eyePick=i<eyePts.length;
        const es=eyePick?toScreen(eyePts[i],.94,centerX,centerY):null;

        const corePick=i<orbitCore.length;
        const op=corePick?orbitCore[i]:orbitRings[i-orbitCore.length];
        const os=toScreen(op,.92,centerX,centerY);

        let tx=p.x, ty=p.y;
        const fieldPull=.38*aField+.18*aConverge;
        tx=lerp(tx,fieldX,fieldPull); ty=lerp(ty,fieldY,fieldPull);
        tx=lerp(tx,hs.x,.78*aConverge+.42*aAware); ty=lerp(ty,hs.y,.78*aConverge+.42*aAware);
        if(eyePick&&es){tx=lerp(tx,es.x,.65*aAware); ty=lerp(ty,es.y,.65*aAware);}
        tx=lerp(tx,os.x,.78*aInstitutional); ty=lerp(ty,os.y,.78*aInstitutional);

        if(driftOut>.001){
          tx=lerp(tx,p.x*1.5+(rand(p.seed*2.2)-.5)*w*.35,.75*driftOut);
          ty=lerp(ty,p.y*1.5+(rand(p.seed*5.6)-.5)*h*.35,.75*driftOut);
        }

        p.tx=tx; p.ty=ty;
        const pull=.55*coherence, noise=22*temperature;
        p.vx=(p.vx+(p.tx-p.x)*pull+jj*noise*.02)*(1-.12*coherence);
        p.vy=(p.vy+(p.ty-p.y)*pull+kk*noise*.02)*(1-.12*coherence);
        p.x+=p.vx*dt*60;
        p.y+=p.vy*dt*60;

        const px=p.x+camX*(.25+.55*(p.z+1)*.5);
        const py=p.y+camY*(.20+.45*(p.z+1)*.5);

        const warmness=p.warm?warmAmp:0;
        const r=Math.floor(lerp(175,242,warmness));
        const g=Math.floor(lerp(160,193,warmness));
        const b=Math.floor(lerp(255,174,warmness));
        const baseA=.35+.22*aField+.30*aConverge+.32*aAware+.26*aInstitutional-.18*aEntropy;
        const size=(1.2+1.2*aConverge+1.6*aAware+1.2*aInstitutional)*p.s;

        ctx.globalAlpha=clamp(baseA*p.alpha,.05,.9);
        ctx.fillStyle=`rgba(${r},${g},${b},1)`;
        ctx.beginPath(); ctx.arc(px+w/2,py+h/2,.9*size,0,Math.PI*2); ctx.fill();

        if(aAware>.15&&i%48===0){
          ctx.globalAlpha=(.25+.35*(.5+.5*Math.sin(elapsed*6.5+i)))*aAware;
          ctx.fillStyle="rgba(255,255,255,1)";
          ctx.beginPath(); ctx.arc(px+w/2,py+h/2,.55*size,0,Math.PI*2); ctx.fill();
        }

        if(wantMesh&&buckets){
          const bk=keyFor(px+w/2,py+h/2);
          const arr=buckets.get(bk)||[];
          arr.push(i);
          buckets.set(bk,arr);
        }
      }

      if(wantMesh&&buckets){
        ctx.save();
        ctx.globalAlpha=clamp(.12*aConverge+.20*aAware+.18*aInstitutional,0,.22);
        ctx.lineWidth=1;
        const maxDist2=130*130;
        for(const[k,arr] of buckets.entries()){
          const[bx,by]=k.split(":").map(Number);
          for(let ox=-1;ox<=1;ox++){
            for(let oy=-1;oy<=1;oy++){
              const other=buckets.get(`${bx+ox}:${by+oy}`);
              if(!other) continue;
              for(let a=0;a<arr.length;a++){
                const ii=arr[a];
                const p1=particles[ii];
                const x1=p1.x+camX*(.25+.55*(p1.z+1)*.5)+w/2;
                const y1=p1.y+camY*(.20+.45*(p1.z+1)*.5)+h/2;
                let links=0;
                for(let b=0;b<other.length&&links<2;b++){
                  const jj2=other[b];
                  if(jj2===ii) continue;
                  const p2=particles[jj2];
                  const x2=p2.x+camX*(.25+.55*(p2.z+1)*.5)+w/2;
                  const y2=p2.y+camY*(.20+.45*(p2.z+1)*.5)+h/2;
                  if((x2-x1)**2+(y2-y1)**2<maxDist2){
                    const ww=warmTarget(t);
                    ctx.strokeStyle=`rgba(${Math.floor(lerp(189,232,ww))},${Math.floor(lerp(166,150,ww))},${Math.floor(lerp(255,124,ww))},${lerp(.08,.15,ww)})`;
                    ctx.beginPath(); ctx.moveTo(x1,y1); ctx.lineTo(x2,y2); ctx.stroke();
                    links++;
                  }
                }
              }
            }
          }
        }
        ctx.restore();
      }

      ctx.restore();
      drawVignette();
      raf=requestAnimationFrame(frame);
    };

    raf=requestAnimationFrame(frame);
    return ()=>{cancelAnimationFrame(raf); window.removeEventListener("resize",resize);};
  },[formations]);

  return (
    <section ref={wrapRef} style={{
      position:"relative", width:"100%", height:"min(92vh, 860px)", minHeight:"560px", overflow:"hidden",
      background:
        "radial-gradient(circle at 35% 55%, rgba(123,97,255,0.25), rgba(10,8,20,0) 60%),"+
        "radial-gradient(circle at 78% 62%, rgba(232,150,124,0.18), rgba(10,8,20,0) 62%),"+
        "linear-gradient(180deg, #070813 0%, #070814 30%, #0B0613 100%)",
    }}>
      <canvas ref={canvasRef} aria-hidden="true" style={{position:"absolute",inset:0,width:"100%",height:"100%"}} />
      <div aria-hidden="true" style={{
        position:"absolute",inset:0,pointerEvents:"none",
        backgroundImage:"radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05), transparent 45%),radial-gradient(circle at 80% 60%, rgba(255,255,255,0.035), transparent 50%)",
        mixBlendMode:"overlay",opacity:.7,
      }} />
      <div style={{position:"absolute",left:"clamp(18px, 3vw, 48px)",right:"clamp(18px, 3vw, 48px)",top:"clamp(22px, 4vh, 54px)",pointerEvents:"none"}}>
        <div style={{
          fontFamily:"Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
          fontWeight:900, letterSpacing:"-.02em", lineHeight:.86,
          fontSize:"clamp(56px, 12vw, 190px)", textTransform:"uppercase",
          background:"linear-gradient(90deg, rgba(189,166,255,0.95), rgba(242,193,174,0.92), rgba(123,97,255,0.95))",
          WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent",
          textShadow:"0 18px 60px rgba(0,0,0,0.42)", userSelect:"none",
        }}>
          INTELLIGENCE
        </div>
        <div style={{
          marginTop:"clamp(10px, 1.6vh, 16px)",
          fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
          fontSize:"11px", letterSpacing:".28em", textTransform:"uppercase",
          color:"rgba(243,239,255,0.55)", userSelect:"none",
        }}>
          Intelligence is not a model — it&apos;s a convergence
        </div>
      </div>
      <div style={{
        position:"absolute",left:0,right:0,bottom:"20px",textAlign:"center",pointerEvents:"none",
        fontFamily:"ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
        fontSize:"10px",letterSpacing:".28em",textTransform:"uppercase",
        color:"rgba(243,239,255,0.35)",userSelect:"none",
      }}>
        DOCG AI • Cognitive Infrastructure
      </div>
    </section>
  );
}
