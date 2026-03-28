import { useState, useEffect, useRef, useMemo, createContext, useContext } from "react";

/* ═══════════════════════════════════════════════════
   ML LERNAPP — Paper/Terminal Theme, Tag/Nacht
   ═══════════════════════════════════════════════════ */

// ── THEMES ──
const THEMES = {
  "paper-light": {
    bg:"#faf8f5",bgS:"#f3f0eb",bgC:"#f3f0eb",bgCA:"#ede8e0",bgAS:"#fdf4e8",bgASS:"#fef9f2",bgI:"#faf8f5",
    bd:"#e5e0d8",bdA:"#f0dfc4",ac:"#c47a2a",acL:"#d4943a",
    tx:"#2c2416",txB:"#6b5d4f",txM:"#a09585",txF:"#c4b8a8",w:"#fff",
    ok:"#5a8a5e",okBg:"#f0f7f0",err:"#b85450",errBg:"#fdf2f1",
    inf:"#5a7a9a",infBg:"#f0f4f8",math:"#7a5a8a",mathBg:"#f8f2fa",
    hf:"Georgia,'Times New Roman',serif",sf:"'Inter',system-ui,sans-serif",mf:"inherit",
    st:"ML Academy",term:false,
  },
  "paper-dark": {
    bg:"#1a1714",bgS:"#15120f",bgC:"#1f1c17",bgCA:"#252118",bgAS:"#2a2215",bgASS:"#1f1c17",bgI:"#15120f",
    bd:"#2e2920",bdA:"#3a3225",ac:"#d4943a",acL:"#e4b44a",
    tx:"#e8e0d4",txB:"#a89880",txM:"#7a6e5e",txF:"#4a4238",w:"#fff",
    ok:"#6a9a6e",okBg:"#1a261a",err:"#c86460",errBg:"#2a1a18",
    inf:"#6a8aaa",infBg:"#1a2028",math:"#9a7aaa",mathBg:"#221a28",
    hf:"Georgia,'Times New Roman',serif",sf:"'Inter',system-ui,sans-serif",mf:"inherit",
    st:"ML Academy",term:false,
  },
  "terminal-light": {
    bg:"#f4f6f8",bgS:"#ebeef2",bgC:"#ebeef2",bgCA:"#e2e6ea",bgAS:"#e8f4f8",bgASS:"#f0f8fc",bgI:"#f4f6f8",
    bd:"#d0d6de",bdA:"#b8d8e8",ac:"#0a7ea4",acL:"#12a4d0",
    tx:"#1a2028",txB:"#4a5568",txM:"#8896a6",txF:"#b8c4d0",w:"#fff",
    ok:"#0a8a4a",okBg:"#e8f8f0",err:"#d03030",errBg:"#fdf0f0",
    inf:"#0a7ea4",infBg:"#e8f4f8",math:"#6a4a9a",mathBg:"#f4f0fa",
    hf:"'Inter',system-ui,sans-serif",sf:"'Inter',system-ui,sans-serif",
    mf:"'JetBrains Mono','Fira Code',monospace",st:"> ml_academy",term:true,
  },
  "terminal-dark": {
    bg:"#0a0e14",bgS:"#0d1117",bgC:"#111820",bgCA:"#161d28",bgAS:"#0a1a24",bgASS:"#0d1520",bgI:"#0d1117",
    bd:"#1b2530",bdA:"#0ea5e930",ac:"#0ea5e9",acL:"#38bdf8",
    tx:"#e2e8f0",txB:"#8896a8",txM:"#4a5a6a",txF:"#2a3540",w:"#fff",
    ok:"#10b981",okBg:"#0a1f18",err:"#ef4444",errBg:"#1f0a0a",
    inf:"#0ea5e9",infBg:"#0a1520",math:"#a78bfa",mathBg:"#140f20",
    hf:"'Inter',system-ui,sans-serif",sf:"'Inter',system-ui,sans-serif",
    mf:"'JetBrains Mono','Fira Code',monospace",st:"> ml_academy_",term:true,
  },
};

const Ctx = createContext({theme:THEMES["paper-light"],completed:{},markComplete:()=>{},unmarkComplete:()=>{},ak:"",setAk:()=>{},prov:"openai",setProv:()=>{}});
const useT = () => useContext(Ctx).theme;
const useApp = () => useContext(Ctx);

// ── MODULE DEFS ──
const MODS_LEARN = [
  {id:"welcome",title:"Was ist KI?",n:"01",tt:"01_ki_intro"},
  {id:"data",title:"Daten & Muster",n:"02",tt:"02_daten"},
  {id:"supervised",title:"Supervised Learning",n:"03",tt:"03_supervised"},
  {id:"gradient",title:"Gradient Descent",n:"04",tt:"04_gradient"},
  {id:"neural",title:"Neuronale Netze",n:"05",tt:"05_neural_nets"},
  {id:"deep",title:"Deep Learning",n:"06",tt:"06_deep_learning"},
  {id:"quiz",title:"Wissenstest",n:"07",tt:"07_quiz"},
  {id:"tutor",title:"AI Tutor",n:"08",tt:"08_ai_tutor"},
];
const MODS_PROJ = [
  {id:"guide",title:"Projektbegleiter",n:"P1",tt:"p1_guide"},
  {id:"ideas",title:"Ideenbewertung",n:"P2",tt:"p2_ideen"},
];
// Sebbi-exklusiv: PA-Kompass erscheint nur fuer Sebbi in der Sidebar
const MODS_SEBBI = [
  {id:"compass",title:"Sebbis Hyperfokus-HQ",n:"🧠",tt:"hyperfokus_hq"},
  {id:"simulation",title:"PA-Simulation",n:"📄",tt:"pa_simulation"},
];
const ALL_MODS_FOR=(author)=>[...MODS_LEARN,...MODS_PROJ,...(author==="Sebbi"?MODS_SEBBI:[])];

// ── SHARED UI ──
const Bar = ({p}) => {
  const t=useT();
  return <div style={{width:"100%",height:4,borderRadius:2,background:t.bd}}>
    <div style={{height:4,borderRadius:2,width:`${p}%`,background:`linear-gradient(90deg,${t.ac},${t.acL})`,transition:"width .5s"}}/>
  </div>;
};

const Info = ({title,children,type="info"}) => {
  const t=useT();
  const m={info:{b:t.inf,bg:t.infBg,l:"Hinweis"},tip:{b:t.ok,bg:t.okBg,l:"Merke"},math:{b:t.math,bg:t.mathBg,l:"Mathematik"},warning:{b:t.ac,bg:t.bgAS,l:"Achtung"}};
  const s=m[type];
  return <div style={{borderLeft:`3px solid ${s.b}`,background:s.bg,borderRadius:"0 8px 8px 0",padding:"16px 20px",margin:"20px 0"}}>
    <div style={{fontFamily:t.hf,fontSize:13,fontWeight:700,color:s.b,marginBottom:6}}>{s.l}{title?` — ${title}`:""}</div>
    <div style={{fontFamily:t.sf,fontSize:13.5,lineHeight:1.7,color:t.txB}}>{children}</div>
  </div>;
};

const ST = ({children}) => {const t=useT();return <h2 style={{fontFamily:t.hf,fontSize:20,fontWeight:700,color:t.tx,marginTop:36,marginBottom:14}}>{children}</h2>;};
const P = ({children}) => {const t=useT();return <p style={{fontFamily:t.sf,fontSize:14.5,lineHeight:1.75,color:t.txB,marginBottom:16}}>{children}</p>;};
const Cd = ({children,style={}}) => {const t=useT();return <div style={{background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?8:12,padding:20,...style}}>{children}</div>;};

const Bt = ({children,primary,onClick,disabled,style={}}) => {
  const t=useT();
  return <button onClick={onClick} disabled={disabled} style={{
    fontFamily:t.term?t.mf:t.sf,fontSize:13,fontWeight:500,padding:"8px 20px",
    borderRadius:t.term?6:8,border:"none",cursor:disabled?"not-allowed":"pointer",
    background:primary?t.ac:t.bgCA,color:primary?t.w:t.txB,opacity:disabled?.5:1,
    transition:"all .2s",...style,
  }}>{children}</button>;
};

const CL = ({num}) => {const t=useT();return <div style={{fontFamily:t.term?t.mf:t.sf,fontSize:11,fontWeight:600,letterSpacing:".1em",color:t.ac,marginBottom:12,textTransform:"uppercase"}}>{t.term?`module[${parseInt(num)||0}]`:`Kapitel ${num}`}</div>;};
const H1 = ({children}) => {const t=useT();return <h1 style={{fontFamily:t.hf,fontSize:t.term?24:28,fontWeight:700,color:t.tx,lineHeight:1.25,marginBottom:12}}>{children}</h1>;};

const Verstanden = ({moduleId}) => {
  const t=useT();const {completed,markComplete,unmarkComplete}=useApp();
  const done=completed[moduleId];
  return <div style={{marginTop:40,paddingTop:24,borderTop:`1px solid ${t.bd}`,textAlign:"center"}}>
    {done?<div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
      <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"12px 28px",borderRadius:t.term?6:24,background:t.okBg,border:`1px solid ${t.ok}40`}}>
        <span style={{color:t.ok,fontSize:18}}>✓</span>
        <span style={{fontSize:14,fontWeight:600,color:t.ok}}>Kapitel verstanden</span>
      </div>
      <button onClick={()=>unmarkComplete(moduleId)} style={{background:"none",border:"none",cursor:"pointer",fontSize:12,color:t.txF,fontFamily:t.sf,padding:4}}>Zuruecksetzen</button>
    </div>
    :<button onClick={()=>markComplete(moduleId)} style={{padding:"14px 36px",borderRadius:t.term?6:24,border:`2px solid ${t.ac}`,background:t.ac,color:t.w,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:t.sf,transition:"all .15s"}}>
      Verstanden
    </button>}
  </div>;
};

const TW = ({title,children}) => {
  const t=useT();
  if(!t.term) return <Cd>{children}</Cd>;
  return <div style={{background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:8,overflow:"hidden"}}>
    <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",borderBottom:`1px solid ${t.bd}`}}>
      <div style={{width:10,height:10,borderRadius:"50%",background:t.err}}/>
      <div style={{width:10,height:10,borderRadius:"50%",background:"#eab308"}}/>
      <div style={{width:10,height:10,borderRadius:"50%",background:t.ok}}/>
      <span style={{marginLeft:8,fontSize:11,color:t.txM,fontFamily:t.mf}}>{title||"viz"}</span>
    </div>
    <div style={{padding:16}}>{children}</div>
  </div>;
};

// ── MODULE 1: Was ist KI? ──
const M1 = () => {
  const t=useT();
  const [sl,setSl]=useState(0);
  const [buzzEx,setBuzzEx]=useState(null);
  const buzzes=[
    {label:"Waschmaschine mit KI",real:false,why:"Nutzt feste Sensoren und Regeln (Gewicht, Wasserstand). Kein Lernen aus Daten, kein Modell. Klassische Steuerungstechnik."},
    {label:"Spotify-Empfehlungen",real:true,why:"Collaborative Filtering und Content-based Filtering. Echte ML-Modelle, die aus dem Verhalten von Millionen Nutzern lernen."},
    {label:"Staubsaugerroboter mit KI",real:false,why:"Die meisten nutzen SLAM-Algorithmen (Simultaneous Localization and Mapping) -- clevere Informatik, aber keine lernenden Modelle."},
    {label:"ChatGPT / Claude",real:true,why:"Large Language Models, trainiert auf Textdaten mit Deep Learning (Transformer-Architektur). Echtes maschinelles Lernen."},
    {label:"Smarter Kuehlschrank",real:false,why:"Temperaturregelung und Timer sind klassische Regelungstechnik. Das Label 'KI' ist hier reines Marketing."},
    {label:"Google Fotos: Gesichtserkennung",real:true,why:"Convolutional Neural Networks (CNNs), trainiert auf Millionen Bildern. Echtes Deep Learning."},
    {label:"E-Mail Spamfilter",real:true,why:"Naive Bayes oder andere Klassifikationsmodelle, die aus markierten E-Mails lernen. Eines der aeltesten ML-Anwendungsgebiete."},
    {label:"Autopilot (Tesla)",real:true,why:"Nutzt neuronale Netze fuer Objekterkennung und Pfadplanung, trainiert auf Videodaten. Echtes Deep Learning -- aber 'Autopilot' ist ein uebertriebener Name."},
  ];
  return <div>
    <CL num="01"/><H1>Was ist Kuenstliche Intelligenz?</H1>
    <P>Der Begriff KI ist ueberall: auf Waschmaschinen, in Kuehlschraenken, auf jeder zweiten Webseite. Aber was davon ist wirklich KI -- und was ist Marketing? Lass uns das aufraumen.</P>

    <ST>KI als Modebegriff</ST>
    <P>Seit dem Hype um ChatGPT (Ende 2022) wird das Label 'KI' an fast alles geklebt, was irgendwie digital ist. Das Problem: Es verwischt die Grenze zwischen echtem maschinellem Lernen und einfacher Programmierung. Klicke auf die Beispiele -- ist das wirklich KI?</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:20}}>
      {buzzes.map((b,i)=><button key={i} onClick={()=>setBuzzEx(buzzEx===i?null:i)} style={{textAlign:"left",padding:"12px 14px",borderRadius:t.term?6:8,border:`1px solid ${buzzEx===i?(b.real?t.ok:t.err)+"60":t.bd}`,background:buzzEx===i?(b.real?t.okBg:t.errBg):t.bgC,cursor:"pointer",transition:"all .15s"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <span style={{fontSize:13,fontWeight:buzzEx===i?600:400,color:t.tx}}>{b.label}</span>
          {buzzEx===i&&<span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:b.real?t.ok:t.err,color:t.w,fontWeight:600}}>{b.real?"Echte KI":"Marketing"}</span>}
        </div>
        {buzzEx===i&&<div style={{fontSize:12,color:t.txB,marginTop:8,lineHeight:1.6,borderTop:`1px solid ${t.bd}`,paddingTop:8}}>{b.why}</div>}
      </button>)}
    </div>
    <Info title="Die Faustregel" type="tip">Echte KI/ML liegt vor, wenn ein System aus Daten lernt und sich dabei verbessert. Wenn nur feste Regeln abgearbeitet werden (if/else), ist es klassische Programmierung -- egal was auf der Verpackung steht.</Info>

    <ST>Die drei Schichten der KI</ST>
    <P>KI ist ein Oberbegriff. Machine Learning ist ein Teilgebiet davon, und Deep Learning ein Teilgebiet von ML. Klicke, um die Schichten aufzudecken.</P>
    <TW title="ki_layers.viz">
      <svg viewBox="0 0 500 460" style={{width:"100%",maxWidth:480,display:"block",margin:"0 auto"}}>
        <ellipse cx="250" cy="240" rx="235" ry="210" fill={sl>=1?`${t.ac}0d`:`${t.ac}05`} stroke={sl>=1?t.ac:t.bd} strokeWidth="2"/>
        <ellipse cx="250" cy="275" rx="170" ry="155" fill={sl>=2?`${t.ok}0d`:`${t.ok}05`} stroke={sl>=2?t.ok:t.bd} strokeWidth="2" opacity={sl>=2?1:.3}/>
        <ellipse cx="250" cy="315" rx="105" ry="100" fill={sl>=3?`${t.inf}0d`:`${t.inf}05`} stroke={sl>=3?t.inf:t.bd} strokeWidth="2" opacity={sl>=3?1:.15}/>
        {sl>=1&&<><text x="250" y="68" textAnchor="middle" fill={t.ac} fontSize="18" fontWeight="700" fontFamily={t.hf}>{"K\u00FCnstliche Intelligenz"}</text><text x="250" y="88" textAnchor="middle" fill={t.txM} fontSize="11" fontFamily={t.sf}>{"Alles, was Maschinen intelligent erscheinen l\u00E4sst"}</text></>}
        {sl>=2&&<><text x="250" y="158" textAnchor="middle" fill={t.ok} fontSize="16" fontWeight="700" fontFamily={t.hf}>Machine Learning</text><text x="250" y="178" textAnchor="middle" fill={t.txM} fontSize="11" fontFamily={t.sf}>Lernen aus Daten statt fester Regeln</text></>}
        {sl>=3&&<><text x="250" y="305" textAnchor="middle" fill={t.inf} fontSize="15" fontWeight="700" fontFamily={t.hf}>Deep Learning</text><text x="250" y="327" textAnchor="middle" fill={t.txM} fontSize="11" fontFamily={t.sf}>Neuronale Netze mit vielen Schichten</text></>}
      </svg>
      <div style={{textAlign:"center",marginTop:16}}>
        <Bt primary onClick={()=>setSl(p=>p<3?p+1:0)}>{sl<3?`Nächste Schicht (${sl}/3)`:"Zurücksetzen"}</Bt>
      </div>
    </TW>
    {sl>=1&&<Info title="KI (der grosse Rahmen)" type="info">Der Begriff geht zurueck auf die Dartmouth Conference 1956. Heute unterscheidet man: Narrow AI (kann eine Aufgabe, z.B. Schach) und General AI (kann alles -- existiert bisher nicht). Alles, was wir heute nutzen, ist Narrow AI.</Info>}
    {sl>=2&&<Info title="Machine Learning (der Paradigmenwechsel)" type="tip">Statt einem Computer Regeln vorzugeben, zeigst du ihm Beispiele. Er findet die Regeln selbst. Arthur Samuel praegte den Begriff 1959 bei IBM, als er ein Programm schrieb, das Checkers (Dame) spielen lernte.</Info>}
    {sl>=3&&<Info title="Deep Learning (die Tiefe)" type="math">Deep Learning nutzt neuronale Netze mit vielen Schichten. Der Durchbruch kam 2012, als AlexNet (ein CNN mit 8 Schichten) den ImageNet-Wettbewerb mit grossem Abstand gewann. Seitdem: Spracherkennung, Uebersetzung, Bilderkennung.</Info>}

    <ST>Klassische Programmierung vs. Machine Learning</ST>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.err,marginBottom:8}}>KLASSISCH</div><P>Der Mensch schreibt Regeln. Der Computer fuehrt sie aus.</P><div style={{fontFamily:"monospace",fontSize:12,color:t.txB,background:t.bgASS,padding:10,borderRadius:6}}>if wort in spam_liste:<br/>{"  "}return "Spam"</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:8}}>MACHINE LEARNING</div><P>Der Mensch gibt Daten + Antworten. Der Computer findet die Regeln.</P><div style={{fontFamily:"monospace",fontSize:12,color:t.txB,background:t.bgASS,padding:10,borderRadius:6}}>model.fit(emails, labels)<br/>model.predict(neue_email)</div></Cd>
    </div>

    <ST>Die Kernidee</ST>
    <div style={{background:t.bgAS,border:`1px solid ${t.bdA}`,borderRadius:t.term?8:12,padding:24,textAlign:"center"}}>
      <p style={{fontFamily:t.hf,fontSize:18,fontStyle:"italic",color:t.tx,lineHeight:1.5,margin:0}}>Machine Learning: Ein Computer lernt aus Erfahrung (Daten), statt explizit programmiert zu werden.</p>
      <p style={{fontFamily:t.sf,fontSize:12,color:t.txM,marginTop:10}}>Basierend auf Arthur Samuel, 1959</p>
    </div>
    <Info title="Warum das fuer eure PA wichtig ist" type="warning">Prof. Turan erwartet Deep Learning (PyTorch oder TensorFlow/Keras), nicht klassisches ML. Ihr muesst erklaeren koennen, warum euer Ansatz ML ist und nicht einfach Regelwerk — und warum ihr DL statt klassischer Algorithmen nutzt.</Info>
    <Verstanden moduleId="welcome"/>
  </div>;
};

// ── MODULE 2: Daten & Muster ──
const M2 = () => {
  const t=useT();
  const [pts,setPts]=useState([{x:80,y:300,l:1},{x:150,y:280,l:1},{x:100,y:320,l:1},{x:130,y:350,l:1},{x:300,y:100,l:0},{x:350,y:80,l:0},{x:320,y:130,l:0},{x:280,y:150,l:0}]);
  const [nl,setNl]=useState(1);
  const ref=useRef(null);
  const click=(e)=>{const r=ref.current.getBoundingClientRect();const x=((e.clientX-r.left)/r.width)*420;const y=((e.clientY-r.top)/r.height)*420;if(x>10&&x<410&&y>10&&y<410)setPts(p=>[...p,{x,y,l:nl}]);};
  return <div>
    <CL num="02"/><H1>Daten & Muster erkennen</H1>
    <P>Ohne Daten kein Machine Learning. In diesem Modul lernst du, was Daten im ML-Kontext bedeuten, was Features sind und warum die Qualitaet deiner Daten wichtiger ist als dein Algorithmus.</P>

    <ST>Was sind Daten im ML-Kontext?</ST>
    <P>ML arbeitet mit tabellarischen Daten: Jede Zeile ist ein Datenpunkt (z.B. ein Patient, ein Haus, eine E-Mail). Jede Spalte ist ein Feature -- eine messbare Eigenschaft. Die letzte Spalte ist oft die Zielvariable (das, was du vorhersagen willst).</P>
    <Cd>
      <div style={{overflowX:"auto"}}>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:12,fontFamily:t.term?t.mf:t.sf}}>
          <thead><tr style={{borderBottom:`2px solid ${t.bd}`}}>
            {["Alter","Blutdruck","Cholesterin","Raucher","Herzkrank?"].map((h,i)=><th key={i} style={{padding:"8px 12px",textAlign:"left",color:i===4?t.ac:t.txM,fontWeight:600,background:i===4?`${t.ac}10`:"transparent"}}>{h}</th>)}
          </tr></thead>
          <tbody>{[[52,130,250,"Ja","Ja"],[37,120,190,"Nein","Nein"],[61,140,280,"Ja","Ja"],[45,125,210,"Nein","Nein"]].map((r,i)=><tr key={i} style={{borderBottom:`1px solid ${t.bd}`}}>
            {r.map((c,j)=><td key={j} style={{padding:"8px 12px",color:j===4?t.ac:t.txB,fontWeight:j===4?600:400,background:j===4?`${t.ac}08`:"transparent"}}>{c}</td>)}
          </tr>)}</tbody>
        </table>
      </div>
      <div style={{marginTop:10,fontSize:11,color:t.txM}}>4 Features (Alter bis Raucher) → 1 Zielvariable (Herzkrank?). Das ist die Grundstruktur jedes ML-Datensatzes.</div>
    </Cd>

    <ST>Feature-Typen</ST>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>NUMERISCH</div><P>Zahlen mit Ordnung und Abstand. Alter (52), Temperatur (37.2), Preis (350000).</P></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>KATEGORISCH</div><P>Klassen ohne Rangfolge. Farbe (rot/blau), Geschlecht, Postleitzahl.</P></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.inf,marginBottom:6}}>ORDINAL</div><P>Klassen mit Rangfolge. Schulnote (1-6), T-Shirt-Groesse (S/M/L/XL).</P></Cd>
    </div>
    <Info title="Warum das wichtig ist" type="warning">ML-Algorithmen koennen nur mit Zahlen rechnen. Kategorische Features muessen in Zahlen umgewandelt werden (One-Hot Encoding). Bei ordinalen Features bleibt die Reihenfolge erhalten (Label Encoding).</Info>

    <ST>Interaktiv: Muster erkennen</ST>
    <P>Klicke ins Diagramm, um Datenpunkte zu setzen. Siehst du, wie sich zwei Gruppen bilden? Genau das muss ein ML-Algorithmus automatisch erkennen.</P>
    <div style={{display:"flex",gap:10,marginBottom:16,alignItems:"center",flexWrap:"wrap"}}>
      <span style={{fontSize:12,color:t.txM}}>Neuer Punkt:</span>
      {[{v:1,n:"Spam"},{v:0,n:"Kein Spam"}].map(({v,n})=><Bt key={v} primary={nl===v} onClick={()=>setNl(v)} style={{background:nl===v?(v?t.err:t.inf):t.bgCA,color:nl===v?t.w:t.txB,fontSize:12,padding:"6px 14px"}}>{"● "+n}</Bt>)}
      <Bt onClick={()=>setPts([])} style={{marginLeft:"auto",fontSize:12,padding:"6px 14px"}}>Reset</Bt>
    </div>
    <TW title="data_clusters.viz">
      <svg ref={ref} viewBox="0 0 420 420" style={{width:"100%",maxWidth:420,display:"block",margin:"0 auto",cursor:"crosshair"}} onClick={click}>
        <rect x="10" y="10" width="400" height="400" fill={t.bgASS} rx="6" stroke={t.bd} strokeWidth="1"/>
        {[0,1,2,3,4].map(i=><g key={i}><line x1={10+i*100} y1="10" x2={10+i*100} y2="410" stroke={t.bd} strokeWidth=".5"/><line x1="10" y1={10+i*100} x2="410" y2={10+i*100} stroke={t.bd} strokeWidth=".5"/></g>)}
        <text x="210" y="406" textAnchor="middle" fill={t.txM} fontSize="10" fontFamily={t.sf}>Feature 1: Verdaechtige Woerter →</text>
        <text x="15" y="210" fill={t.txM} fontSize="10" fontFamily={t.sf} transform="rotate(-90,15,210)">Feature 2: Link-Anzahl →</text>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="7" fill={p.l?`${t.err}cc`:`${t.inf}cc`} stroke={p.l?t.err:t.inf} strokeWidth="1.5"/>)}
      </svg>
    </TW>
    <Info title="Entscheidungsgrenzen" type="tip">Ein ML-Algorithmus findet automatisch eine Grenze (Decision Boundary) zwischen den Gruppen. Bei 2 Features ist das eine Linie, bei 3 eine Flaeche, bei mehr eine Hyperebene.</Info>

    <ST>Labelling: Woher kommen die Antworten?</ST>
    <P>Supervised Learning braucht Daten MIT richtigen Antworten (Labels). Aber die fallen nicht vom Himmel -- jemand muss sie erstellen. Das nennt man Labelling, und es ist oft der teuerste und zeitaufwaendigste Schritt im gesamten ML-Workflow.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>LABELLING BEI KLASSIFIKATION</div><P>Ein Mensch ordnet jeden Datenpunkt einer Klasse zu: 'Spam' oder 'Kein Spam', 'Krank' oder 'Gesund'. Bei 10.000 E-Mails muss jede einzelne gelesen und markiert werden.</P></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>LABELLING BEI REGRESSION</div><P>Der Zielwert muss bekannt sein: der tatsaechliche Hauspreis, die gemessene Temperatur, der echte Energieverbrauch. Oft kommen diese aus historischen Aufzeichnungen oder Sensordaten.</P></Cd>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:16}}>
      {[["Manuell","Menschen labeln per Hand. Teuer, aber oft am genauesten. Tools: Label Studio, Prodigy."],
        ["Crowdsourcing","Viele Menschen labeln ueber Plattformen wie Amazon Mechanical Turk. Billiger, aber fehleranfaelliger -- deshalb labeln mehrere Personen denselben Datenpunkt."],
        ["Automatisch / Schwach","Heuristiken oder vortrainierte Modelle erzeugen Labels. Schnell, aber ungenau. Gut als Startpunkt, danach manuell nachkorrigieren."]
      ].map(([title,desc],i)=><Cd key={i}><div style={{fontSize:12,fontWeight:700,color:t.inf,marginBottom:4}}>{title}</div><div style={{fontSize:11,color:t.txB,lineHeight:1.5}}>{desc}</div></Cd>)}
    </div>
    <Info title="Fuer eure PA" type="tip">Bei eurer Projektarbeit nutzt ihr fertig gelabelte Datensaetze (z.B. von Kaggle). Trotzdem solltet ihr in der Dokumentation erwaehnen, woher die Labels stammen und wie vertrauenswuerdig sie sind -- das zeigt Verstaendnis.</Info>

    <ST>Datenqualitaet: Garbage In, Garbage Out</ST>
    <P>Die wichtigste Regel im ML: Dein Modell ist nur so gut wie deine Daten. Typische Probleme, die ihr in eurer PA adressieren muesst:</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
      {[["Fehlende Werte (NaN)","Zellen ohne Inhalt. Loesungen: Zeile loeschen, Mittelwert einsetzen, oder Median verwenden."],
        ["Ausreisser","Extremwerte, die das Modell verzerren. Ein Patient mit Alter 999 ist offensichtlich ein Datenfehler."],
        ["Class Imbalance","95% gesund, 5% krank -- das Modell lernt einfach immer 'gesund' zu sagen und hat 95% Accuracy."],
        ["Bias in Daten","Wenn der Datensatz nicht repraesentativ ist, lernt das Modell verzerrte Muster."]
      ].map(([title,desc],i)=><Cd key={i}><div style={{fontSize:12,fontWeight:700,color:t.err,marginBottom:4}}>{title}</div><div style={{fontSize:12,color:t.txB,lineHeight:1.5}}>{desc}</div></Cd>)}
    </div>
    <Verstanden moduleId="data"/>
  </div>;
};

