(() => {
  const api = window.AURA_MENU_CONFIG?.apiBase || 'https://auradigital.ink/api/auramenu';
  const params = new URLSearchParams(location.search);
  const $ = id => document.getElementById(id);

  let menu = null;
  let token = '';
  let qr = null;
  let timer = null;

  const storageKey = id => `auraMenuDashboardToken:${id}`;
  const requestId = () => params.get('id') || localStorage.getItem('auraMenuLastRequest') || '';

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char]);
  }

  function msg(element, text, type = '') {
    element.textContent = text;
    element.className = `message ${type}`;
  }

  function formatMoney(value) {
    return new Intl.NumberFormat('tr-TR', { maximumFractionDigits: 0 }).format(Number(value || 0)) + ' TL';
  }

  function selectedDays() {
    return Math.max(1, Number($('accessDays')?.value || 1));
  }

  function updateAccessOffer() {
    if (!$('accessDays') || !$('requestAccess')) return;
    const days = selectedDays();
    const pricePerDay = Number(menu?.editAccess?.pricePerDay || 100);
    const amount = days * pricePerDay;
    $('requestAccess').textContent = `${days} gün düzenleme iste — ${formatMoney(amount)}`;
    if ($('accessPrice') && !(menu?.editAccess?.requestStatus === 'requested') && !menu?.editAccess?.active) {
      $('accessPrice').textContent = `Seçili süre: ${days} gün · ${formatMoney(amount)}`;
    }
  }

  async function request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    };
    if (token) headers['X-Aura-Menu-Token'] = token;

    const response = await fetch(`${api}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  }

  function renderQr() {
    const target = $('qrCode');
    target.innerHTML = '';
    if (typeof QRCode === 'undefined' || !menu) return;
    qr = new QRCode(target, {
      text: `https://auramenu.space/${menu.slug}`,
      width: 220,
      height: 220,
      colorDark: '#111111',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H,
    });
  }

  function downloadQr() {
    const source = $('qrCode').querySelector('canvas');
    if (!source) return;
    const canvas = document.createElement('canvas');
    canvas.width = 900;
    canvas.height = 1000;
    const context = canvas.getContext('2d');
    context.fillStyle = '#fff';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#111';
    context.textAlign = 'center';
    context.font = '700 46px Arial';
    context.fillText(menu.businessName || 'AuraMenu', 450, 90);
    context.font = '400 24px Arial';
    context.fillText('Menüyü Görüntüle', 450, 135);
    context.imageSmoothingEnabled = false;
    context.drawImage(source, 130, 190, 640, 640);
    context.imageSmoothingEnabled = true;
    context.font = '500 22px Arial';
    context.fillText(`auramenu.space/${menu.slug}`, 450, 900);

    const link = document.createElement('a');
    link.download = `${menu.slug}-qr.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function imagePreview(item) {
    return item.imageData || item.imageUrl || '';
  }

  function renderCategories() {
    const root = $('categories');
    root.innerHTML = '';

    menu.categories.forEach((category, categoryIndex) => {
      const element = document.createElement('div');
      element.className = 'category';
      element.innerHTML = `
        <div class="category-top">
          <input data-cat-emoji maxlength="12" value="${esc(category.emoji || '🍽️')}">
          <input data-cat-name maxlength="80" value="${esc(category.name)}">
          <button type="button" data-remove-cat>Sil</button>
        </div>
        <div class="items"></div>
        <button type="button" data-add-item>+ Ürün</button>
      `;

      const itemsRoot = element.querySelector('.items');

      category.items.forEach((item, itemIndex) => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        const image = imagePreview(item);

        itemElement.innerHTML = `
          <div class="item-top">
            <strong>Ürün ${itemIndex + 1}</strong>
            <button type="button" data-remove-item>Sil</button>
          </div>
          <div class="item-grid">
            <label>Ad<input data-name maxlength="100" value="${esc(item.name)}"></label>
            <label>Fiyat<input data-price maxlength="40" value="${esc(item.price || '')}"></label>
            <label class="full">Açıklama<textarea data-description maxlength="300">${esc(item.description || '')}</textarea></label>
            <label class="full"><input data-featured type="checkbox" ${item.featured ? 'checked' : ''}> Öne çıkan ürün</label>
          </div>
          <div class="photo-row">
            ${image ? `<img data-preview src="${esc(image)}" alt="">` : ''}
            <input data-photo type="file" accept="image/png,image/jpeg,image/webp">
            <span>Yeni fotoğraf seçebilirsiniz</span>
          </div>
        `;

        itemElement.querySelector('[data-name]').addEventListener('input', event => {
          item.name = event.target.value;
        });
        itemElement.querySelector('[data-price]').addEventListener('input', event => {
          item.price = event.target.value;
        });
        itemElement.querySelector('[data-description]').addEventListener('input', event => {
          item.description = event.target.value;
        });
        itemElement.querySelector('[data-featured]').addEventListener('change', event => {
          item.featured = event.target.checked;
        });
        itemElement.querySelector('[data-remove-item]').onclick = () => {
          category.items.splice(itemIndex, 1);
          renderCategories();
        };
        itemElement.querySelector('[data-photo]').addEventListener('change', async event => {
          const file = event.target.files?.[0];
          if (!file) return;
          try {
            item.imageData = await compress(file);
            renderCategories();
          } catch (error) {
            alert(error.message);
          }
        });

        itemsRoot.appendChild(itemElement);
      });

      element.querySelector('[data-cat-name]').addEventListener('input', event => {
        category.name = event.target.value;
      });
      element.querySelector('[data-cat-emoji]').addEventListener('input', event => {
        category.emoji = event.target.value;
      });
      element.querySelector('[data-remove-cat]').onclick = () => {
        menu.categories.splice(categoryIndex, 1);
        renderCategories();
      };
      element.querySelector('[data-add-item]').onclick = () => {
        category.items.push({
          name: '',
          price: '',
          description: '',
          imageUrl: '',
          imageData: '',
          featured: false,
        });
        renderCategories();
      };

      root.appendChild(element);
    });
  }

  async function compress(file) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      throw new Error('JPG, PNG veya WebP seçin.');
    }
    if (file.size > 12 * 1024 * 1024) throw new Error('Fotoğraf 12 MB altında olmalı.');

    const bitmap = await createImageBitmap(file);
    const max = 900;
    const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    for (const quality of [.82, .72, .62, .52]) {
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      if (blob && blob.size <= 280 * 1024) {
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result || ''));
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }
    }
    throw new Error('Fotoğraf küçültülemedi. Daha küçük fotoğraf seçin.');
  }

  function fill() {
    if (!menu) return;
    $('businessTitle').textContent = menu.businessName;
    $('menuUrl').textContent = `auramenu.space/${menu.slug}`;
    $('openMenu').href = `https://auramenu.space/${menu.slug}`;
    $('businessName').value = menu.businessName || '';
    $('templateId').value = menu.templateId || 'modern';
    $('tagline').value = menu.tagline || '';
    $('description').value = menu.description || '';
    $('address').value = menu.address || '';
    $('businessPhone').value = menu.businessPhone || '';
    $('whatsapp').value = menu.whatsapp || '';
    $('openingHours').value = menu.openingHours || '';
    $('menuLanguage').value = menu.menuLanguage || 'tr';
    $('currency').value = menu.currency || 'TRY';
    renderCategories();
    renderQr();
    renderAccess();
  }

  function renderAccess() {
    const access = menu.editAccess || {};
    const isActive = Boolean(access.active);
    const isRequested = access.requestStatus === 'requested';
    const pricePerDay = Number(access.pricePerDay || 100);

    $('editorFields').disabled = !isActive;
    $('saveMenu').disabled = !isActive;
    $('editBadge').textContent = isActive ? 'Editing active' : 'Editing locked';
    $('editBadge').classList.toggle('active', isActive);

    $('requestAccess').hidden = isActive || isRequested;
    $('accessDays').hidden = isActive || isRequested;

    if (isActive) {
      $('accessTitle').textContent = 'Düzenleme açık';
      $('accessText').textContent = 'Bu süre boyunca fiyat, ürün, fotoğraf ve işletme bilgilerini değiştirebilirsiniz.';
      $('accessPrice').textContent = `Ödeme: ${formatMoney(access.paidAmount || 0)}`;
    } else if (isRequested) {
      const days = Number(access.requestedDays || 1);
      const amount = Number(access.requestedAmount || days * pricePerDay);
      $('accessTitle').textContent = 'Erişim isteği gönderildi';
      $('accessText').textContent = 'AuraDigital ödeme onayından sonra seçtiğiniz süreyi hemen başlatacaktır.';
      $('accessPrice').textContent = `Bekleyen talep: ${days} gün · ${formatMoney(amount)}`;
      if ($('accessDays').querySelector(`option[value="${days}"]`)) $('accessDays').value = String(days);
    } else {
      $('accessTitle').textContent = 'Düzenleme kilitli';
      $('accessText').textContent = `1 gün = ${formatMoney(pricePerDay)}. Süreyi seçip erişim isteyin. Ödeme onaylandıktan sonra erişim açılır.`;
      updateAccessOffer();
    }

    clearInterval(timer);
    timer = null;

    if (isActive && access.accessUntil) {
      const update = () => {
        const left = Math.max(0, Date.parse(access.accessUntil) - Date.now());
        if (left <= 0) {
          clearInterval(timer);
          timer = null;
          menu.editAccess.active = false;
          menu.editAccess.requestStatus = 'none';
          menu.editAccess.accessUntil = null;
          menu.editAccess.paidAmount = 0;
          $('countdown').textContent = 'Süre doldu — düzenleme kilitlendi';
          $('editorFields').disabled = true;
          $('saveMenu').disabled = true;
          $('editBadge').textContent = 'Editing locked';
          $('editBadge').classList.remove('active');
          $('requestAccess').hidden = false;
          $('accessDays').hidden = false;
          $('accessTitle').textContent = 'Düzenleme kilitli';
          $('accessText').textContent = `1 gün = ${formatMoney(pricePerDay)}. Yeni erişim süresi seçebilirsiniz.`;
          updateAccessOffer();
          return;
        }
        const totalHours = Math.floor(left / 3600000);
        const days = Math.floor(totalHours / 24);
        const hours = totalHours % 24;
        const minutes = Math.floor((left % 3600000) / 60000);
        const seconds = Math.floor((left % 60000) / 1000);
        $('countdown').textContent = days > 0
          ? `${days}g ${hours}sa ${minutes}dk ${seconds}sn`
          : `${hours}sa ${minutes}dk ${seconds}sn`;
      };
      update();
      timer = setInterval(update, 1000);
    } else {
      $('countdown').textContent = '';
    }
  }

  async function claim() {
    const menuId = $('claimId').value.trim();
    if (!menuId) {
      msg($('claimMessage'), 'Request Number gerekli.', 'error');
      return;
    }

    try {
      const existing = localStorage.getItem(storageKey(menuId)) || '';
      const data = await request(`/dashboard/${encodeURIComponent(menuId)}/claim`, {
        method: 'POST',
        body: JSON.stringify({ existingToken: existing }),
      });
      token = data.token;
      localStorage.setItem(storageKey(menuId), token);
      menu = data.menu;
      params.set('id', menuId);
      history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
      show();
    } catch (error) {
      msg($('claimMessage'), error.message, 'error');
    }
  }

  async function restore() {
    const menuId = requestId();
    if (!menuId) return;
    $('claimId').value = menuId;
    token = localStorage.getItem(storageKey(menuId)) || '';
    if (!token) return;

    try {
      const data = await request(`/dashboard/${encodeURIComponent(menuId)}`);
      menu = data.menu;
      show();
    } catch {
      token = '';
      localStorage.removeItem(storageKey(menuId));
    }
  }

  function show() {
    $('claim').hidden = true;
    $('dashboard').hidden = false;
    fill();
  }

  async function accessRequest() {
    const days = selectedDays();
    const amount = days * Number(menu.editAccess?.pricePerDay || 100);
    try {
      const data = await request(`/dashboard/${encodeURIComponent(menu.id)}/access-request`, {
        method: 'POST',
        body: JSON.stringify({ days }),
      });
      menu = data.menu;
      renderAccess();
      alert(`Erişim isteği gönderildi: ${days} gün · ${formatMoney(amount)}. Ödeme onaylandığında süre başlayacak.`);
    } catch (error) {
      alert(error.message);
    }
  }

  async function save() {
    try {
      menu.businessName = $('businessName').value.trim();
      menu.templateId = $('templateId').value;
      menu.tagline = $('tagline').value.trim();
      menu.description = $('description').value.trim();
      menu.address = $('address').value.trim();
      menu.businessPhone = $('businessPhone').value.trim();
      menu.whatsapp = $('whatsapp').value.trim();
      menu.openingHours = $('openingHours').value.trim();
      menu.menuLanguage = $('menuLanguage').value;
      menu.currency = $('currency').value;

      const data = await request(`/dashboard/${encodeURIComponent(menu.id)}`, {
        method: 'PATCH',
        body: JSON.stringify(menu),
      });
      menu = data.menu;
      fill();
      msg($('saveMessage'), 'Menü güncellendi. Canlı menünüz yeni bilgilerle çalışıyor.', 'success');
    } catch (error) {
      msg($('saveMessage'), error.message, 'error');
    }
  }

  $('claimButton').onclick = claim;
  $('requestAccess').onclick = accessRequest;
  $('accessDays').addEventListener('change', updateAccessOffer);
  $('saveMenu').onclick = save;
  $('downloadQr').onclick = downloadQr;
  $('addCategory').onclick = () => {
    menu.categories.push({
      name: 'Yeni kategori',
      emoji: '🍽️',
      items: [{ name: 'Yeni ürün', price: '', description: '', imageUrl: '', imageData: '', featured: false }],
    });
    renderCategories();
  };

  restore();
})();
