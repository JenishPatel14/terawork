const express = require('express');
const axios = require('axios');
const path = require('path');
const FormData = require('form-data'); // Add form-data for multipart/form-data requests
const app = express();
const port = process.env.PORT || 3000;


// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Handle static routes
app.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact-us.html'));
});

app.get('/terms', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terms.html'));
});

app.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'privacy-policy.html'));
});

app.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about-us.html'));
});

app.get('/dmca', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dmca.html'));
});

app.get('/terabox-video-player', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'terabox-video-player.html'));
});

app.get('/ping', (req, res) => {
    res.status(200).send('OK');
  });
  
  app.use((req, res, next) => {
    const host = req.headers.host;
    if (host === 'terawork.onrender.com') {
      return res.redirect(301, 'https://teradownloader.site' + req.url);
    }
    next();
  });
  
// Middleware to parse JSON requests
app.use(express.json());

// Function to extract the share ID from a TeraBox URL
function extractShareIdFromUrl(url) {
  const regex = /(?:ww\.mirrobox\.com|www\.nephobox\.com|terafileshare\.com|freeterabox\.com|teraboxlinke\.com|www\.freeterabox\.com|1024tera\.com|4funbox\.co|www\.4funbox\.com|mirrobox\.com|nephobox\.com|terabox\.app|terabox\.com|www\.terabox\.ap|terabox\.fun|www\.terabox\.com|www\.1024tera\.co|www\.momerybox\.com|teraboxapp\.com|momerybox\.com|tibibox\.com|www\.tibibox\.com|www\.teraboxapp\.com|1024terabox\.com|terasharelink\.com)\/s\/([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

// Cloudflare bypass headers
function getCloudflareHeaders() {
  return {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Referer': 'https://taradownloader.com/',
    'Origin': 'https://taradownloader.com',
    'Sec-Fetch-Dest': 'empty',
    'Sec-Fetch-Mode': 'cors',
    'Sec-Fetch-Site': 'same-origin',
    'x-requested-with': 'XMLHttpRequest',
    'Cookie': '_ga=GA1.1.1752085603.1743828761; _lscache_vary=7493568aecb72699a9cf2af70b304c01; _clck=673cg0%7C2%7Cfv5%7C0%7C1921; _clsk=fwv2fd%7C1744882453722%7C2%7C1%7Cn.clarity.ms%2Fcollect; _ga_KL6QW8ZEBS=GS1.1.1744882428.10.1.1744882521.0.0.0'
  };
}

// Format file size
function formatFileSize(bytes) {
  if (!bytes || isNaN(bytes)) return 'Unknown size';
  const units = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}

// Get file extension safely
function getFileExtension(filename) {
  if (!filename) return 'unknown';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toLowerCase() : 'unknown';
}

// Function to get file information from TeraDownloader
async function getTeraDownloaderFileInfo(teraboxUrl) {
  const formData = new FormData();
  formData.append('action', 'terabox_action_slide');
  formData.append('code', 'download');
  formData.append('terabox', `terabox_video_url=${encodeURIComponent(teraboxUrl)}`);

  const response = await axios.post('https://taradownloader.com/wp-admin/admin-ajax.php', formData, {
    headers: {
      ...getCloudflareHeaders(),
      ...formData.getHeaders()
    }
  });

  if (!response.data.success) {
    throw new Error('Failed to fetch file info from TeraDownloader');
  }

  return JSON.parse(response.data.data);
}

// Function to get download link from TeraDownloader
async function getTeraDownloaderDownloadLink(fileData) {
  const { shareid, uk, sign, timestamp, list } = fileData;
  const fs_id = list[0].fs_id;

  const formData = new FormData();
  formData.append('action', 'terabox_action_slide');
  formData.append('code', 'get');
  formData.append('terabox', `fs_id=${fs_id}&shareid=${shareid}&sign=${sign}&timestamp=${timestamp}&uk=${uk}`);

  const response = await axios.post('https://taradownloader.com/wp-admin/admin-ajax.php', formData, {
    headers: {
      ...getCloudflareHeaders(),
      ...formData.getHeaders()
    }
  });

  if (!response.data.success) {
    throw new Error('Failed to fetch download link from TeraDownloader');
  }

  return JSON.parse(response.data.data).downloadLink;
}

// Function to get file information from existing API
async function getFileInfo(shareId) {
  const infoUrl = `https://terabox.hnn.workers.dev/api/get-info-new?shorturl=${shareId}&pwd=`;
  console.log("Fetching file info from:", infoUrl);

  const response = await axios.get(infoUrl, {
    headers: getCloudflareHeaders(),
    httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
  });

  return response.data;
}

// Function to get download links from existing API
async function getDownloadLinks(postData) {
  try {
    const [fastResponse, slowResponse] = await Promise.all([
      axios.post(`https://terabox.hnn.workers.dev/api/get-downloadp`, postData, {
        headers: { ...getCloudflareHeaders(), 'Content-Type': 'application/json' },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      }),
      axios.post(`https://terabox.hnn.workers.dev/api/get-download`, postData, {
        headers: { ...getCloudflareHeaders(), 'Content-Type': 'application/json' },
        httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
      })
    ]);

    return {
      fastLink: fastResponse.data.downloadLink || fastResponse.data.download_url,
      slowLink: slowResponse.data.downloadLink || slowResponse.data.download_url
    };
  } catch (error) {
    throw new Error(`Failed to get download links: ${error.message}`);
  }
}

// New endpoint to serve the video player page
app.get('/watch', (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) {
    return res.status(400).send('No video URL provided');
  }

  const htmlContent = `
      <html>
      <head>
          <title>Basic HTML5 Video Player</title>
      </head>
      <body>
      <video width="500" height="360" controls>
          <source src="${videoUrl}" type="video/mp4">
          Your browser does not support the video tag.
      </video>
      </body>
      </html>
  `;

  res.set('Content-Type', 'text/html');
  res.send(htmlContent);
});

// Modified main endpoint to include TeraDownloader link
app.post('/get-links', async (req, res) => {
  try {
    const { teraboxUrl } = req.body;
    if (!teraboxUrl) return res.status(400).json({ error: 'TeraBox URL is required' });

    // Extract share ID
    let shareId = teraboxUrl;
    if (teraboxUrl.startsWith('http')) {
      shareId = extractShareIdFromUrl(teraboxUrl);
      if (!shareId) throw new Error('Invalid TeraBox URL');
    }

    // Get file info from existing API
    const fileInfo = await getFileInfo(shareId);
    if (!fileInfo?.ok) throw new Error('Failed to get file information');
    if (!fileInfo.list || fileInfo.list.length === 0) throw new Error('No files found in the shared link');

    const { shareid, uk, sign, timestamp, list } = fileInfo;
    const file = list[0];
    const postData = { shareid, uk, sign, timestamp, fs_id: file.fs_id };

    // Get download links from existing API
    const { fastLink, slowLink } = await getDownloadLinks(postData);

    // Get TeraDownloader download link
    let teraDownloaderLink = null;
    try {
      const teraFileInfo = await getTeraDownloaderFileInfo(teraboxUrl);
      teraDownloaderLink = await getTeraDownloaderDownloadLink(teraFileInfo);
    } catch (error) {
      console.error('TeraDownloader API error:', error.message);
      // Continue without TeraDownloader link if it fails
    }

    // Build response with all download options
    const options = [
      {
        type: 'fast',
        label: 'Fast Download',
        description: 'Higher speed download',
        downloadLink: fastLink
      },

      {
        type: 'fast1',
        label: 'Fast Download 1',
        description: 'Higher speed download',
        downloadLink: teraDownloaderLink
      
    },

      {
        type: 'slow',
        label: 'Slow Download',
        description: 'Basic download option',
        downloadLink: slowLink
      },
    
      {
        type: 'watch',
        label: 'Watch Online',
        description: 'Terabox Online Video',
        downloadLink: `/terabox-video-player`
      }
    ];

    // Add TeraDownloader option if available
    

    res.json({
      originalUrl: teraboxUrl,
      fileName: file.filename || 'Unknown filename',
      fileSize: formatFileSize(file.size),
      fileType: getFileExtension(file.filename),
      options
    });

  } catch (error) {
    res.status(500).json({
      error: error.message,
      details: error.response?.data || 'Server error'
    });
  }
});

// Backward compatible GET endpoint
app.get('/get-link', async (req, res) => {
  try {
    let { id } = req.query;
    if (!id) return res.status(400).json({ error: 'No ID provided' });

    const fileInfo = await getFileInfo(id);
    if (!fileInfo?.ok) throw new Error('Failed to get file information');
    if (!fileInfo.list || fileInfo.list.length === 0) throw new Error('No files found');

    const { shareid, uk, sign, timestamp, list } = fileInfo;
    const file = list[0];
    const postData = { shareid, uk, sign, timestamp, fs_id: file.fs_id };

    const response = await axios.post(`https://terabox.hnn.workers.dev/api/get-downloadp`, postData, {
      headers: { ...getCloudflareHeaders(), 'Content-Type': 'application/json' },
      httpsAgent: new (require('https').Agent)({ rejectUnauthorized: false })
    });

    const downloadLink = response.data.downloadLink || response.data.download_url;
    if (!downloadLink) throw new Error('No download link found');

    res.json({
      ok: true,
      filename: file.filename || 'Unknown filename',
      size: formatFileSize(file.size),
      download_url: downloadLink,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Request failed',
      details: error.message
    });
  }
});
setInterval(() => {
    axios.get('https://teradownloader.site/ping')
      .then(() => console.log('Self-ping successful'))
      .catch(err => console.error('Self-ping failed:', err.message));
  }, 13.5 * 60 * 1000); // Every 4 minutes 
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });  