// ── MODULE 3: Supervised Learning ──
const M3 = () => {
  const t=useT();
  const [pts,setPts]=useState([{x:30,y:250},{x:60,y:310},{x:100,y:200},{x:150,y:170},{x:200,y:150},{x:250,y:100},{x:300,y:80},{x:350,y:60}]);
  const [sl,setSl]=useState(-0.6);const [ic,setIc]=useState(300);const [sbf,setSbf]=useState(false);
  const ref=useRef(null);
  const mse=useMemo(()=>pts.length?Math.round(pts.map(p=>Math.pow(p.y-(sl*p.x+ic),2)).reduce((a,b)=>a+b,0)/pts.length):0,[pts,sl,ic]);
  const bf=useMemo(()=>{if(pts.length<2)return{s:0,i:200};const n=pts.length,sx=pts.reduce((a,p)=>a+p.x,0),sy=pts.reduce((a,p)=>a+p.y,0),sxy=pts.reduce((a,p)=>a+p.x*p.y,0),sx2=pts.reduce((a,p)=>a+p.x*p.x,0);const s2=(n*sxy-sx*sy)/(n*sx2-sx*sx);return{s:s2,i:(sy-s2*sx)/n};},[pts]);
  const hBf=()=>{setSl(Math.round(bf.s*100)/100);setIc(Math.round(bf.i));setSbf(true);};
  const hClick=(e)=>{const r=ref.current.getBoundingClientRect();const x=Math.round(((e.clientX-r.left)/r.width)*400);const y=Math.round(((e.clientY-r.top)/r.height)*400);if(x>5&&x<395&&y>5&&y<395){setPts(p=>[...p,{x,y}]);setSbf(false);}};
  return <div>
    <CL num="03"/><H1>Supervised Learning</H1>
    <P>Supervised Learning (ueberwachtes Lernen) ist das gaengigste ML-Paradigma und die Basis eurer Projektarbeit. Der Algorithmus bekommt Beispiele mit richtigen Antworten (Labels) und lernt daraus, Vorhersagen fuer neue Daten zu treffen.</P>

    <ST>Die drei Lernparadigmen</ST>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
      <Cd style={{borderColor:t.ac,borderWidth:2}}><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>SUPERVISED</div><P>Daten + richtige Antworten. Wie Lernen mit Loesungsbuch. Fuer eure PA relevant!</P><div style={{fontSize:11,color:t.txM}}>Beispiel: 1000 E-Mails, markiert als Spam/kein Spam</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>UNSUPERVISED</div><P>Nur Daten, keine Antworten. Das Modell findet selbst Gruppen und Muster.</P><div style={{fontSize:11,color:t.txM}}>Beispiel: Kundensegmentierung (wer kauft aehnlich?)</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.inf,marginBottom:6}}>REINFORCEMENT</div><P>Lernen durch Belohnung/Bestrafung. Trial and Error in einer Umgebung.</P><div style={{fontSize:11,color:t.txM}}>Beispiel: AlphaGo lernt Go spielen durch Millionen Partien</div></Cd>
    </div>

    <ST>Klassifikation vs. Regression</ST>
    <P>Supervised Learning hat zwei Hauptformen, je nachdem was vorhergesagt wird:</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.inf,marginBottom:6}}>KLASSIFIKATION</div><P>Vorhersage einer Kategorie. Die Ausgabe ist eine Klasse.</P><div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>Krank / Gesund<br/>Spam / Kein Spam<br/>Katze / Hund / Vogel</div><div style={{marginTop:8,fontSize:11,color:t.txM}}>Metriken: Accuracy, Precision, Recall, F1-Score</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:"#7c3aed",marginBottom:6}}>REGRESSION</div><P>Vorhersage einer Zahl. Die Ausgabe ist ein kontinuierlicher Wert.</P><div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>Hauspreis: 350.000 EUR<br/>Temperatur morgen: 22.3 C<br/>Umsatz naechsten Monat</div><div style={{marginTop:8,fontSize:11,color:t.txM}}>Metriken: MSE, RMSE, MAE, R2-Score</div></Cd>
    </div>

    <ST>Interaktiv: Lineare Regression</ST>
    <P>Das einfachste Regressionsmodell: Eine Linie durch Punkte legen. Verschiebe Steigung und Y-Abschnitt -- oder klicke auf 'Optimale Linie' fuer die mathematisch beste Loesung.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
      <TW title="regression.viz">
        <svg ref={ref} viewBox="0 0 400 400" style={{width:"100%",cursor:"crosshair"}} onClick={hClick}>
          <rect width="400" height="400" fill={t.bgASS} rx="6" stroke={t.bd} strokeWidth="1"/>
          {[0,1,2,3,4].map(i=><g key={i}><line x1={i*100} y1="0" x2={i*100} y2="400" stroke={t.bd} strokeWidth=".5"/><line x1="0" y1={i*100} x2="400" y2={i*100} stroke={t.bd} strokeWidth=".5"/></g>)}
          {pts.map((p,i)=><line key={"e"+i} x1={p.x} y1={p.y} x2={p.x} y2={sl*p.x+ic} stroke={`${t.ac}50`} strokeWidth="1.5" strokeDasharray="3"/>)}
          <line x1="0" y1={ic} x2="400" y2={sl*400+ic} stroke={t.ok} strokeWidth="2.5"/>
          {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="5.5" fill={`${t.inf}cc`} stroke={t.inf} strokeWidth="1.5"/>)}
        </svg>
      </TW>
      <div>
        <div style={{textAlign:"center",padding:16,borderRadius:t.term?8:12,marginBottom:16,background:mse<500?t.okBg:mse<2000?t.bgAS:t.errBg,border:`1px solid ${(mse<500?t.ok:mse<2000?t.ac:t.err)}40`}}>
          <div style={{fontSize:12,color:t.txM}}>MSE (Mean Squared Error)</div>
          <div style={{fontSize:32,fontWeight:700,color:t.tx,fontFamily:t.hf}}>{mse.toLocaleString()}</div>
          <div style={{fontSize:11,color:t.txM,marginTop:4}}>{mse<500?"Hervorragend!":mse<2000?"Geht besser.":"Zu hoch!"}</div>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:t.txM,marginBottom:4}}><span>Steigung (m)</span><span style={{color:t.ac,fontWeight:600}}>{sl}</span></div>
          <input type="range" min="-2" max="2" step="0.01" value={sl} onChange={e=>{setSl(parseFloat(e.target.value));setSbf(false);}} style={{width:"100%",accentColor:t.ac}}/>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:t.txM,marginBottom:4}}><span>Y-Abschnitt (b)</span><span style={{color:t.ac,fontWeight:600}}>{ic}</span></div>
          <input type="range" min="0" max="400" step="1" value={ic} onChange={e=>{setIc(parseInt(e.target.value));setSbf(false);}} style={{width:"100%",accentColor:t.ac}}/>
        </div>
        <div style={{display:"flex",gap:8}}><Bt primary onClick={hBf}>Optimale Linie</Bt><Bt onClick={()=>{setPts([]);setSbf(false);}}>Reset</Bt></div>
        {sbf&&<Info type="math">Beste Linie: <strong>y = {bf.s.toFixed(2)}x + {bf.i.toFixed(0)}</strong></Info>}
      </div>
    </div>
    <Info title="MSE-Formel" type="math"><strong>MSE = (1/n) * Summe( (y_real - y_predicted)^2 )</strong>. Quadrieren hat zwei Gruende: Positive und negative Fehler heben sich nicht auf, und grosse Fehler werden staerker bestraft.</Info>

    <ST>Overfitting vs. Underfitting</ST>
    <P>Zwei zentrale Gefahren, die ihr in eurer PA verstehen und diskutieren muesst:</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.err,marginBottom:6}}>OVERFITTING</div><P>Das Modell lernt die Trainingsdaten auswendig -- inklusive Rauschen und Zufall. Es funktioniert perfekt auf Trainingsdaten, versagt aber bei neuen Daten.</P><div style={{fontSize:11,color:t.txM}}>Abhilfe: Mehr Daten, einfacheres Modell, Regularisierung, Cross-Validation</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>UNDERFITTING</div><P>Das Modell ist zu einfach fuer die Daten. Es erkennt nicht mal die offensichtlichen Muster. Schlecht auf Trainings- UND Testdaten.</P><div style={{fontSize:11,color:t.txM}}>Abhilfe: Komplexeres Modell, mehr Features, Feature Engineering</div></Cd>
    </div>
    <Info title="Train/Test-Split" type="warning">NIEMALS mit den Testdaten trainieren! Standardmaessig: 70% Training, 15% Validation, 15% Test. In PyTorch/Keras nutzt ihr torch.utils.data.random_split() oder ImageDataGenerator. In Scikit-learn gibt es train_test_split() — gut zum Lernen, aber fuer eure PA nutzt ihr PyTorch oder TensorFlow.</Info>
    <Verstanden moduleId="supervised"/>
  </div>;
};

// ── MODULE 4: Gradient Descent ──
const M4 = () => {
  const t=useT();
  const [bp,setBp]=useState(350);const [rolling,setRolling]=useState(false);const [lr,setLr]=useState(0.03);const [hist,setHist]=useState([]);
  const aRef=useRef(null);
  const loss=x=>0.0008*(x-200)**2+30;
  const grad=x=>0.0016*(x-200);
  const start=()=>{
    setRolling(true);setHist([]);
    let pos=bp;let h=[pos];let step=0;
    const go=()=>{pos=Math.max(20,Math.min(380,pos-lr*grad(pos)*300));h=[...h,pos];setBp(pos);setHist([...h]);step++;
      if(Math.abs(grad(pos))>0.001&&step<200){aRef.current=requestAnimationFrame(go);}else{setRolling(false);}};
    aRef.current=requestAnimationFrame(go);
  };
  useEffect(()=>()=>{if(aRef.current)cancelAnimationFrame(aRef.current);},[]);
  const curve=[];for(let x=20;x<=380;x+=2)curve.push(`${x},${370-loss(x)*1.3}`);
  return <div>
    <CL num="04"/><H1>Gradient Descent</H1>
    <P>Wie findet ein ML-Modell die besten Parameter? Durch Optimierung. Gradient Descent ist der wichtigste Optimierungsalgorithmus im ML -- er steckt hinter fast jedem trainierten Modell.</P>

    <ST>Die Intuition</ST>
    <P>Stell dir vor, du stehst im Nebel auf einem Huegel und willst ins Tal (das Minimum). Du kannst nichts sehen, aber du spuerst die Neigung unter deinen Fuessen. Also gehst du immer in die Richtung, in der es am steilsten bergab geht. Genau das macht Gradient Descent -- der Gradient (die Ableitung) zeigt die Richtung des steilsten Anstiegs, und wir gehen in die entgegengesetzte Richtung.</P>

    <ST>Interaktiv: Den Berg hinab</ST>
    <P>Setze eine Startposition und Learning Rate, dann klicke 'Starten'. Beobachte, wie der rote Ball ins Minimum rollt.</P>
    <TW title="gradient_descent.viz">
      <svg viewBox="0 0 400 340" style={{width:"100%",maxWidth:480,display:"block",margin:"0 auto"}}>
        <defs><linearGradient id="hg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={`${t.ac}30`}/><stop offset="100%" stopColor={`${t.ac}05`}/></linearGradient></defs>
        <polygon points={`20,320 ${curve.join(" ")} 380,320`} fill="url(#hg)"/>
        <polyline points={curve.join(" ")} fill="none" stroke={t.ac} strokeWidth="2.5"/>
        <line x1="200" y1={370-loss(200)*1.3} x2="200" y2="320" stroke={`${t.ok}40`} strokeDasharray="4"/>
        <text x="200" y="335" textAnchor="middle" fill={t.ok} fontSize="11">Minimum</text>
        {hist.length>1&&hist.map((h,i)=>{if(!i)return null;return <line key={i} x1={hist[i-1]} y1={370-loss(hist[i-1])*1.3} x2={h} y2={370-loss(h)*1.3} stroke={`${t.ac}50`} strokeWidth="1"/>;})}
        <circle cx={bp} cy={370-loss(bp)*1.3} r="10" fill={t.err} stroke={`${t.err}80`} strokeWidth="2"/>
        <text x={bp} y={370-loss(bp)*1.3-16} textAnchor="middle" fill={t.txB} fontSize="10">Loss: {loss(bp).toFixed(1)}</text>
      </svg>
    </TW>
    <div style={{display:"flex",gap:16,marginTop:16,flexWrap:"wrap",alignItems:"end"}}>
      <div style={{flex:1,minWidth:180}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:t.txM,marginBottom:4}}><span>Startposition</span><span style={{color:t.ac,fontWeight:600}}>{Math.round(bp)}</span></div>
        <input type="range" min="20" max="380" value={bp} disabled={rolling} onChange={e=>setBp(parseInt(e.target.value))} style={{width:"100%",accentColor:t.ac}}/>
      </div>
      <div style={{flex:1,minWidth:180}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:t.txM,marginBottom:4}}><span>Learning Rate</span><span style={{color:t.ac,fontWeight:600}}>{lr}</span></div>
        <input type="range" min="0.005" max="0.15" step="0.005" value={lr} disabled={rolling} onChange={e=>setLr(parseFloat(e.target.value))} style={{width:"100%",accentColor:t.ac}}/>
      </div>
      <Bt primary onClick={rolling?undefined:start} disabled={rolling}>{rolling?"Laeuft ...":"Starten"}</Bt>
    </div>

    <ST>Die Formel</ST>
    <Cd style={{textAlign:"center",padding:20}}>
      <div style={{fontFamily:"monospace",fontSize:16,fontWeight:700,color:t.tx,marginBottom:8}}>w_neu = w_alt - LR * dL/dw</div>
      <div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>w = Gewicht (Parameter) | LR = Learning Rate (Schrittgroesse) | dL/dw = Gradient (Ableitung der Loss-Funktion nach w). Das Minus sorgt dafuer, dass wir bergab gehen.</div>
    </Cd>

    <ST>Learning Rate: Der wichtigste Hyperparameter</ST>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.err,marginBottom:6}}>ZU GROSS</div><P>Springt uebers Minimum hinweg, kann sogar divergieren (Loss wird immer groesser).</P></Cd>
      <Cd style={{borderColor:t.ok}}><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>GENAU RICHTIG</div><P>Konvergiert zuegig zum Minimum. In der Praxis: Ausprobieren oder adaptive Verfahren nutzen.</P></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>ZU KLEIN</div><P>Konvergiert, aber extrem langsam. Training dauert ewig und kann in lokalen Minima stecken bleiben.</P></Cd>
    </div>

    <Info title="Varianten in der Praxis" type="info">Batch GD: Nutzt alle Daten pro Schritt (stabil, langsam). Stochastic GD (SGD): Nutzt einen Datenpunkt (schnell, rauschig). Mini-Batch GD: Nutzt kleine Gruppen (32-256 Datenpunkte) -- der Standard in der Praxis.</Info>
    <Info title="Fuer eure PA" type="warning">In PyTorch/Keras muesst ihr Gradient Descent nicht selbst programmieren — der Optimizer (z.B. Adam) macht das fuer euch. Aber ihr muesst erklaeren koennen, was dabei passiert: Learning Rate, Loss minimieren, Gewichte anpassen.</Info>
    <Verstanden moduleId="gradient"/>
  </div>;
};

// ── MODULE 5: Neuronale Netze ──
const M5 = () => {
  const t=useT();
  const [iv,setIv]=useState([0.8,0.3,0.6]);const [an,setAn]=useState(null);
  const w=[[0.5,-0.3,0.8],[0.2,0.7,-0.4]];
  const sig=x=>1/(1+Math.exp(-x));
  const hid=w.map(ww=>sig(ww.reduce((s,wi,i)=>s+wi*iv[i],0)));
  const out=sig(hid[0]*0.6+hid[1]*0.4);
  const neurons=[...iv.map((v,i)=>({x:70,y:100+i*80,v,l:0,n:`Input ${i+1}`})),...hid.map((v,i)=>({x:200,y:140+i*80,v,l:1,n:`Hidden ${i+1}`})),{x:330,y:180,v:out,l:2,n:out>0.5?"Klasse A":"Klasse B"}];
  const lc=[t.ac,t.ok,t.inf];
  return <div>
    <CL num="05"/><H1>Neuronale Netze</H1>
    <P>Neuronale Netze sind mathematische Modelle, die lose vom Gehirn inspiriert sind. Sie bestehen aus Schichten von Recheneinheiten (Neuronen), die Eingaben gewichtet verarbeiten. Der Name klingt biologisch, aber die Funktionsweise ist reine lineare Algebra + nichtlineare Funktionen.</P>

    <ST>Aufbau: Schichten und Neuronen</ST>
    <P>Ein neuronales Netz hat mindestens 3 Schichten: Input (Daten rein), Hidden (Berechnungen), Output (Ergebnis raus). Veraendere die Eingabewerte und beobachte, wie sich die Werte durch das Netz bewegen.</P>
    <TW title="neural_network.viz">
      <svg viewBox="0 0 400 340" style={{width:"100%",maxWidth:440,display:"block",margin:"0 auto"}}>
        {neurons.filter(nn=>nn.l===0).map((inp,i)=>neurons.filter(nn=>nn.l===1).map((h,j)=><line key={`${i}-${j}`} x1={inp.x} y1={inp.y} x2={h.x} y2={h.y} stroke={w[j][i]>0?`${t.ok}55`:`${t.err}55`} strokeWidth={Math.abs(w[j][i])*2.5+.5}/>))}
        {neurons.filter(nn=>nn.l===1).map((h,i)=>neurons.filter(nn=>nn.l===2).map((o,j)=><line key={`o${i}${j}`} x1={h.x} y1={h.y} x2={o.x} y2={o.y} stroke={`${t.inf}55`} strokeWidth="2"/>))}
        {["Input","Hidden","Output"].map((l,i)=><text key={i} x={[70,200,330][i]} y="30" textAnchor="middle" fill={t.txM} fontSize="11" fontFamily={t.hf} fontWeight="600">{l}</text>)}
        {neurons.map((nn,i)=><g key={i} style={{cursor:"pointer"}} onMouseEnter={()=>setAn(i)} onMouseLeave={()=>setAn(null)}>
          <circle cx={nn.x} cy={nn.y} r={an===i?24:20} fill={t.bgASS} stroke={lc[nn.l]} strokeWidth={an===i?2.5:1.5} opacity={.5+nn.v*.5} style={{transition:"all .2s"}}/>
          <text x={nn.x} y={nn.y+4} textAnchor="middle" fill={t.tx} fontSize="11" fontWeight="600">{nn.v.toFixed(2)}</text>
          <text x={nn.x} y={nn.y+38} textAnchor="middle" fill={t.txM} fontSize="9">{nn.n}</text>
        </g>)}
      </svg>
    </TW>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:16,marginTop:16}}>
      {["Input 1","Input 2","Input 3"].map((l,i)=><div key={i}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:t.txM,marginBottom:4}}><span>{l}</span><span style={{color:t.ac,fontWeight:600}}>{iv[i].toFixed(2)}</span></div>
        <input type="range" min="0" max="1" step="0.01" value={iv[i]} onChange={e=>{const v=[...iv];v[i]=parseFloat(e.target.value);setIv(v);}} style={{width:"100%",accentColor:t.ac}}/>
      </div>)}
    </div>

    <ST>Was passiert in einem Neuron?</ST>
    <P>Jedes Neuron macht genau zwei Dinge:</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>1. GEWICHTETE SUMME</div><div style={{fontFamily:"monospace",fontSize:13,color:t.tx,marginBottom:6}}>z = w1*x1 + w2*x2 + ... + b</div><P>Jeder Input wird mit einem Gewicht (w) multipliziert und aufsummiert. b ist der Bias (Schwellwert).</P></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>2. AKTIVIERUNGSFUNKTION</div><div style={{fontFamily:"monospace",fontSize:13,color:t.tx,marginBottom:6}}>a = f(z)</div><P>Die Summe wird durch eine nichtlineare Funktion geschickt. Ohne sie koennte das Netz nur lineare Zusammenhaenge lernen.</P></Cd>
    </div>

    <ST>Aktivierungsfunktionen</ST>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:4}}>Sigmoid</div><div style={{fontFamily:"monospace",fontSize:11,marginBottom:4}}>1 / (1 + e^(-z))</div><div style={{fontSize:11,color:t.txB}}>Ausgabe: 0 bis 1. Fuer Wahrscheinlichkeiten. Problem: Gradient wird bei extremen Werten sehr klein (Vanishing Gradient).</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:4}}>ReLU</div><div style={{fontFamily:"monospace",fontSize:11,marginBottom:4}}>max(0, z)</div><div style={{fontSize:11,color:t.txB}}>Ausgabe: 0 oder z. Standard in modernen Netzen. Schnell, einfach, loest Vanishing Gradient teilweise.</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.inf,marginBottom:4}}>Softmax</div><div style={{fontFamily:"monospace",fontSize:11,marginBottom:4}}>e^(zi) / sum(e^(zj))</div><div style={{fontSize:11,color:t.txB}}>Ausgabe: Wahrscheinlichkeiten die sich zu 1 aufaddieren. Fuer Multi-Class-Klassifikation im Output-Layer.</div></Cd>
    </div>

    <Info title="Backpropagation" type="math">So lernt das Netz: Der Fehler am Output wird zurueckpropagiert (Kettenregel der Ableitung), und jedes Gewicht wird per Gradient Descent angepasst. Vorwaerts: Vorhersage. Rueckwaerts: Lernen.</Info>
    <Info title="Fuer eure PA" type="warning">Prof. Turan will explizit Deep Learning sehen — also neuronale Netze! Genau das, was ihr hier gelernt habt. In der PA nutzt ihr CNNs (Convolutional Neural Networks) mit PyTorch oder TensorFlow/Keras. Dieses Kapitel ist also direkt relevant.</Info>
    <Verstanden moduleId="neural"/>
  </div>;
};

