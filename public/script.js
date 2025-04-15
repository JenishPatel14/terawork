const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
        document.addEventListener('DOMContentLoaded', function() {
        const teraboxUrlInput = document.getElementById('teraboxUrl');
        const fetchBtn = document.getElementById('fetchBtn');
        const loadingDiv = document.getElementById('loading');
        const errorDiv = document.getElementById('error');
        const resultsDiv = document.getElementById('results');
    
        fetchBtn.addEventListener('click', fetchDownloadLinks);
        teraboxUrlInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                fetchDownloadLinks();
            }
        });
    
        async function fetchDownloadLinks() {
            const teraboxUrl = teraboxUrlInput.value.trim();
            
            if (!teraboxUrl) {
                showError('Please enter a TeraBox URL');
                return;
            }
    
            // Validate URL format
            if (!isValidTeraboxUrl(teraboxUrl)) {
                showError('Please enter a valid TeraBox URL. It should look like: https://teraboxapp.com/s/...');
                return;
            }
    
            // Clear previous results and errors
            errorDiv.style.display = 'none';
            resultsDiv.style.display = 'none';
            loadingDiv.style.display = 'flex';
    
            try {
                const response = await fetch('/get-links', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ teraboxUrl })
                });
    
                const data = await response.json();
    
                if (response.ok) {
                    displayResults(data);
                } else {
                    throw new Error(data.error || 'Failed to fetch download links');
                }
            } catch (error) {
                showError(error.message);
            } finally {
                loadingDiv.style.display = 'none';
            }
        }
    
        function isValidTeraboxUrl(url) {
            const patterns = [
/^https?:\/\/(www\.)?ww\.terafileshare\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?ww\.teraboxlinke\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?ww\.mirrobox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?nephobox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?freeterabox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?1024tera\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?4funbox\.co\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?4funbox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?mirrobox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?terabox\.app\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?terabox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?terabox\.ap\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?terabox\.fun\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?1024tera\.co\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?momerybox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?teraboxapp\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?tibibox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?terasharelink\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?1024terabox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?freeterabox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?teraboxapp\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?tibibox\.com\/s\/[a-zA-Z0-9_-]+/,
/^https?:\/\/(www\.)?terabox\.fun\/s\/[a-zA-Z0-9_-]+/,
                /^[a-zA-Z0-9_-]+$/ // For just the ID
            ];
            
            return patterns.some(pattern => pattern.test(url));
        }
    
        function displayResults(data) {
            resultsDiv.innerHTML = '';
            
            if (!data.options || data.options.length === 0) {
                showError('No download links found. Please try again later.');
                return;
            }
    
            // File info section
            const fileInfoDiv = document.createElement('div');
            fileInfoDiv.className = 'file-info-card';
            fileInfoDiv.innerHTML = `
                <h3>File Information</h3>
                <p><strong>Name:</strong> ${data.fileName || 'Unknown'}</p>
                <p><strong>Size:</strong> ${data.fileSize || 'Unknown'}</p>
                <p><strong>Type:</strong> ${data.fileType || 'Unknown'}</p>
            `;
            resultsDiv.appendChild(fileInfoDiv);
    
            // Download options
            data.options.forEach((option, index) => {
                const card = document.createElement('div');
                card.className = 'result-card';
                
                const header = document.createElement('div');
                header.className = 'result-header';
                
                const title = document.createElement('div');
                title.className = 'result-title';
                title.innerHTML = `
                    <span>${option.label}</span>
                    <span class="badge badge-${index + 1}">${option.type === 'fast' ? 'Recommended' : option.type === 'slow' ? 'Alternative' : 'Stream' }</span>
                `;

                const description = document.createElement('div');
                description.className = 'file-size';
                description.textContent = option.description;
                
                header.appendChild(title);
                card.appendChild(header);
                card.appendChild(description);
                
                const actionDiv = document.createElement('div');
                actionDiv.className = 'file-details';
                
                if (option.type === 'stream') {
                    const viewLink = document.createElement('a');
                    viewLink.className = 'view-btn';
                    viewLink.href = option.viewLink;
                    viewLink.target = '_blank';
                    viewLink.innerHTML = '<i class="fas fa-play"></i> Watch Online';
                    actionDiv.appendChild(viewLink);
                } else {
                    const downloadLink = document.createElement('a');
                    downloadLink.className = 'download-btn';
                    downloadLink.href = option.downloadLink;
                    downloadLink.target = '_blank';
                    downloadLink.innerHTML = '<i class="fas fa-download"></i> Download Now';
                    actionDiv.appendChild(downloadLink);
                }
                
                card.appendChild(actionDiv);
                resultsDiv.appendChild(card);
            });
            
            resultsDiv.style.display = 'block';
        }
    
        function showError(message) {
            errorDiv.textContent = message;
            errorDiv.style.display = 'block';
            resultsDiv.style.display = 'none';
        }
    });

