const products=[
{id:1,name:"ผัดไทยกุ้ง",cat:"ไทย",price:159,emoji:"🍜",desc:"ผัดไทยเส้นจันท์กุ้งสด รสกลมกล่อม",country:"TH"},
{id:2,name:"ต้มยำกุ้ง",cat:"ไทย",price:189,emoji:"🍲",desc:"ต้มยำกุ้งน้ำข้น เครื่องสมุนไพรจัดเต็ม",country:"TH"},
{id:3,name:"Sushi Set",cat:"ญี่ปุ่น",price:299,emoji:"🍣",desc:"ซูชิรวม 10 คำ พร้อมโชยุและวาซาบิ",country:"JP"},
{id:4,name:"Ramen Tonkotsu",cat:"ญี่ปุ่น",price:239,emoji:"🍜",desc:"ราเมนซุปกระดูกหมูเข้มข้น เส้นสด",country:"JP"},
{id:5,name:"Korean Fried Chicken",cat:"เกาหลี",price:229,emoji:"🍗",desc:"ไก่ทอดเกาหลีซอสเผ็ดหวาน กรอบนอกนุ่มใน",country:"KR"},
{id:6,name:"Bibimbap",cat:"เกาหลี",price:199,emoji:"🍚",desc:"ข้าวยำเกาหลี เนื้อ ผัก และไข่ดาว",country:"KR"},
{id:7,name:"Truffle Cream Pasta",cat:"อิตาเลียน",price:289,emoji:"🍝",desc:"พาสตาครีมทรัฟเฟิล หอมละมุน",country:"IT"},
{id:8,name:"Margherita Pizza",cat:"อิตาเลียน",price:249,emoji:"🍕",desc:"พิซซ่ามะเขือเทศ มอซซาเรลลา โหระพา",country:"IT"},
{id:9,name:"Classic Burger",cat:"อเมริกัน",price:219,emoji:"🍔",desc:"เบอร์เกอร์เนื้อย่าง ชีส ผักสด และซอสสูตรร้าน",country:"US"},
{id:10,name:"BBQ Ribs",cat:"อเมริกัน",price:329,emoji:"🍖",desc:"ซี่โครงหมูอบซอสบาร์บีคิว เนื้อนุ่ม",country:"US"},
{id:11,name:"Matcha Latte",cat:"เครื่องดื่ม",price:99,emoji:"🍵",desc:"มัทฉะลาเต้เข้มข้น หวานกำลังดี",country:"JP"},
{id:12,name:"Strawberry Soda",cat:"เครื่องดื่ม",price:89,emoji:"🥤",desc:"สตรอว์เบอร์รีโซดา สดชื่น",country:"INT"}
];

let cart=JSON.parse(localStorage.getItem("gt_cart")||"[]");
let activeCat="ทั้งหมด";
let reviews=JSON.parse(localStorage.getItem("gt_reviews")||"[]");
let currentUser=JSON.parse(localStorage.getItem("gt_user")||"null");
let orders=JSON.parse(localStorage.getItem("gt_orders")||"[]");

const $=s=>document.querySelector(s);
const money=n=>"฿"+Number(n).toLocaleString("th-TH");
function save(){localStorage.setItem("gt_cart",JSON.stringify(cart));renderCart();}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2200)}
function openModal(id){$("#overlay").classList.add("show");$(id).classList.add("show")}
function closeAll(){document.querySelectorAll(".modal").forEach(x=>x.classList.remove("show"));$("#overlay").classList.remove("show")}
function renderCategories(){
 const cats=["ทั้งหมด",...new Set(products.map(p=>p.cat))];
 $("#categories").innerHTML=cats.map(c=>`<button class="category ${c===activeCat?"active":""}" data-cat="${c}">${c}</button>`).join("");
}
function renderProducts(){
 const q=$("#searchInput").value.toLowerCase();
 const list=products.filter(p=>(activeCat==="ทั้งหมด"||p.cat===activeCat)&&(`${p.name} ${p.desc}`.toLowerCase().includes(q)));
 $("#productGrid").innerHTML=list.length?list.map(p=>`
 <article class="product"><div class="food-image"><span class="country">${p.country}</span>${p.emoji}</div>
 <div class="product-body"><h3>${p.name}</h3><p>${p.desc}</p><div class="product-bottom"><span class="price">${money(p.price)}</span><button class="add" onclick="addCart(${p.id})">+</button></div></div></article>`).join(""):`<p>ไม่พบเมนูที่ค้นหา</p>`;
}
function addCart(id){const item=cart.find(x=>x.id===id);item?item.qty++:cart.push({id,qty:1});save();toast("เพิ่มอาหารลงตะกร้าแล้ว 🍽️")}
function renderCart(){
 const count=cart.reduce((s,x)=>s+x.qty,0);$("#cartCount").textContent=count;
 const items=cart.map(x=>({...products.find(p=>p.id===x.id),qty:x.qty}));
 $("#cartItems").innerHTML=items.length?items.map(p=>`<div class="cart-item"><div class="cart-icon">${p.emoji}</div><div><h4>${p.name}</h4><small>${money(p.price)}</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${p.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><b>${money(p.price*p.qty)}</b></div>`).join(""):`<div style="text-align:center;padding:50px 10px;color:#888">ตะกร้ายังว่างอยู่ 🛒<br><br>เลือกเมนูที่ชอบแล้วเพิ่มได้เลย</div>`;
 $("#cartTotal").textContent=money(items.reduce((s,p)=>s+p.price*p.qty,0));
}
function changeQty(id,d){const x=cart.find(i=>i.id===id);if(!x)return;x.qty+=d;if(x.qty<=0)cart=cart.filter(i=>i.id!==id);save()}
function openCart(){$("#cartDrawer").classList.add("open");$("#overlay").classList.add("show")}
function renderAccount(){
 if(currentUser){$("#accountContent").innerHTML=`<h2>สวัสดี ${currentUser.name} 👋</h2><p>คุณเข้าสู่ระบบแล้ว</p><div class="order-card"><b>อีเมล</b><br>${currentUser.email}</div><button class="btn primary full" onclick="logout()">ออกจากระบบ</button>`}
 else $("#accountContent").innerHTML=`<div class="tabs"><button class="active">เข้าสู่ระบบ</button><button>สมัครสมาชิก</button></div><h2>เข้าสู่ระบบ</h2><form onsubmit="login(event)"><input id="loginEmail" class="checkout-form" type="email" placeholder="อีเมล" required><input id="loginPass" class="checkout-form" type="password" placeholder="รหัสผ่าน" required><button class="btn primary full">เข้าสู่ระบบ</button></form><p style="font-size:12px;color:#888">Demo: ข้อมูลสมาชิกจะถูกเก็บไว้ในเครื่องนี้เท่านั้น</p>`}