// ── MODULE 6: Deep Learning ──
const M6 = () => {
  const t=useT();const [al,setAl]=useState(null);
  const layers=[{n:"Eingabe",d:"Rohe Pixel (z.B. 224x224x3 = 150.528 Werte)",cnt:8,c:t.ac},{n:"Conv 1",d:"Erkennt einfache Muster: Kanten, Linien, Ecken",cnt:12,c:t.acL},{n:"Conv 2",d:"Kombiniert Kanten zu Texturen und Formen",cnt:10,c:t.ok},{n:"Conv 3",d:"Erkennt Objekt-Teile: Augen, Ohren, Raeder",cnt:8,c:t.inf},{n:"Dense",d:"Verknuepft Teile zu Konzepten: 'Gesicht', 'Auto'",cnt:6,c:t.math},{n:"Output",d:"Wahrscheinlichkeiten pro Klasse (Softmax)",cnt:2,c:t.err}];
  return <div>
    <CL num="06"/><H1>Deep Learning</H1>
    <P>Deep Learning ist ein Teilgebiet von ML, das neuronale Netze mit vielen Schichten (daher 'deep') nutzt. Der Durchbruch kam 2012 mit AlexNet im ImageNet-Wettbewerb. Seitdem dominiert Deep Learning bei Bilderkennung, Sprachverarbeitung und Textgenerierung.</P>

    <ST>Warum Tiefe wichtig ist</ST>
    <P>Jede Schicht lernt abstraktere Merkmale. Schicht 1 erkennt Kanten, Schicht 2 kombiniert Kanten zu Formen, Schicht 3 erkennt Objekt-Teile, und die letzte Schicht trifft die Entscheidung. Hover ueber die Schichten:</P>
    <TW title="cnn_architecture.viz">
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8,height:220}}>
        {layers.map((l,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",height:"100%",cursor:"pointer"}} onMouseEnter={()=>setAl(i)} onMouseLeave={()=>setAl(null)}>
          <div style={{fontSize:10,textAlign:"center",color:al===i?t.tx:t.txF,fontWeight:al===i?600:400,marginBottom:8,transition:"all .2s"}}>{l.n}</div>
          <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"center"}}>
            {Array.from({length:l.cnt}).map((_,j)=><div key={j} style={{width:al===i?14:10,height:al===i?14:10,borderRadius:"50%",transition:"all .2s",background:al===i?l.c:`${l.c}44`,boxShadow:al===i?`0 0 8px ${l.c}40`:"none"}}/>)}
          </div>
        </div>)}
      </div>
      {al!==null&&<div style={{marginTop:16,textAlign:"center",padding:12,borderRadius:8,background:`${layers[al].c}10`,border:`1px solid ${layers[al].c}25`}}>
        <div style={{fontFamily:t.hf,fontWeight:700,color:t.tx,fontSize:14}}>{layers[al].n}</div>
        <div style={{fontSize:12,color:t.txB,marginTop:4}}>{layers[al].d}</div>
      </div>}
    </TW>

    <ST>Die wichtigsten Architekturen</ST>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>CNN (Convolutional Neural Network)</div><P>Fuer Bilder. Nutzt Filter (Kernels), die ueber das Bild gleiten und lokale Muster erkennen. AlexNet, VGG, ResNet sind bekannte Vertreter.</P><div style={{fontSize:11,color:t.txM}}>Anwendung: Bilderkennung, medizinische Bildanalyse, autonomes Fahren</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>RNN (Recurrent Neural Network)</div><P>Fuer Sequenzen (Text, Zeitreihen). Hat ein 'Gedaechtnis' durch Rueckkopplungen. LSTM und GRU sind verbesserte Varianten.</P><div style={{fontSize:11,color:t.txM}}>Anwendung: Spracherkennung, Zeitreihen-Vorhersage, Maschinenuebersetzung</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.inf,marginBottom:6}}>Transformer</div><P>Die Architektur hinter ChatGPT, Claude, BERT. Nutzt Attention-Mechanismus statt Rekurrenz. Seit 2017 (Paper: 'Attention Is All You Need') der Standard in NLP.</P><div style={{fontSize:11,color:t.txM}}>Anwendung: Textgenerierung, Uebersetzung, Code-Generierung, auch Bilder (ViT)</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.math,marginBottom:6}}>GAN (Generative Adversarial Network)</div><P>Zwei Netze spielen gegeneinander: Generator erzeugt Fakes, Diskriminator erkennt sie. Beide werden besser. Eingefuehrt 2014 von Ian Goodfellow.</P><div style={{fontSize:11,color:t.txM}}>Anwendung: Bildgenerierung, Style Transfer, Deepfakes</div></Cd>
    </div>

    <ST>Praxisbeispiel: YOLO (You Only Look Once)</ST>
    <P>YOLO ist eines der bekanntesten Deep-Learning-Modelle fuer Echtzeit-Objekterkennung. Es zeigt perfekt, wie Deep Learning in der Praxis funktioniert -- und warum Labelling so aufwaendig ist.</P>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>WAS YOLO MACHT</div><P>Ein Bild einmal anschauen und gleichzeitig alle Objekte erkennen: Position (Bounding Box) + Klasse (Auto, Person, Hund). Schnell genug fuer Echtzeit-Video (30+ FPS).</P><div style={{fontSize:11,color:t.txM}}>Erstmals 2016 von Joseph Redmon veroeffentlicht, aktuell bei v8+ (Ultralytics).</div></Cd>
      <Cd><div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>WIE YOLO FUNKTIONIERT</div><P>Das Bild wird in ein Raster aufgeteilt. Jede Zelle sagt vorher: 'Ist hier ein Objekt? Wenn ja, wo genau (Box) und was (Klasse)?' Alles in einem einzigen Forward Pass durch ein CNN.</P><div style={{fontSize:11,color:t.txM}}>Daher der Name: You Only Look Once -- ein Durchlauf statt vieler.</div></Cd>
    </div>
    <Cd style={{marginBottom:20}}>
      <div style={{fontSize:12,fontWeight:700,color:t.err,marginBottom:6}}>DAS LABELLING-PROBLEM BEI YOLO</div>
      <P>Um YOLO zu trainieren, muss jedes Bild von Hand gelabelt werden: Fuer jedes Objekt zeichnet ein Mensch eine Bounding Box und weist eine Klasse zu. Der COCO-Datensatz (328.000 Bilder, 2.5 Millionen gelabelte Objekte) hat Jahre und tausende Arbeitsstunden gekostet.</P>
      <div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>Das zeigt ein Grundproblem von Supervised Learning: Die Qualitaet der Labels bestimmt die Qualitaet des Modells. Falsch gesetzte Boxes oder falsche Klassen fuehren direkt zu falschen Vorhersagen.</div>
    </Cd>

    <Info title="Selbstorganisation" type="tip">Niemand sagt dem Netz, wonach es suchen soll. Die Hierarchie (Kanten → Formen → Objekte) entsteht automatisch durch das Training. Das ist der zentrale Unterschied zu handgemachtem Feature Engineering.</Info>
    <Info title="Deep Learning fuer eure PA" type="warning">Prof. Turan will explizit Deep Learning sehen — nicht klassisches ML. DL braucht viele Daten und Rechenpower, stimmt. Aber: Bild-Datensaetze auf Kaggle haben 10.000+ Bilder, und mit Transfer Learning (vortrainierte Netze) braucht ihr keine eigene GPU. Genau deshalb empfehlen wir Bildklassifikation als Projekt.</Info>
    <Verstanden moduleId="deep"/>
  </div>;
};

// ── MODULE 7: Quiz ──
const QD=[
  {q:"Hauptunterschied klassische Programmierung vs. ML?",o:["ML ist schneller","ML lernt aus Daten statt Regeln","ML braucht keinen Strom","ML ist immer besser"],c:1,e:"Bei ML gibst du Daten, der Algorithmus findet die Regeln selbst."},
  {q:"Was beschreibt der MSE?",o:["Geschwindigkeit","Datenpunktanzahl","Durchschn. quadrierter Fehler","Steigung"],c:2,e:"MSE misst die durchschnittliche quadrierte Abweichung."},
  {q:"Learning Rate zu groß?",o:["Besseres Lernen","Springt übers Minimum","Daten gelöscht","Nichts"],c:1,e:"Zu große Schritte lassen das Modell übers Optimum springen."},
  {q:"Was macht eine Aktivierungsfunktion?",o:["Löscht Daten","Nichtlineare Transformation","Speichert Gewichte","Verbindet Schichten"],c:1,e:"Ohne Nichtlinearität könnte das Netz nur lineare Zusammenhänge lernen."},
  {q:"Wofür steht ‚Deep' in Deep Learning?",o:["Tiefes Denken","Viele Schichten","Tiefe Analyse","Deep Web"],c:1,e:"Tiefe = Anzahl der Schichten im Netz."},
  {q:"Was ist Supervised Learning?",o:["Ohne Daten","Mit Labels","Durch Belohnung","Supervisor-Prozess"],c:1,e:"Der Algorithmus bekommt Beispiele MIT richtigen Antworten."},
];
const M7 = () => {
  const t=useT();
  const [cur,setCur]=useState(0);const [sel,setSel]=useState(null);const [score,setScore]=useState(0);const [ans,setAns]=useState({});const [done,setDone]=useState(false);
  const q=QD[cur];const isA=ans[cur]!==undefined;
  const answer=(i)=>{if(isA)return;setSel(i);setAns(p=>({...p,[cur]:i}));if(i===q.c)setScore(s=>s+1);};
  const next=()=>{if(cur<QD.length-1){setCur(cur+1);setSel(null);}else{setDone(true);}};
  if(done){const pct=Math.round(score/QD.length*100);return <div><CL num="07"/><H1>Ergebnis</H1><div style={{textAlign:"center",padding:40}}>
    <div style={{fontSize:56,fontFamily:t.hf,fontWeight:700,color:t.tx}}>{score}/{QD.length}</div>
    <div style={{fontSize:16,color:t.txM,marginTop:8}}>{pct}% richtig</div>
    <div style={{marginTop:24}}><Bt primary onClick={()=>{setCur(0);setSel(null);setScore(0);setAns({});setDone(false);}}>Nochmal</Bt></div>
  </div></div>;}
  return <div>
    <CL num="07"/><H1>Wissenstest</H1>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
      <span style={{fontSize:13,color:t.txM}}>Frage {cur+1}/{QD.length}</span>
      <div style={{flex:1}}><Bar p={cur/QD.length*100}/></div>
      <span style={{fontSize:13,fontWeight:600,color:t.ac}}>{score} Pkt.</span>
    </div>
    <Cd>
      <div style={{fontFamily:t.hf,fontSize:17,fontWeight:600,color:t.tx,lineHeight:1.4,marginBottom:20}}>{q.q}</div>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {q.o.map((opt,i)=>{
          let bg=t.bgASS,bd=t.bd,cl=t.tx;
          if(isA&&i===q.c){bg=t.okBg;bd=t.ok;cl=t.ok;}
          else if(isA&&i===sel&&i!==q.c){bg=t.errBg;bd=t.err;cl=t.err;}
          return <button key={i} onClick={()=>answer(i)} disabled={isA} style={{width:"100%",textAlign:"left",padding:"12px 16px",borderRadius:t.term?6:8,border:`1.5px solid ${bd}`,background:bg,cursor:isA?"default":"pointer",fontFamily:t.sf,fontSize:13.5,color:cl,transition:"all .15s"}}>
            <span style={{fontWeight:600,marginRight:8}}>{String.fromCharCode(65+i)}.</span>{opt}
          </button>;
        })}
      </div>
      {isA&&<div style={{marginTop:16,padding:14,borderRadius:8,background:t.infBg,border:`1px solid ${t.inf}30`}}>
        <div style={{fontSize:12,fontWeight:600,color:t.inf,fontFamily:t.hf,marginBottom:4}}>Erklärung</div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.6}}>{q.e}</div>
      </div>}
      {isA&&<div style={{marginTop:16}}><Bt primary onClick={next}>{cur<QD.length-1?"Nächste Frage →":"Ergebnis"}</Bt></div>}
    </Cd>
  </div>;
};

// ── MODULE 8: AI Tutor ──
const M8 = () => {
  const t=useT();const {ak,setAk,prov,setProv}=useApp();
  const [msgs,setMsgs]=useState([{role:"assistant",content:"Willkommen! Ich bin dein ML-Tutor. Gib deinen API-Key ein und stell mir jede Frage."}]);
  const [inp,setInp]=useState("");const [ld,setLd]=useState(false);const [ss,setSs]=useState(true);
  const endRef=useRef(null);
  useEffect(()=>{endRef.current?.scrollIntoView({behavior:"smooth"});},[msgs]);
  const sys="Du bist ein freundlicher ML-Tutor. Erkläre auf Deutsch, didaktisch, mit Analogien. Max 200 Wörter.";
  const send=async()=>{
    if(!inp.trim()||!ak||ld)return;
    const um={role:"user",content:inp};const nm=[...msgs,um];setMsgs(nm);setInp("");setLd(true);
    try{
      const am=nm.filter(m=>m.role!=="system").map(m=>({role:m.role,content:m.content}));
      if(prov==="openai"){
        const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${ak}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:sys},...am],max_tokens:800})});
        const d=await r.json();if(d.error)throw new Error(d.error.message);setMsgs([...nm,{role:"assistant",content:d.choices[0].message.content}]);
      } else {
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ak,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:800,system:sys,messages:am})});
        const d=await r.json();if(d.error)throw new Error(d.error.message);setMsgs([...nm,{role:"assistant",content:d.content[0].text}]);
      }
    }catch(err){setMsgs([...nm,{role:"assistant",content:`Fehler: ${err.message}`}]);}finally{setLd(false);}
  };
  return <div>
    <CL num="08"/><H1>AI Tutor</H1>
    <button onClick={()=>setSs(!ss)} style={{fontFamily:t.sf,fontSize:12,color:t.txM,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>API-Einstellungen {ss?"▴":"▾"}</button>
    {ss&&<Cd style={{marginBottom:16}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>{[["openai","OpenAI"],["anthropic","Anthropic"]].map(([id,l])=><Bt key={id} primary={prov===id} onClick={()=>setProv(id)} style={{fontSize:12,padding:"6px 14px"}}>{l}</Bt>)}</div>
      <input type="password" value={ak} onChange={e=>setAk(e.target.value)} placeholder={prov==="openai"?"sk-...":"sk-ant-..."} style={{width:"100%",boxSizing:"border-box",padding:"8px 12px",borderRadius:t.term?6:8,border:`1px solid ${t.bd}`,background:t.bgI,fontFamily:t.term?t.mf:t.sf,fontSize:13,color:t.tx,outline:"none"}}/>
      <div style={{fontSize:11,color:t.txF,marginTop:6}}>{ak?"Key gesetzt ✓":"Key wird nur in deinem Browser gespeichert."}</div>
    </Cd>}
    <Cd style={{padding:0,overflow:"hidden"}}>
      <div style={{maxHeight:340,minHeight:200,overflowY:"auto",padding:16}}>
        {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:10}}>
          <div style={{maxWidth:"75%",padding:"10px 14px",borderRadius:12,fontSize:13,lineHeight:1.65,fontFamily:t.sf,background:m.role==="user"?t.ac:t.bgC,color:m.role==="user"?t.w:t.txB,border:m.role==="user"?"none":`1px solid ${t.bd}`,borderBottomRightRadius:m.role==="user"?4:12,borderBottomLeftRadius:m.role==="user"?12:4,whiteSpace:"pre-wrap"}}>{m.content}</div>
        </div>)}
        {ld&&<div style={{padding:"10px 14px",borderRadius:12,background:t.bgC,border:`1px solid ${t.bd}`,fontSize:13,color:t.txM,display:"inline-block"}}>{t.term?"processing...":"Denkt nach ..."}</div>}
        <div ref={endRef}/>
      </div>
      {msgs.length<=1&&<div style={{padding:"0 16px 12px",display:"flex",flexWrap:"wrap",gap:6}}>
        {["Was ist Overfitting?","Erkläre Backpropagation","CNN vs. RNN?","Wie funktioniert ein Transformer?"].map((s,i)=><button key={i} onClick={()=>setInp(s)} style={{fontSize:11,padding:"5px 10px",borderRadius:20,border:`1px solid ${t.bd}`,background:t.bg,color:t.txM,cursor:"pointer",fontFamily:t.sf}}>{s}</button>)}
      </div>}
      <div style={{padding:12,borderTop:`1px solid ${t.bd}`,display:"flex",gap:8}}>
        <input value={inp} onChange={e=>setInp(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send()} placeholder={ak?"Stelle eine Frage ...":"API-Key eingeben ..."} disabled={!ak||ld} style={{flex:1,padding:"10px 14px",borderRadius:t.term?6:8,border:`1px solid ${t.bd}`,background:t.bgI,fontFamily:t.term?t.mf:t.sf,fontSize:13,color:t.tx,outline:"none"}}/>
        <Bt primary onClick={send} disabled={!ak||ld||!inp.trim()}>Senden</Bt>
      </div>
    </Cd>
  </div>;
};

// ── PROJECT STEPS DATA ──
const STEPS=[
  {id:"problem",n:1,t:"Problembeschreibung",s:"Was willst du vorhersagen?",
    ex:"Hier definierst du klar, welches Problem dein ML-System lösen soll. Formuliere eine konkrete Frage, z.B.: Kann man anhand von Patientendaten vorhersagen, ob eine Herzerkrankung vorliegt?",
    prof:"Klare Definition (Klassifikation oder Regression), Relevanz, konkrete Zielsetzung, Herausforderungen.",
    terms:[{t:"Klassifikation",d:"Vorhersage einer Kategorie (Spam/kein Spam, krank/gesund)."},{t:"Regression",d:"Vorhersage einer Zahl (Hauspreis, Temperatur)."},{t:"Zielvariable",d:"Die Spalte, die du vorhersagen willst. Alles andere sind Features."}],
    code:"# Klassifikation: \"Ist der Patient herzkrank?\"\n# Regression: \"Wie hoch wird der Hauspreis?\"",
    checks:["Problemtyp festgelegt","Zielfrage formuliert","Relevanz begründet","Herausforderungen benannt"]},
  {id:"datasrc",n:2,t:"Datenquelle",s:"Woher kommen deine Daten?",
    ex:"Du brauchst einen Datensatz — eine Tabelle mit Zeilen (Beispiele) und Spalten (Features). Gute Quellen: Kaggle, UCI Repository, NASA Data Portal.",
    prof:"Link zum Dataset, Lizenz, Anzahl Datenpunkte/Features, Beschreibung der wichtigsten Features.",
    terms:[{t:"Dataset",d:"Deine Datentabelle. Jede Zeile = ein Beispiel, jede Spalte = ein Merkmal."},{t:"Feature",d:"Eine messbare Eigenschaft: Alter, Gewicht, Quadratmeter."},{t:"Kaggle",d:"Größte Plattform für ML-Datasets. Kostenlos."}],
    code:"import pandas as pd\ndf = pd.read_csv(\"dataset.csv\")\nprint(f\"Zeilen: {len(df)}, Spalten: {len(df.columns)}\")\ndf.head()",
    checks:["Dataset gefunden","Quelle dokumentiert","Größe beschrieben","Features aufgelistet"]},
  {id:"eda",n:3,t:"Explorative Datenanalyse",s:"Daten verstehen, bevor du loslegst",
    ex:"Bevor du ein Modell trainierst: Wie sind die Werte verteilt? Gibt es Zusammenhänge? Auffälligkeiten? Das ist wie eine Diagnose vor der Behandlung.",
    prof:"Histogramme, Boxplots, Korrelationsanalyse, Muster, Class Imbalance prüfen.",
    terms:[{t:"Histogramm",d:"Zeigt, wie oft Werte in bestimmten Bereichen vorkommen."},{t:"Korrelation",d:"Zusammenhang zwischen Werten. Nahe 1 = stark, nahe 0 = kein Zusammenhang."},{t:"Class Imbalance",d:"Wenn eine Kategorie viel häufiger ist (95% gesund, 5% krank)."}],
    code:"import seaborn as sns\ndf[\"target\"].hist(bins=30)\nsns.heatmap(df.corr(), annot=True, cmap=\"coolwarm\")",
    checks:["Verteilung visualisiert","Korrelationsmatrix erstellt","Auffälligkeiten dokumentiert","Class Imbalance geprüft"]},
  {id:"preproc",n:4,t:"Datenvorverarbeitung",s:"Bilder vorbereiten",
    ex:"Bilder auf gleiche Groesse bringen, normalisieren, optional augmentieren (spiegeln, drehen, zoomen). Das macht euer Modell robuster.",
    prof:"Resize, Normalisierung, Data Augmentation, Train/Val/Test-Split.",
    terms:[{t:"Resize",d:"Alle Bilder auf gleiche Groesse bringen (z.B. 224x224 Pixel)."},{t:"Normalisierung",d:"Pixelwerte auf 0-1 skalieren (statt 0-255)."},{t:"Data Augmentation",d:"Trainingsbilder kuenstlich vermehren: spiegeln, drehen, zoomen. Schuetzt vor Overfitting."}],
    code:"from torchvision import transforms\ntransform = transforms.Compose([\n  transforms.Resize((224, 224)),\n  transforms.RandomHorizontalFlip(),\n  transforms.RandomRotation(15),\n  transforms.ToTensor(),\n  transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])\n])",
    checks:["Fehlende Werte behandelt","Ausreißer geprüft","Normalisierung durchgeführt","Kategorien codiert"]},
  {id:"models",n:5,t:"Modellauswahl",s:"Welche DL-Architektur nutzt du?",
    ex:"Wähle 2-3 CNN-Architekturen und begründe warum. Z.B. ein eigenes CNN vs. Transfer Learning mit ResNet/VGG.",
    prof:"Begründung der Wahl, Beschreibung der Architektur, Hyperparameter.",
    terms:[{t:"CNN",d:"Convolutional Neural Network — spezialisiert auf Bilder. Erkennt Muster wie Kanten und Formen."},{t:"Transfer Learning",d:"Vortrainiertes Netz (z.B. ResNet50) auf eigene Aufgabe feintunen. Spart Zeit."},{t:"Hyperparameter",d:"Einstellungen, die DU festlegst: Learning Rate, Batch Size, Epochs, Dropout."},{t:"Baseline",d:"Einfachstes Modell — der Maßstab für komplexere."}],
    code:"import torch\nimport torchvision.models as models\n# Transfer Learning: ResNet50 vortrainiert\nmodel = models.resnet50(pretrained=True)\n# Letzte Schicht anpassen (z.B. 7 Klassen)\nmodel.fc = torch.nn.Linear(model.fc.in_features, 7)",
    checks:["2-3 Architekturen ausgewählt","Auswahl begründet","Hyperparameter beschrieben","Baseline definiert"]},
  {id:"training",n:6,t:"Training",s:"Modelle trainieren",
    ex:"Daten aufteilen, Modelle trainieren, Trainingsfortschritt beobachten. NIEMALS mit Testdaten trainieren!",
    prof:"Train/Val/Test-Split, Batch Size, Learning Rate, Epochs, Loss-Funktion, Optimizer, Dropout, Early Stopping, Lernkurven.",
    terms:[{t:"Train/Val/Test-Split",d:"70% Lernen, 15% Validierung, 15% Test. Val zum Tunen, Test nur am Ende."},{t:"Overfitting",d:"Modell lernt auswendig statt Muster. Training-Loss sinkt, Val-Loss steigt."},{t:"Early Stopping",d:"Training stoppen wenn Val-Loss nicht mehr besser wird."}],
    code:"import torch\nfrom torch.utils.data import DataLoader, random_split\n# Daten aufteilen\ntrain_set, val_set, test_set = random_split(dataset, [0.7, 0.15, 0.15])\ntrain_loader = DataLoader(train_set, batch_size=32, shuffle=True)\n# Training Loop\nfor epoch in range(50):\n  model.train()\n  for images, labels in train_loader:\n    optimizer.zero_grad()\n    loss = criterion(model(images), labels)\n    loss.backward()\n    optimizer.step()",
    checks:["Daten aufgeteilt","Modelle trainiert","Cross-Validation durchgeführt","Overfitting geprüft"]},
  {id:"eval",n:7,t:"Evaluation",s:"Wie gut sind deine Modelle?",
    ex:"Vergleichstabelle aller Modelle. Detaillierte Analyse des besten. Fehleranalyse: WO macht es Fehler?",
    prof:"Metriken definieren, Vergleichstabelle, Confusion Matrix, Fehleranalyse.",
    terms:[{t:"Accuracy",d:"Anteil korrekter Vorhersagen. Vorsicht bei Imbalance!"},{t:"F1-Score",d:"Kompromiss aus Precision und Recall. Gute Einzelzahl."},{t:"Confusion Matrix",d:"Zeigt True/False Positives/Negatives. Das vollständige Bild."}],
    code:"from sklearn.metrics import classification_report, confusion_matrix\n# sklearn.metrics ist OK fuer Auswertung (nicht fuers Modell!)\ny_pred = model(test_images).argmax(dim=1)\nprint(classification_report(y_test, y_pred.numpy()))\nsns.heatmap(confusion_matrix(y_test, y_pred.numpy()), annot=True)",
    checks:["Metriken definiert","Modelle verglichen","Confusion Matrix erstellt","Fehleranalyse durchgeführt"]},
  {id:"discuss",n:8,t:"Diskussion & Fazit",s:"Reflektieren und einordnen",
    ex:"Der wichtigste Teil! Was hat funktioniert? Was nicht? Warum? Ehrliche Reflexion schlägt perfekte Ergebnisse.",
    prof:"Zielerreichung, kritische Reflexion, Limitationen, Verbesserungsvorschläge.",
    terms:[{t:"Limitation",d:"Einschränkungen deines Ansatzes (zu wenig Daten, Bias, ...)."},{t:"Generalisierung",d:"Kann dein Modell auch mit neuen Daten umgehen?"}],
    code:"# Kein Code — reiner Text:\n# 1. Ziele erreicht?\n# 2. Bestes Modell und warum?\n# 3. Was hat NICHT funktioniert?\n# 4. Limitationen?\n# 5. Nächste Schritte?",
    checks:["Ziele überprüft","Reflexion geschrieben","Limitationen benannt","Verbesserungen vorgeschlagen"]},
];

const MILES=[
  {id:"topic",l:"Thema gewaehlt",e:"🎯"},{id:"data",l:"Daten gefunden",e:"📦"},
  {id:"eda",l:"EDA abgeschlossen",e:"🔍"},{id:"clean",l:"Daten aufbereitet",e:"🧹"},
  {id:"models",l:"Modelle trainiert",e:"🏋️"},{id:"results",l:"Ergebnisse da",e:"📊"},
  {id:"doku",l:"Doku fertig",e:"📝"},{id:"pptx",l:"PPTX erstellt",e:"🎤"},
  {id:"repo",l:"Git Repo ready",e:"🚀"},{id:"submit",l:"Abgabe",e:"🏆"},
];

