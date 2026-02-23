import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Package, Search, Plus, Edit3, Trash2, Users, ChevronDown, LogOut, Home, Sparkles, Check, X, Zap, ArrowUp, ArrowDown, AlertTriangle, Box, DollarSign, MapPin, Activity, Shield, Download, RefreshCw, MessageSquare, ShoppingCart, Truck, Tag, Star, Mail, LayoutGrid, List, Columns, Command, Hash, ChevronRight, Eye, Clock, ArrowRight, Filter, MoreHorizontal, Copy, Archive } from "lucide-react";

// ═══════ DATA ═══════
const CATS=[{id:"electronics",label:"Electronics",color:"#3b82f6",icon:"⚡"},{id:"furniture",label:"Furniture",color:"#8b5cf6",icon:"🪑"},{id:"clothing",label:"Clothing",color:"#ec4899",icon:"👕"},{id:"food",label:"Food & Bev",color:"#f97316",icon:"🍔"},{id:"tools",label:"Tools",color:"#14b8a6",icon:"🔧"},{id:"office",label:"Office",color:"#6366f1",icon:"📎"},{id:"medical",label:"Medical",color:"#ef4444",icon:"🏥"},{id:"raw",label:"Raw Materials",color:"#78716c",icon:"🧱"}];
const ST={instock:{l:"In Stock",c:"#22c55e",dot:"#22c55e"},low:{l:"Low Stock",c:"#eab308",dot:"#eab308"},ordered:{l:"Ordered",c:"#3b82f6",dot:"#3b82f6"},discontinued:{l:"Discontinued",c:"#71717a",dot:"#71717a"}};
const ROLES={admin:{l:"Admin",c:"#ef4444",perms:["read","write","delete","manage_users","manage_orders","export","ai"]},manager:{l:"Manager",c:"#f59e0b",perms:["read","write","manage_orders","export","ai"]},viewer:{l:"Viewer",c:"#3b82f6",perms:["read"]}};
const LOCS=["Warehouse A","Warehouse B","Warehouse C","Store Front","Cold Storage","Outdoor Yard"];
const SUPS=[{id:"s1",name:"TechParts Global",contact:"John M.",email:"john@techparts.io",rating:4.8},{id:"s2",name:"FurnishCo",contact:"Anna K.",email:"anna@furnishco.com",rating:4.5},{id:"s3",name:"TextileWorks",contact:"Omar R.",email:"omar@textileworks.net",rating:4.2},{id:"s4",name:"QuickSupply Ltd.",contact:"Lisa W.",email:"lisa@quicksupply.com",rating:4.9},{id:"s5",name:"MedEquip Inc.",contact:"Dr. Patel",email:"patel@medequip.org",rating:4.7}];
const USERS_DB=[{id:"u1",name:"Hasan",email:"hasan@nexus.app",role:"admin",av:"#3b82f6"},{id:"u2",name:"Sarah",email:"sarah@nexus.app",role:"manager",av:"#a855f7"},{id:"u3",name:"Alex",email:"alex@nexus.app",role:"viewer",av:"#14b8a6"},{id:"u4",name:"Dana",email:"dana@nexus.app",role:"manager",av:"#f97316"}];
const uid=()=>"x"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);
const mkSku=(c)=>(c||"GEN").slice(0,3).toUpperCase()+"-"+Math.random().toString(36).slice(2,6).toUpperCase();
const now=()=>new Date().toISOString();
const money=(n)=>"$"+(n||0).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g,",");
const autoSt=(q,m)=>q<=0?"discontinued":q<=(m||5)?"low":"instock";
const fmtD=(d)=>new Date(d).toLocaleDateString("en",{month:"short",day:"numeric"});

const SEED=[
  {id:"i1",sku:"ELE-X7K9M",name:"4K Monitor 27\"",desc:"Ultra-wide 4K IPS display with USB-C connectivity",category:"electronics",tags:["display","tech"],qty:45,minStock:10,maxStock:200,price:549.99,cost:320,supplier:"s1",location:"Warehouse A",status:"instock",createdBy:"u1",createdAt:"2025-12-01T10:00:00Z",updatedAt:"2026-02-20T14:30:00Z"},
  {id:"i2",sku:"ELE-P3N2Q",name:"Wireless Keyboard",desc:"Bluetooth mechanical keyboard with RGB backlit keys",category:"electronics",tags:["input","wireless"],qty:8,minStock:15,maxStock:100,price:89.99,cost:42,supplier:"s1",location:"Warehouse A",status:"low",createdBy:"u1",createdAt:"2025-11-15T09:00:00Z",updatedAt:"2026-02-18T11:00:00Z"},
  {id:"i3",sku:"FUR-M8T4R",name:"Ergonomic Office Chair",desc:"Full lumbar support with mesh back and adjustable armrests",category:"furniture",tags:["seating","ergonomic"],qty:23,minStock:5,maxStock:50,price:399.00,cost:210,supplier:"s2",location:"Warehouse B",status:"instock",createdBy:"u2",createdAt:"2025-10-20T08:00:00Z",updatedAt:"2026-02-15T16:45:00Z"},
  {id:"i4",sku:"CLO-D9W1K",name:"Company Polo Shirts",desc:"Branded polo shirts in various sizes and colors",category:"clothing",tags:["branded","uniform"],qty:150,minStock:30,maxStock:500,price:29.99,cost:12,supplier:"s3",location:"Store Front",status:"instock",createdBy:"u2",createdAt:"2025-09-10T12:00:00Z",updatedAt:"2026-01-28T09:15:00Z"},
  {id:"i5",sku:"TOO-J5L8P",name:"Cordless Drill Set",desc:"18V Li-Ion drill with 50-piece accessory kit",category:"tools",tags:["power tool","drill"],qty:3,minStock:10,maxStock:60,price:179.99,cost:95,supplier:"s4",location:"Warehouse C",status:"low",createdBy:"u1",createdAt:"2025-08-05T14:00:00Z",updatedAt:"2026-02-22T10:00:00Z"},
  {id:"i6",sku:"OFF-A2B6N",name:"A4 Copy Paper (Box)",desc:"5000 sheets per box at 80gsm white paper",category:"office",tags:["paper","essential"],qty:67,minStock:20,maxStock:300,price:42.50,cost:22,supplier:"s4",location:"Warehouse A",status:"instock",createdBy:"u4",createdAt:"2025-07-01T10:00:00Z",updatedAt:"2026-02-10T13:30:00Z"},
  {id:"i7",sku:"MED-F1G3H",name:"First Aid Kit - Industrial",desc:"OSHA compliant kit for 100-person capacity workplaces",category:"medical",tags:["safety","compliance"],qty:12,minStock:5,maxStock:30,price:89.00,cost:48,supplier:"s5",location:"Store Front",status:"instock",createdBy:"u1",createdAt:"2026-01-15T08:00:00Z",updatedAt:"2026-02-20T15:00:00Z"},
  {id:"i8",sku:"RAW-C4V7Z",name:"Steel Rebar (Bundle)",desc:"12mm diameter rebar, 6m length, 10 pieces per bundle",category:"raw",tags:["construction","metal"],qty:0,minStock:20,maxStock:100,price:185.00,cost:120,supplier:"s4",location:"Outdoor Yard",status:"discontinued",createdBy:"u2",createdAt:"2025-06-20T11:00:00Z",updatedAt:"2026-02-01T09:00:00Z"},
  {id:"i9",sku:"ELE-R6S9T",name:"USB-C Hub 7-in-1",desc:"HDMI, USB 3.0, SD card reader, PD charging hub",category:"electronics",tags:["adapter","usb-c"],qty:92,minStock:20,maxStock:200,price:59.99,cost:25,supplier:"s1",location:"Warehouse A",status:"instock",createdBy:"u1",createdAt:"2025-11-01T10:00:00Z",updatedAt:"2026-02-21T12:00:00Z"},
  {id:"i10",sku:"FUR-W2X5Y",name:"Standing Desk 60\"",desc:"Electric height adjustable desk with memory presets",category:"furniture",tags:["desk","ergonomic"],qty:7,minStock:3,maxStock:25,price:699.00,cost:380,supplier:"s2",location:"Warehouse B",status:"instock",createdBy:"u4",createdAt:"2025-12-10T09:00:00Z",updatedAt:"2026-02-19T14:00:00Z"},
  {id:"i11",sku:"FOO-K8L2M",name:"Premium Coffee Beans 1kg",desc:"Single-origin Arabica, medium roast, whole bean",category:"food",tags:["beverage","coffee"],qty:34,minStock:10,maxStock:100,price:24.99,cost:14,supplier:"s4",location:"Cold Storage",status:"instock",createdBy:"u2",createdAt:"2026-01-05T08:00:00Z",updatedAt:"2026-02-22T08:00:00Z"},
  {id:"i12",sku:"OFF-N3P7Q",name:"Whiteboard Markers (Pack)",desc:"12-color assorted chisel tip dry erase markers",category:"office",tags:["markers","presentation"],qty:41,minStock:15,maxStock:120,price:18.99,cost:8,supplier:"s4",location:"Store Front",status:"instock",createdBy:"u4",createdAt:"2025-10-01T10:00:00Z",updatedAt:"2026-02-14T11:00:00Z"},
];
const SEED_LOG=[
  {id:"l1",action:"created",itemId:"i1",userId:"u1",ts:"2025-12-01T10:00:00Z",detail:"Created 4K Monitor 27\""},
  {id:"l2",action:"updated",itemId:"i2",userId:"u1",ts:"2026-02-18T11:00:00Z",detail:"Qty 25 → 8"},
  {id:"l3",action:"created",itemId:"i11",userId:"u2",ts:"2026-01-05T08:00:00Z",detail:"Created Premium Coffee Beans 1kg"},
  {id:"l4",action:"order",itemId:"i5",userId:"u1",ts:"2026-02-22T10:05:00Z",detail:"PO for 20× Cordless Drill Set"},
  {id:"l5",action:"status",itemId:"i8",userId:"u2",ts:"2026-02-01T09:00:00Z",detail:"Steel Rebar → Discontinued"},
];
const SEED_ORD=[
  {id:"o1",items:[{itemId:"i2",qty:50},{itemId:"i5",qty:20}],supplier:"s1",status:"pending",date:"2026-02-22T10:00:00Z",total:6399.30,createdBy:"u1",notes:"Urgent restock"},
  {id:"o2",items:[{itemId:"i8",qty:30}],supplier:"s4",status:"shipped",date:"2026-02-18T09:00:00Z",total:5550.00,createdBy:"u2",notes:"Monthly order"},
  {id:"o3",items:[{itemId:"i4",qty:200}],supplier:"s3",status:"delivered",date:"2026-02-10T14:00:00Z",total:2400.00,createdBy:"u4",notes:"New batch"},
];