function login(e){e.preventDefault();currentUser={name:$("#loginEmail").value.split("@")[0],email:$("#loginEmail").value};localStorage.setItem("gt_user",JSON.stringify(currentUser));renderAccount();toast("เข้าสู่ระบบสำเร็จ");}
function logout(){currentUser=null;localStorage.removeItem("gt_user");renderAccount();toast("ออกจากระบบแล้ว")}
function checkout(){
 if(!cart.length){toast("กรุณาเลือกอาหารก่อน");return}
 if(!currentUser){closeAll();openModal("#accountModal");toast("กรุณาเข้าสู่ระบบก่อนชำระเงิน");return}
 const items=cart.map(x=>({...products.find(p=>p.id===x.id),qty:x.qty}));
 const subtotal=items.reduce((s,p)=>s+p.price*p.qty,0),ship=subtotal>=599?0:39;
 $("#checkoutContent").innerHTML=`<div class="checkout-layout"><form class="checkout-form" onsubmit="placeOrder(event)">
 <h3>ข้อมูลจัดส่ง</h3><input id="address" required placeholder="ชื่อผู้รับ / บ้านเลขที่ / ถนน" value=""><input id="phone" required placeholder="เบอร์โทรศัพท์"><select id="payment"><option>เก็บเงินปลายทาง</option><option>โอนผ่านธนาคาร</option><option>บัตรเครดิต/เดบิต</option></select><textarea id="note" placeholder="หมายเหตุเพิ่มเติม" style="height:80px"></textarea><button class="btn primary full">ยืนยันคำสั่งซื้อ</button></form>
 <div class="checkout-summary"><h3>สรุปคำสั่งซื้อ</h3>${items.map(p=>`<div><span>${p.name} × ${p.qty}</span><span>${money(p.price*p.qty)}</span></div>`).join("")}<div><span>ค่าส่ง</span><span>${ship?money(ship):"ฟรี"}</span></div><div class="total"><span>ยอดชำระ</span><span>${money(subtotal+ship)}</span></div></div></div>`;
 openModal("#checkoutModal");
}
function placeOrder(e){e.preventDefault();const items=cart.map(x=>({...products.find(p=>p.id===x.id),qty:x.qty}));const subtotal=items.reduce((s,p)=>s+p.price*p.qty,0),ship=subtotal>=599?0:39;const order={id:"GT"+Date.now().toString().slice(-7),date:new Date().toLocaleString("th-TH"),items,total:subtotal+ship,address:$("#address").value,phone:$("#phone").value,payment:$("#payment").value,status:1};orders.unshift(order);localStorage.setItem("gt_orders",JSON.stringify(orders));cart=[];save();closeAll();showOrder(order.id);toast("สั่งอาหารสำเร็จ 🎉")}
function showOrder(id){const o=orders.find(x=>x.id===id);if(!o)return;$("#orderContent").innerHTML=`<h2>ติดตามคำสั่งซื้อ #${o.id}</h2><p>สั่งเมื่อ ${o.date}</p><div class="order-status">${["รับออเดอร์","กำลังทำ","กำลังจัดส่ง","จัดส่งแล้ว"].map((s,i)=>`<div class="status-step ${i<o.status?"done":""}"><i>${i<o.status?"✓":i+1}</i><small>${s}</small></div>`).join("")}</div><div class="order-card"><b>รายการอาหาร</b>${o.items.map(p=>`<div style="display:flex;justify-content:space-between;margin-top:8px"><span>${p.name} × ${p.qty}</span><span>${money(p.price*p.qty)}</span></div>`).join("")}<hr><b>ยอดรวม ${money(o.total)}</b></div><div class="order-card">📍 ${o.address}<br>📞 ${o.phone}<br>💳 ${o.payment}</div>`;openModal("#orderModal")}
function showOrders(){if(!orders.length){toast("ยังไม่มีประวัติการสั่งซื้อ");return}$("#orderContent").innerHTML=`<h2>ประวัติการสั่งซื้อ</h2>${orders.map(o=>`<div class="order-card"><b>#${o.id}</b> — ${o.date}<br>ยอด ${money(o.total)} <button class="btn light" onclick="showOrder('${o.id}')">ติดตาม</button></div>`).join("")}`;openModal("#orderModal")}
function renderReviews(){const base=[{name:"Nina",rating:5,text:"อาหารอร่อยมาก แพ็กมาดีและส่งเร็ว"},{name:"Mark",rating:5,text:"พาสตาทรัฟเฟิลหอมมาก คุ้มราคา"},{name:"Beam",rating:4,text:"เมนูเยอะดี รสชาติถูกปาก"}];const all=[...reviews,...base];$("#reviewGrid").innerHTML=all.slice(0,6).map(r=>`<div class="review"><div class="stars">${"★".repeat(r.rating)}${"☆".repeat(5-r.rating)}</div><p>“${r.text}”</p><strong>${r.name}</strong></div>`).join("")}
function submitReview(){const name=$("#reviewName").value.trim(),text=$("#reviewText").value.trim();if(!name||!text){toast("กรอกข้อมูลให้ครบ");return}reviews.unshift({name,rating:+$("#reviewRating").value,text});localStorage.setItem("gt_reviews",JSON.stringify(reviews));$("#reviewName").value="";$("#reviewText").value="";renderReviews();toast("ขอบคุณสำหรับรีวิว ⭐")}
function admin(){const revenue=orders.reduce((s,o)=>s+o.total,0);$("#orderContent").innerHTML=`<h2>🛠️ ระบบผู้ดูแลร้าน</h2><div class="admin-stat"><div><small>ยอดขาย</small><b>${money(revenue)}</b></div><div><small>ออเดอร์</small><b>${orders.length}</b></div><div><small>เมนู</small><b>${products.length}</b></div></div><h3>ออเดอร์ล่าสุด</h3><table class="admin-table"><tr><th>เลขที่</th><th>ยอด</th><th>สถานะ</th></tr>${orders.slice(0,8).map(o=>`<tr><td>${o.id}</td><td>${money(o.total)}</td><td><select onchange="setStatus('${o.id}',this.value)"><option value="1" ${o.status===1?"selected":""}>รับออเดอร์</option><option value="2" ${o.status===2?"selected":""}>กำลังทำ</option><option value="3" ${o.status===3?"selected":""}>กำลังจัดส่ง</option><option value="4" ${o.status===4?"selected":""}>จัดส่งแล้ว</option></select></td></tr>`).join("")}</table>`;openModal("#orderModal")}
function setStatus(id,status){const o=orders.find(x=>x.id===id);if(o){o.status=+status;localStorage.setItem("gt_orders",JSON.stringify(orders));toast("อัปเดตสถานะแล้ว")}}
document.addEventListener("click",e=>{
 if(e.target.matches("[data-cat]")){activeCat=e.target.dataset.cat;renderCategories();renderProducts()}
 if(e.target.matches("[data-close]")||e.target===document.querySelector("#overlay")){closeAll();$("#cartDrawer").classList.remove("open")}
 if(e.target.matches("[data-promo]")){navigator.clipboard?.writeText(e.target.dataset.promo);toast("คัดลอกโค้ด "+e.target.dataset.promo+" แล้ว")}
});
$("#searchInput").addEventListener("input",renderProducts);
$("#cartBtn").onclick=openCart;
$("#accountBtn").onclick=()=>{renderAccount();openModal("#accountModal")};
$("#checkoutBtn").onclick=checkout;
$("#reviewBtn").onclick=submitReview;
$("#trackLink").onclick=e=>{e.preventDefault();orders.length?showOrder(orders[0].id):toast("ยังไม่มีออเดอร์")};
$("#ordersLink").onclick=e=>{e.preventDefault();showOrders()};
$("#adminLink").onclick=e=>{e.preventDefault();admin()};
$("#contactForm").onsubmit=e=>{e.preventDefault();e.target.reset();toast("ส่งข้อความเรียบร้อย ขอบคุณครับ 💬")};
$("#menuToggle").onclick=()=>document.querySelector(".nav nav").classList.toggle("mobile");
renderCategories();renderProducts();renderCart();renderReviews();