// ── MODULE: PA-Kompass / Sebbis Hyperfokus-HQ (ADHS-gerecht, nur fuer Sebbi) ──
const PA_DEADLINES=[
  {date:"2026-03-31",label:"PPTX an Prof senden",desc:"1-2 Folien: Was wollt ihr machen?"},
  {date:"2026-06-30",label:"Projekt abgeben",desc:"Git Repo mit Code + Doku per E-Mail"},
  {date:"2026-07-07",label:"Praesentation",desc:"10 Min. pro Person, vor Ort"},
];
// Sebbis Original-Favoriten + alle 5 Vorschlaege
const PA_MEINE_WAHL=[
  {name:"Spotify — Wird ein Song ein Hit?",emoji:"🎵",wahl:true,
    frage:"Kann man anhand von Audio-Features (Tempo, Energie, Tanzbarkeit) vorhersagen, ob ein Song populaer wird?",
    erklaerung:"Spotify liefert fuer jeden Song Zahlen: Wie schnell ist er (Tempo)? Wie energiegeladen (Energie)? Wie tanzbar (Tanzbarkeit)? Die Idee: Der Computer lernt aus tausenden Songs mit diesen Zahlen, welche Kombination 'Hit' ergibt und welche nicht.",
    dl_problem:"Das Problem: Spotify-Daten sind TABELLEN (Zahlen in Spalten). Deep Learning ist aber am staerksten bei Bildern, Text oder Audio. Ein neuronales Netz auf Tabellen-Daten bringt kaum Vorteile gegenueber klassischem ML — und der Prof will explizit DL sehen.",
    dl_loesung:"Es gaebe einen Weg: Statt die Zahlen zu nutzen, koenntet ihr die echten Audio-Dateien als Mel-Spektrogramme (= Bilder vom Klang) umwandeln und darauf ein CNN trainieren. Das waere echtes Deep Learning — aber deutlich aufwaendiger und ein grosser Sprung fuer Anfaenger.",
    fazit:"Cooles Thema, das jeden anspricht. Aber: Entweder tabellarisch (dann kein echtes DL) oder mit Spektrogrammen (dann sehr anspruchsvoll). Risiko-Thema fuer Anfaenger.",
    schwierigkeit:"Schwer (wegen DL-Anforderung)"},
  {name:"ADHS-Prioritaetenchecker",emoji:"🧠",wahl:true,
    frage:"Kann ML Menschen mit ADHS helfen, Aufgaben zu priorisieren und Zeitaufwand einzuschaetzen?",
    erklaerung:"Die Idee: Verschiedene Kaggle-Datensaetze zu ADHS (Diagnose-Daten, Produktivitaets-Daten, Leseleistung) zusammenfuehren und daraus ein System bauen, das bei der Aufgabenplanung hilft.",
    dl_problem:"Mehrere Probleme: Was genau soll der Computer vorhersagen? 'Prioritaet' ist kein klares Ziel. Vier verschiedene Datensaetze muessten zusammengefuehrt werden (extrem aufwaendig). Die Verbindung zwischen den Daten und dem Ergebnis ist schwach. Dazu kommt: 80% der Zeit wuerde fuer Daten-Aufbereitung draufgehen, nicht fuer DL.",
    dl_loesung:"Man koennte theoretisch ein neuronales Netz auf die zusammengefuehrten Daten trainieren — aber das waere wieder Tabellen-DL (nicht die Staerke von DL) und die Datenqualitaet ist das Hauptproblem.",
    fazit:"Persoenlich mega motivierend. Aber: Unklares Ziel + schwache Daten + DL-Anforderung = hohes Risiko. Fuer ein erstes ML-Projekt zu riskant. Die Motivation ist Gold wert — vielleicht fuer ein spaeteres Projekt.",
    schwierigkeit:"Sehr schwer (zu viele Unbekannte)"},
  {name:"Studentenperformance",emoji:"📚",wahl:false,
    frage:"Kann man anhand von Lernzeit, Familie, Fehlzeiten vorhersagen, wer die Pruefung besteht?",
    erklaerung:"Saubere, kleine Datensaetze mit klaren Features. Direkte studentische Perspektive. Aber: Wieder tabellarische Daten — kein ideales DL-Projekt.",
    dl_problem:"Gleiche Problematik wie Spotify: Tabellen-Daten sind nicht die Staerke von DL. Der Prof will explizit DL sehen.",
    dl_loesung:"Kein guter Workaround fuer echtes DL.",
    fazit:"Einfach und verstaendlich, aber passt nicht zur DL-Anforderung.",
    schwierigkeit:"Einfach (aber kein DL)"},
  {name:"Immobilienpreise",emoji:"🏠",wahl:false,
    frage:"Was ist eine Wohnung wert? Preis vorhersagen anhand von Groesse, Lage, Baujahr.",
    erklaerung:"Regression statt Klassifikation: Der Computer sagt nicht 'Kategorie A oder B', sondern 'Diese Wohnung kostet ca. 280.000 Euro'. Gute Datensaetze verfuegbar (Ames Housing, Berliner Mieten).",
    dl_problem:"Tabellarische Daten + Regression. DL bringt hier keinen Vorteil gegenueber klassischem ML.",
    dl_loesung:"Man koennte Bilder der Wohnungen einbeziehen — aber dafuer gibt es kaum fertige Datensaetze.",
    fazit:"Tolles Thema zum Lernen, aber nicht DL-geeignet.",
    schwierigkeit:"Mittel (aber kein DL)"},
  {name:"Fake News / Spam",emoji:"📰",wahl:false,
    frage:"Ist dieser Text echt oder fake? Spam oder kein Spam?",
    erklaerung:"Textklassifikation: Der Computer liest Texte und lernt Muster fuer Fake News oder Spam. Gesellschaftlich relevant und aktuell.",
    dl_problem:"Text-DL ist moeglich (NLP mit Transformern), aber Textverarbeitung (Tokenisierung, Embeddings) ist ein zusaetzlicher Lernschritt fuer Anfaenger.",
    dl_loesung:"Moeglich mit vortrainierten Sprachmodellen (BERT), aber deutlich komplexer als Bildklassifikation.",
    fazit:"DL-faehig, aber anspruchsvoller als Bilder. Koennte funktionieren, wenn jemand im Team Text-Erfahrung hat.",
    schwierigkeit:"Mittel-Schwer"},
];
// DL-optimierte Alternativvorschlaege (Bildklassifikation)
const PA_PROJEKT_TIPPS=[
  {name:"Hautkrebs-Erkennung",dataset:"HAM10000 (Kaggle)",emoji:"🔬",
    frage:"Ist dieses Hautbild gutartig oder boesartig?",
    erklaerung:"Stell dir vor, du zeigst dem Computer 10.000 Fotos von Hautflecken. Unter jedem Foto steht, ob es harmlos oder gefaehrlich ist. Der Computer schaut sich alle Fotos an und lernt dabei Muster: Welche Formen, Farben, Raender deuten auf Krebs hin? Nach dem Training kann er bei einem NEUEN Foto sagen: 'Das sieht gefaehrlich aus' oder 'Das ist wahrscheinlich harmlos.'",
    was_ihr_tut:"Ihr nehmt ein fertiges, schlaues Netz (z.B. ResNet50 — hat schon Millionen Bilder gesehen) und bringt ihm bei, speziell Hautbilder zu unterscheiden. Das nennt man Transfer Learning. Weil es viel mehr harmlose als gefaehrliche Bilder gibt, muesstet ihr die Daten etwas tricksen (Data Augmentation), damit das Modell nicht einfach immer 'harmlos' sagt.",
    pro:["Riesiger Datensatz (10.000+ Bilder) — genug zum Lernen","Medizinisch relevant — fuehlt sich sinnvoll an","Sehr viele Tutorials und Anleitungen online","Transfer Learning funktioniert hier besonders gut"],
    con:["7 verschiedene Kategorien — etwas komplexer","Klassen-Ungleichgewicht: viel mehr gutartige Bilder","Medizinische Bilder koennen unangenehm sein"],
    warum_gut:"Genug Daten, spannend, viele Hilfen online. Das Ungleichgewicht ist sogar ein Pluspunkt fuer die Doku — ihr koennt zeigen, dass ihr das Problem erkannt und behandelt habt.",
    warum_nicht:"Wenn euch medizinische Bilder unangenehm sind. Oder wenn 7 Klassen euch zu komplex erscheinen.",
    ansatz:"CNN mit Transfer Learning (z.B. ResNet50), Data Augmentation gegen Ungleichgewicht",
    schwierigkeit:"Mittel",
    doku_potenzial:"Sehr hoch — viel zu analysieren, zu diskutieren, und zu zeigen"},
  {name:"Roentgenbild: Lungenentzuendung",dataset:"Chest X-Ray (Kaggle)",emoji:"🫁",
    frage:"Zeigt dieses Roentgenbild eine gesunde oder kranke Lunge?",
    erklaerung:"Der Computer bekommt Roentgenbilder von Lungen. Manche sind gesund, manche zeigen eine Lungenentzuendung. Er lernt die Unterschiede — z.B. dass bei einer Entzuendung bestimmte Bereiche 'verschleiert' aussehen. Danach kann er bei einem neuen Bild sagen: 'Das sieht nach Pneumonie aus.'",
    was_ihr_tut:"Wieder Transfer Learning: Ihr nehmt ein vortrainiertes Netz (z.B. VGG16) und trainiert es auf eure Roentgenbilder. Nur 2 Klassen (gesund/krank), also ist die Aufgabe klar. Cool: Mit Grad-CAM koennt ihr dem Computer quasi eine Brille aufsetzen und sehen, WOHIN er auf dem Bild schaut — das ist super fuer die Praesentation!",
    pro:["Nur 2 Klassen — einfachste Variante","Klare visuelle Unterschiede, gut erkennbar","Grad-CAM macht es visuell spannend","Perfekter Einstieg fuer absolute Anfaenger"],
    con:["Kleinerer Datensatz als HAM10000","Nur 2 Klassen = weniger komplex = weniger zu diskutieren","Prof koennte finden, dass es ZU einfach ist"],
    warum_gut:"Am einfachsten von allen drei. Grad-CAM (zeigt wo das Modell hinschaut) beeindruckt in der Praesentation. Wenig kann schiefgehen.",
    warum_nicht:"Koennte zu einfach wirken. Weniger Stoff fuer die Diskussion/Doku, weil es nur 2 Klassen gibt.",
    ansatz:"CNN mit Transfer Learning (z.B. VGG16), Grad-CAM fuer visuelle Erklaerbarkeit",
    schwierigkeit:"Einfach",
    doku_potenzial:"Mittel — funktioniert gut, aber weniger Tiefe fuer Diskussion"},
  {name:"Emotionserkennung",dataset:"FER2013 (Kaggle)",emoji:"😊",
    frage:"Welche Emotion zeigt dieses Gesicht? (Happy, Sad, Angry, Surprise, ...)",
    erklaerung:"Der Computer bekommt Fotos von Gesichtern mit verschiedenen Emotionen. Er lernt: Wie sieht 'gluecklich' aus? Wie 'wuetend'? Manche Emotionen sind leicht (Gluecklich vs. Traurig), andere schwer (Angst vs. Ueberraschung). Genau DAS macht es spannend — man kann super ueber Fehler diskutieren.",
    was_ihr_tut:"Ihr koenntet sogar ein eigenes CNN von Grund auf bauen (nicht nur Transfer Learning). 7 Klassen (Happy, Sad, Angry, Surprise, Fear, Disgust, Neutral). Die Confusion Matrix wird richtig interessant zeigen, welche Emotionen der Computer verwechselt — und ihr koennt diskutieren WARUM.",
    pro:["7 Klassen — anspruchsvoll, zeigt echtes DL-Verstaendnis","35.000+ Bilder — genug Daten","Alltagsbezug, macht Spass, jeder versteht es","Die Fehler sind spannend zu analysieren (beste Diskussion!)"],
    con:["Schwieriger — manche Emotionen sind echt aehnlich","Datensatz-Qualitaet ist nicht perfekt (unscharfe Bilder)","Braucht evtl. mehr Tuning als die anderen beiden"],
    warum_gut:"Die beste Diskussion! Wenn das Modell 'Angst' und 'Ueberraschung' verwechselt, koennt ihr schreiben WARUM das Sinn macht. Der Prof liebt sowas. Und: Emotionen versteht jeder — eure Praesentation wird lebendig.",
    warum_nicht:"Schwieriger umzusetzen. Wenn ihr euch unsicher fuehlt und wenig Zeit habt, ist das ein Risiko.",
    ansatz:"CNN (eigenes oder Transfer Learning), Confusion Matrix zeigt spannende Verwechslungen",
    schwierigkeit:"Mittel-Schwer",
    doku_potenzial:"Sehr hoch — Fehleranalyse ist Gold wert fuer die Diskussion"},
];
const PA_GLOSSAR=[
  {term:"Deep Learning (DL)",simple:"Eine Art des Lernens, bei der der Computer mit vielen Schichten (Layers) arbeitet — wie ein Gehirn mit mehreren Verarbeitungsstufen. Jede Schicht erkennt kompliziertere Muster.",why:"Der Prof will DL, NICHT klassisches ML wie Scikit-learn. Also: PyTorch oder TensorFlow/Keras."},
  {term:"CNN (Convolutional Neural Network)",simple:"Ein spezielles neuronales Netz fuer Bilder. Es schaut sich kleine Bildausschnitte an und erkennt Muster wie Kanten, Formen, Texturen — und baut daraus ein Verstaendnis auf.",why:"Perfekt fuer Bildklassifikation. Das ist euer Hauptwerkzeug."},
  {term:"Transfer Learning",simple:"Statt bei Null anzufangen, nehmt ihr ein Netz, das schon Millionen Bilder gesehen hat (z.B. ResNet), und bringt ihm nur noch EURE spezielle Aufgabe bei. Wie ein Koch, der schon kochen kann, aber ein neues Rezept lernt.",why:"Spart enorm viel Zeit und funktioniert meistens besser als von Null."},
  {term:"Epoch",simple:"Einmal durch ALLE Trainingsdaten durchgehen. Training laeuft typisch 10-100 Epochs. Wie ein Schueler, der ein Buch mehrmals liest.",why:"Zu wenige: Modell lernt nicht genug. Zu viele: Modell lernt Daten auswendig (Overfitting)."},
  {term:"Batch Size",simple:"Wie viele Beispiele der Computer gleichzeitig anschaut, bevor er seine Gewichte anpasst. Z.B. 32 Bilder auf einmal.",why:"Muss man angeben und begruenden. Typisch: 16, 32, 64."},
  {term:"Learning Rate",simple:"Wie grosse Schritte das Modell beim Lernen macht. Zu gross = es springt uebers Ziel hinaus. Zu klein = es braucht ewig.",why:"DER wichtigste Hyperparameter. Typisch: 0.001 oder 0.0001."},
  {term:"Loss-Funktion",simple:"Misst, wie schlecht das Modell gerade ist. Je kleiner der Loss, desto besser. Das Ziel des Trainings ist: Loss minimieren.",why:"Cross-Entropy fuer Klassifikation. Muss in der Doku stehen."},
  {term:"Optimizer",simple:"Der Algorithmus, der die Gewichte anpasst. Adam ist der Standard — funktioniert fast immer gut.",why:"In der Doku angeben und begruenden. Adam ist eine sichere Wahl."},
  {term:"Overfitting",simple:"Das Modell lernt die Trainingsdaten AUSWENDIG, statt allgemeine Muster zu erkennen. Wie ein Schueler, der nur die alten Pruefungsfragen auswendig lernt.",why:"Erkennt man wenn: Training-Loss sinkt, aber Validation-Loss steigt. Gegenmittel: Dropout, Early Stopping, mehr Daten."},
  {term:"Dropout",simple:"Zufaellig werden waehrend des Trainings einige Neuronen 'ausgeschaltet'. Das zwingt das Netz, sich nicht auf einzelne Neuronen zu verlassen.",why:"Schuetzt vor Overfitting. Typischer Wert: 0.3-0.5."},
  {term:"Early Stopping",simple:"Training automatisch anhalten, wenn das Modell auf den Validierungsdaten nicht mehr besser wird — bevor es overfittet.",why:"Steht explizit in den Anforderungen. Leicht umzusetzen."},
  {term:"Confusion Matrix",simple:"Eine Tabelle, die zeigt: Was hat das Modell als was erkannt? Z.B. 90x Hautkrebs richtig erkannt, 5x faelschlich als gutartig eingestuft.",why:"Zeigt genau, WO das Modell Fehler macht. Muss in der Evaluation stehen."},
  {term:"Accuracy / Precision / Recall / F1",simple:"Verschiedene Wege zu messen, wie gut das Modell ist. Accuracy = Wie oft liegt es insgesamt richtig? Precision = Wenn es 'Krebs' sagt, wie oft stimmt das? Recall = Wie viele echte Krebs-Faelle findet es? F1 = Mittelwert aus Precision und Recall.",why:"Alles in der Evaluation angeben. Bei ungleichen Klassen ist F1 besser als Accuracy."},
];
const PA_PROF_ZITAT="Eine Projektarbeit ist NICHT gescheitert, wenn die gewuenschte Performance nicht erreicht wird. Entscheidend ist, dass ihr den Prozess versteht und wissenschaftlich analysiert.";
const PA_PPTX_REQ=[
  "a) Titel der Projektarbeit",
  "b) Ziel des Projekts: Was soll euer Modell koennen?",
  "c) Datenquelle: Woher kommen die Daten? (Kaggle-Link)",
  "d) Ansatz/Methodik: Welchen DL-Ansatz nutzt ihr?",
  "e) Evaluationsmetriken: Womit messt ihr den Erfolg?",
  "f) Aufgabenverteilung: Wer macht was im Team?",
];
const PA_PHASES=[
  {id:"topic",title:"Thema finden",emoji:"💡",focus:"Was soll der Computer lernen?",
    simple:"Ihr sucht ein Problem, bei dem ein Computer aus Beispielen lernen kann, etwas zu erkennen. Bildklassifikation ist ideal fuer Anfaenger: Ihr gebt dem Computer Bilder und er lernt, sie zu sortieren. Z.B. 'Ist dieses Roentgenbild gesund oder krank?'",
    todo:["Projektvorschlaege anschauen (s. unten)","Ein Dataset auf Kaggle.com finden","Klaeren: Was ist die Frage? (Klassifikation!)","Thema im Team absprechen","Pruefen: Ist genug Datenmaterial vorhanden? (min. 1000 Bilder)"],
    done:"Ihr wisst, welches Problem ihr loesen wollt und woher die Daten kommen.",
    extra:"bildklassifikation"},
  {id:"pptx",title:"PPTX fuer den Prof",emoji:"📧",focus:"1-2 Folien — Deadline: 31. Maerz 2026!",
    simple:"Der Prof will wissen, was ihr vorhabt. Kein fertiges Projekt — nur ein Plan. Die 6 Punkte (a-f) muessen drauf. Das ist kein Hexenwerk: Titel, was ihr macht, woher die Daten, wie ihr vorgeht, wie ihr Erfolg messt, wer was macht.",
    todo:["Die 6 Pflichtpunkte (a-f) abarbeiten (s. unten)","PPTX erstellen (1-2 Folien reichen!)","Per E-Mail an Prof. Turan senden","FRIST: 31.03.2026!"],
    done:"Prof hat euren Plan und gibt Feedback.",
    extra:"pptx_req"},
  {id:"data",title:"Daten anschauen",emoji:"🔍",focus:"Was steckt in den Daten?",
    simple:"Bevor ihr trainiert, schaut ihr euch die Daten an. Wie ein Koch, der erstmal den Kuehlschrank oeffnet. Wie viele Bilder/Zeilen? Welche Kategorien? Ist alles ausgewogen oder fehlt was?",
    todo:["Dataset herunterladen","Jupyter Notebook oeffnen","Anzahl Datenpunkte zaehlen","Verteilung der Klassen anzeigen (Balkendiagramm)","Ein paar Beispiele anschauen","Auffaelligkeiten notieren"],
    done:"Ihr wisst, was in den Daten steckt und wo Probleme lauern."},
  {id:"prep",title:"Daten aufbereiten",emoji:"🧹",focus:"Daten sauber machen",
    simple:"Echte Daten sind nie perfekt. Ihr bringt alles in Form: gleiche Groesse, fehlende Werte behandeln, Daten normalisieren. Wie Zutaten vorbereiten vor dem Kochen.",
    todo:["Fehlende Werte finden und behandeln","Bilder auf gleiche Groesse bringen (falls Bildprojekt)","Daten normalisieren/standardisieren","Train/Validation/Test aufteilen (z.B. 70/15/15)","Optional: Data Augmentation (mehr Trainingsdaten erzeugen)"],
    done:"Eure Daten sind sauber und bereit fuers Training."},
  {id:"model",title:"Modell bauen",emoji:"🧠",focus:"Das neuronale Netz zusammenstecken",
    simple:"Jetzt baut ihr das 'Gehirn'. Ihr muesst nichts erfinden — es gibt fertige Bauplaene (z.B. ResNet). Ihr waehlt eine Architektur, stellt die Hyperparameter ein, und erklaert warum.",
    todo:["Framework waehlen (PyTorch oder TensorFlow/Keras)","Architektur waehlen und begruenden","Hyperparameter festlegen (Learning Rate, Batch Size, Epochs)","Loss-Funktion und Optimizer waehlen","Optional: Transfer Learning (vortrainiertes Netz nutzen)"],
    done:"Euer Modell steht und ist bereit zum Trainieren."},
  {id:"train",title:"Trainieren",emoji:"🏋️",focus:"Dem Computer die Beispiele zeigen",
    simple:"Ihr startet das Training. Der Computer schaut sich die Beispiele immer wieder an und lernt Muster. Ihr beobachtet die Lernkurve: Geht der Fehler runter? Gut! Steigt er wieder? Overfitting!",
    todo:["Training starten","Loss-Kurve beobachten und speichern","Verschiedene Modelle/Einstellungen vergleichen","Overfitting-Techniken anwenden (Dropout, Early Stopping)","Bestes Modell auswaehlen"],
    done:"Euer Modell hat gelernt. Zeit zum Testen."},
  {id:"eval",title:"Testen & Auswerten",emoji:"📊",focus:"Wie gut ist das Modell wirklich?",
    simple:"Ihr testet mit Daten, die das Modell noch NIE gesehen hat. Dann messt ihr: Wie oft liegt es richtig? Wo macht es Fehler? Das ist der ehrliche Moment.",
    todo:["Modell auf Testdaten laufen lassen","Metriken berechnen (Accuracy, Precision, Recall, F1)","Confusion Matrix erstellen","Fehleranalyse: Wo und warum irrt sich das Modell?","Vergleichstabelle aller Modelle erstellen","Ergebnisse visualisieren"],
    done:"Ihr wisst, wie gut euer Modell ist und warum."},
  {id:"discuss",title:"Diskussion schreiben",emoji:"💬",focus:"Was habt ihr gelernt?",
    simple:"DAS ist der wichtigste Teil fuer die Note! Hat es funktioniert? Was nicht? Warum? Was wuerdet ihr naechstes Mal anders machen? Ehrlichkeit wird hier belohnt.",
    todo:["Ergebnisse interpretieren","Was hat gut funktioniert?","Was hat NICHT funktioniert und warum?","Limitationen ehrlich benennen","Verbesserungsideen fuer die Zukunft aufschreiben"],
    done:"Eure Diskussion zeigt, dass ihr den Prozess verstanden habt."},
  {id:"finish",title:"Abgabe vorbereiten",emoji:"🚀",focus:"Alles zusammenpacken",
    simple:"Git Repo aufraeuemen, README schreiben, requirements.txt erstellen, Doku finalisieren. Dann Link per E-Mail an den Prof. Fertig!",
    todo:["Code aufraeumen und kommentieren","README.md schreiben (Anleitung zur Ausfuehrung)","requirements.txt erstellen","Doku finalisieren (Jupyter Notebook oder Markdown)","Git Repo pruefen: Ist alles reproduzierbar?","Link per E-Mail an den Prof senden","Praesentation vorbereiten (10 Min. pro Person)"],
    done:"Abgegeben! Jetzt nur noch praesentieren."},
];

// Shared collapsible section (outside components to avoid re-mount)
const InfoBox=({emoji,title,children,color})=>{const t=useT();return <div style={{background:(color||t.ac)+"10",border:`1px solid ${(color||t.ac)}25`,borderRadius:t.term?6:10,padding:"14px 16px",marginBottom:12}}>
  <div style={{fontSize:12,fontWeight:700,color:color||t.ac,marginBottom:6}}>{emoji} {title}</div>
  <div style={{fontSize:13,color:t.txB,lineHeight:1.7}}>{children}</div>
</div>;};
const Section=({title,emoji,children,defaultOpen})=>{
  const t=useT();
  const [open,setOpen]=useState(defaultOpen||false);
  return <div style={{marginBottom:16}}>
    <button onClick={()=>setOpen(!open)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"14px 18px",background:open?t.ac+"10":t.bgC,border:`1px solid ${open?t.ac+"30":t.bd}`,borderRadius:t.term?6:10,cursor:"pointer",fontFamily:t.sf}}>
      <span style={{fontSize:14,fontWeight:700,color:open?t.ac:t.tx}}>{emoji} {title}</span>
      <span style={{fontSize:12,color:t.txM}}>{open?"▲":"▼"}</span>
    </button>
    {open&&<div style={{padding:"16px 18px",border:`1px solid ${t.bd}`,borderTop:"none",borderRadius:`0 0 ${t.term?6:10}px ${t.term?6:10}px`}}>{children}</div>}
  </div>;
};

