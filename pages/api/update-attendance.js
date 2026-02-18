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

    const filePath = path.join(process.cwd(), 'public', filename);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    // Update last-sync timestamp
    const lastUpdatePath = path.join(process.cwd(), 'public', 'last-update.json');
    const updateInfo = {
      timestamp: new Date().toISOString(),
      section: section,
      year: year
    };
    fs.writeFileSync(lastUpdatePath, JSON.stringify(updateInfo, null, 2));

    return res.status(200).json({
      message: `Successfully updated Year ${year} - ${section} (${filename})`,
      lastUpdated: updateInfo.timestamp
    });
  } catch (error) {
    console.error('Error saving attendance data:', error);
    return res.status(500).json({ message: 'Internal server error', error: error.message });
  }
}
