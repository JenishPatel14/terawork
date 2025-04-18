const hamburger=document.getElementById("hamburger"),navMenu=document.getElementById("navMenu");hamburger.addEventListener("click",(()=>{navMenu.classList.toggle("active")})),document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("teraboxUrl"),t=document.getElementById("fetchBtn"),n=document.getElementById("loading"),a=document.getElementById("error"),o=document.getElementById("results");async function s(){const t=e.value.trim();if(t)if(s=t,[/^https?:\/\/(www\.)?ww\.terafileshare\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?ww\.teraboxlinke\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?ww\.mirrobox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?nephobox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?freeterabox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?1024tera\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?4funbox\.co\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?4funbox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?mirrobox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?terabox\.app\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?terabox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?terabox\.ap\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?terabox\.fun\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?1024tera\.co\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?momerybox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?teraboxapp\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?tibibox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?terasharelink\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?1024terabox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?freeterabox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?teraboxapp\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?tibibox\.com\/s\/[a-zA-Z0-9_-]+/,/^https?:\/\/(www\.)?terabox\.fun\/s\/[a-zA-Z0-9_-]+/,/^[a-zA-Z0-9_-]+$/].some((e=>e.test(s)))){var s;a.style.display="none",o.style.display="none",n.style.display="flex";try{const e=await fetch("/get-links",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({teraboxUrl:t})}),n=await e.json();if(!e.ok)throw new Error(n.error||"Failed to fetch download links");!function(e){if(o.innerHTML="",!e.options||0===e.options.length)return void l("No download links found. Please try again later.");const t=document.createElement("div");t.className="file-info-card",t.innerHTML=`\n                <h3>File Information</h3>\n                <p><strong>Name:</strong> ${e.fileName||"Unknown"}</p>\n                <p><strong>Size:</strong> ${e.fileSize||"Unknown"}</p>\n                <p><strong>Type:</strong> ${e.fileType||"Unknown"}</p>\n            `,o.appendChild(t),e.options.forEach(((e,t)=>{const n=document.createElement("div");n.className="result-card";const a=document.createElement("div");a.className="result-header";const s=document.createElement("div");s.className="result-title",s.innerHTML=`\n    <span>${e.label}</span>\n    <span class="badge badge-${t+1}">\n        ${"fast"===e.type?"Recommended":"fast1"===e.type?"optional":"slow"===e.type?"Alternative":"Stream"}\n    </span>\n`;const l=document.createElement("div");l.className="file-size",l.textContent=e.description,a.appendChild(s),n.appendChild(a),n.appendChild(l);const r=document.createElement("div");if(r.className="file-details","watch"===e.type){const e=document.createElement("a");e.className="view-btn",e.href="/terabox-player-online",e.target="_blank",e.innerHTML='<i class="fas fa-play"></i> Watch Online',r.appendChild(e)}else{const t=document.createElement("a");t.className="download-btn",t.href=e.downloadLink,t.target="_blank",t.innerHTML='<i class="fas fa-download"></i> Download Now',r.appendChild(t)}n.appendChild(r),o.appendChild(n)})),o.style.display="block"}(n)}catch(e){l(e.message)}finally{n.style.display="none"}}else l("Please enter a valid TeraBox URL. It should look like: https://teraboxapp.com/s/...");else l("Please enter a TeraBox URL")}function l(e){a.textContent=e,a.style.display="block",o.style.display="none"}t.addEventListener("click",s),e.addEventListener("keypress",(function(e){"Enter"===e.key&&s()}))})),document.addEventListener("DOMContentLoaded",(()=>{const e=document.querySelectorAll(".nav-menu a"),t=window.location.pathname.replace(/\.html$/,"");e.forEach((e=>{e.getAttribute("href").replace(/\.html$/,"")===t&&e.classList.add("active")}))}));