const MCompass = () => {
  const t=useT();const {author}=useApp();
  const [phase,setPhase]=useState(0);
  const [checks,setChecks]=useState(()=>{try{const s=localStorage.getItem("ml_compass_"+author);return s?JSON.parse(s):{};}catch(e){return {};}});
  const [expanded,setExpanded]=useState(null);
  const [openProject,setOpenProject]=useState(null);
  const [glossarFilter,setGlossarFilter]=useState("");
  const [miles,setMiles]=useState(()=>{try{const s=localStorage.getItem("ml_miles_"+author);return s?JSON.parse(s):{};} catch(e){return {};}});
  const [justDone,setJustDone]=useState(null);
  useEffect(()=>{try{localStorage.setItem("ml_miles_"+author,JSON.stringify(miles));}catch(e){}},[miles,author]);
  const toggleMile=(id)=>{const nv=!miles[id];setMiles(p=>({...p,[id]:nv}));if(nv){setJustDone(id);setTimeout(()=>setJustDone(null),2500);}};
  const mileCnt=Object.values(miles).filter(Boolean).length;
  const milePct=Math.round(mileCnt/MILES.length*100);
  useEffect(()=>{try{localStorage.setItem("ml_compass_"+author,JSON.stringify(checks));}catch(e){}},[checks,author]);

  const toggleCheck=(phaseId,idx)=>setChecks(p=>{const key=phaseId+"_"+idx;return {...p,[key]:!p[key]};});
  const phaseProgress=(p)=>{const done=p.todo.filter((_,i)=>checks[p.id+"_"+i]).length;return Math.round(done/p.todo.length*100);};
  const totalProgress=Math.round(PA_PHASES.reduce((s,p)=>s+phaseProgress(p),0)/PA_PHASES.length);
  const today=new Date();
  const daysUntil=(dateStr)=>{const d=new Date(dateStr);return Math.ceil((d-today)/(1000*60*60*24));};
  const p=PA_PHASES[phase];
  const filteredGlossar=PA_GLOSSAR.filter(g=>!glossarFilter||g.term.toLowerCase().includes(glossarFilter.toLowerCase())||g.simple.toLowerCase().includes(glossarFilter.toLowerCase()));

  return <div>
    <CL num="🧠"/><H1>Sebbis Hyperfokus-HQ</H1>
    <P>Dein persoenlicher Guide durch die Projektarbeit. Aktuell: Projekt auswaehlen!</P>

    {/* ═══════════════════════════════════════ */}
    {/* HERO: PROJEKTWAHL — DAS IST JETZT DRAN */}
    {/* ═══════════════════════════════════════ */}

    <div style={{background:`linear-gradient(135deg, ${t.ac}12, ${t.ok}08)`,border:`2px solid ${t.ac}40`,borderRadius:t.term?8:16,padding:"24px 28px",marginBottom:24}}>
      <div style={{fontSize:11,fontWeight:700,color:t.ac,textTransform:"uppercase",letterSpacing:".08em",marginBottom:6}}>🎯 Dein Fokus jetzt</div>
      <div style={{fontSize:22,fontWeight:700,fontFamily:t.hf,color:t.tx,marginBottom:12}}>Welches Projekt nehmen wir?</div>

      {/* Erstmal verstehen: Was machen wir ueberhaupt? */}
      <div style={{background:t.bgC,borderRadius:t.term?6:10,padding:"16px 20px",marginBottom:16,border:`1px solid ${t.bd}`}}>
        <div style={{fontSize:13,fontWeight:700,color:t.tx,marginBottom:8}}>Was machen wir ueberhaupt?</div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.8}}>
          Ihr bringt einem Computer bei, Bilder zu sortieren. Ganz konkret: Ihr zeigt ihm tausende Beispielbilder, bei denen ihr wisst, was drauf ist. Der Computer erkennt dabei selbst Muster. Danach kann er bei einem NEUEN Bild sagen, was er sieht.
        </div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.8,marginTop:8}}>
          Das ist wie einem Kind Tiere beibringen: Ihr zeigt ihm 1000 Fotos von Hunden und Katzen, und irgendwann kann es selbst sagen "Das ist ein Hund." Nur dass euer "Kind" ein neuronales Netz ist.
        </div>
      </div>

      {/* Warum Bildklassifikation */}
      <div style={{background:t.ac+"08",borderRadius:t.term?6:10,padding:"14px 18px",marginBottom:16,border:`1px solid ${t.ac}20`}}>
        <div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:4}}>Warum gerade Bilder?</div>
        <div style={{fontSize:12,color:t.txB,lineHeight:1.7}}>
          Weil es der einfachste und klarste Einstieg in Deep Learning ist. Die Aufgabe ist simpel (Bild rein → Kategorie raus), es gibt riesige fertige Datensaetze, und ihr koennt ein vortrainiertes Netz nehmen (Transfer Learning), das schon "sehen" kann — ihr bringt ihm nur bei, WAS es sehen soll.
        </div>
      </div>

      {/* Warum Deep Learning */}
      <div style={{background:t.ac+"08",borderRadius:t.term?6:10,padding:"14px 18px",marginBottom:20,border:`1px solid ${t.ac}20`}}>
        <div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:4}}>Warum Deep Learning und nicht was Einfacheres?</div>
        <div style={{fontSize:12,color:t.txB,lineHeight:1.7}}>
          Der Prof sagt klar: Er will Deep Learning sehen (PyTorch oder TensorFlow), NICHT klassisches Machine Learning (Scikit-learn). Deep Learning = neuronale Netze mit vielen Schichten. Das klingt kompliziert, aber mit Transfer Learning ist es ueberraschend machbar — ihr muesstet nichts von Null erfinden.
        </div>
      </div>

      {/* ─── SEBBIS ORIGINAL-AUSWAHL: ALLE 5 VORSCHLAEGE ─── */}
      <div style={{fontSize:16,fontWeight:700,fontFamily:t.hf,color:t.tx,marginBottom:4}}>Unsere 5 Ideen — und warum es knifflig wird</div>
      <div style={{fontSize:12,color:t.txM,marginBottom:16}}>Das waren unsere urspruenglichen 5 Vorschlaege. Du hast Spotify und ADHS gewaehlt (markiert mit ⭐). Hier siehst du fuer jedes Projekt, wie es mit der DL-Anforderung des Profs zusammenpasst.</div>

      {PA_MEINE_WAHL.map((mw,i)=>{const isOpen=expanded==="mw_"+i;
        return <div key={"mw"+i} style={{marginBottom:10}}>
          <button onClick={()=>setExpanded(isOpen?null:"mw_"+i)} style={{width:"100%",textAlign:"left",padding:"14px 18px",background:isOpen?mw.wahl?t.ac+"12":t.bgAS:mw.wahl?t.ac+"06":t.bgC,border:`1px solid ${mw.wahl?t.ac+"40":t.bd}`,borderRadius:isOpen?`${t.term?6:10}px ${t.term?6:10}px 0 0`:t.term?6:10,cursor:"pointer",fontFamily:t.sf,transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:18}}>{mw.emoji}</span>
                {mw.wahl&&<span style={{fontSize:11,fontWeight:700,padding:"1px 6px",borderRadius:4,background:t.ac+"20",color:t.ac}}>⭐ DEINE WAHL</span>}
                <span style={{fontSize:14,fontWeight:mw.wahl?700:600,color:t.tx}}>{mw.name}</span>
              </div>
              <span style={{fontSize:10,fontWeight:600,padding:"2px 6px",borderRadius:4,background:mw.schwierigkeit.includes("Schwer")||mw.schwierigkeit.includes("schwer")?t.errBg:mw.schwierigkeit.includes("Einfach")?t.okBg:t.ac+"15",color:mw.schwierigkeit.includes("Schwer")||mw.schwierigkeit.includes("schwer")?t.err:mw.schwierigkeit.includes("Einfach")?t.ok:t.ac}}>{mw.schwierigkeit}</span>
            </div>
          </button>
          {isOpen&&<div style={{padding:"16px 20px",border:`1px solid ${mw.wahl?t.ac+"40":t.bd}`,borderTop:"none",borderRadius:`0 0 ${t.term?6:10}px ${t.term?6:10}px`,background:t.bgAS}}>
            <div style={{fontSize:13,color:t.ac,fontWeight:600,marginBottom:10}}>"{mw.frage}"</div>
            <div style={{fontSize:13,color:t.txB,lineHeight:1.7,marginBottom:12}}>{mw.erklaerung}</div>
            <div style={{background:t.err+"08",border:`1px solid ${t.err}20`,borderRadius:t.term?4:8,padding:"10px 14px",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:t.err,marginBottom:4}}>⚠️ DL-PROBLEM</div>
              <div style={{fontSize:12,color:t.txB,lineHeight:1.7}}>{mw.dl_problem}</div>
            </div>
            <div style={{background:t.ac+"08",border:`1px solid ${t.ac}20`,borderRadius:t.term?4:8,padding:"10px 14px",marginBottom:10}}>
              <div style={{fontSize:11,fontWeight:700,color:t.ac,marginBottom:4}}>💡 MOEGLICHE DL-LOESUNG</div>
              <div style={{fontSize:12,color:t.txB,lineHeight:1.7}}>{mw.dl_loesung}</div>
            </div>
            <div style={{background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?4:8,padding:"10px 14px"}}>
              <div style={{fontSize:11,fontWeight:700,color:t.txM,marginBottom:4}}>FAZIT</div>
              <div style={{fontSize:12,color:t.txB,lineHeight:1.7,fontWeight:500}}>{mw.fazit}</div>
            </div>
          </div>}
        </div>;})}

      {/* ─── WARUM BILDER? ─── */}
      <div style={{background:t.ac+"10",border:`1px solid ${t.ac}25`,borderRadius:t.term?6:10,padding:"14px 18px",marginTop:16,marginBottom:16}}>
        <div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:4}}>Und jetzt? Warum Bildklassifikation als Alternative?</div>
        <div style={{fontSize:12,color:t.txB,lineHeight:1.7}}>
          Das Problem bei Spotify, ADHS, Studenten und Immobilien: Die Daten sind TABELLEN (Zahlen in Spalten). Deep Learning ist aber am staerksten bei Bildern und Text. Der Prof will DL sehen — also braucht ihr ein Projekt, bei dem DL Sinn macht. Bildklassifikation ist der perfekte Einstieg: Bild rein, Kategorie raus, fertige Datensaetze, Transfer Learning macht es machbar.
        </div>
      </div>

      {/* ─── DIE 3 BILD-PROJEKTE ALS DL-ALTERNATIVEN ─── */}
      <div style={{fontSize:16,fontWeight:700,fontFamily:t.hf,color:t.tx,marginBottom:4}}>3 DL-taugliche Alternativen (Bildklassifikation)</div>
      <div style={{fontSize:12,color:t.txM,marginBottom:16}}>Diese drei Projekte passen perfekt zur DL-Anforderung. Alle nutzen CNNs auf Bilddaten. Klick fuer Details.</div>

      {PA_PROJEKT_TIPPS.map((pr,i)=>{const isOpen=openProject===i;
        return <div key={i} style={{marginBottom:12}}>
          <button onClick={()=>setOpenProject(isOpen?null:i)} style={{width:"100%",textAlign:"left",padding:"16px 20px",background:isOpen?t.bgAS:t.bgC,border:`1px solid ${isOpen?t.ac+"40":t.bd}`,borderRadius:isOpen?`${t.term?6:10}px ${t.term?6:10}px 0 0`:t.term?6:10,cursor:"pointer",fontFamily:t.sf,transition:"all .15s"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div>
                <span style={{fontSize:20,marginRight:8}}>{pr.emoji}</span>
                <span style={{fontSize:15,fontWeight:700,color:t.tx}}>{pr.name}</span>
                <span style={{fontSize:11,fontWeight:600,padding:"2px 8px",borderRadius:4,marginLeft:10,background:pr.schwierigkeit==="Einfach"?t.okBg:pr.schwierigkeit==="Mittel"?t.ac+"15":t.errBg,color:pr.schwierigkeit==="Einfach"?t.ok:pr.schwierigkeit==="Mittel"?t.ac:t.err}}>{pr.schwierigkeit}</span>
              </div>
              <span style={{fontSize:12,color:t.txM}}>{isOpen?"▲":"▼"}</span>
            </div>
            <div style={{fontSize:13,color:t.ac,fontWeight:600,marginTop:4}}>"{pr.frage}"</div>
          </button>

          {isOpen&&<div style={{padding:"20px 24px",border:`1px solid ${t.ac}40`,borderTop:"none",borderRadius:`0 0 ${t.term?6:10}px ${t.term?6:10}px`,background:t.bgAS}}>
            {/* Was passiert hier? */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:t.tx,marginBottom:6}}>🧠 Was passiert hier — ganz einfach erklaert:</div>
              <div style={{fontSize:13,color:t.txB,lineHeight:1.8,background:t.bgC,padding:"12px 16px",borderRadius:t.term?4:8,border:`1px solid ${t.bd}`}}>{pr.erklaerung}</div>
            </div>

            {/* Was IHR tut */}
            <div style={{marginBottom:16}}>
              <div style={{fontSize:12,fontWeight:700,color:t.tx,marginBottom:6}}>🔧 Was ihr konkret tun wuerdet:</div>
              <div style={{fontSize:13,color:t.txB,lineHeight:1.8,background:t.bgC,padding:"12px 16px",borderRadius:t.term?4:8,border:`1px solid ${t.bd}`}}>{pr.was_ihr_tut}</div>
            </div>

            {/* Datensatz */}
            <div style={{fontSize:12,color:t.txM,marginBottom:12}}>📦 Datensatz: <span style={{fontWeight:600,color:t.ac}}>{pr.dataset}</span> — Doku-Potenzial: <span style={{fontWeight:600,color:t.ac}}>{pr.doku_potenzial}</span></div>

            {/* Pro / Contra */}
            <div style={{display:"flex",gap:12,marginBottom:16,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:200,background:t.okBg,borderRadius:t.term?4:8,padding:"12px 14px"}}>
                <div style={{fontSize:11,fontWeight:700,color:t.ok,marginBottom:6}}>DAFUER</div>
                {pr.pro.map((p,j)=><div key={j} style={{fontSize:12,color:t.txB,lineHeight:1.6,paddingLeft:12,position:"relative"}}><span style={{position:"absolute",left:0,color:t.ok}}>+</span> {p}</div>)}
              </div>
              <div style={{flex:1,minWidth:200,background:t.errBg,borderRadius:t.term?4:8,padding:"12px 14px"}}>
                <div style={{fontSize:11,fontWeight:700,color:t.err,marginBottom:6}}>DAGEGEN</div>
                {pr.con.map((c,j)=><div key={j} style={{fontSize:12,color:t.txB,lineHeight:1.6,paddingLeft:12,position:"relative"}}><span style={{position:"absolute",left:0,color:t.err}}>−</span> {c}</div>)}
              </div>
            </div>

            {/* Empfehlung */}
            <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:12}}>
              <div style={{flex:1,minWidth:200,padding:"10px 14px",background:t.ok+"10",borderRadius:t.term?4:8,border:`1px solid ${t.ok}20`}}>
                <div style={{fontSize:11,fontWeight:700,color:t.ok,marginBottom:2}}>Nehmen wenn:</div>
                <div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>{pr.warum_gut}</div>
              </div>
              <div style={{flex:1,minWidth:200,padding:"10px 14px",background:t.err+"10",borderRadius:t.term?4:8,border:`1px solid ${t.err}20`}}>
                <div style={{fontSize:11,fontWeight:700,color:t.err,marginBottom:2}}>Lieber nicht wenn:</div>
                <div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>{pr.warum_nicht}</div>
              </div>
            </div>

            <div style={{fontSize:12,color:t.txM,padding:"8px 12px",background:t.bgC,borderRadius:t.term?4:6,border:`1px solid ${t.bd}`}}>
              <span style={{fontWeight:600,color:t.ac}}>Technischer Ansatz:</span> {pr.ansatz}
            </div>
          </div>}
        </div>;})}

      {/* Zusammenfassung / Empfehlung */}
      <div style={{background:t.bgC,borderRadius:t.term?6:10,padding:"16px 20px",marginTop:8,border:`1px solid ${t.bd}`}}>
        <div style={{fontSize:13,fontWeight:700,color:t.tx,marginBottom:8}}>Und was soll ich dem Team sagen?</div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.8}}>
          Du musst kein Experte sein, um mitzureden. Hier ist, was du wissen musst:
        </div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.8,marginTop:8}}>
          <span style={{fontWeight:600}}>Am sichersten:</span> Roentgenbild (Pneumonia) — am wenigsten kann schiefgehen, ideal wenn ihr wenig Erfahrung habt. Aber: Weniger spannend fuer die Doku.
        </div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.8,marginTop:4}}>
          <span style={{fontWeight:600}}>Bestes Verhaeltnis:</span> Hautkrebs (HAM10000) — genug Daten, genug Komplexitaet, viele Hilfen online. Die sicherste Wahl fuer eine gute Note.
        </div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.8,marginTop:4}}>
          <span style={{fontWeight:600}}>Am spannendsten:</span> Emotionserkennung — macht am meisten Spass und liefert die beste Diskussion, aber auch am anspruchsvollsten.
        </div>
        <div style={{fontSize:13,color:t.txM,lineHeight:1.8,marginTop:8,fontStyle:"italic"}}>
          Tipp: Schlag dem Team die Projekte vor und fragt euch: Was interessiert UNS am meisten? Denn das Projekt zieht sich ueber Monate — Interesse schlaegt Einfachheit.
        </div>
      </div>
    </div>

    {/* ═══════ WICHTIG ZU WISSEN (Prof-Zitat + Philosophie) ═══════ */}
    <div style={{background:t.okBg,border:`1px solid ${t.ok}30`,borderRadius:t.term?6:12,padding:"16px 20px",marginBottom:20}}>
      <div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:6}}>💚 DAS WICHTIGSTE — DRUCK RAUSNEHMEN</div>
      <div style={{fontSize:14,fontStyle:"italic",color:t.tx,lineHeight:1.6,marginBottom:8}}>"{PA_PROF_ZITAT}"</div>
      <div style={{fontSize:12,color:t.txB,lineHeight:1.7}}>
        Heisst: Ihr muesst NICHT die beste Accuracy haben. Wenn euer Modell nur 60% der Bilder richtig erkennt, ist das OKAY — solange ihr erklaeren koennt WARUM und was man besser machen koennte. Lieber etwas, das mit einer schluessigen Erklaerung nicht perfekt funktioniert, als etwas, das irgendwie funktioniert, aber keiner versteht warum.
      </div>
      <div style={{fontSize:13,fontWeight:600,color:t.ok,marginTop:8}}>Verstehen {">"} Performance. Der Weg ist das Ziel.</div>
    </div>

    {/* ═══════ DEADLINES ═══════ */}
    <div style={{display:"flex",gap:8,marginBottom:24,flexWrap:"wrap"}}>
      {PA_DEADLINES.map((dl,i)=>{const days=daysUntil(dl.date);const urgent=days<=7&&days>=0;const past=days<0;
        return <div key={i} style={{flex:1,minWidth:150,padding:"12px 14px",borderRadius:t.term?6:10,background:past?t.okBg:urgent?t.errBg:t.bgC,border:`1px solid ${past?t.ok+"40":urgent?t.err+"40":t.bd}`}}>
          <div style={{fontSize:11,fontWeight:700,color:past?t.ok:urgent?t.err:t.txM,marginBottom:2}}>{past?"✓ ERLEDIGT":urgent?"⚡ DRINGEND":"📅 TERMIN"}</div>
          <div style={{fontSize:13,fontWeight:600,color:t.tx}}>{dl.label}</div>
          <div style={{fontSize:11,color:t.txM,marginTop:2}}>{dl.desc}</div>
          <div style={{fontSize:12,fontWeight:700,color:past?t.ok:urgent?t.err:t.ac,marginTop:4}}>{past?"Geschafft!":days===0?"HEUTE!":days===1?"Morgen!":"Noch "+days+" Tage"}</div>
        </div>;})}
    </div>

    {/* ═══════ AUFKLAPPBAR: BEGRIFFE-LEXIKON ═══════ */}
    <Section title="Begriffe-Lexikon — einfach erklaert" emoji="📖">
      <div style={{fontSize:12,color:t.txM,marginBottom:12}}>Hier findest du alle Fachbegriffe, die im Projekt vorkommen. Klick auf einen Begriff fuer mehr Details.</div>
      <input value={glossarFilter} onChange={e=>setGlossarFilter(e.target.value)} placeholder="🔍 Begriff suchen..." style={{width:"100%",padding:"8px 12px",borderRadius:t.term?4:8,border:`1px solid ${t.bd}`,background:t.bgC,color:t.tx,fontSize:13,fontFamily:t.sf,marginBottom:12,boxSizing:"border-box"}}/>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {filteredGlossar.map((g,i)=><div key={i} onClick={()=>setExpanded(expanded===g.term?null:g.term)} style={{padding:"12px 16px",background:expanded===g.term?t.ac+"08":t.bgC,border:`1px solid ${expanded===g.term?t.ac+"30":t.bd}`,borderRadius:t.term?6:8,cursor:"pointer",transition:"all .15s"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,fontWeight:700,color:t.ac}}>{g.term}</span>
            <span style={{fontSize:11,color:t.txM}}>{expanded===g.term?"▲":"▼"}</span>
          </div>
          <div style={{fontSize:12,color:t.txB,marginTop:4,lineHeight:1.6}}>{g.simple}</div>
          {expanded===g.term&&<div style={{marginTop:8,padding:"8px 12px",background:t.ac+"10",borderRadius:t.term?4:6,fontSize:12,color:t.txM,lineHeight:1.6}}>
            <span style={{fontWeight:600,color:t.ac}}>Warum wichtig?</span> {g.why}
          </div>}
        </div>)}
      </div>
    </Section>

    {/* ═══════ AUFKLAPPBAR: ALLE PHASEN ═══════ */}
    <Section title="Alle Phasen im Ueberblick" emoji="🗺️">
      <div style={{fontSize:12,color:t.txM,marginBottom:12}}>Sobald das Thema steht, arbeitet ihr euch Schritt fuer Schritt durch diese 9 Phasen. Jede Phase wird ein Kapitel in eurer Doku.</div>

      {/* Gesamtfortschritt */}
      <div style={{marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600,color:t.txM}}>Gesamtfortschritt</span>
          <span style={{fontSize:13,fontWeight:700,color:t.ac}}>{totalProgress}%</span>
        </div>
        <div style={{height:8,borderRadius:4,background:t.bd+"40",overflow:"hidden"}}>
          <div style={{height:"100%",width:totalProgress+"%",background:`linear-gradient(90deg, ${t.ac}, ${t.ok})`,borderRadius:4,transition:"width .5s"}}/>
        </div>
      </div>

      {/* Phase-Navigation */}
      <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
        {PA_PHASES.map((ph,i)=>{const prog=phaseProgress(ph);const active=phase===i;const done=prog===100;
          return <button key={ph.id} onClick={()=>setPhase(i)} style={{padding:"6px 10px",borderRadius:t.term?4:20,border:`1px solid ${active?t.ac:done?t.ok+"40":t.bd}`,background:active?t.ac:done?t.okBg:t.bgC,color:active?t.w:done?t.ok:t.txM,fontSize:11,fontWeight:active?700:500,cursor:"pointer",fontFamily:t.sf,whiteSpace:"nowrap",transition:"all .15s"}}>
            {done?"✓ ":""}{ph.emoji} {ph.title.split(" ")[0]}
          </button>;})}
      </div>

      {/* Aktive Phase */}
      {p&&<div>
        <div style={{background:t.bgAS,border:`1px solid ${t.bdA}`,borderRadius:t.term?8:14,padding:"20px 24px",marginBottom:16}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
            <div>
              <span style={{fontSize:24,marginRight:8}}>{p.emoji}</span>
              <span style={{fontSize:18,fontWeight:700,fontFamily:t.hf,color:t.tx}}>{p.title}</span>
            </div>
            <span style={{fontSize:13,fontWeight:700,color:phaseProgress(p)===100?t.ok:t.ac}}>{phaseProgress(p)}%</span>
          </div>

          <div style={{background:t.ac+"15",border:`1px solid ${t.ac}30`,borderRadius:t.term?6:10,padding:"12px 14px",marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:t.ac,marginBottom:2}}>🎯 FOKUS</div>
            <div style={{fontSize:14,fontWeight:600,color:t.tx,lineHeight:1.5}}>{p.focus}</div>
          </div>

          <div style={{fontSize:13,color:t.txB,lineHeight:1.7,marginBottom:16}}>{p.simple}</div>

          {p.extra==="pptx_req"&&<div style={{background:t.ac+"10",border:`1px solid ${t.ac}25`,borderRadius:t.term?6:10,padding:"12px 16px",marginBottom:12}}>
            <div style={{fontSize:12,fontWeight:700,color:t.ac,marginBottom:6}}>📋 DIESE 6 PUNKTE MUESSEN DRAUF</div>
            {PA_PPTX_REQ.map((req,i)=><div key={i} style={{fontSize:12,color:t.txB,lineHeight:1.6,padding:"2px 0"}}>{req}</div>)}
          </div>}

          <div style={{fontSize:11,fontWeight:700,color:t.txM,marginBottom:6,textTransform:"uppercase",letterSpacing:".05em"}}>Checkliste</div>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {p.todo.map((item,i)=>{const checked=checks[p.id+"_"+i];
              return <button key={i} onClick={()=>toggleCheck(p.id,i)} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:checked?t.okBg:t.bgC,border:`1px solid ${checked?t.ok+"40":t.bd}`,borderRadius:t.term?6:8,cursor:"pointer",textAlign:"left",transition:"all .15s"}}>
                <span style={{width:18,height:18,borderRadius:t.term?3:4,border:`2px solid ${checked?t.ok:t.bd}`,background:checked?t.ok:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:t.w,fontSize:10,flexShrink:0}}>{checked?"✓":""}</span>
                <span style={{fontSize:12,color:checked?t.ok:t.tx,textDecoration:checked?"line-through":"none",opacity:checked?.7:1}}>{item}</span>
              </button>;})}
          </div>

          <div style={{marginTop:12,padding:"8px 12px",background:t.okBg,border:`1px solid ${t.ok}30`,borderRadius:t.term?6:8}}>
            <div style={{fontSize:11,fontWeight:700,color:t.ok,marginBottom:2}}>✓ FERTIG WENN:</div>
            <div style={{fontSize:12,color:t.txB,lineHeight:1.5}}>{p.done}</div>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between"}}>
          {phase>0?<Bt onClick={()=>setPhase(a=>a-1)}>← {PA_PHASES[phase-1].emoji} {PA_PHASES[phase-1].title}</Bt>:<div/>}
          {phase<PA_PHASES.length-1?<Bt primary onClick={()=>setPhase(a=>a+1)}>{PA_PHASES[phase+1].emoji} {PA_PHASES[phase+1].title} →</Bt>:<div/>}
        </div>
      </div>}
    </Section>

    {/* ═══════ MEILENSTEINE ═══════ */}
    <Section title={`Meilensteine (${mileCnt}/${MILES.length})`} emoji="🏆">
      {justDone&&<div style={{background:`linear-gradient(135deg,${t.ok}15,${t.ac}15)`,border:`1px solid ${t.ok}40`,borderRadius:t.term?8:12,padding:"14px 18px",marginBottom:14,textAlign:"center",animation:"fadeIn .3s ease"}}>
        <div style={{fontSize:28,marginBottom:2}}>{MILES.find(m=>m.id===justDone)?.e}</div>
        <div style={{fontFamily:t.hf,fontWeight:700,color:t.tx,fontSize:15}}>Meilenstein erreicht!</div>
        <div style={{fontSize:12,color:t.txB,marginTop:2}}>{MILES.find(m=>m.id===justDone)?.l}</div>
      </div>}
      <div style={{marginBottom:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
          <span style={{fontSize:12,fontWeight:600,color:t.txM}}>Fortschritt</span>
          <span style={{fontSize:13,fontWeight:700,color:t.ac}}>{milePct}%</span>
        </div>
        <div style={{height:8,borderRadius:4,background:t.bd+"40",overflow:"hidden"}}>
          <div style={{height:"100%",width:milePct+"%",background:`linear-gradient(90deg, ${t.ac}, ${t.ok})`,borderRadius:4,transition:"width .5s"}}/>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
        {MILES.map(m=>{const done=miles[m.id];return <button key={m.id} onClick={()=>toggleMile(m.id)} style={{display:"flex",alignItems:"center",gap:8,padding:"10px 12px",background:done?t.okBg:t.bgC,border:`1px solid ${done?t.ok+"40":t.bd}`,borderRadius:t.term?6:8,cursor:"pointer",textAlign:"left",transition:"all .2s"}}>
          <span style={{width:20,height:20,borderRadius:t.term?4:5,border:`2px solid ${done?t.ok:t.bd}`,background:done?t.ok:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:t.w,fontSize:11,flexShrink:0}}>{done?"✓":""}</span>
          <span style={{fontSize:12,fontWeight:done?600:400,color:done?t.ok:t.tx}}>{m.e} {m.l}</span>
        </button>;})}
      </div>
    </Section>

    {/* ═══════ AUFKLAPPBAR: DOKU-ANFORDERUNGEN ═══════ */}
    <Section title="Was muss in die Abgabe?" emoji="📝">
      <div style={{fontSize:12,color:t.txM,lineHeight:1.7,marginBottom:8}}>Der Prof erwartet 9 Dokumentations-Abschnitte. Jede Phase oben entspricht einem Abschnitt:</div>
      <div style={{fontSize:12,color:t.txB,lineHeight:1.8}}>
        {"1. Problembeschreibung — 2. Datenquelle — 3. EDA (Daten anschauen) — 4. Vorverarbeitung — 5. Data Augmentation (optional) — 6. Modellauswahl — 7. Training (Batch Size, LR, Epochs, Loss, Optimizer, Dropout, Early Stopping, Lernkurven!) — 8. Evaluation — 9. Diskussion"}
      </div>
      <div style={{fontSize:12,color:t.txM,marginTop:8}}>Ausserdem: Sauberer Code, README.md, requirements.txt, Git Repo, Jupyter Notebook.</div>
    </Section>
  </div>;
};


// ── MODULE: Ideenbewertung ──
// ── SUPABASE CONFIG ──
const SB_URL="https://xibsyrwtqtsvmcaruaze.supabase.co";
const SB_KEY="sb_publishable_G5MU28TO5E51Ge3XwS9KYQ_cJb8x1aW";
const sbFetch=async(path,opts={})=>{const r=await fetch(`${SB_URL}/rest/v1/${path}`,{...opts,headers:{"apikey":SB_KEY,"Authorization":`Bearer ${SB_KEY}`,"Content-Type":"application/json","Prefer":opts.prefer||"return=representation",...(opts.headers||{})}});return r.json();};
const AUTHOR_COLORS={"Sebbi":"#c47a2a","Lukas":"#5a8a5e","Achim":"#5a7a9a"};

// ── FILE PARSERS ──
const parseTabular=(text)=>{
  const lines=text.split(/\r?\n/).filter(l=>l.trim());
  if(lines.length<2)return null;
  const sep=lines[0].includes(";")?";":(lines[0].includes("\t")?"\t":",");
  const headers=lines[0].split(sep).map(h=>h.trim().replace(/^"|"$/g,""));
  const rows=lines.slice(1).map(l=>l.split(sep).map(c=>c.trim().replace(/^"|"$/g,"")));
  const types=headers.map((_,ci)=>{
    const vals=rows.slice(0,50).map(r=>r[ci]).filter(v=>v&&v!=="");
    if(vals.length===0)return "leer";
    if(vals.every(v=>!isNaN(Number(v))))return "numerisch";
    const unique=new Set(vals);
    if(unique.size<=10)return `kategorisch (${unique.size} Werte: ${[...unique].slice(0,5).join(", ")}${unique.size>5?"...":""})`;
    return "text";
  });
  return {headers,types,rowCount:rows.length,sample:rows.slice(0,3),sep};
};
const FILE_ICONS={"tabular":"📊","json":"📋","image":"🖼️","excel":"📗","xml":"📄","other":"📎"};
const parseFile=async(file)=>{
  const ext=file.name.split(".").pop().toLowerCase();
  const base={name:file.name,size:file.size,ext};
  if(["csv","tsv","txt"].includes(ext)){const text=await file.text();const p=parseTabular(text);return p?{...base,format:"tabular",...p}:null;}
  if(ext==="json"){try{const text=await file.text();const data=JSON.parse(text);if(Array.isArray(data)&&data.length>0&&typeof data[0]==="object"){const headers=Object.keys(data[0]);const types=headers.map(h=>{const vals=data.slice(0,50).map(r=>r[h]).filter(v=>v!=null);if(vals.every(v=>typeof v==="number"||(!isNaN(Number(v))&&v!=="")))return "numerisch";const unique=new Set(vals.map(String));if(unique.size<=10)return `kategorisch (${unique.size} Werte: ${[...unique].slice(0,5).join(", ")}${unique.size>5?"...":""})`;return "text";});return {...base,format:"tabular",headers,types,rowCount:data.length,sample:data.slice(0,3).map(r=>headers.map(h=>String(r[h]??"")))};}return {...base,format:"json",structure:typeof data==="object"?Object.keys(data).slice(0,10).join(", "):"scalar",rowCount:Array.isArray(data)?data.length:Object.keys(data).length};}catch{return null;}}
  if(["jpg","jpeg","png","gif","bmp","webp","svg"].includes(ext)){const url=URL.createObjectURL(file);return {...base,format:"image",preview:url};}
  if(["xlsx","xls","xlsm"].includes(ext)){return {...base,format:"excel",note:"Excel erkannt — fuer beste Analyse als CSV exportieren"};}
  if(ext==="xml"){try{const text=await file.text();const parser=new DOMParser();const doc=parser.parseFromString(text,"text/xml");const root=doc.documentElement;return {...base,format:"xml",rootTag:root.tagName,childCount:root.children.length};}catch{return null;}}
  return {...base,format:"other",note:"Datei erkannt"};
};
// ── STAR RATING ──
const StarRating=({value=0,onChange,size=18})=><div style={{display:"flex",gap:1}}>{[1,2,3,4,5].map(s=><span key={s} onClick={onChange?()=>onChange(s):undefined} style={{cursor:onChange?"pointer":"default",fontSize:size,color:s<=value?"#f59e0b":"#d1d5db",transition:"color .15s",userSelect:"none"}}>{s<=value?"★":"☆"}</span>)}</div>;

const MIdea = () => {
  const t=useT();const {ak,setAk,prov,setProv,author}=useApp();
  const [idea,setIdea]=useState("");
  const [ss,setSs]=useState(true);
  const [ld,setLd]=useState(false);
  const [result,setResult]=useState(null);
  const [history,setHistory]=useState([]);
  const [dbReady,setDbReady]=useState(false);
  const [dataFiles,setDataFiles]=useState([]);
  const [editingId,setEditingId]=useState(null);
  const [ratingOpen,setRatingOpen]=useState(null);
  const [myStars,setMyStars]=useState(0);
  const [myComment,setMyComment]=useState("");
  const fileRef=useRef(null);

  const mapRow=(r)=>({id:r.id,idea:r.idea,result:r.result,author:r.author,files:r.files||[],ratings:r.ratings||{},ts:new Date(r.created_at).toLocaleString("de-DE",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})});
  useEffect(()=>{
    sbFetch("ideas?select=*&order=created_at.desc").then(data=>{
      if(Array.isArray(data)){setHistory(data.map(mapRow));setDbReady(true);}
    }).catch(()=>setDbReady(false));
    const iv=setInterval(()=>{
      sbFetch("ideas?select=*&order=created_at.desc").then(data=>{
        if(Array.isArray(data))setHistory(data.map(mapRow));
      }).catch(()=>{});
    },8000);
    return ()=>clearInterval(iv);
  },[]);

  // Dateien einlesen (alle Formate)
  const handleFiles=async(files)=>{
    const newFiles=[];
    for(const file of files){
      const parsed=await parseFile(file);
      if(parsed)newFiles.push(parsed);
    }
    setDataFiles(p=>[...p,...newFiles]);
  };
  const removeFile=(idx)=>{
    const f=dataFiles[idx];
    if(f.preview&&f.format==="image")URL.revokeObjectURL(f.preview);
    setDataFiles(p=>p.filter((_,i)=>i!==idx));
  };

  // Daten-Summary fuer den Prompt bauen
  const buildDataSummary=()=>{
    if(dataFiles.length===0)return "";
    return "\n\n--- HOCHGELADENE DATEIEN ---\n"+dataFiles.map(f=>{
      if(f.format==="tabular")return `Datei: ${f.name} (${f.rowCount} Zeilen, ${f.headers.length} Spalten)\nSpalten:\n${f.headers.map((h,i)=>`  - ${h}: ${f.types[i]}`).join("\n")}\nBeispieldaten:\n${f.sample.map(r=>f.headers.map((h,i)=>`${h}=${r[i]||"?"}`).join(", ")).join("\n")}`;
      if(f.format==="json")return `Datei: ${f.name} (JSON, Struktur: ${f.structure}, ${f.rowCount} Eintraege)`;
      if(f.format==="image")return `Datei: ${f.name} (Bild, ${Math.round(f.size/1024)}KB — bitte beruecksichtige, dass Bilddaten zusaetzliche Vorverarbeitung benoetigen)`;
      if(f.format==="excel")return `Datei: ${f.name} (Excel — ${f.note})`;
      if(f.format==="xml")return `Datei: ${f.name} (XML, Root: ${f.rootTag}, ${f.childCount} Kinder-Elemente)`;
      return `Datei: ${f.name} (${f.ext})`;
    }).join("\n\n");
  };

  // Rating speichern
  const saveRating=async(ideaId)=>{
    const entry=history.find(h=>h.id===ideaId);
    if(!entry)return;
    const newRatings={...entry.ratings,[author]:{stars:myStars,comment:myComment}};
    await sbFetch(`ideas?id=eq.${ideaId}`,{method:"PATCH",body:JSON.stringify({ratings:newRatings})}).catch(()=>{});
    setHistory(p=>p.map(h=>h.id===ideaId?{...h,ratings:newRatings}:h));
    setRatingOpen(null);setMyStars(0);setMyComment("");
  };

  const sysPrompt=`Du bist ein ML-Projektberater fuer eine Uni-Projektarbeit (Angewandtes Machine Learning, SS2026, Prof. Bugra Turan).
Das Team besteht aus 3 Personen (Sebbi, Lukas, Achim), jeder praesentiert 10 Minuten.
Anforderungen laut Prof: Deep Learning mit PyTorch oder TensorFlow/Keras bevorzugt. Doku als Markdown/PDF oder integriert in Jupyter Notebook. Git-Repository mit requirements.txt und README.md.

WICHTIGER HINWEIS VOM PROF: "Eine Projektarbeit ist nicht gescheitert, wenn die gewuenschte Performance nicht erreicht wird. Entscheidend ist die wissenschaftlich fundierte Analyse und Diskussion der Hintergruende und Ergebnisse. Ein sauberer Vergleich verschiedener Ansaetze mit kritischer Reflexion ist genauso wertvoll wie das Erreichen hoher Metriken."

${dataFiles.length>0?"Der Nutzer hat echte Datasets hochgeladen. Analysiere die Spalten, Datentypen und Beispielwerte GENAU. Empfehle konkret, welche Spalte als Zielvariable geeignet ist, welche Features relevant sind, und welche Vorverarbeitungsschritte noetig sind.":""}

WICHTIG: Simuliere fuer die Idee eine KOMPLETTE Mini-Projektarbeit. Fuer jede der 9 Pflicht-Sektionen: Schreibe einen konkreten Entwurf mit ALLEN Unterpunkten die der Prof verlangt UND bewerte die Machbarkeit.

Antworte IMMER exakt in diesem JSON-Format (kein Markdown, kein Text drumherum):
{
  "titel": "Kurzer Projekttitel",
  "typ": "Klassifikation" oder "Regression",
  "score": Zahl 1-10,
  "machbarkeit": "Leicht" oder "Mittel" oder "Anspruchsvoll",
  "proGrund": "2-3 Saetze: Warum die Idee die Anforderungen gut erfuellt",
  "woraufAchten": "2-3 Saetze: Moegliche Stolperfallen",
  "verbesserung": "1-2 Saetze: Wie die Idee schaerfer werden kann",
  "sektionen": [
    {
      "name": "Problembeschreibung",
      "nr": 1,
      "anforderungen": ["Klare Definition des Problems (Klassifikation oder Regression)","Relevanz und Anwendungskontext","Formulierung der Zielsetzung: Was soll das System konkret leisten?","Erwartete Herausforderungen und deren Bedeutung"],
      "entwurf": "Konkreter Entwurf mit allen 4 Unterpunkten. So wie es in der fertigen Doku stehen koennte.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team konkret tun?",
      "tipp": "Ein konkreter Tipp"
    },
    {
      "name": "Datenquelle und Datenbeschreibung",
      "nr": 2,
      "anforderungen": ["Herkunft der Daten (Link/Referenz zum Dataset)","Lizenz und Verfuegbarkeit der Daten","Anzahl der Datenpunkte und Features","Beschreibung der wichtigsten Features (inkl. Datentypen)","Verteilung der Zielklassen (Klassifikation) bzw. Wertebereich (Regression)"],
      "entwurf": "Konkreter Entwurf mit allen 5 Unterpunkten. Echte Datensaetze mit Links nennen.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Explorative Datenanalyse (EDA)",
      "nr": 3,
      "anforderungen": ["Visualisierung der Datenverteilung (Histogramme, Boxplots etc.)","Korrelationsanalyse zwischen Features und Zielvariable","Identifikation von Mustern, Trends und Auffaelligkeiten","Analyse von Class Imbalance (falls vorhanden)"],
      "entwurf": "Konkreter Entwurf: Welche Plots, welche Analysen, was erwartet ihr zu finden?",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Datenvorverarbeitung",
      "nr": 4,
      "anforderungen": ["Behandlung fehlender Werte (NaN, Inf)","Erkennung und Behandlung von Outliers","Normalisierung/Standardisierung","Feature Engineering: Erstellung neuer Features (falls durchgefuehrt)","Encoding kategorialer Variablen (One-Hot, Label Encoding etc.)"],
      "entwurf": "Konkreter Entwurf mit allen 5 Unterpunkten. Konkrete Werte und Methoden.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Data Augmentation (optional)",
      "nr": 5,
      "anforderungen": ["Beschreibung der Augmentation-Techniken","Auswirkung auf die Datenmenge und -qualitaet"],
      "entwurf": "Konkreter Entwurf: Welche Techniken, warum, und wie wirkt sich das aus?",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Modellauswahl und -architektur",
      "nr": 6,
      "anforderungen": ["Begruendung fuer die Auswahl der Modelle","Detaillierte Beschreibung der finalen Modellarchitektur","Hyperparameter und deren Wahl"],
      "entwurf": "Konkreter Entwurf mit allen 3 Unterpunkten. Welche Modelle verglichen, warum genau dieses?",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Training",
      "nr": 7,
      "anforderungen": ["Aufteilung der Daten (Train/Validation/Test-Split)","Training-Konfiguration (Batch Size, Learning Rate, Epochs etc.)","Verwendete Loss-Function und Optimizer","Techniken zur Vermeidung von Overfitting (Regularisierung, Dropout, Early Stopping etc.)","Visualisierung des Trainingsverlaufs (Loss- und Metrik-Kurven)"],
      "entwurf": "Konkreter Entwurf mit allen 5 Unterpunkten. Echte Werte vorschlagen.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun? (GPU, Colab etc.)",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Evaluation und Ergebnisse",
      "nr": 8,
      "anforderungen": ["Definition und Begruendung der Evaluation-Metriken","Quantitative Ergebnisse aller getesteten Modelle (Vergleichstabelle)","Detaillierte Analyse des besten Modells (Confusion Matrix, Classification Report etc.)","Fehleranalyse: Wo macht das Modell Fehler und warum?","Visualisierung der Ergebnisse (Predictions vs. Ground Truth)"],
      "entwurf": "Konkreter Entwurf mit allen 5 Unterpunkten. Welche Metriken, welche Visualisierungen?",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Diskussion und Fazit",
      "nr": 9,
      "anforderungen": ["Interpretation der Ergebnisse: Wurden die Ziele erreicht?","Kritische Reflexion: Was hat gut funktioniert, was nicht?","Limitationen der gewaehlten Ansaetze","Moegliche Verbesserungen und Ausblick"],
      "entwurf": "Konkreter Entwurf mit allen 4 Unterpunkten.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    }
  ],
  "zusatz": {
    "packages": ["paket1","paket2","paket3"],
    "readme_entwurf": "Konkreter README.md-Entwurf fuer dieses Projekt (Titel, Beschreibung, Setup, Ausfuehrung)",
    "code_tipp": "Konkreter Tipp fuer Code-Qualitaet bei diesem Projekt"
  }
}`;
  const evaluate=async()=>{
    if(!idea.trim()||!ak||ld||!author)return;
    setLd(true);setResult(null);
    const userMsg=idea+buildDataSummary();
    try{
      let text="";
      if(prov==="openai"){
        const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${ak}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:sysPrompt},{role:"user",content:userMsg}],max_tokens:4000})});
        const d=await r.json();if(d.error)throw new Error(d.error.message);text=d.choices[0].message.content;
      } else {
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ak,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:sysPrompt,messages:[{role:"user",content:userMsg}]})});
        const d=await r.json();if(d.error)throw new Error(d.error.message);text=d.content[0].text;
      }
      const json=JSON.parse(text);
      setResult(json);
      const fileNames=dataFiles.map(f=>({name:f.name,format:f.format,ext:f.ext}));
      if(editingId){
        // Bestehende Idee updaten (Bewertung ersetzen)
        await sbFetch(`ideas?id=eq.${editingId}`,{method:"PATCH",body:JSON.stringify({idea,result:json,files:fileNames})});
        setHistory(p=>p.map(h=>h.id===editingId?{...h,idea,result:json,files:fileNames}:h));
        setEditingId(null);
      } else {
        // Neue Idee speichern
        const saved=await sbFetch("ideas",{method:"POST",body:JSON.stringify({author,idea,result:json,files:fileNames,ratings:{}})});
        if(Array.isArray(saved)&&saved[0]){setHistory(p=>[mapRow(saved[0]),...p]);}
      }
    }catch(err){setResult({error:err.message});}finally{setLd(false);}
  };
  const archiveIdea=async(id)=>{
    const item=history.find(h=>h.id===id);
    if(!item)return;
    const patched={...item.result,_archived:true};
    await sbFetch(`ideas?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({result:patched}),prefer:"return=minimal"}).catch(()=>{});
    setHistory(p=>p.map(h=>h.id===id?{...h,result:patched}:h));
    if(result&&item.result.titel===result.titel)setResult(null);
  };
  const restoreIdea=async(id)=>{
    const item=history.find(h=>h.id===id);
    if(!item)return;
    const {_archived,...cleaned}=item.result;
    await sbFetch(`ideas?id=eq.${id}`,{method:"PATCH",body:JSON.stringify({result:cleaned}),prefer:"return=minimal"}).catch(()=>{});
    setHistory(p=>p.map(h=>h.id===id?{...h,result:cleaned}:h));
  };
  const scoreColor=(s)=>s>=8?t.ok:s>=5?t.ac:t.err;
  const authorColor=(name)=>AUTHOR_COLORS[name]||t.ac;
  const Tag=({children,color})=><span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:(color||t.ac)+"18",color:color||t.ac,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>;
  const AuthorBadge=({name})=><span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:10,background:authorColor(name)+"20",color:authorColor(name),border:`1px solid ${authorColor(name)}40`}}>{name}</span>;

  return <div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"flex-end",marginBottom:16}}>
      {dbReady&&<span style={{fontSize:11,color:t.ok}}>● Supabase verbunden</span>}
      {!dbReady&&<span style={{fontSize:11,color:t.err}}>● Offline (lokal)</span>}
    </div>
    <ST>Beschreibe deine Projektidee</ST>
    <P>Schreib in 1-3 Saetzen, was du vorhersagen moechtest und womit. Die KI bewertet, ob das fuer die PA geeignet ist.</P>
    <button onClick={()=>setSs(!ss)} style={{fontFamily:t.sf,fontSize:12,color:t.txM,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>API-Einstellungen {ss?"▴":"▾"}</button>
    {ss&&<Cd style={{marginBottom:16}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>{[["openai","OpenAI"],["anthropic","Anthropic"]].map(([id,l])=><Bt key={id} primary={prov===id} onClick={()=>setProv(id)} style={{fontSize:12,padding:"6px 14px"}}>{l}</Bt>)}</div>
      <input type="password" value={ak} onChange={e=>setAk(e.target.value)} placeholder={prov==="openai"?"sk-...":"sk-ant-..."} style={{width:"100%",boxSizing:"border-box",padding:"8px 12px",borderRadius:t.term?6:8,border:`1px solid ${t.bd}`,background:t.bgI,fontFamily:t.term?t.mf:t.sf,fontSize:13,color:t.tx,outline:"none"}}/>
      <div style={{fontSize:11,color:t.txF,marginTop:6}}>{ak?"Key gesetzt ✓":"Key wird nur in deinem Browser gespeichert."}</div>
    </Cd>}
    <div style={{marginBottom:20}}>
      <textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder={"z.B. Ich moechte anhand von Wetterdaten den Stromverbrauch einer Stadt vorhersagen."} rows={3} style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:t.term?6:8,border:`1px solid ${t.bd}`,background:t.bgI,fontFamily:t.sf,fontSize:13,color:t.tx,outline:"none",resize:"vertical",lineHeight:1.6}}/>
      {/* Datei Upload (alle Formate) */}
      <div style={{marginTop:12,padding:"16px 18px",borderRadius:t.term?6:10,border:`2px dashed ${dataFiles.length>0?t.ok+"60":t.bd}`,background:dataFiles.length>0?t.okBg:t.bgC,cursor:"pointer",transition:"all .2s"}}
        onClick={()=>fileRef.current?.click()}
        onDragOver={e=>{e.preventDefault();e.currentTarget.style.borderColor=t.ac;}}
        onDragLeave={e=>{e.currentTarget.style.borderColor=dataFiles.length>0?t.ok+"60":t.bd;}}
        onDrop={e=>{e.preventDefault();e.currentTarget.style.borderColor=dataFiles.length>0?t.ok+"60":t.bd;handleFiles(e.dataTransfer.files);}}>
        <input ref={fileRef} type="file" accept=".csv,.tsv,.txt,.json,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg,.xlsx,.xls,.xlsm,.xml" multiple onChange={e=>handleFiles(e.target.files)} style={{display:"none"}}/>
        {dataFiles.length===0?<div style={{textAlign:"center"}}>
          <div style={{fontSize:20,marginBottom:4}}>+</div>
          <div style={{fontSize:12,color:t.txM}}>Dateien hierher ziehen oder klicken</div>
          <div style={{fontSize:11,color:t.txF,marginTop:4}}>CSV, JSON, Bilder, Excel, XML — die KI analysiert alles und gibt bessere Empfehlungen</div>
        </div>
        :<div>
          <div style={{fontSize:11,fontWeight:700,color:t.ok,marginBottom:8}}>{dataFiles.length} Datei{dataFiles.length>1?"en":""} geladen</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {dataFiles.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"8px 12px",background:t.bg,borderRadius:t.term?4:6,border:`1px solid ${t.bd}`}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flex:1,minWidth:0}}>
                <span style={{fontSize:16,flexShrink:0}}>{FILE_ICONS[f.format]||"📎"}</span>
                {f.format==="image"&&f.preview&&<img src={f.preview} alt={f.name} style={{width:32,height:32,objectFit:"cover",borderRadius:4,flexShrink:0}}/>}
                <div style={{minWidth:0}}>
                  <div style={{fontSize:12,fontWeight:600,color:t.tx,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.name}</div>
                  <div style={{fontSize:11,color:t.txM}}>
                    {f.format==="tabular"&&`${f.rowCount} Zeilen, ${f.headers.length} Spalten: ${f.headers.slice(0,3).join(", ")}${f.headers.length>3?"...":""}`}
                    {f.format==="json"&&`JSON — ${f.structure} (${f.rowCount} Eintraege)`}
                    {f.format==="image"&&`Bild (${Math.round(f.size/1024)} KB)`}
                    {f.format==="excel"&&f.note}
                    {f.format==="xml"&&`XML — <${f.rootTag}> (${f.childCount} Elemente)`}
                    {f.format==="other"&&`${f.ext.toUpperCase()}-Datei`}
                  </div>
                </div>
              </div>
              <button onClick={e=>{e.stopPropagation();removeFile(i);}} style={{background:"none",border:"none",cursor:"pointer",color:t.txF,fontSize:14,padding:"2px 6px",flexShrink:0}}>x</button>
            </div>)}
          </div>
          <div style={{fontSize:11,color:t.txM,marginTop:6,textAlign:"center"}}>Weitere Dateien hinzufuegen: klicken oder ziehen</div>
        </div>}
      </div>
      <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
        <Bt primary onClick={evaluate} disabled={!ak||!idea.trim()||ld}>{ld?"Wird bewertet ...":editingId?"Neu bewerten":"Idee bewerten"}</Bt>
        {editingId&&<Bt onClick={()=>{setEditingId(null);setIdea("");setResult(null);setDataFiles([]);}}>Abbrechen</Bt>}
        {result&&!result.error&&!editingId&&<Bt onClick={()=>{setResult(null);setIdea("");setDataFiles([]);}}>Neue Idee bewerten</Bt>}
        {!ak&&<span style={{fontSize:12,color:t.txM,alignSelf:"center"}}>Zuerst API-Key eingeben</span>}
      </div>
    </div>
    {result&&!result.error&&<Cd style={{marginBottom:20}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <div style={{fontFamily:t.hf,fontSize:20,fontWeight:700,color:t.tx}}>{result.titel}</div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:44,height:44,borderRadius:"50%",background:scoreColor(result.score)+"18",border:`3px solid ${scoreColor(result.score)}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:18,color:scoreColor(result.score),fontFamily:t.hf}}>{result.score}</div>
          <span style={{fontSize:11,color:t.txM}}>/10</span>
        </div>
      </div>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:16}}>
        <Tag color={result.typ==="Klassifikation"?t.inf:"#7c3aed"}>{result.typ}</Tag>
        <Tag color={result.machbarkeit==="Leicht"?t.ok:result.machbarkeit==="Mittel"?t.ac:t.err}>{result.machbarkeit}</Tag>
      </div>
      <div style={{background:t.okBg,border:`1px solid ${t.ok}30`,borderRadius:t.term?6:8,padding:"12px 14px",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:t.ok,marginBottom:4}}>Warum die Idee passt</div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.6}}>{result.proGrund}</div>
      </div>
      <div style={{background:t.errBg,border:`1px solid ${t.err}30`,borderRadius:t.term?6:8,padding:"12px 14px",marginBottom:10}}>
        <div style={{fontSize:12,fontWeight:700,color:t.err,marginBottom:4}}>Worauf achten</div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.6}}>{result.woraufAchten}</div>
      </div>
      <div style={{background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?6:8,padding:"12px 14px"}}>
        <div style={{fontSize:12,fontWeight:700,color:t.txB,marginBottom:4}}>So wird die Idee noch besser</div>
        <div style={{fontSize:13,color:t.txB,lineHeight:1.6}}>{result.verbesserung}</div>
      </div>
    </Cd>}
    {result&&result.error&&<Info title="Fehler" type="warning">{result.error}</Info>}
    {history.length>0&&<>{(()=>{const active=history.filter(h=>!h.result?._archived);const archived=history.filter(h=>h.result?._archived);return <><ST>Alle Team-Bewertungen ({active.length})</ST>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {active.map((h,i)=>{const isActive=result&&!result.error&&result.titel===h.result?.titel;const rats=h.ratings||{};const ratNames=Object.keys(rats);const avgStars=ratNames.length>0?Math.round(ratNames.reduce((s,n)=>s+(rats[n].stars||0),0)/ratNames.length*10)/10:null;
        return <div key={h.id||i} style={{background:isActive?t.bgAS:t.bgC,border:`1px solid ${isActive?t.ac+"60":t.bd}`,borderRadius:t.term?6:10,overflow:"hidden",transition:"all .15s"}}>
          <button onClick={()=>{setResult(h.result);setIdea(h.idea);window.scrollTo({top:0,behavior:"smooth"});}} style={{width:"100%",textAlign:"left",padding:"12px 14px",background:"transparent",border:"none",cursor:"pointer"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <AuthorBadge name={h.author}/>
                <span style={{fontSize:13,fontWeight:600,color:isActive?t.ac:t.tx}}>{h.result?.titel||"?"}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Tag color={scoreColor(h.result?.score)}>{h.result?.score}/10</Tag>
                {avgStars!==null&&<span style={{fontSize:12,color:"#f59e0b",fontWeight:600}}>{"★".repeat(Math.round(avgStars))} {avgStars}</span>}
                <span style={{fontSize:11,color:t.txF}}>{h.ts}</span>
              </div>
            </div>
            <div style={{fontSize:12,color:t.txM,marginTop:4}}>{h.idea.slice(0,80)}{h.idea.length>80?"...":""}</div>
            {/* Dateien anzeigen */}
            {h.files&&h.files.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap",marginTop:6}}>
              {h.files.map((f,fi)=><span key={fi} style={{fontSize:10,padding:"1px 6px",borderRadius:8,background:t.bd+"40",color:t.txM}}>{FILE_ICONS[f.format]||"📎"} {f.name}</span>)}
            </div>}
          </button>
          {/* Team-Ratings anzeigen */}
          <div style={{padding:"0 14px 10px",display:"flex",flexDirection:"column",gap:4}}>
            {ratNames.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {ratNames.map(name=><div key={name} style={{display:"flex",alignItems:"center",gap:4,padding:"3px 8px",borderRadius:8,background:authorColor(name)+"10",border:`1px solid ${authorColor(name)}20`}}>
                <span style={{fontSize:10,fontWeight:700,color:authorColor(name)}}>{name}</span>
                <StarRating value={rats[name].stars} size={12}/>
                {rats[name].comment&&<span style={{fontSize:10,color:t.txM,fontStyle:"italic"}}>"{rats[name].comment}"</span>}
              </div>)}
            </div>}
            {/* Eigene Bewertung abgeben */}
            {ratingOpen===h.id?<div style={{display:"flex",alignItems:"center",gap:8,marginTop:4,flexWrap:"wrap"}}>
              <StarRating value={myStars} onChange={setMyStars} size={16}/>
              <input value={myComment} onChange={e=>setMyComment(e.target.value)} placeholder="Kommentar (optional)" style={{flex:1,minWidth:120,padding:"4px 8px",borderRadius:6,border:`1px solid ${t.bd}`,background:t.bgI,fontSize:11,color:t.tx,fontFamily:t.sf,outline:"none"}}/>
              <Bt primary onClick={()=>saveRating(h.id)} disabled={myStars===0} style={{fontSize:11,padding:"4px 10px"}}>Speichern</Bt>
              <Bt onClick={()=>{setRatingOpen(null);setMyStars(0);setMyComment("");}} style={{fontSize:11,padding:"4px 10px"}}>Abbrechen</Bt>
            </div>
            :<div style={{display:"flex",alignItems:"center",gap:12}}>
              <button onClick={(e)=>{e.stopPropagation();setRatingOpen(h.id);setMyStars(rats[author]?.stars||0);setMyComment(rats[author]?.comment||"");}} style={{fontSize:11,color:t.ac,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:t.sf}}>
                {rats[author]?"✏ Meine Bewertung aendern":"★ Bewerten"}
              </button>
              <button onClick={(e)=>{e.stopPropagation();setIdea(h.idea);setEditingId(h.id);setResult(null);setDataFiles([]);window.scrollTo({top:0,behavior:"smooth"});}} style={{fontSize:11,color:t.inf,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:t.sf}}>🔄 Neu bewerten</button>
              <button onClick={(e)=>{e.stopPropagation();if(confirm("Idee archivieren?"))archiveIdea(h.id);}} style={{fontSize:11,color:t.err,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:t.sf}}>📦 Archivieren</button>
            </div>}
          </div>
        </div>;})}
      </div>
      {archived.length>0&&<details style={{marginTop:16}}>
        <summary style={{cursor:"pointer",fontSize:13,fontWeight:600,color:t.txM,padding:"8px 0",userSelect:"none"}}>📦 Archiv ({archived.length})</summary>
        <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
          {archived.map((h,i)=><div key={h.id||i} style={{background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?6:10,padding:"10px 14px",opacity:.7}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <AuthorBadge name={h.author}/>
                <span style={{fontSize:13,fontWeight:600,color:t.txM,textDecoration:"line-through"}}>{h.result?.titel||"?"}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Tag color={scoreColor(h.result?.score)}>{h.result?.score}/10</Tag>
                <span style={{fontSize:11,color:t.txF}}>{h.ts}</span>
              </div>
            </div>
            <div style={{fontSize:12,color:t.txF,marginTop:4}}>{h.idea.slice(0,80)}{h.idea.length>80?"...":""}</div>
            <div style={{marginTop:6}}>
              <button onClick={()=>restoreIdea(h.id)} style={{fontSize:11,color:t.ok,background:"none",border:"none",cursor:"pointer",padding:0,fontFamily:t.sf}}>♻ Wiederherstellen</button>
            </div>
          </div>)}
        </div>
      </details>}
    </>;})()}</>}
  </div>;
};

// ── MODULE: PA-Simulation (Sebbi-exklusiv) ──
const MSimulation = () => {
  const t=useT();const {ak,setAk,prov,setProv,author}=useApp();
  const [idea,setIdea]=useState("");
  const [ld,setLd]=useState(false);
  const [result,setResult]=useState(null);
  const [ss,setSs]=useState(true);

  const simPrompt=`Du bist ein ML-Projektberater fuer eine Uni-Projektarbeit (Angewandtes Machine Learning, SS2026, Prof. Bugra Turan).
Das Team besteht aus 3 Personen (Sebbi, Lukas, Achim), jeder praesentiert 10 Minuten.
Anforderungen laut Prof: Deep Learning mit PyTorch oder TensorFlow/Keras bevorzugt. Doku als Markdown/PDF oder integriert in Jupyter Notebook. Git-Repository mit requirements.txt und README.md.

WICHTIGER HINWEIS VOM PROF: "Eine Projektarbeit ist nicht gescheitert, wenn die gewuenschte Performance nicht erreicht wird. Entscheidend ist die wissenschaftlich fundierte Analyse und Diskussion der Hintergruende und Ergebnisse. Ein sauberer Vergleich verschiedener Ansaetze mit kritischer Reflexion ist genauso wertvoll wie das Erreichen hoher Metriken."

AUFGABE: Simuliere fuer die genannte Projektidee eine KOMPLETTE Mini-Projektarbeit. Fuer jede der 9 Pflicht-Sektionen: Schreibe einen AUSFUEHRLICHEN konkreten Entwurf mit ALLEN Unterpunkten die der Prof verlangt UND bewerte die Machbarkeit. Sei so konkret wie moeglich — echte Datensaetze, echte Hyperparameter, echte Code-Fragmente.

Antworte IMMER exakt in diesem JSON-Format (kein Markdown, kein Text drumherum):
{
  "titel": "Kurzer Projekttitel",
  "typ": "Klassifikation" oder "Regression",
  "score": Zahl 1-10,
  "machbarkeit": "Leicht" oder "Mittel" oder "Anspruchsvoll",
  "zusammenfassung": "3-4 Saetze: Kurze Zusammenfassung des gesamten Projekts",
  "sektionen": [
    {
      "name": "Problembeschreibung",
      "nr": 1,
      "anforderungen": ["Klare Definition des Problems (Klassifikation oder Regression)","Relevanz und Anwendungskontext","Formulierung der Zielsetzung: Was soll das System konkret leisten?","Erwartete Herausforderungen und deren Bedeutung"],
      "entwurf": "AUSFUEHRLICHER Entwurf mit ALLEN 4 Unterpunkten. Mehrere Saetze pro Unterpunkt. So wie es in der fertigen Doku stehen koennte.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team konkret tun?",
      "tipp": "Ein konkreter Tipp"
    },
    {
      "name": "Datenquelle und Datenbeschreibung",
      "nr": 2,
      "anforderungen": ["Herkunft der Daten (Link/Referenz zum Dataset)","Lizenz und Verfuegbarkeit der Daten","Anzahl der Datenpunkte und Features","Beschreibung der wichtigsten Features (inkl. Datentypen)","Verteilung der Zielklassen (Klassifikation) bzw. Wertebereich (Regression)"],
      "entwurf": "AUSFUEHRLICH mit allen 5 Unterpunkten. Echte Datensaetze mit echten Links.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Explorative Datenanalyse (EDA)",
      "nr": 3,
      "anforderungen": ["Visualisierung der Datenverteilung (Histogramme, Boxplots etc.)","Korrelationsanalyse zwischen Features und Zielvariable","Identifikation von Mustern, Trends und Auffaelligkeiten","Analyse von Class Imbalance (falls vorhanden)"],
      "entwurf": "AUSFUEHRLICH: Welche konkreten Plots mit welchen Libraries? Was erwartet ihr zu finden?",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Datenvorverarbeitung",
      "nr": 4,
      "anforderungen": ["Behandlung fehlender Werte (NaN, Inf)","Erkennung und Behandlung von Outliers","Normalisierung/Standardisierung","Feature Engineering: Erstellung neuer Features (falls durchgefuehrt)","Encoding kategorialer Variablen (One-Hot, Label Encoding etc.)"],
      "entwurf": "AUSFUEHRLICH mit allen 5 Unterpunkten. Konkrete Werte, Methoden, Code-Fragmente.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Data Augmentation (optional)",
      "nr": 5,
      "anforderungen": ["Beschreibung der Augmentation-Techniken","Auswirkung auf die Datenmenge und -qualitaet"],
      "entwurf": "AUSFUEHRLICH: Welche Techniken, warum, konkrete Auswirkungen mit Zahlen.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Modellauswahl und -architektur",
      "nr": 6,
      "anforderungen": ["Begruendung fuer die Auswahl der Modelle","Detaillierte Beschreibung der finalen Modellarchitektur","Hyperparameter und deren Wahl"],
      "entwurf": "AUSFUEHRLICH: Welche Modelle verglichen, warum genau dieses? Layer-Aufbau beschreiben.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Training",
      "nr": 7,
      "anforderungen": ["Aufteilung der Daten (Train/Validation/Test-Split)","Training-Konfiguration (Batch Size, Learning Rate, Epochs etc.)","Verwendete Loss-Function und Optimizer","Techniken zur Vermeidung von Overfitting (Regularisierung, Dropout, Early Stopping etc.)","Visualisierung des Trainingsverlaufs (Loss- und Metrik-Kurven)"],
      "entwurf": "AUSFUEHRLICH mit allen 5 Unterpunkten. Echte Werte, erwarteter Trainingsverlauf.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun? (GPU, Colab etc.)",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Evaluation und Ergebnisse",
      "nr": 8,
      "anforderungen": ["Definition und Begruendung der Evaluation-Metriken","Quantitative Ergebnisse aller getesteten Modelle (Vergleichstabelle)","Detaillierte Analyse des besten Modells (Confusion Matrix, Classification Report etc.)","Fehleranalyse: Wo macht das Modell Fehler und warum?","Visualisierung der Ergebnisse (Predictions vs. Ground Truth)"],
      "entwurf": "AUSFUEHRLICH mit allen 5 Unterpunkten. Erwartete Metriken, typische Fehler.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    },
    {
      "name": "Diskussion und Fazit",
      "nr": 9,
      "anforderungen": ["Interpretation der Ergebnisse: Wurden die Ziele erreicht?","Kritische Reflexion: Was hat gut funktioniert, was nicht?","Limitationen der gewaehlten Ansaetze","Moegliche Verbesserungen und Ausblick"],
      "entwurf": "AUSFUEHRLICH mit allen 4 Unterpunkten. Ehrliche Reflexion.",
      "aufwand": "Leicht/Mittel/Schwer",
      "braucht_ihr": "Was muss das Team tun?",
      "tipp": "Konkreter Tipp"
    }
  ],
  "zusatz": {
    "packages": ["paket1","paket2","paket3"],
    "readme_entwurf": "Konkreter README.md-Entwurf (Titel, Beschreibung, Setup, Ausfuehrung)",
    "code_tipp": "Konkreter Tipp fuer Code-Qualitaet bei diesem Projekt"
  }
}`;

  const runSim=async()=>{
    if(!idea.trim()||!ak||ld)return;
    setLd(true);setResult(null);
    try{
      let text="";
      if(prov==="openai"){
        const r=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${ak}`},body:JSON.stringify({model:"gpt-4o-mini",messages:[{role:"system",content:simPrompt},{role:"user",content:idea}],max_tokens:4000})});
        const d=await r.json();if(d.error)throw new Error(d.error.message);text=d.choices[0].message.content;
      } else {
        const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":ak,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:4000,system:simPrompt,messages:[{role:"user",content:idea}]})});
        const d=await r.json();if(d.error)throw new Error(d.error.message);text=d.content[0].text;
      }
      setResult(JSON.parse(text));
    }catch(err){setResult({error:err.message});}finally{setLd(false);}
  };

  const scoreColor=(s)=>s>=8?t.ok:s>=5?t.ac:t.err;
  const aufwandColor=(a)=>a==="Leicht"?t.ok:a==="Mittel"?t.ac:t.err;
  const SEC_EMOJI=["📋","📦","🔍","⚙️","🎨","🧠","🏋️","📊","💬"];
  const Tag=({children,color})=><span style={{fontSize:11,padding:"2px 8px",borderRadius:10,background:(color||t.ac)+"18",color:color||t.ac,fontWeight:600,whiteSpace:"nowrap"}}>{children}</span>;

  return <div>
    <CL num="📄"/><H1>PA-Simulation</H1>
    <P>Gib eine Projektidee ein und sieh sofort, wie die komplette Projektarbeit mit allen 9 Pflicht-Sektionen aussehen koennte — inklusive Anforderungen vom Prof, Entwuerfen und Machbarkeits-Check.</P>

    <button onClick={()=>setSs(!ss)} style={{fontFamily:t.sf,fontSize:12,color:t.txM,background:"none",border:"none",cursor:"pointer",marginBottom:12}}>API-Einstellungen {ss?"▴":"▾"}</button>
    {ss&&<Cd style={{marginBottom:16}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>{[["openai","OpenAI"],["anthropic","Anthropic"]].map(([id,l])=><Bt key={id} primary={prov===id} onClick={()=>setProv(id)} style={{fontSize:12,padding:"6px 14px"}}>{l}</Bt>)}</div>
      <input type="password" value={ak} onChange={e=>setAk(e.target.value)} placeholder={prov==="openai"?"sk-...":"sk-ant-..."} style={{width:"100%",boxSizing:"border-box",padding:"8px 12px",borderRadius:t.term?6:8,border:`1px solid ${t.bd}`,background:t.bgI,fontFamily:t.term?t.mf:t.sf,fontSize:13,color:t.tx,outline:"none"}}/>
      <div style={{fontSize:11,color:t.txF,marginTop:6}}>{ak?"Key gesetzt ✓":"Key wird nur in deinem Browser gespeichert."}</div>
    </Cd>}

    <div style={{marginBottom:20}}>
      <textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder={"z.B. Zootier-Klassifikation mit Transfer Learning (ResNet-18) und Grad-CAM Analyse"} rows={3} style={{width:"100%",boxSizing:"border-box",padding:"12px 14px",borderRadius:t.term?6:8,border:`1px solid ${t.bd}`,background:t.bgI,fontFamily:t.sf,fontSize:13,color:t.tx,outline:"none",resize:"vertical",lineHeight:1.6}}/>
      <div style={{display:"flex",gap:8,marginTop:12}}>
        <Bt primary onClick={runSim} disabled={!ak||!idea.trim()||ld}>{ld?"Wird simuliert ...":"PA simulieren"}</Bt>
        {result&&!result.error&&<Bt onClick={()=>{setResult(null);setIdea("");}}>Neue Simulation</Bt>}
        {!ak&&<span style={{fontSize:12,color:t.txM,alignSelf:"center"}}>Zuerst API-Key eingeben</span>}
      </div>
    </div>

    {result&&result.error&&<Info title="Fehler" type="warning">{result.error}</Info>}

    {result&&!result.error&&<>
      <div style={{background:`linear-gradient(135deg, ${t.ac}12, ${t.inf}12)`,border:`2px solid ${t.ac}40`,borderRadius:t.term?8:14,padding:"24px 20px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
          <div>
            <div style={{fontFamily:t.hf,fontSize:22,fontWeight:800,color:t.tx}}>{result.titel}</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap",marginTop:8}}>
              <Tag color={result.typ==="Klassifikation"?t.inf:"#7c3aed"}>{result.typ}</Tag>
              <Tag color={aufwandColor(result.machbarkeit)}>{result.machbarkeit}</Tag>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{width:52,height:52,borderRadius:"50%",background:scoreColor(result.score)+"18",border:`3px solid ${scoreColor(result.score)}`,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:800,fontSize:22,color:scoreColor(result.score),fontFamily:t.hf}}>{result.score}</div>
            <span style={{fontSize:11,color:t.txM}}>/10</span>
          </div>
        </div>
        {result.zusammenfassung&&<div style={{fontSize:13,color:t.txB,lineHeight:1.7,padding:"12px 14px",background:t.bg+"80",borderRadius:t.term?6:8}}>{result.zusammenfassung}</div>}
        {result.sektionen&&<>
          <div style={{display:"flex",gap:12,marginTop:16,flexWrap:"wrap"}}>
            {(()=>{const leicht=result.sektionen.filter(s=>s.aufwand==="Leicht").length;const mittel=result.sektionen.filter(s=>s.aufwand==="Mittel").length;const schwer=result.sektionen.filter(s=>s.aufwand==="Schwer").length;return <>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,background:t.ok+"18",border:`1px solid ${t.ok}30`}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:t.ok}}/><span style={{fontSize:12,fontWeight:600,color:t.ok}}>{leicht}x Leicht</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,background:t.ac+"18",border:`1px solid ${t.ac}30`}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:t.ac}}/><span style={{fontSize:12,fontWeight:600,color:t.ac}}>{mittel}x Mittel</span>
              </div>
              {schwer>0&&<div style={{display:"flex",alignItems:"center",gap:6,padding:"6px 12px",borderRadius:20,background:t.err+"18",border:`1px solid ${t.err}30`}}>
                <div style={{width:8,height:8,borderRadius:"50%",background:t.err}}/><span style={{fontSize:12,fontWeight:600,color:t.err}}>{schwer}x Schwer</span>
              </div>}
            </>;})()}
          </div>
          <div style={{display:"flex",gap:4,marginTop:12}}>
            {result.sektionen.map((s,i)=><div key={i} style={{flex:1,height:6,borderRadius:3,background:aufwandColor(s.aufwand)+"60"}} title={`${s.nr}. ${s.name}: ${s.aufwand}`}/>)}
          </div>
        </>}
      </div>

      {result.sektionen&&result.sektionen.map((s,i)=><div key={i} style={{marginBottom:12,background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?6:12,overflow:"hidden"}}>
        <button onClick={(e)=>{const det=e.currentTarget.nextElementSibling;det.style.display=det.style.display==="none"?"block":"none";}} style={{width:"100%",textAlign:"left",cursor:"pointer",padding:"14px 16px",background:"transparent",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{width:32,height:32,borderRadius:t.term?4:8,background:aufwandColor(s.aufwand)+"15",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16}}>{SEC_EMOJI[i]||"📄"}</span>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:t.tx}}>{s.nr}. {s.name}</div>
              <div style={{fontSize:11,color:t.txM,marginTop:1}}>Aufwand: {s.aufwand}</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <Tag color={aufwandColor(s.aufwand)}>{s.aufwand}</Tag>
            <span style={{color:t.txM,fontSize:12}}>▾</span>
          </div>
        </button>
        <div style={{display:i===0?"block":"none",padding:"0 16px 16px",borderTop:`1px solid ${t.bd}`}}>
          {s.anforderungen&&<div style={{marginTop:12,padding:"12px 14px",background:t.errBg,border:`1px solid ${t.err}20`,borderRadius:t.term?6:8,marginBottom:10}}>
            <div style={{fontSize:11,fontWeight:700,color:t.err,marginBottom:8,letterSpacing:".5px"}}>ANFORDERUNGEN VOM PROF</div>
            {s.anforderungen.map((a,ai)=><div key={ai} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:4}}>
              <span style={{color:t.err,fontSize:11,marginTop:2,flexShrink:0}}>●</span>
              <span style={{fontSize:12,color:t.txB,lineHeight:1.5}}>{a}</span>
            </div>)}
          </div>}
          <div style={{padding:"14px 16px",background:t.bgAS,border:`1px solid ${t.bdA}`,borderRadius:t.term?6:10,marginBottom:12}}>
            <div style={{fontSize:11,fontWeight:700,color:t.ac,marginBottom:8,letterSpacing:".5px"}}>ENTWURF — SO KOENNTE ES IN DER DOKU STEHEN</div>
            <div style={{fontSize:13,color:t.txB,lineHeight:1.8}}>{s.entwurf}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{padding:"12px 14px",background:t.infBg,border:`1px solid ${t.inf}30`,borderRadius:t.term?6:8}}>
              <div style={{fontSize:11,fontWeight:700,color:t.inf,marginBottom:6}}>DAS BRAUCHT IHR</div>
              <div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>{s.braucht_ihr}</div>
            </div>
            <div style={{padding:"12px 14px",background:t.mathBg,border:`1px solid ${t.math}30`,borderRadius:t.term?6:8}}>
              <div style={{fontSize:11,fontWeight:700,color:t.math,marginBottom:6}}>PROFI-TIPP</div>
              <div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>{s.tipp}</div>
            </div>
          </div>
        </div>
      </div>)}

      {result.zusatz&&<div style={{marginTop:16,background:`linear-gradient(135deg, ${t.ok}08, ${t.inf}08)`,border:`2px solid ${t.ok}30`,borderRadius:t.term?8:14,padding:"20px 18px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
          <span style={{fontSize:18}}>📦</span>
          <div style={{fontFamily:t.hf,fontSize:16,fontWeight:700,color:t.tx}}>Zusaetzliche Anforderungen</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
          <div style={{padding:"12px 14px",background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?6:8}}>
            <div style={{fontSize:11,fontWeight:700,color:t.inf,marginBottom:6}}>REQUIREMENTS.TXT</div>
            <div style={{fontSize:12,color:t.txB,lineHeight:1.6,fontFamily:t.term?t.mf:"monospace"}}>{(result.zusatz.packages||[]).join(", ")}</div>
          </div>
          <div style={{padding:"12px 14px",background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?6:8}}>
            <div style={{fontSize:11,fontWeight:700,color:t.math,marginBottom:6}}>CODE-QUALITAET</div>
            <div style={{fontSize:12,color:t.txB,lineHeight:1.6}}>{result.zusatz.code_tipp}</div>
          </div>
        </div>
        <div style={{padding:"12px 14px",background:t.bgC,border:`1px solid ${t.bd}`,borderRadius:t.term?6:8}}>
          <div style={{fontSize:11,fontWeight:700,color:t.ok,marginBottom:6}}>README.MD ENTWURF</div>
          <div style={{fontSize:12,color:t.txB,lineHeight:1.6,whiteSpace:"pre-wrap"}}>{result.zusatz.readme_entwurf}</div>
        </div>
      </div>}
    </>}
  </div>;
};

// ── MODULE: Projektbegleiter ──
const MGuide = () => {
  const t=useT();

  const [as,setAs]=useState(0);
  const [expT,setExpT]=useState({});
  const [checks,setChecks]=useState(()=>{const o={};STEPS.forEach(s=>{o[s.id]={};});return o;});
  const step=STEPS[as];
  const stepProg=step?Math.round(Object.keys(checks[step.id]||{}).filter(k=>checks[step.id][k]).length/step.checks.length*100):0;
  const toggleT=(term)=>setExpT(p=>({...p,[term]:!p[term]}));
  const toggleC=(sid,idx)=>setChecks(p=>{const s={...p[sid]};s[idx]=!s[idx];return{...p,[sid]:s};});
  return <div>
    <CL num="P2"/><H1>Projektbegleiter</H1>
    <P>Dein 9-Schritte-Guide durch die Projektarbeit — von der Idee bis zur Praesentation.</P>
    <div style={{display:"flex",gap:4,marginBottom:24,flexWrap:"wrap"}}>
      {STEPS.map((s,i)=>{const active=as===i;const done=Object.keys(checks[s.id]||{}).filter(k=>checks[s.id][k]).length===s.checks.length;
        return <button key={s.id} onClick={()=>setAs(i)} style={{padding:"6px 12px",borderRadius:t.term?4:20,border:`1px solid ${active?t.ac:done?t.ok+"40":t.bd}`,background:active?t.ac:done?t.okBg:t.bgC,color:active?t.w:done?t.ok:t.txM,fontSize:11,fontWeight:active?700:500,cursor:"pointer",fontFamily:t.sf,whiteSpace:"nowrap"}}>
          {done&&!active?"✓ ":""}{s.n}. {s.t.split(" ")[0]}
        </button>;
      })}
    </div>
    {step&&<div>
      <div style={{background:t.bgAS,border:`1px solid ${t.bdA}`,borderRadius:t.term?8:12,padding:"20px 24px",marginBottom:20}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
          <div style={{fontSize:12,fontWeight:600,color:t.ac}}>SCHRITT {step.n} VON {STEPS.length}</div>
          <div style={{fontSize:11,color:t.txM}}>{stepProg}% erledigt</div>
        </div>
        <div style={{fontFamily:t.hf,fontSize:22,fontWeight:700,color:t.tx,marginBottom:4}}>{step.t}</div>
        <div style={{fontSize:14,color:t.txB}}>{step.s}</div>
        <div style={{marginTop:10}}><Bar p={stepProg}/></div>
      </div>
      <ST>Was muss ich hier tun?</ST>
      <P>{step.ex}</P>
      <Info title="Das erwartet der Dozent" type="warning">{step.prof}</Info>
      <ST>Wichtige Begriffe</ST>
      <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
        {step.terms.map((tm,i)=><button key={i} onClick={()=>toggleT(tm.t)} style={{textAlign:"left",padding:"10px 14px",background:expT[tm.t]?t.bgAS:t.bgC,border:`1px solid ${expT[tm.t]?t.bdA:t.bd}`,borderRadius:t.term?6:8,cursor:"pointer"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span style={{fontFamily:t.term?t.mf:t.sf,fontSize:13,fontWeight:600,color:t.tx}}>{tm.t}</span>
            <span style={{color:t.txM,fontSize:12,transform:expT[tm.t]?"rotate(90deg)":"none",transition:"transform .2s"}}>▸</span>
          </div>
          {expT[tm.t]&&<div style={{fontSize:13,color:t.txB,marginTop:8,lineHeight:1.6,borderTop:`1px solid ${t.bd}`,paddingTop:8}}>{tm.d}</div>}
        </button>)}
      </div>
      <ST>Code-Beispiel</ST>
      <div style={{background:t.term?t.bgC:"#1e1e2e",border:`1px solid ${t.bd}`,borderRadius:t.term?8:10,overflow:"hidden"}}>
        <div style={{padding:"8px 14px",borderBottom:`1px solid ${t.bd}`,display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:t.err}}/><div style={{width:8,height:8,borderRadius:"50%",background:"#eab308"}}/><div style={{width:8,height:8,borderRadius:"50%",background:t.ok}}/>
          <span style={{marginLeft:8,fontSize:11,color:t.txM,fontFamily:"monospace"}}>python</span>
        </div>
        <pre style={{padding:16,margin:0,overflowX:"auto",fontSize:12,lineHeight:1.6,fontFamily:"'JetBrains Mono','Fira Code',monospace",color:"#c9d1d9"}}>{step.code}</pre>
      </div>
      <ST>Checkliste</ST>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {step.checks.map((item,i)=>{const checked=checks[step.id]?.[i];return <button key={i} onClick={()=>toggleC(step.id,i)} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",background:checked?t.okBg:t.bgC,border:`1px solid ${checked?t.ok+"40":t.bd}`,borderRadius:t.term?6:8,cursor:"pointer",textAlign:"left"}}>
          <span style={{width:20,height:20,borderRadius:t.term?3:4,border:`2px solid ${checked?t.ok:t.bd}`,background:checked?t.ok:"transparent",display:"flex",alignItems:"center",justifyContent:"center",color:t.w,fontSize:11,flexShrink:0}}>{checked?"✓":""}</span>
          <span style={{fontSize:13,color:checked?t.ok:t.tx,textDecoration:checked?"line-through":"none",opacity:checked?.7:1}}>{item}</span>
        </button>;})}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:28}}>
        {as>0?<Bt onClick={()=>setAs(a=>a-1)}>{"← Schritt "+(step.n-1)}</Bt>:<div/>}
        {as<STEPS.length-1?<Bt primary onClick={()=>setAs(a=>a+1)}>{"Schritt "+(step.n+1)+" →"}</Bt>:<div/>}
      </div>
    </div>}
  </div>;
};

// ── SIDEBAR FOOTER ──
const SBFooter = ({themeKey,setThemeKey,open}) => {
  const t=useT();
  const [theme,mode]=themeKey.split("-");
  const setC=(th,mo)=>setThemeKey(`${th}-${mo}`);
  const toggleMode=()=>setC(theme,mode==="light"?"dark":"light");
  const toggleTheme=()=>setC(theme==="paper"?"terminal":"paper",mode);
  if(!open)return <div style={{padding:"12px 0",borderTop:`1px solid ${t.bd}`,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
    <button onClick={toggleMode} title={mode==="light"?"Nachtmodus":"Tagmodus"} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,color:t.txM,padding:4}}>
      {mode==="light"?"☀":"☾"}
    </button>
  </div>;
  return <div style={{padding:"14px 16px",borderTop:`1px solid ${t.bd}`}}>
    <div style={{display:"flex",borderRadius:t.term?5:6,overflow:"hidden",border:`1px solid ${t.bd}`,marginBottom:10}}>
      {[["paper","Paper"],["terminal","Terminal"]].map(([id,label])=><button key={id} onClick={()=>setC(id,mode)} style={{flex:1,padding:"6px 0",fontSize:11,fontWeight:600,border:"none",cursor:"pointer",fontFamily:id==="terminal"?"'JetBrains Mono',monospace":"Georgia,serif",background:theme===id?t.ac:t.bgC,color:theme===id?t.w:t.txM,transition:"all .2s"}}>{label}</button>)}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
      <span style={{fontSize:11,color:t.txF}}>v1.0</span>
      <button onClick={toggleMode} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:20,border:`1px solid ${t.bd}`,background:t.bgC,cursor:"pointer",fontSize:11,color:t.txM}}>
        <span style={{fontSize:13}}>{mode==="light"?"☀":"☾"}</span><span>{mode==="light"?"Tag":"Nacht"}</span>
      </button>
    </div>
  </div>;
};

// ── MAIN APP ──
export default function MLLernApp(){
  const [author,setAuthor]=useState(()=>{try{return localStorage.getItem("ml_author")||"";}catch(e){return "";}});
  const [active,setActive]=useState("welcome");
  const [completed,setCompleted]=useState(()=>{try{const s=localStorage.getItem("ml_completed_"+author);return s?JSON.parse(s):{};}catch(e){return {};}});
  const [sbOpen,setSbOpen]=useState(true);
  const [themeKey,setThemeKey]=useState("paper-light");
  const [ak,setAk]=useState(()=>{try{return typeof import.meta!=="undefined"&&import.meta.env?.VITE_API_KEY||"";}catch(e){return "";}});
  const [prov,setProv]=useState(()=>{try{return typeof import.meta!=="undefined"&&import.meta.env?.VITE_API_PROVIDER||"anthropic";}catch(e){return "anthropic";}});
  const t=THEMES[themeKey]||THEMES["paper-light"];

  // Lernstand pro Person speichern
  useEffect(()=>{if(author){try{localStorage.setItem("ml_completed_"+author,JSON.stringify(completed));}catch(e){}};},[completed,author]);

  const pickAuthor=(name)=>{setAuthor(name);try{localStorage.setItem("ml_author",name);const s=localStorage.getItem("ml_completed_"+name);setCompleted(s?JSON.parse(s):{});}catch(e){setCompleted({});}};
  const switchAuthor=()=>{setAuthor("");try{localStorage.removeItem("ml_author");}catch(e){}};
  const [showTour,setShowTour]=useState(()=>{try{return !localStorage.getItem("ml_tour_done_"+author);}catch(e){return true;}});
  const [tourStep,setTourStep]=useState(0);
  const [showHelp,setShowHelp]=useState(false);
  const closeTour=()=>{setShowTour(false);try{localStorage.setItem("ml_tour_done_"+author,"1");}catch(e){}};
  const resetTour=()=>{setShowTour(true);setTourStep(0);setShowHelp(false);};

  const TOUR_STEPS=[
    {title:"Willkommen bei ML Academy!",text:"Diese App begleitet dich durch Machine Learning -- von den Grundlagen bis zum Uni-Projekt. Hier lernst du alles Schritt fuer Schritt.",icon:"🧠"},
    {title:"6 Lernmodule",text:"Links in der Sidebar findest du 6 Kapitel: Was ist KI, Daten, Supervised Learning, Gradient Descent, Neuronale Netze und Deep Learning. Arbeite sie der Reihe nach durch.",icon:"📚"},
    {title:"Verstanden-Button",text:"Am Ende jedes Kapitels klickst du 'Verstanden'. Dann wird es in der Sidebar gruen markiert und dein Fortschritt steigt. Du kannst es jederzeit zuruecksetzen.",icon:"✓"},
    {title:"Quiz & AI Tutor",text:"Nach den Lernmodulen testest du dein Wissen im Quiz (Modul 7). Der AI Tutor (Modul 8) beantwortet jede Frage -- du brauchst dafuer einen API-Key.",icon:"🤖"},
    {title:"Projektarbeit",text:"Im Projektbegleiter findest du den 9-Schritte-Leitfaden fuer eure Uni-Arbeit. In der Ideenbewertung (eigener Menue-Punkt) koennt ihr als Team Projektideen bewerten und vergleichen.",icon:"🎓"},
    {title:"Euer Fortschritt ist getrennt",text:"Jeder im Team (Sebbi, Lukas, Achim) hat seinen eigenen Lernstand. Nur die Ideenbewertungen werden geteilt -- per Supabase, in Echtzeit.",icon:"👥"},
  ];

  const handleNav=(id)=>{setActive(id);};
  const markComplete=(id)=>setCompleted(p=>({...p,[id]:true}));
  const unmarkComplete=(id)=>setCompleted(p=>{const n={...p};delete n[id];return n;});
  const cCount=MODS_LEARN.filter(m=>completed[m.id]).length;
  const progress=Math.round(cCount/MODS_LEARN.length*100);
  const authorColor=AUTHOR_COLORS[author]||t.ac;

  // Namensauswahl als Startscreen
  if(!author)return <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:t.bg,fontFamily:t.sf}}>
    <div style={{textAlign:"center",maxWidth:400,padding:40}}>
      <div style={{fontFamily:t.hf,fontSize:28,fontWeight:700,color:t.tx,marginBottom:8}}>ML Academy</div>
      <div style={{fontSize:14,color:t.txM,marginBottom:32}}>Wer bist du?</div>
      <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
        {Object.entries(AUTHOR_COLORS).map(([name,color])=><button key={name} onClick={()=>pickAuthor(name)} style={{padding:"16px 32px",borderRadius:t.term?6:14,border:`2px solid ${color}`,background:color+"12",color:color,fontSize:17,fontWeight:700,cursor:"pointer",fontFamily:t.hf,transition:"all .2s"}}>{name}</button>)}
      </div>
    </div>
  </div>;
  const allMods=ALL_MODS_FOR(author);
  const aidx=allMods.findIndex(m=>m.id===active);
  const render=()=>{switch(active){
    case"welcome":return <M1/>;case"data":return <M2/>;case"supervised":return <M3/>;
    case"gradient":return <M4/>;case"neural":return <M5/>;case"deep":return <M6/>;
    case"quiz":return <M7/>;case"tutor":return <M8/>;
    case"compass":return <MCompass/>;case"guide":return <MGuide/>;case"ideas":return <MIdea/>;case"simulation":return <MSimulation/>;
    default:return <M1/>;
  }};

  const NavItem=({mod,isProj})=>{
    const isA=active===mod.id;const isDone=completed[mod.id];
    return <button onClick={()=>handleNav(mod.id)} style={{width:"100%",textAlign:"left",display:"flex",alignItems:"center",gap:sbOpen?10:0,justifyContent:sbOpen?"flex-start":"center",padding:sbOpen?"8px 18px":"8px 0",background:isA?t.bg:"transparent",borderLeft:sbOpen?(isA?`3px solid ${t.ac}`:"3px solid transparent"):"none",border:"none",cursor:"pointer",transition:"all .15s"}}>
      <span style={{width:22,height:22,borderRadius:t.term?(isProj?4:4):(isProj?6:"50%"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:isProj?10:9,fontWeight:600,flexShrink:0,fontFamily:t.term?t.mf:t.sf,background:(isDone&&!isProj)?t.ok:isA?t.ac:t.bd,color:((isDone&&!isProj)||isA)?t.w:t.txM,transition:"all .2s"}}>
        {isDone&&!isProj?"✓":isProj?(mod.n.startsWith("P")?mod.n==="P1"?"◈":"◇":mod.n):mod.n}
      </span>
      {sbOpen&&<span style={{fontSize:12.5,color:isA?t.tx:t.txM,fontWeight:isA?600:400,fontFamily:t.term?t.mf:t.sf,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.term?mod.tt:mod.title}</span>}
    </button>;
  };

  return <Ctx.Provider value={{theme:t,completed,markComplete,unmarkComplete,ak,setAk,prov,setProv,author}}>
    <div style={{minHeight:"100vh",display:"flex",background:t.bg,fontFamily:t.sf}}>
      {/* Sidebar — fixed height, no scroll */}
      <div style={{width:sbOpen?232:56,flexShrink:0,background:t.bgS,borderRight:`1px solid ${t.bd}`,display:"flex",flexDirection:"column",transition:"width .3s",height:"100vh",position:"sticky",top:0}}>
        <div style={{padding:sbOpen?"18px 18px 14px":"14px 0",borderBottom:`1px solid ${t.bd}`}}>
          {sbOpen?<div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div style={{fontFamily:t.hf,fontSize:t.term?14:17,fontWeight:700,color:t.tx}}>{t.st}{t.term&&<span style={{animation:"blink 1s step-end infinite",color:t.ac}}>_</span>}</div>
              <div style={{display:"flex",alignItems:"center",gap:6,marginTop:3}}>
                <span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:8,background:authorColor+"20",color:authorColor,border:`1px solid ${authorColor}40`}}>{author}</span>
                <span style={{fontSize:11,color:t.txM}}>{progress}%</span>
                <button onClick={switchAuthor} style={{fontSize:10,color:t.txF,background:"none",border:"none",cursor:"pointer",padding:0}}>wechseln</button>
              </div>
            </div>
            <button onClick={()=>setSbOpen(false)} style={{background:"none",border:"none",cursor:"pointer",color:t.txM,fontSize:16,padding:"4px 6px"}}>◂</button>
          </div>:<div style={{display:"flex",justifyContent:"center"}}><button onClick={()=>setSbOpen(true)} style={{background:"none",border:"none",cursor:"pointer",color:t.txM,fontSize:16,padding:"4px 6px"}}>▸</button></div>}
          {sbOpen&&<div style={{marginTop:10}}><Bar p={progress}/></div>}
        </div>
        <nav style={{flex:1,paddingTop:6,overflowY:"auto"}}>
          {sbOpen&&<div style={{padding:"8px 18px 4px",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.txF}}>Lernen</div>}
          {MODS_LEARN.map(m=><NavItem key={m.id} mod={m}/>)}
          <div style={{margin:sbOpen?"10px 18px":"10px 8px",height:1,background:t.bd}}/>
          {sbOpen&&<div style={{padding:"4px 18px 4px",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.txF}}>Projektarbeit</div>}
          {MODS_PROJ.map(m=><NavItem key={m.id} mod={m} isProj/>)}
          {author==="Sebbi"&&<>
            <div style={{margin:sbOpen?"10px 18px":"10px 8px",height:1,background:t.bd}}/>
            {sbOpen&&<div style={{padding:"4px 18px 4px",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:".08em",color:t.txF}}>Sebbi</div>}
            {MODS_SEBBI.map(m=><NavItem key={m.id} mod={m} isProj/>)}
          </>}
        </nav>
        <SBFooter themeKey={themeKey} setThemeKey={setThemeKey} open={sbOpen}/>
      </div>
      {/* Main */}
      <div style={{flex:1,overflowY:"auto"}}>
        <div style={{maxWidth:680,margin:"0 auto",padding:"32px 32px 48px"}}>
          {render()}
          <div style={{display:"flex",justifyContent:"space-between",marginTop:48,paddingTop:24,borderTop:`1px solid ${t.bd}`}}>
            {aidx>0?<Bt onClick={()=>handleNav(allMods[aidx-1].id)}>← Zurück</Bt>:<div/>}
            {aidx<allMods.length-1?<Bt primary onClick={()=>handleNav(allMods[aidx+1].id)}>Weiter →</Bt>:<div/>}
          </div>
        </div>
      </div>
      {/* Hilfe-Button */}
      <button onClick={()=>setShowHelp(true)} style={{position:"fixed",bottom:20,right:20,width:44,height:44,borderRadius:"50%",background:t.ac,color:t.w,fontSize:20,fontWeight:700,border:"none",cursor:"pointer",boxShadow:`0 2px 12px ${t.ac}40`,zIndex:100,display:"flex",alignItems:"center",justifyContent:"center"}}>?</button>
      {/* Willkommens-Tour */}
      {showTour&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s"}}>
        <div style={{background:t.bg,borderRadius:t.term?8:16,padding:"36px 32px 28px",maxWidth:440,width:"90%",boxShadow:"0 8px 40px rgba(0,0,0,.3)"}}>
          <div style={{fontSize:40,textAlign:"center",marginBottom:12}}>{TOUR_STEPS[tourStep].icon}</div>
          <div style={{fontFamily:t.hf,fontSize:20,fontWeight:700,color:t.tx,textAlign:"center",marginBottom:10}}>{TOUR_STEPS[tourStep].title}</div>
          <div style={{fontSize:14,color:t.txB,lineHeight:1.7,textAlign:"center",marginBottom:24}}>{TOUR_STEPS[tourStep].text}</div>
          <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:20}}>
            {TOUR_STEPS.map((_,i)=><div key={i} style={{width:i===tourStep?20:8,height:8,borderRadius:4,background:i===tourStep?t.ac:`${t.bd}`,transition:"all .2s"}}/>)}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <button onClick={closeTour} style={{fontSize:12,color:t.txM,background:"none",border:"none",cursor:"pointer",fontFamily:t.sf}}>Ueberspringen</button>
            <div style={{display:"flex",gap:8}}>
              {tourStep>0&&<Bt onClick={()=>setTourStep(p=>p-1)}>Zurueck</Bt>}
              {tourStep<TOUR_STEPS.length-1?<Bt primary onClick={()=>setTourStep(p=>p+1)}>Weiter</Bt>
              :<Bt primary onClick={closeTour}>Los geht's!</Bt>}
            </div>
          </div>
        </div>
      </div>}
      {/* Hilfe-Seite */}
      {showHelp&&<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.55)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",animation:"fadeIn .3s"}} onClick={()=>setShowHelp(false)}>
        <div style={{background:t.bg,borderRadius:t.term?8:16,padding:"28px 28px 20px",maxWidth:520,width:"90%",maxHeight:"80vh",overflowY:"auto",boxShadow:"0 8px 40px rgba(0,0,0,.3)"}} onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
            <div style={{fontFamily:t.hf,fontSize:20,fontWeight:700,color:t.tx}}>Hilfe</div>
            <button onClick={()=>setShowHelp(false)} style={{background:"none",border:"none",cursor:"pointer",fontSize:18,color:t.txM}}>x</button>
          </div>
          {[
            {q:"Wie funktioniert die App?",a:"Arbeite die 6 Lernmodule der Reihe nach durch. Am Ende jedes Kapitels klickst du 'Verstanden'. Der Fortschritt wird in der Sidebar und als Prozentzahl angezeigt."},
            {q:"Was bedeuten die Farben in der Sidebar?",a:"Gruen = Kapitel verstanden. Orange/Blau = aktuelles Kapitel. Grau = noch nicht bearbeitet. Die Projekt-Module (P1, P2) haben keine Haken -- die sind Werkzeuge, die du immer wieder nutzt."},
            {q:"Was ist der AI Tutor?",a:"Ein KI-Chat, der dir ML-Fragen beantwortet. Du brauchst einen API-Key von OpenAI oder Anthropic. Den Key gibst du einmal ein, er bleibt gespeichert."},
            {q:"Wie funktioniert die Ideenbewertung?",a:"Beschreibe deine Projektidee in 1-3 Saetzen. Optional: Lade CSV-Dateien hoch, damit die KI die echten Daten analysiert. Die Bewertung wird fuer das ganze Team in Supabase gespeichert."},
            {q:"Sieht mein Team meinen Fortschritt?",a:"Nein! Dein Lernstand ist nur auf deinem Geraet gespeichert. Nur die Ideenbewertungen werden geteilt."},
            {q:"Kann ich den Fortschritt zuruecksetzen?",a:"Ja. Am Ende jedes Kapitels gibt es unter dem gruenen Badge einen 'Zuruecksetzen'-Link."},
            {q:"Was sind Paper und Terminal?",a:"Zwei Design-Themes. Paper = warm, akademisch, Serif-Schrift. Terminal = technisch, Monospace-Schrift, Hacker-Vibes. Beide haben Tag- und Nachtmodus."},
          ].map((item,i)=><div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:i<6?`1px solid ${t.bd}`:"none"}}>
            <div style={{fontSize:13,fontWeight:700,color:t.tx,marginBottom:6}}>{item.q}</div>
            <div style={{fontSize:13,color:t.txB,lineHeight:1.6}}>{item.a}</div>
          </div>)}
          <div style={{textAlign:"center",marginTop:8}}>
            <Bt onClick={resetTour}>Tour nochmal ansehen</Bt>
          </div>
        </div>
      </div>}
      <style>{`@keyframes blink{50%{opacity:0}}@keyframes fadeIn{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  </Ctx.Provider>;
}