const GLOBAL_STYLES = `@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{to{transform:rotate(360deg)}}@keyframes float1{0%,100%{transform:translate(0,0) rotate(0deg)}25%{transform:translate(30px,-20px) rotate(3deg)}50%{transform:translate(-10px,15px) rotate(-2deg)}75%{transform:translate(20px,10px) rotate(1deg)}}@keyframes float2{0%,100%{transform:translate(0,0) rotate(0deg)}25%{transform:translate(-20px,25px) rotate(-3deg)}50%{transform:translate(15px,-10px) rotate(2deg)}75%{transform:translate(-25px,-15px) rotate(-1deg)}}@keyframes float3{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(15px,-30px) scale(1.05)}66%{transform:translate(-20px,10px) scale(.95)}}@keyframes pulse-glow{0%,100%{opacity:.15}50%{opacity:.3}}@keyframes scanline{0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}}input::placeholder{color:#555!important}textarea::placeholder{color:#555!important}select option{background:#1a1a1a}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#333;border-radius:3px}*{box-sizing:border-box}html,body,#root{margin:0;padding:0;width:100%;height:100%;overflow:hidden}`;

// ═══════ EDIT PANE (extracted to fix hooks) ═══════
function EditPane({ editId, editData, onSave, onClose }) {
  const isNew = editId === "new";
  const [f, setF] = useState(
    editData || (isNew ? { name: "", desc: "", category: "electronics", tags: [], qty: 0, minStock: 10, maxStock: 100, price: 0, cost: 0, supplier: "s1", location: "Warehouse A" } : {})
  );
  const [tg, setTg] = useState("");

  const up = (k, v) => setF(p => ({ ...p, [k]: v }));
  const field = (label, k, type, opts) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10, color: "#888", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>{label}</div>
      {opts ? <select value={f[k]} onChange={e => up(k, e.target.value)} style={{ width: "100%", padding: "7px 8px", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none" }}>{opts.map(o => <option key={o.v} value={o.v} style={{ background: "#1a1a1a" }}>{o.l}</option>)}</select> :
        <input type={type || "text"} value={f[k] || ""} onChange={e => up(k, type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)} style={{ width: "100%", padding: "7px 8px", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none", boxSizing: "border-box" }} onFocus={e => e.target.style.borderColor = "#555"} onBlur={e => e.target.style.borderColor = "#2a2a2a"} />}
    </div>
  );
  return (
    <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 380, background: "#111", borderLeft: "1px solid #222", zIndex: 900, overflow: "auto", animation: "fi .15s ease", padding: "20px 18px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
        <span style={{ color: "#fff", fontSize: 14, fontWeight: 600 }}>{isNew ? "New Item" : "Edit Item"}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: 0, display: "flex" }}><X size={16} /></button>
      </div>
      {field("Name", "name")}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "#888", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Description</div>
        <textarea value={f.desc || ""} onChange={e => up("desc", e.target.value)} rows={2} style={{ width: "100%", padding: "7px 8px", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none", resize: "vertical", fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {field("Category", "category", null, CATS.map(c => ({ v: c.id, l: c.icon + " " + c.label })))}
        {field("Supplier", "supplier", null, SUPS.map(s => ({ v: s.id, l: s.name })))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
        {field("Qty", "qty", "number")}{field("Min", "minStock", "number")}{field("Max", "maxStock", "number")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {field("Price ($)", "price", "number")}{field("Cost ($)", "cost", "number")}
      </div>
      {field("Location", "location", null, LOCS.map(l => ({ v: l, l })))}
      <div style={{ marginBottom: 10 }}>
        <div style={{ fontSize: 10, color: "#888", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Tags</div>
        <div style={{ display: "flex", gap: 4 }}>
          <input placeholder="Add tag" value={tg} onChange={e => setTg(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tg.trim()) { up("tags", [...(f.tags || []), tg.trim()]); setTg(""); } }} style={{ flex: 1, padding: "6px 8px", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
        </div>
        {f.tags?.length > 0 && <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>{f.tags.map((t, i) => <span key={i} onClick={() => up("tags", f.tags.filter((_, j) => j !== i))} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#1e1e1e", color: "#aaa", cursor: "pointer", border: "1px solid #2a2a2a" }}>{t} ×</span>)}</div>}
      </div>
      <div style={{ display: "flex", gap: 6, marginTop: 16, paddingTop: 14, borderTop: "1px solid #222" }}>
        <button onClick={onClose} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "1px solid #333", background: "transparent", color: "#aaa", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Cancel</button>
        <button onClick={() => { if (!f.name) return; onSave(isNew ? f : { ...f, id: editId }); }} style={{ flex: 1, padding: "9px", borderRadius: 8, border: "none", background: "#fff", color: "#111", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>{isNew ? "Create" : "Save"}</button>
      </div>
    </div>
  );
}

// ═══════ LOGIN SCREEN ═══════
function LoginScreen({ onLogin }) {
  return (
    <div style={{ height: "100vh", width: "100vw", background: "#111", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter',-apple-system,sans-serif", overflow: "hidden", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Ambient floating orbs */}
      <div style={{ position: "absolute", top: "-10%", left: "-5%", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,.08) 0%, transparent 70%)", animation: "float1 20s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "-15%", right: "-8%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,.07) 0%, transparent 70%)", animation: "float2 25s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "20%", right: "10%", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(20,184,166,.06) 0%, transparent 70%)", animation: "float3 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "25%", left: "8%", width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,.05) 0%, transparent 70%)", animation: "float2 22s ease-in-out infinite", pointerEvents: "none" }} />

      {/* Grid pattern overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.02) 1px, transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

      {/* Subtle diagonal brushstrokes */}
      <div style={{ position: "absolute", top: "5%", left: "3%", width: 180, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,.15), transparent)", transform: "rotate(-25deg)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", left: "6%", width: 120, height: 1, background: "linear-gradient(90deg, transparent, rgba(59,130,246,.1), transparent)", transform: "rotate(-25deg)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "12%", right: "4%", width: 160, height: 1, background: "linear-gradient(90deg, transparent, rgba(168,85,247,.15), transparent)", transform: "rotate(30deg)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "7%", width: 100, height: 1, background: "linear-gradient(90deg, transparent, rgba(168,85,247,.1), transparent)", transform: "rotate(30deg)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "40%", left: "2%", width: 140, height: 1, background: "linear-gradient(90deg, transparent, rgba(20,184,166,.12), transparent)", transform: "rotate(-15deg)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "60%", right: "3%", width: 130, height: 1, background: "linear-gradient(90deg, transparent, rgba(249,115,22,.1), transparent)", transform: "rotate(20deg)", pointerEvents: "none" }} />

      {/* Corner accents */}
      <div style={{ position: "absolute", top: 30, left: 30, display: "flex", gap: 6, opacity: 0.12, pointerEvents: "none" }}>
        <div style={{ width: 24, height: 1, background: "#fff" }} />
        <div style={{ width: 1, height: 24, background: "#fff", position: "absolute", top: 0, left: 0 }} />
      </div>
      <div style={{ position: "absolute", bottom: 30, right: 30, display: "flex", gap: 6, opacity: 0.12, pointerEvents: "none" }}>
        <div style={{ width: 24, height: 1, background: "#fff", position: "absolute", bottom: 0, right: 0 }} />
        <div style={{ width: 1, height: 24, background: "#fff", position: "absolute", bottom: 0, right: 0 }} />
      </div>

      {/* Floating mini shapes */}
      <div style={{ position: "absolute", top: "30%", left: "15%", width: 6, height: 6, borderRadius: "50%", background: "rgba(59,130,246,.2)", animation: "pulse-glow 4s ease-in-out infinite", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "70%", left: "20%", width: 4, height: 4, borderRadius: "50%", background: "rgba(168,85,247,.2)", animation: "pulse-glow 5s ease-in-out infinite 1s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "25%", right: "18%", width: 5, height: 5, borderRadius: "50%", background: "rgba(20,184,166,.2)", animation: "pulse-glow 3.5s ease-in-out infinite .5s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "55%", right: "15%", width: 4, height: 4, borderRadius: 1, background: "rgba(249,115,22,.15)", transform: "rotate(45deg)", animation: "pulse-glow 4.5s ease-in-out infinite 2s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "80%", left: "35%", width: 3, height: 3, borderRadius: "50%", background: "rgba(236,72,153,.15)", animation: "pulse-glow 5.5s ease-in-out infinite 1.5s", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "15%", right: "35%", width: 5, height: 5, borderRadius: 1, background: "rgba(99,102,241,.12)", transform: "rotate(45deg)", animation: "pulse-glow 4s ease-in-out infinite 3s", pointerEvents: "none" }} />

      {/* Side brush streaks - left */}
      <div style={{ position: "absolute", left: 0, top: "30%", width: 80, height: 120, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, left: -20, width: 100, height: 1, background: "linear-gradient(90deg, rgba(59,130,246,.12), transparent)", transform: "rotate(-8deg)" }} />
        <div style={{ position: "absolute", top: 20, left: -10, width: 70, height: 1, background: "linear-gradient(90deg, rgba(59,130,246,.08), transparent)", transform: "rotate(-5deg)" }} />
        <div style={{ position: "absolute", top: 45, left: -15, width: 90, height: 1, background: "linear-gradient(90deg, rgba(168,85,247,.1), transparent)", transform: "rotate(-12deg)" }} />
        <div style={{ position: "absolute", top: 70, left: -5, width: 60, height: 1, background: "linear-gradient(90deg, rgba(20,184,166,.08), transparent)", transform: "rotate(-3deg)" }} />
        <div style={{ position: "absolute", top: 95, left: -10, width: 80, height: 1, background: "linear-gradient(90deg, rgba(59,130,246,.06), transparent)", transform: "rotate(-7deg)" }} />
      </div>

      {/* Side brush streaks - right */}
      <div style={{ position: "absolute", right: 0, top: "55%", width: 80, height: 120, overflow: "hidden", pointerEvents: "none" }}>
        <div style={{ position: "absolute", top: 0, right: -20, width: 100, height: 1, background: "linear-gradient(270deg, rgba(168,85,247,.12), transparent)", transform: "rotate(8deg)" }} />
        <div style={{ position: "absolute", top: 25, right: -10, width: 70, height: 1, background: "linear-gradient(270deg, rgba(168,85,247,.08), transparent)", transform: "rotate(5deg)" }} />
        <div style={{ position: "absolute", top: 50, right: -15, width: 90, height: 1, background: "linear-gradient(270deg, rgba(249,115,22,.1), transparent)", transform: "rotate(10deg)" }} />
        <div style={{ position: "absolute", top: 75, right: -5, width: 60, height: 1, background: "linear-gradient(270deg, rgba(20,184,166,.08), transparent)", transform: "rotate(3deg)" }} />
      </div>

      {/* Main card */}
      <div style={{ width: "100%", maxWidth: 380, padding: "0 20px", animation: "fi .4s ease", position: "relative", zIndex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 30px rgba(255,255,255,.08)" }}><Package size={18} color="#111" /></div>
          <div>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 20, letterSpacing: "-.04em" }}>Nexus</span>
            <div style={{ color: "#555", fontSize: 10, fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase", marginTop: -2 }}>Inventory Platform</div>
          </div>
        </div>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>Sign in to your workspace</p>
        {USERS_DB.map(u => (
          <div key={u.id} onClick={() => onLogin(u)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderRadius: 10, border: "1px solid #1e1e1e", marginBottom: 6, cursor: "pointer", transition: "all .15s", background: "rgba(255,255,255,.01)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#444"; e.currentTarget.style.background = "rgba(255,255,255,.03)"; e.currentTarget.style.transform = "translateX(4px)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#1e1e1e"; e.currentTarget.style.background = "rgba(255,255,255,.01)"; e.currentTarget.style.transform = "translateX(0)"; }}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: u.av, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: `0 0 20px ${u.av}30` }}>{u.name[0]}</div>
            <div style={{ flex: 1 }}><div style={{ color: "#eee", fontSize: 13, fontWeight: 500 }}>{u.name}</div><div style={{ color: "#555", fontSize: 11 }}>{u.email}</div></div>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: ROLES[u.role].c + "15", color: ROLES[u.role].c, fontWeight: 500 }}>{ROLES[u.role].l}</span>
            <ChevronRight size={14} color="#333" />
          </div>
        ))}
        <div style={{ marginTop: 28, textAlign: "center", color: "#333", fontSize: 10 }}>Nexus v3 · Secure Workspace</div>
      </div>
    </div>
  );
}

// ═══════ MAIN ═══════
export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState(SEED);
  const [logs, setLogs] = useState(SEED_LOG);
  const [orders, setOrders] = useState(SEED_ORD);
  const [q, setQ] = useState("");
  const [fCat, setFCat] = useState("all");
  const [fStat, setFStat] = useState("all");
  const [fLoc, setFLoc] = useState("all");
  const [sel, setSel] = useState(null);
  const [mode, setMode] = useState("table");
  const [sortK, setSortK] = useState("name");
  const [sortD, setSortD] = useState("asc");
  const [toast, setToast] = useState(null);
  const [cmdOpen, setCmdOpen] = useState(false);
  const [cmdQ, setCmdQ] = useState("");
  const [aiLoad, setAiLoad] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [checked, setChecked] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [oSup, setOSup] = useState("s1");
  const [oItems, setOItems] = useState([{ itemId: "", qty: 10 }]);
  const [oNotes, setONotes] = useState("");
  const [orderModal, setOrderModal] = useState(false);
  const [tab, setTab] = useState("items");
  const cmdRef = useRef(null);
  const searchRef = useRef(null);

  const notify = useCallback((m, t = "ok") => { setToast({ m, t }); setTimeout(() => setToast(null), 3000); }, []);
  const can = (p) => user && ROLES[user.role]?.perms.includes(p);
  const log = (a, iid, d) => setLogs(p => [{ id: uid(), action: a, itemId: iid, userId: user?.id, ts: now(), detail: d }, ...p].slice(0, 200));

  // Storage
  useEffect(() => {
    (async () => {
      try { const r = await window.storage.get("nx3-items"); if (r?.value) setItems(JSON.parse(r.value)); } catch {/* ignore */ }
      try { const r = await window.storage.get("nx3-logs"); if (r?.value) setLogs(JSON.parse(r.value)); } catch {/* ignore */ }
      try { const r = await window.storage.get("nx3-orders"); if (r?.value) setOrders(JSON.parse(r.value)); } catch {/* ignore */ }
      try { const r = await window.storage.get("nx3-user"); if (r?.value) setUser(JSON.parse(r.value)); } catch {/* ignore */ }
      setLoaded(true);
    })();
  }, []);
  useEffect(() => { if (!loaded) return; (async () => { try { await window.storage.set("nx3-items", JSON.stringify(items)); } catch {/* ignore */ } })(); }, [items, loaded]);
  useEffect(() => { if (!loaded) return; (async () => { try { await window.storage.set("nx3-logs", JSON.stringify(logs)); } catch {/* ignore */ } })(); }, [logs, loaded]);
  useEffect(() => { if (!loaded) return; (async () => { try { await window.storage.set("nx3-orders", JSON.stringify(orders)); } catch {/* ignore */ } })(); }, [orders, loaded]);
  useEffect(() => { if (!loaded) return; (async () => { try { await window.storage.set("nx3-user", JSON.stringify(user)); } catch {/* ignore */ } })(); }, [user, loaded]);

  // Keyboard shortcut
  useEffect(() => {
    const h = (e) => { if ((e.metaKey || e.ctrlKey) && e.key === "k") { e.preventDefault(); setCmdOpen(p => !p); setCmdQ(""); } if (e.key === "Escape") { setCmdOpen(false); setSel(null); } };
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h);
  }, []);

  const saveItem = (it) => {
    if (!can("write")) return notify("No permission", "err");
    const s = autoSt(it.qty, it.minStock);
    if (it.id && items.find(e => e.id === it.id)) {
      setItems(p => p.map(e => e.id === it.id ? { ...it, status: it.status === "discontinued" ? "discontinued" : s, updatedAt: now() } : e));
      log("updated", it.id, `Updated ${it.name}`); notify("Saved");
    } else {
      const ni = { ...it, id: uid(), sku: it.sku || mkSku(it.category), status: s, createdBy: user.id, createdAt: now(), updatedAt: now() };
      setItems(p => [ni, ...p]); log("created", ni.id, `Created ${ni.name}`); notify("Created");
    }
    setEditId(null); setEditData(null);
  };
  const delItem = (id) => { if (!can("delete")) return; const it = items.find(e => e.id === id); setItems(p => p.filter(e => e.id !== id)); log("deleted", id, `Deleted ${it?.name}`); if (sel?.id === id) setSel(null); notify("Deleted", "info"); };
  const cycleStatus = (id) => {
    if (!can("write")) return;
    const order = ["instock", "low", "ordered", "discontinued"];
    setItems(p => p.map(e => { if (e.id !== id) return e; const idx = (order.indexOf(e.status) + 1) % order.length; return { ...e, status: order[idx], updatedAt: now() }; }));
  };
  const exportCSV = () => {
    if (!can("export")) return;
    const rows = [["SKU", "Name", "Category", "Qty", "Min", "Max", "Price", "Cost", "Status", "Location"].join(",")];
    items.forEach(i => rows.push([i.sku, `"${i.name}"`, i.category, i.qty, i.minStock, i.maxStock, i.price, i.cost, i.status, i.location].join(",")));
    const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([rows.join("\n")], { type: "text/csv" })); a.download = "inventory.csv"; a.click();
    log("export", null, "CSV export"); notify("Exported");
  };
  const bulkDel = () => { if (!can("delete")) return; setItems(p => p.filter(e => !checked.has(e.id))); log("bulk", "", `Deleted ${checked.size}`); setChecked(new Set()); notify(`Deleted ${checked.size}`, "info"); };
  const bulkSt = (s) => { if (!can("write")) return; setItems(p => p.map(e => checked.has(e.id) ? { ...e, status: s, updatedAt: now() } : e)); setChecked(new Set()); notify("Updated"); };

  // AI
  const aiExec = async (input) => {
    if (!can("ai")) return; setAiLoad(true);
    try {
      const inv = items.slice(0, 15).map(i => `[${i.sku}]${i.name}:qty=${i.qty},min=${i.minStock},$${i.price},${i.status},${i.category},${i.location}`).join("\n");
      const r = await fetch("https://api.anthropic.com/v1/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, system: `Inventory AI.\n${inv}\nCats:${CATS.map(c => c.id)}.Locs:${LOCS}.Sups:${SUPS.map(s => s.id + "=" + s.name)}\nActions:\n1.ADD:{action:"add",data:{name,desc,category,qty,minStock,maxStock,price,cost,supplier,location,tags:[]}}\n2.UPDATE:{action:"update",sku:"...",data:{...}}\n3.SEARCH:{action:"search",query:"..."}\n4.REPORT:{action:"report",text:"..."}\nJSON only.`, messages: [{ role: "user", content: input }] }) });
      const d = await r.json(); const txt = d.content?.map(c => c.text || "").join("") || "";
      const p = JSON.parse(txt.replace(/```json|```/g, "").trim());
      if (p.action === "add") { const ni = { ...p.data, id: uid(), sku: mkSku(p.data.category), status: autoSt(p.data.qty, p.data.minStock), createdBy: user.id, createdAt: now(), updatedAt: now(), tags: p.data.tags || [] }; setItems(pr => [ni, ...pr]); log("ai_add", ni.id, `AI: ${ni.name}`); notify("AI added item"); }
      else if (p.action === "update") { const t = items.find(i => i.sku === p.sku); if (t) { setItems(pr => pr.map(e => e.sku === p.sku ? { ...e, ...p.data, updatedAt: now() } : e)); log("ai_upd", t.id, `AI: ${t.name}`); notify(`Updated ${t.name}`); } else notify("Not found", "err"); }
      else if (p.action === "search") { setQ(p.query); notify("Search set", "info"); }
      else if (p.action === "report") { notify(p.text, "info"); }
    } catch { notify("AI error", "err"); }
    setAiLoad(false); setCmdOpen(false); setCmdQ("");
  };

  const filtered = useMemo(() => {
    let r = items;
    if (q) { const s = q.toLowerCase(); r = r.filter(e => e.name.toLowerCase().includes(s) || e.sku.toLowerCase().includes(s) || e.tags?.some(t => t.toLowerCase().includes(s))); }
    if (fCat !== "all") r = r.filter(e => e.category === fCat);
    if (fStat !== "all") r = r.filter(e => e.status === fStat);
    if (fLoc !== "all") r = r.filter(e => e.location === fLoc);
    r.sort((a, b) => { let va = a[sortK], vb = b[sortK]; if (typeof va === "string") return sortD === "asc" ? va.localeCompare(vb) : vb.localeCompare(va); return sortD === "asc" ? (va || 0) - (vb || 0) : (vb || 0) - (va || 0); });
    return r;
  }, [items, q, fCat, fStat, fLoc, sortK, sortD]);

  const stats = useMemo(() => ({
    total: items.length, units: items.reduce((a, b) => a + b.qty, 0),
    value: items.reduce((a, b) => a + b.qty * b.price, 0),
    low: items.filter(e => e.status === "low").length,
    margin: items.reduce((a, b) => a + b.qty * (b.price - b.cost), 0),
  }), [items]);

  // ── LOGIN ──
  if (!user) return <LoginScreen onLogin={(u) => { setUser(u); notify("Welcome, " + u.name); }} />;

  // ── DETAIL PANEL ──
  const DetailPane = () => {
    if (!sel) return null;
    const it = items.find(e => e.id === sel.id) || sel;
    const cat = CATS.find(c => c.id === it.category); const sup = SUPS.find(s => s.id === it.supplier); const cr = USERS_DB.find(u => u.id === it.createdBy);
    const pct = it.maxStock ? Math.min((it.qty / it.maxStock) * 100, 100) : 50;
    const row = (l, v) => <div style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #1a1a1a" }}><span style={{ color: "#777", fontSize: 12 }}>{l}</span><span style={{ color: "#ddd", fontSize: 12, fontWeight: 500 }}>{v}</span></div>;
    return (
      <div style={{ position: "fixed", top: 0, right: 0, bottom: 0, width: 380, background: "#111", borderLeft: "1px solid #222", zIndex: 800, overflow: "auto", animation: "fi .15s ease" }}>
        <div style={{ padding: "16px 18px", borderBottom: "1px solid #1e1e1e", display: "flex", justifyContent: "space-between", alignItems: "center", position: "sticky", top: 0, background: "#111", zIndex: 1 }}>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}><span style={{ fontSize: 16 }}>{cat?.icon}</span>{it.name}</span>
          <div style={{ display: "flex", gap: 4 }}>
            {can("write") && <button onClick={() => { setSel(null); setEditId(it.id); setEditData(it); }} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: 5, cursor: "pointer", color: "#aaa", display: "flex" }}><Edit3 size={13} /></button>}
            <button onClick={() => setSel(null)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", padding: 0, display: "flex" }}><X size={16} /></button>
          </div>
        </div>
        <div style={{ padding: "14px 18px" }}>
          <div style={{ display: "flex", gap: 5, marginBottom: 16 }}>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: "#1e1e1e", color: "#999", fontFamily: "monospace", fontWeight: 500, border: "1px solid #2a2a2a" }}>{it.sku}</span>
            <span onClick={() => can("write") && cycleStatus(it.id)} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: ST[it.status]?.c + "15", color: ST[it.status]?.c, fontWeight: 500, cursor: can("write") ? "pointer" : "default", display: "flex", alignItems: "center", gap: 3 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: ST[it.status]?.dot }} />{ST[it.status]?.l}
            </span>
            <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: cat?.color + "15", color: cat?.color, fontWeight: 500 }}>{cat?.label}</span>
          </div>
          {it.desc && <p style={{ color: "#999", fontSize: 12, margin: "0 0 16px", lineHeight: 1.6 }}>{it.desc}</p>}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}><span style={{ color: "#777", fontSize: 11 }}>Stock Level</span><span style={{ color: "#ddd", fontSize: 11, fontWeight: 600 }}>{it.qty} / {it.maxStock}</span></div>
            <div style={{ height: 4, borderRadius: 2, background: "#1e1e1e" }}>
              <div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: pct > 50 ? "#22c55e" : pct > 20 ? "#eab308" : "#ef4444", transition: "width .3s" }} />
            </div>
          </div>
          {row("Sell Price", money(it.price))}{row("Unit Cost", money(it.cost))}{row("Margin/Unit", money(it.price - it.cost))}{row("Total Value", money(it.qty * it.price))}
          {row("Min Stock", it.minStock)}{row("Max Stock", it.maxStock)}{row("Location", it.location)}{row("Supplier", sup?.name || "—")}{row("Created By", cr?.name || "—")}
          {row("Last Updated", fmtD(it.updatedAt))}
          {it.tags?.length > 0 && <div style={{ marginTop: 12 }}><div style={{ fontSize: 10, color: "#777", marginBottom: 5, textTransform: "uppercase", letterSpacing: ".05em" }}>Tags</div><div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>{it.tags.map((t, i) => <span key={i} style={{ fontSize: 10, padding: "2px 6px", borderRadius: 4, background: "#1a1a1a", color: "#aaa", border: "1px solid #2a2a2a" }}>{t}</span>)}</div></div>}
          {can("delete") && <button onClick={() => delItem(it.id)} style={{ marginTop: 16, width: "100%", padding: "8px", borderRadius: 8, border: "1px solid #ef444430", background: "#ef444410", color: "#ef4444", fontSize: 12, cursor: "pointer", fontWeight: 500 }}>Delete Item</button>}
        </div>
      </div>
    );
  };

  // ── CMD PALETTE ──
  const CmdPalette = () => {
    if (!cmdOpen) return null;
    const suggestions = [
      { l: "Add 25 USB-C cables at $9.99", ic: Plus }, { l: "Show low stock items", ic: Search }, { l: "Update ELE-P3N2Q qty to 50", ic: Edit3 }, { l: "Generate restock report", ic: Activity },
    ];
    return (
      <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "15vh" }} onClick={() => setCmdOpen(false)}>
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" }} />
        <div onClick={e => e.stopPropagation()} style={{ width: 520, background: "#161616", border: "1px solid #2a2a2a", borderRadius: 12, overflow: "hidden", animation: "fi .15s ease", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 14px", borderBottom: "1px solid #222" }}>
            {aiLoad ? <RefreshCw size={15} color="#888" style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={15} color="#888" />}
            <input ref={cmdRef} autoFocus value={cmdQ} onChange={e => setCmdQ(e.target.value)} placeholder="Ask AI anything about your inventory..." onKeyDown={e => { if (e.key === "Enter" && cmdQ.trim()) aiExec(cmdQ); if (e.key === "Escape") setCmdOpen(false); }}
              style={{ flex: 1, background: "none", border: "none", color: "#eee", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            <span style={{ fontSize: 10, color: "#555", padding: "2px 6px", borderRadius: 4, border: "1px solid #333" }}>ESC</span>
          </div>
          <div style={{ padding: 8 }}>
            <div style={{ fontSize: 10, color: "#666", padding: "4px 8px", marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Suggestions</div>
            {suggestions.map((s, i) => (
              <div key={i} onClick={() => { setCmdQ(s.l); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 6, cursor: "pointer", transition: "background .1s" }}
                onMouseEnter={e => e.currentTarget.style.background = "#1e1e1e"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                <s.ic size={14} color="#666" /><span style={{ color: "#ccc", fontSize: 13 }}>{s.l}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: "8px 14px", borderTop: "1px solid #222", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#555", fontSize: 10 }}>Powered by Claude AI</span>
            <span style={{ color: "#555", fontSize: 10 }}>Enter to run</span>
          </div>
        </div>
      </div>
    );
  };

  // ── STATUS DOT ──
  const Dot = ({ status, clickable, id }) => (
    <span onClick={e => { if (clickable && can("write")) { e.stopPropagation(); cycleStatus(id); } }} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: ST[status]?.c, cursor: clickable && can("write") ? "pointer" : "default", fontWeight: 500 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: ST[status]?.dot }} />{ST[status]?.l}
    </span>
  );

  // ── TABLE VIEW ──
  const TableView = () => {
    const srt = (k) => { if (sortK === k) setSortD(d => d === "asc" ? "desc" : "asc"); else { setSortK(k); setSortD("asc"); } };
    const SI = ({ k: col }) => sortK === col ? (sortD === "asc" ? <ArrowUp size={9} /> : <ArrowDown size={9} />) : null;
    const allCk = filtered.length > 0 && filtered.every(i => checked.has(i.id));
    return (
      <div style={{ overflow: "auto", flex: 1 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead><tr style={{ borderBottom: "1px solid #222" }}>
            {can("write") && <th style={{ padding: "8px 10px", width: 32, textAlign: "center" }}><input type="checkbox" checked={allCk} onChange={() => setChecked(allCk ? new Set() : new Set(filtered.map(i => i.id)))} style={{ accentColor: "#fff" }} /></th>}
            {[{ k: "name", l: "Item", w: null }, { k: "sku", l: "SKU", w: 100 }, { k: "category", l: "Category", w: 100 }, { k: "qty", l: "Qty", w: 70, a: "right" }, { k: "price", l: "Price", w: 80, a: "right" }, { k: "status", l: "Status", w: 100 }, { k: "location", l: "Location", w: 110 }].map(c => (
              <th key={c.k} onClick={() => srt(c.k)} style={{ padding: "8px 10px", textAlign: c.a || "left", color: "#666", fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap", fontSize: 11, letterSpacing: ".03em", textTransform: "uppercase", width: c.w || "auto" }}>{c.l} <SI k={c.k} /></th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(it => {
              const cat = CATS.find(c => c.id === it.category); const ck = checked.has(it.id);
              const pct = it.maxStock ? Math.min((it.qty / it.maxStock) * 100, 100) : 50;
              return (
                <tr key={it.id} onClick={() => setSel(it)} style={{ borderBottom: "1px solid #1a1a1a", background: ck ? "#ffffff06" : sel?.id === it.id ? "#ffffff08" : "transparent", cursor: "pointer", transition: "background .08s" }}
                  onMouseEnter={e => e.currentTarget.style.background = ck ? "#ffffff0a" : sel?.id === it.id ? "#ffffff08" : "#ffffff04"} onMouseLeave={e => e.currentTarget.style.background = ck ? "#ffffff06" : sel?.id === it.id ? "#ffffff08" : "transparent"}>
                  {can("write") && <td style={{ padding: "9px 10px", textAlign: "center" }} onClick={e => e.stopPropagation()}><input type="checkbox" checked={ck} onChange={() => setChecked(p => { const n = new Set(p); n.has(it.id) ? n.delete(it.id) : n.add(it.id); return n; })} style={{ accentColor: "#fff" }} /></td>}
                  <td style={{ padding: "9px 10px" }}>
                    <div style={{ color: "#eee", fontWeight: 500, fontSize: 13 }}>{it.name}</div>
                    {it.tags?.length > 0 && <div style={{ display: "flex", gap: 3, marginTop: 3 }}>{it.tags.slice(0, 2).map((t, i) => <span key={i} style={{ fontSize: 9, padding: "0px 4px", borderRadius: 3, color: "#666", background: "#1a1a1a" }}>{t}</span>)}</div>}
                  </td>
                  <td style={{ padding: "9px 10px", color: "#888", fontFamily: "monospace", fontSize: 11 }}>{it.sku}</td>
                  <td style={{ padding: "9px 10px" }}><span style={{ display: "flex", alignItems: "center", gap: 4, color: "#aaa", fontSize: 12 }}><span>{cat?.icon}</span>{cat?.label}</span></td>
                  <td style={{ padding: "9px 10px", textAlign: "right" }}>
                    <span style={{ color: "#eee", fontWeight: 600 }}>{it.qty}</span>
                    <div style={{ width: 36, height: 2, borderRadius: 1, background: "#222", marginLeft: "auto", marginTop: 3 }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 1, background: pct > 50 ? "#22c55e" : pct > 20 ? "#eab308" : "#ef4444" }} /></div>
                  </td>
                  <td style={{ padding: "9px 10px", textAlign: "right", color: "#ddd", fontWeight: 500 }}>{money(it.price)}</td>
                  <td style={{ padding: "9px 10px" }} onClick={e => e.stopPropagation()}><Dot status={it.status} clickable id={it.id} /></td>
                  <td style={{ padding: "9px 10px", color: "#888", fontSize: 11 }}>{it.location}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtered.length && <div style={{ textAlign: "center", padding: 48, color: "#555" }}><Package size={28} style={{ marginBottom: 8, opacity: .3 }} /><p style={{ fontSize: 13, margin: 0 }}>No items match</p></div>}
      </div>
    );
  };

  // ── GRID VIEW ──
  const GridView = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 8, padding: "4px 0", overflow: "auto", flex: 1 }}>
      {filtered.map(it => { const cat = CATS.find(c => c.id === it.category); const pct = it.maxStock ? Math.min((it.qty / it.maxStock) * 100, 100) : 50; return (
        <div key={it.id} onClick={() => setSel(it)} style={{ background: "#161616", border: sel?.id === it.id ? "1px solid #444" : "1px solid #1e1e1e", borderRadius: 8, padding: 14, cursor: "pointer", transition: "all .12s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#333"} onMouseLeave={e => e.currentTarget.style.borderColor = sel?.id === it.id ? "#444" : "#1e1e1e"}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <span style={{ fontSize: 20 }}>{cat?.icon}</span>
            <Dot status={it.status} clickable id={it.id} />
          </div>
          <div style={{ color: "#eee", fontWeight: 600, fontSize: 13, marginBottom: 2 }}>{it.name}</div>
          <div style={{ color: "#666", fontSize: 10, fontFamily: "monospace", marginBottom: 8 }}>{it.sku}</div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div><div style={{ color: "#aaa", fontSize: 18, fontWeight: 700 }}>{it.qty}</div><div style={{ color: "#666", fontSize: 10 }}>units</div></div>
            <div style={{ textAlign: "right" }}><div style={{ color: "#ddd", fontSize: 13, fontWeight: 600 }}>{money(it.price)}</div><div style={{ color: "#555", fontSize: 10 }}>{it.location}</div></div>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: "#222", marginTop: 10 }}><div style={{ width: `${pct}%`, height: "100%", borderRadius: 2, background: pct > 50 ? "#22c55e" : pct > 20 ? "#eab308" : "#ef4444" }} /></div>
        </div>
      ); })}
    </div>
  );

  // ── KANBAN VIEW ──
  const KanbanView = () => {
    const cols = Object.entries(ST);
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols.length},1fr)`, gap: 10, overflow: "auto", flex: 1, alignItems: "flex-start" }}>
        {cols.map(([k, v]) => { const colItems = filtered.filter(i => i.status === k); return (
          <div key={k}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, padding: "0 4px" }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: v.dot }} /><span style={{ color: "#aaa", fontSize: 12, fontWeight: 600 }}>{v.l}</span>
              <span style={{ color: "#555", fontSize: 11, marginLeft: 2 }}>{colItems.length}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {colItems.map(it => { const cat = CATS.find(c => c.id === it.category); return (
                <div key={it.id} onClick={() => setSel(it)} style={{ background: "#161616", border: sel?.id === it.id ? "1px solid #444" : "1px solid #1e1e1e", borderRadius: 8, padding: 10, cursor: "pointer", transition: "all .1s" }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = "#333"} onMouseLeave={e => e.currentTarget.style.borderColor = sel?.id === it.id ? "#444" : "#1e1e1e"}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: 12 }}>{cat?.icon}</span>
                    <span style={{ color: "#ddd", fontSize: 12, fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{it.name}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: "#666", fontSize: 10, fontFamily: "monospace" }}>{it.sku}</span>
                    <span style={{ color: "#aaa", fontSize: 11, fontWeight: 600 }}>{it.qty} units</span>
                  </div>
                </div>
              ); })}
              {!colItems.length && <div style={{ padding: 20, textAlign: "center", color: "#333", fontSize: 11, border: "1px dashed #222", borderRadius: 8 }}>Empty</div>}
            </div>
          </div>
        ); })}
      </div>
    );
  };

  // ── ORDERS TAB ──
  const OrdersTab = () => {
    const oS = { pending: { c: "#eab308", l: "Pending" }, shipped: { c: "#3b82f6", l: "Shipped" }, delivered: { c: "#22c55e", l: "Delivered" }, cancelled: { c: "#71717a", l: "Cancelled" } };
    return (<div style={{ overflow: "auto", flex: 1, padding: "4px 0" }}>
      {orders.map(o => { const sup = SUPS.find(s => s.id === o.supplier); const cr = USERS_DB.find(u => u.id === o.createdBy); return (
        <div key={o.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 14px", borderBottom: "1px solid #1a1a1a", transition: "background .1s" }}
          onMouseEnter={e => e.currentTarget.style.background = "#ffffff04"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: (oS[o.status]?.c || "#555") + "15", display: "flex", alignItems: "center", justifyContent: "center" }}><ShoppingCart size={14} color={oS[o.status]?.c} /></div>
          <div style={{ flex: 1 }}>
            <div style={{ color: "#eee", fontSize: 13, fontWeight: 500 }}>PO-{o.id.slice(1)} <span style={{ color: "#666", fontWeight: 400 }}>· {sup?.name}</span></div>
            <div style={{ color: "#666", fontSize: 11 }}>{o.items.length} item{o.items.length > 1 ? "s" : ""} · {cr?.name} · {fmtD(o.date)}</div>
          </div>
          <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: oS[o.status]?.c + "15", color: oS[o.status]?.c, fontWeight: 500 }}>{oS[o.status]?.l}</span>
          <span style={{ color: "#ddd", fontWeight: 700, fontSize: 14, minWidth: 80, textAlign: "right" }}>{money(o.total)}</span>
          {can("manage_orders") && o.status === "pending" && <button onClick={() => setOrders(p => p.map(x => x.id === o.id ? { ...x, status: "shipped" } : x))} style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", borderRadius: 6, padding: "4px 8px", color: "#aaa", fontSize: 10, cursor: "pointer" }}>Ship</button>}
          {can("manage_orders") && o.status === "shipped" && <button onClick={() => setOrders(p => p.map(x => x.id === o.id ? { ...x, status: "delivered" } : x))} style={{ background: "#22c55e15", border: "1px solid #22c55e30", borderRadius: 6, padding: "4px 8px", color: "#22c55e", fontSize: 10, cursor: "pointer" }}>Deliver</button>}
        </div>
      ); })}
    </div>);
  };

  // ── TEAM TAB ──
  const TeamTab = () => (
    <div style={{ overflow: "auto", flex: 1, padding: "4px 0" }}>
      {USERS_DB.map(u => (
        <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", borderBottom: "1px solid #1a1a1a" }}>
          <div style={{ width: 34, height: 34, borderRadius: 8, background: u.av, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 14, fontWeight: 600 }}>{u.name[0]}</div>
          <div style={{ flex: 1 }}><div style={{ color: "#eee", fontSize: 13, fontWeight: 500 }}>{u.name}{u.id === user.id && <span style={{ color: "#555", fontSize: 10, marginLeft: 4 }}>(you)</span>}</div><div style={{ color: "#666", fontSize: 11 }}>{u.email}</div></div>
          <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 5, background: ROLES[u.role].c + "20", color: ROLES[u.role].c, fontWeight: 500 }}>{ROLES[u.role].l}</span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, maxWidth: 200 }}>{ROLES[u.role].perms.slice(0, 4).map(p => <span key={p} style={{ fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "#1a1a1a", color: "#666" }}>{p}</span>)}</div>
        </div>
      ))}
    </div>
  );

  // ── ORDER MODAL ──
  const OrderModalContent = () => (
    <div style={{ position: "fixed", inset: 0, zIndex: 1500, display: "flex", alignItems: "center", justifyContent: "center" }} onClick={() => setOrderModal(false)}>
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)" }} />
      <div onClick={e => e.stopPropagation()} style={{ width: 480, background: "#161616", border: "1px solid #2a2a2a", borderRadius: 12, padding: 22, position: "relative", animation: "fi .15s ease", maxHeight: "80vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <span style={{ color: "#fff", fontSize: 15, fontWeight: 600 }}>New Purchase Order</span>
          <button onClick={() => setOrderModal(false)} style={{ background: "none", border: "none", color: "#666", cursor: "pointer" }}><X size={16} /></button>
        </div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ fontSize: 10, color: "#888", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Supplier</div>
          <select value={oSup} onChange={e => setOSup(e.target.value)} style={{ width: "100%", padding: "7px 8px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none" }}>{SUPS.map(s => <option key={s.id} value={s.id} style={{ background: "#111" }}>{s.name}</option>)}</select>
        </div>
        <div style={{ fontSize: 10, color: "#888", fontWeight: 500, marginBottom: 6, textTransform: "uppercase", letterSpacing: ".05em" }}>Items</div>
        {oItems.map((oi, idx) => (
          <div key={idx} style={{ display: "flex", gap: 6, marginBottom: 6, alignItems: "center" }}>
            <select value={oi.itemId} onChange={e => setOItems(p => p.map((x, i) => i === idx ? { ...x, itemId: e.target.value } : x))} style={{ flex: 1, padding: "7px 8px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none" }}>{items.map(it => <option key={it.id} value={it.id} style={{ background: "#111" }}>[{it.sku}] {it.name}</option>)}</select>
            <input type="number" value={oi.qty} onChange={e => setOItems(p => p.map((x, i) => i === idx ? { ...x, qty: parseInt(e.target.value) || 0 } : x))} style={{ width: 60, padding: "7px 8px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
            {oItems.length > 1 && <button onClick={() => setOItems(p => p.filter((_, i) => i !== idx))} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}><X size={14} /></button>}
          </div>
        ))}
        <button onClick={() => setOItems(p => [...p, { itemId: items[0]?.id || "", qty: 10 }])} style={{ fontSize: 11, color: "#888", background: "none", border: "1px dashed #333", borderRadius: 6, padding: "5px 10px", cursor: "pointer", width: "100%", marginBottom: 12 }}>+ Add line item</button>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: "#888", fontWeight: 500, marginBottom: 4, textTransform: "uppercase", letterSpacing: ".05em" }}>Notes</div>
          <textarea value={oNotes} onChange={e => setONotes(e.target.value)} placeholder="Optional" rows={2} style={{ width: "100%", padding: "7px 8px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#ddd", fontSize: 12, outline: "none", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: "1px solid #222" }}>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 700 }}>{money(oItems.reduce((a, oi) => { const it = items.find(e => e.id === oi.itemId); return a + (it?.cost || 0) * oi.qty; }, 0))}</span>
          <button onClick={() => {
            const total = oItems.reduce((a, oi) => { const it = items.find(e => e.id === oi.itemId); return a + (it?.cost || 0) * oi.qty; }, 0);
            setOrders(p => [{ id: uid(), items: oItems, supplier: oSup, status: "pending", date: now(), total, createdBy: user.id, notes: oNotes }, ...p]);
            log("order", "", `PO ${money(total)}`); setOrderModal(false); setOItems([{ itemId: items[0]?.id || "", qty: 10 }]); setONotes(""); notify("Order placed");
          }} style={{ padding: "9px 20px", borderRadius: 8, border: "none", background: "#fff", color: "#111", fontSize: 12, cursor: "pointer", fontWeight: 600 }}>Place Order</button>
        </div>
      </div>
    </div>
  );

  // ═══════ RENDER ═══════
  const kpiBar = [
    { l: "Items", v: stats.total, c: "#3b82f6" }, { l: "Units", v: stats.units.toLocaleString(), c: "#14b8a6" }, { l: "Value", v: money(stats.value), c: "#22c55e" }, { l: "Low Stock", v: stats.low, c: stats.low > 0 ? "#eab308" : "#555" }, { l: "Margin", v: money(stats.margin), c: "#a855f7" }
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", width: "100vw", background: "#111", fontFamily: "'Inter',-apple-system,sans-serif", color: "#eee", overflow: "hidden", position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── TOP BAR ── */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 18px", borderBottom: "1px solid #1e1e1e", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}><Package size={14} color="#111" /></div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: "-.04em" }}>Nexus</span>
        </div>
        <div style={{ width: 1, height: 20, background: "#222", margin: "0 4px" }} />
        {[{ id: "items", l: "Inventory", ic: Package }, { id: "orders", l: "Orders", ic: ShoppingCart }, { id: "team", l: "Team", ic: Users }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 10px", borderRadius: 6, border: "none", background: tab === t.id ? "#ffffff10" : "transparent", color: tab === t.id ? "#eee" : "#666", fontSize: 12, fontWeight: 500, cursor: "pointer", transition: "all .12s" }}>
            <t.ic size={13} />{t.l}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        {can("ai") && <button onClick={() => { setCmdOpen(true); setCmdQ(""); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 7, border: "1px solid #2a2a2a", background: "#161616", color: "#888", fontSize: 12, cursor: "pointer", transition: "border-color .12s" }}
          onMouseEnter={e => e.currentTarget.style.borderColor = "#444"} onMouseLeave={e => e.currentTarget.style.borderColor = "#2a2a2a"}>
          <Sparkles size={12} />AI Command<span style={{ fontSize: 10, color: "#555", marginLeft: 6, padding: "0px 4px", borderRadius: 3, border: "1px solid #333" }}>⌘K</span>
        </button>}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginLeft: 6 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: user.av, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 600 }}>{user.name[0]}</div>
          <span style={{ color: "#aaa", fontSize: 12, fontWeight: 500 }}>{user.name}</span>
          <span style={{ fontSize: 9, padding: "1px 5px", borderRadius: 4, background: ROLES[user.role].c + "20", color: ROLES[user.role].c }}>{ROLES[user.role].l}</span>
        </div>
        <button onClick={() => { setUser(null); }} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", padding: 4, display: "flex" }}><LogOut size={14} /></button>
      </div>

      {/* ── KPI STRIP ── */}
      <div style={{ display: "flex", gap: 0, borderBottom: "1px solid #1e1e1e", flexShrink: 0 }}>
        {kpiBar.map((k, i) => (
          <div key={i} style={{ flex: 1, padding: "10px 18px", borderRight: i < kpiBar.length - 1 ? "1px solid #1e1e1e" : "none" }}>
            <div style={{ color: "#555", fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: ".05em", marginBottom: 2 }}>{k.l}</div>
            <div style={{ color: k.c, fontSize: 17, fontWeight: 700, letterSpacing: "-.02em" }}>{k.v}</div>
          </div>
        ))}
      </div>

      {tab === "items" && <>
        {/* ── TOOLBAR ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderBottom: "1px solid #1e1e1e", flexShrink: 0 }}>
          <div style={{ position: "relative", flex: "0 1 280px" }}>
            <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#555" }} />
            <input ref={searchRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Search items..." style={{ width: "100%", padding: "7px 10px 7px 32px", background: "#161616", border: "1px solid #2a2a2a", borderRadius: 7, color: "#ddd", fontSize: 12, outline: "none", boxSizing: "border-box" }}
              onFocus={e => e.target.style.borderColor = "#444"} onBlur={e => e.target.style.borderColor = "#2a2a2a"} />
          </div>
          <button onClick={() => setShowFilters(p => !p)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "6px 10px", borderRadius: 6, border: `1px solid ${showFilters ? "#444" : "#2a2a2a"}`, background: showFilters ? "#1e1e1e" : "transparent", color: showFilters ? "#ddd" : "#888", fontSize: 11, cursor: "pointer", fontWeight: 500 }}><Filter size={12} />Filters{(fCat !== "all" || fStat !== "all" || fLoc !== "all") && <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#3b82f6" }} />}</button>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", border: "1px solid #2a2a2a", borderRadius: 7, overflow: "hidden" }}>
            {[{ m: "table", ic: List }, { m: "grid", ic: LayoutGrid }, { m: "kanban", ic: Columns }].map(v => (
              <button key={v.m} onClick={() => setMode(v.m)} style={{ padding: "5px 8px", background: mode === v.m ? "#2a2a2a" : "transparent", border: "none", color: mode === v.m ? "#ddd" : "#666", cursor: "pointer", display: "flex" }}><v.ic size={14} /></button>
            ))}
          </div>
          {checked.size > 0 && can("write") && <>
            <div style={{ width: 1, height: 18, background: "#333" }} />
            <span style={{ color: "#888", fontSize: 11 }}>{checked.size} sel</span>
            <button onClick={() => bulkSt("instock")} style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #2a2a2a", background: "transparent", color: "#aaa", fontSize: 10, cursor: "pointer" }}>In Stock</button>
            <button onClick={() => bulkSt("ordered")} style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #2a2a2a", background: "transparent", color: "#aaa", fontSize: 10, cursor: "pointer" }}>Ordered</button>
            {can("delete") && <button onClick={bulkDel} style={{ padding: "4px 8px", borderRadius: 5, border: "1px solid #ef444430", background: "#ef444410", color: "#ef4444", fontSize: 10, cursor: "pointer" }}>Delete</button>}
            <button onClick={() => setChecked(new Set())} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: 10 }}>Clear</button>
          </>}
          <div style={{ width: 1, height: 18, background: "#333" }} />
          {can("export") && <button onClick={exportCSV} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 8px", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: "#888", fontSize: 11, cursor: "pointer" }}><Download size={12} />CSV</button>}
          {can("manage_orders") && <button onClick={() => setOrderModal(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 8px", borderRadius: 6, border: "1px solid #2a2a2a", background: "transparent", color: "#888", fontSize: 11, cursor: "pointer" }}><ShoppingCart size={12} />Order</button>}
          {can("write") && <button onClick={() => { setEditId("new"); setEditData(null); }} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: "#fff", color: "#111", fontSize: 11, cursor: "pointer", fontWeight: 600 }}><Plus size={13} />Add Item</button>}
        </div>

        {/* ── FILTER ROW ── */}
        {showFilters && <div style={{ display: "flex", gap: 8, padding: "8px 18px", borderBottom: "1px solid #1e1e1e", flexShrink: 0, background: "#161616" }}>
          <select value={fCat} onChange={e => setFCat(e.target.value)} style={{ padding: "5px 8px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#aaa", fontSize: 11, outline: "none" }}><option value="all" style={{ background: "#111" }}>All Categories</option>{CATS.map(c => <option key={c.id} value={c.id} style={{ background: "#111" }}>{c.icon} {c.label}</option>)}</select>
          <select value={fStat} onChange={e => setFStat(e.target.value)} style={{ padding: "5px 8px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#aaa", fontSize: 11, outline: "none" }}><option value="all" style={{ background: "#111" }}>All Status</option>{Object.entries(ST).map(([k, v]) => <option key={k} value={k} style={{ background: "#111" }}>{v.l}</option>)}</select>
          <select value={fLoc} onChange={e => setFLoc(e.target.value)} style={{ padding: "5px 8px", background: "#111", border: "1px solid #2a2a2a", borderRadius: 6, color: "#aaa", fontSize: 11, outline: "none" }}><option value="all" style={{ background: "#111" }}>All Locations</option>{LOCS.map(l => <option key={l} value={l} style={{ background: "#111" }}>{l}</option>)}</select>
          {(fCat !== "all" || fStat !== "all" || fLoc !== "all") && <button onClick={() => { setFCat("all"); setFStat("all"); setFLoc("all"); }} style={{ background: "none", border: "none", color: "#888", fontSize: 11, cursor: "pointer" }}>Clear filters</button>}
        </div>}

        {/* ── CONTENT ── */}
        <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", padding: mode === "table" ? 0 : "12px 18px" }}>
          {mode === "table" && TableView()}
          {mode === "grid" && GridView()}
          {mode === "kanban" && KanbanView()}
        </div>
      </>}

      {tab === "orders" && <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 18px", borderBottom: "1px solid #1e1e1e" }}>
          <span style={{ color: "#888", fontSize: 12 }}>{orders.length} orders</span>
          {can("manage_orders") && <button onClick={() => setOrderModal(true)} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 10px", borderRadius: 7, border: "none", background: "#fff", color: "#111", fontSize: 11, cursor: "pointer", fontWeight: 600 }}><Plus size={13} />New Order</button>}
        </div>
        {OrdersTab()}
      </div>}

      {tab === "team" && <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 18px", borderBottom: "1px solid #1e1e1e" }}><span style={{ color: "#888", fontSize: 12 }}>{USERS_DB.length} members</span></div>
        {TeamTab()}
      </div>}

      {/* ── BOTTOM BAR ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 18px", borderTop: "1px solid #1e1e1e", flexShrink: 0, background: "#0e0e0e" }}>
        <span style={{ color: "#444", fontSize: 10 }}>{filtered.length} items · {stats.low > 0 && <span style={{ color: "#eab308" }}>{stats.low} low stock</span>}</span>
        <span style={{ color: "#444", fontSize: 10 }}>Nexus v3 · {ROLES[user.role].l}</span>
      </div>

      {/* PANELS */}
      {sel && !editId && DetailPane()}
      {editId && <EditPane editId={editId} editData={editData} onSave={saveItem} onClose={() => { setEditId(null); setEditData(null); }} />}
      {cmdOpen && CmdPalette()}
      {orderModal && OrderModalContent()}

      {/* TOAST */}
      {toast && <div style={{ position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)", zIndex: 3000, padding: "8px 16px", borderRadius: 8, background: "#1e1e1e", border: "1px solid #333", color: "#ddd", fontSize: 12, display: "flex", alignItems: "center", gap: 6, animation: "fi .15s ease" }}>
        {toast.t === "ok" ? <Check size={13} color="#22c55e" /> : toast.t === "err" ? <X size={13} color="#ef4444" /> : <Activity size={13} color="#3b82f6" />}
        {toast.m}
      </div>}
    </div>
  );
}