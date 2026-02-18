import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { section, year, data, password } = req.body;

  if (password !== 'Dimple@123') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (!section || !data || !year) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const sectionName = section.toLowerCase();
    let filename;

    if (year === '3') {
      const cleanSection = sectionName.toLowerCase().replace(/\s+/g, '');
      // Keep original names for 3rd year to avoid breaking current app
      filename = cleanSection === 'csd' ? 'csdattedn.json' : `${cleanSection}attend.json`;
    } else {
      // New format for 2nd year: replace spaces with underscores (e.g., "cse a" -> "cse_a")
      const cleanSection = sectionName.replace(/\s+/g, '_');
      filename = `${year}nd_${cleanSection}attend.json`;
    }

    // 🚀 Dual-Mode Sync: GitHub API (Vercel) vs Filesystem (Local)

    // Check for GitHub Token (Production Mode)
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
    const REPO_OWNER = 'varuntejreddy03';
    const REPO_NAME = 'kmcecscattend';
    const BRANCH = 'main';

    if (GITHUB_TOKEN) {
      // 🌐 GitHub API Strategy
      const statusUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/${filename}`;

      // 1. Get current SHA
      const getRes = await fetch(statusUrl, {
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });

      let sha = null;
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // 2. Commit Update
      const content = Buffer.from(JSON.stringify(data, null, 4)).toString('base64');
      const putRes = await fetch(statusUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `🤖 Auto-Sync: Updated ${year}nd Year - ${section}`,
          content: content,
          sha: sha, // Include SHA if file exists
          branch: BRANCH
        })
      });

      if (!putRes.ok) {
        const err = await putRes.json();
        throw new Error(`GitHub Sync Failed: ${err.message}`);
      }

      // Also update last-update.json on GitHub
      const updateUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/last-update.json`;
      const updateInfo = {
        timestamp: new Date().toISOString(),
        section: section,
        year: year
      };

      const getUpdateRes = await fetch(updateUrl, {
        headers: { 'Authorization': `token ${GITHUB_TOKEN}` }
      });
      let updateSha = null;
      if (getUpdateRes.ok) {
        const d = await getUpdateRes.json();
        updateSha = d.sha;
      }

      await fetch(updateUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${GITHUB_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `🕒 Timestamp Update`,
          content: Buffer.from(JSON.stringify(updateInfo, null, 2)).toString('base64'),
          sha: updateSha,
          branch: BRANCH
        })
      });

      return res.status(200).json({
        message: `✅ GitHub Cloud Sync Active! Vercel will redeploy in ~60s.`,
        lastUpdated: updateInfo.timestamp,
        mode: 'cloud'
      });

    } else {
      // 💻 Local Filesystem Strategy
      const filePath = path.join(process.cwd(), 'public', filename);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

      // Update last-sync timestamp local
      const lastUpdatePath = path.join(process.cwd(), 'public', 'last-update.json');
      const updateInfo = {
        timestamp: new Date().toISOString(),
        section: section,
        year: year
      };
      fs.writeFileSync(lastUpdatePath, JSON.stringify(updateInfo, null, 2));

      return res.status(200).json({
        message: `✅ Local Sync Complete: ${filename}`,
        lastUpdated: updateInfo.timestamp,
        mode: 'local'
      });
    }
  } catch (error) {
    console.error('Sync Error:', error);
    return res.status(500).json({ message: 'Sync Protocol Failed', error: error.message });
  }
}
