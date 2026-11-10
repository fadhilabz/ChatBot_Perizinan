export const PAGE_CSS = `
.pg-hero{background:linear-gradient(135deg,#12365c,#1f5a94);color:#fff;border-radius:16px;padding:24px;margin-bottom:16px}
.pg-hero h2{margin:0 0 6px;font-size:24px;display:flex;align-items:center;gap:10px}
.pg-hero p{margin:0;opacity:.92;line-height:1.5}
.pg-tools{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:12px}
.pg-search{flex:1;min-width:200px;padding:11px 14px;border:1px solid #d0d7e2;border-radius:10px;font-size:15px;background:#fff;box-sizing:border-box}
.pg-tabs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}
.pg-tab{border:1px solid #d5e3f3;background:#fff;color:#12365c;border-radius:999px;padding:7px 14px;font-size:14px;cursor:pointer}
.pg-tab.on{background:#12365c;color:#fff;border-color:#12365c}
.pg-list{display:grid;gap:12px}
.pg-card{background:#fff;border:1px solid #e3e8ef;border-radius:14px;padding:16px 18px}
.pg-card.pinned{border-color:#f5c26b;background:#fffaf0}
.pg-card h3{margin:8px 0 6px;font-size:17px}
.pg-card p{margin:0;font-size:15px;line-height:1.6;white-space:pre-line;color:#344054}
.pg-row{display:flex;gap:10px;align-items:center;flex-wrap:wrap}
.pg-badge{display:inline-block;font-size:12px;font-weight:600;padding:3px 10px;border-radius:999px;background:#e8f0fa;color:#12365c}
.pg-badge.k-libur,.pg-badge.k-penting{background:#fde8e8;color:#9b1c1c}
.pg-badge.k-jam{background:#fff1cc;color:#8a5a00}
.pg-badge.k-ok{background:#e7f6ee;color:#146c43}
.pg-badge.k-abu{background:#eef0f3;color:#475467}
.pg-pin{display:inline-flex;align-items:center;gap:4px;font-size:12.5px;color:#8a5a00;font-weight:600}
.pg-date{font-size:13px;color:#667085;display:inline-flex;align-items:center;gap:5px}
.pg-until{margin-top:10px}
.pg-empty{background:#fff;border:1px dashed #cdd5df;border-radius:14px;padding:28px;text-align:center;color:#667085}
.pg-file{display:flex;gap:14px;align-items:center}
.pg-file .ic{width:46px;height:46px;border-radius:12px;background:#e8f0fa;color:#12365c;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.pg-file .tx{flex:1;min-width:0}
.pg-file h3{margin:6px 0 4px}
.pg-file p{font-size:14px}
.pg-btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;background:#12365c;color:#fff;border:0;border-radius:10px;padding:9px 15px;font-size:14px;font-weight:600;cursor:pointer;text-decoration:none;white-space:nowrap}
.pg-btn:hover:not(:disabled){background:#1a4a7a}
.pg-btn.ghost{background:#fff;color:#12365c;border:1px solid #d5e3f3}
.pg-btn.danger{background:#b42318}
.pg-btn.sm{padding:6px 10px;font-size:13px}
.pg-btn:disabled{opacity:.55;cursor:not-allowed}
.pg-form{display:grid;gap:10px}
.pg-form label{font-size:13px;font-weight:600;color:#344054;display:grid;gap:5px}
.pg-form input,.pg-form select,.pg-form textarea{padding:10px 12px;border:1px solid #d0d7e2;border-radius:10px;font:inherit;font-size:15px;background:#fff;box-sizing:border-box;width:100%}
.pg-form textarea{min-height:120px;resize:vertical}
.pg-form .chk{display:flex;align-items:center;gap:8px;font-weight:500}
.pg-form .chk input{width:auto}
.pg-grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.pg-msg{padding:10px 12px;border-radius:10px;font-size:14px;margin-bottom:10px}
.pg-msg.ok{background:#e7f6ee;color:#146c43;border:1px solid #bfe5d0}
.pg-msg.err{background:#fde8e8;color:#9b1c1c;border:1px solid #f5c2c2}
.pg-admin{display:grid;grid-template-columns:minmax(0,390px) minmax(0,1fr);gap:16px;align-items:start}
.pg-admin h3{margin:0 0 12px;font-size:16px}
.pg-bar{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
.pg-bar .sp{margin-left:auto}
.pg-item{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;padding:12px 0;border-bottom:1px solid #eef0f3}
.pg-item:last-child{border-bottom:0}
.pg-item b{display:block;margin:4px 0 2px}
.pg-item .acts{display:flex;gap:6px;flex-shrink:0}
@media(max-width:860px){.pg-admin{grid-template-columns:1fr}}
@media(max-width:560px){.pg-grid2{grid-template-columns:1fr}.pg-file{align-items:flex-start}}
`;
