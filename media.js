
const DB_NAME='wilpattu_media_v1';
function openMediaDB(){return new Promise((ok,no)=>{const r=indexedDB.open(DB_NAME,1);r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('reviews'))d.createObjectStore('reviews',{keyPath:'id',autoIncrement:true});if(!d.objectStoreNames.contains('media'))d.createObjectStore('media',{keyPath:'id',autoIncrement:true})};r.onsuccess=()=>ok(r.result);r.onerror=()=>no(r.error)})}
function allMedia(store){return openMediaDB().then(d=>new Promise((ok,no)=>{const r=d.transaction(store,'readonly').objectStore(store).getAll();r.onsuccess=()=>ok(r.result||[]);r.onerror=()=>no(r.error)}))}
function putMedia(store,v){return openMediaDB().then(d=>new Promise((ok,no)=>{const t=d.transaction(store,'readwrite');t.objectStore(store).put(v);t.oncomplete=ok;t.onerror=()=>no(t.error)}))}
function delMedia(store,id){return openMediaDB().then(d=>new Promise((ok,no)=>{const t=d.transaction(store,'readwrite');t.objectStore(store).delete(id);t.oncomplete=ok;t.onerror=()=>no(t.error)}))}
function readFileData(file){return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=()=>no(r.error);r.readAsDataURL(file)})}
function safeText(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]))}
