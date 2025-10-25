//บรรทัดนี้เหมือนกับการเริ่มต้นการสื่อสาร
console.log('[script.js] loaded');
// ฟังก์ชันคือชุดคำสั่งที่ทำงานเมื่อเราเรียกมัน async คือ ที่ต้องรอผล
async function loadProducts() {
  const grid = document.querySelector('.product-grid'); // หากล่องที่ชื่อว่า .product-grid
  if (!grid) {
    console.error('ไม่พบ .product-grid');
    return;
  }

  // สร้าง loader UI ชั่วคราว
  const loader = document.createElement('div');
  loader.textContent = 'Loading products...';
  loader.style.cssText = 'padding:12px;margin:8px 0;color:#555;';
  grid.before(loader);

  try {
    const res = await fetch('https://fakestoreapi.com/products', { cache: 'no-store' });
    console.log('[fetch] status', res.status);

    if (!res.ok) throw new Error('Fetch failed with status ' + res.status);

    const data = await res.json();
    console.log('[fetch] count', data.length);

    // ล้างการ์ดเดิมทิ้งก่อน (กันซ้ำ)
    grid.innerHTML = '';

    data.forEach(item => {
      const card = document.createElement('article');
      card.className = 'product';
      card.innerHTML = `
        <figure style="aspect-ratio:4/5;background:#f4f4f5;overflow:hidden;">
          <img src="${item.image}" alt="${escapeHtml(item.title)}" style="width:100%;height:100%;object-fit:cover;display:block;">
        </figure>
        <div class="product-info">
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.category)}</p>
          <div class="product-meta">
            <span class="price">${Number(item.price).toFixed(2)} $</span>
            <span class="category">${escapeHtml(item.category)}</span>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });

  } catch (err) {
    console.error('[fetch-error]', err);
    // แสดงข้อความผิดพลาดให้ผู้ใช้เห็น
    const errBox = document.createElement('div');
    errBox.textContent = 'โหลดสินค้าไม่สำเร็จ: ' + err.message;
    errBox.style.cssText = 'padding:12px;margin:8px 0;color:#b91c1c;background:#fee2e2;border:1px solid #fecaca;border-radius:8px;';
    grid.before(errBox);
  } finally {
    loader.remove(); // เอา loader ออกไม่ว่าผลจะเป็นยังไง
  }
}

// ป้องกันกรณีสคริปต์โหลดก่อน DOM พร้อม
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadProducts);
} else {
  loadProducts();
}

// ป้องกัน XSS เวลาฝัง text
function escapeHtml(str){
  return String(str)
    .replaceAll('&','&amp;')
    .replaceAll('<','&lt;')
    .replaceAll('>','&gt;')
    .replaceAll('"','&quot;')
    .replaceAll("'",'&#39;');
}
