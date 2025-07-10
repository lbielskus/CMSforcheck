import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Ensure tmp directory exists
    const tmpDir = './tmp';
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const form = formidable({
      uploadDir: tmpDir,
      keepExtensions: true,
      maxFileSize: 10 * 1024 * 1024, // 10MB limit
    });

    const [fields, files] = await form.parse(req);
    const uploadedFiles = Array.isArray(files.files)
      ? files.files
      : [files.files];

    let extractedTexts = [];

    // Process each file based on its type
    for (const file of uploadedFiles) {
      if (!file) continue;

      const filePath = file.filepath;
      const fileName = file.originalFilename;
      const extension = path.extname(fileName).toLowerCase();

      try {
        let text = '';

        switch (extension) {
          case '.docx':
          case '.doc':
            text = await extractFromWord(filePath);
            break;
          case '.txt':
            text = await extractFromText(filePath);
            break;
          default:
            console.log(
              `Unsupported file type: ${extension}. Supported: .docx (recommended), .doc (limited support), .txt`
            );
            continue;
        }

        if (text) {
          extractedTexts.push({
            fileName,
            content: text,
            fileType: extension,
          });
        }
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
        extractedTexts.push({
          fileName,
          content: `[Klaida apdorojant failą: ${error.message}]`,
          fileType: extension,
          error: true,
        });
      } finally {
        // Clean up temporary file
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
    }

    if (extractedTexts.length === 0) {
      return res.status(400).json({
        error:
          'Nepavyko apdoroti jokio failo. Palaikomi formatai: .docx (rekomenduojama), .doc (ribotas palaikymas), .txt',
      });
    }

    // Return extracted text for manual processing
    const result = {
      success: true,
      extractedTexts,
      suggestions: createSuggestions(extractedTexts),
    };

    res.status(200).json(result);
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Klaida apdorojant failus' });
  }
}

async function extractFromWord(filePath) {
  try {
    // First try mammoth for both .docx and .doc files
    const result = await mammoth.extractRawText({ path: filePath });
    const extractedText = result.value.trim();

    // If mammoth successfully extracted meaningful text, return it
    if (extractedText && extractedText.length > 100) {
      return extractedText;
    }

    // If mammoth didn't work well, try alternative approach for .doc files
    console.log('Mammoth extraction minimal, trying alternative approach...');
  } catch (mammothError) {
    console.log(
      'Mammoth failed, trying alternative extraction:',
      mammothError.message
    );
  }

  // Alternative approach: Try to extract text from .doc files manually
  try {
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      throw new Error('Failas tuščias');
    }

    // Read file as buffer
    const buffer = fs.readFileSync(filePath);

    // For .doc files, try to extract readable text
    // This is a simple approach - look for readable ASCII text in the binary
    let extractedText = '';

    // Convert buffer to string and try to find readable text patterns
    const bufferString = buffer.toString('binary');

    // Look for text patterns that are likely to be document content
    // .doc files store text in various formats, this tries to find readable portions
    const textMatches = bufferString.match(/[\x20-\x7E\s]{10,}/g);

    if (textMatches) {
      // Clean and combine the extracted text pieces
      extractedText = textMatches
        .map((match) => match.trim())
        .filter((text) => {
          // Filter out non-meaningful text (too short, too many special chars, etc.)
          if (text.length < 10) return false;

          // Check if text has reasonable ratio of letters to other characters
          const letterCount = (text.match(/[a-zA-ZąčęėįšųūžĄČĘĖĮŠŲŪŽ]/g) || [])
            .length;
          const totalCount = text.length;

          // Require at least 30% letters
          return letterCount / totalCount > 0.3;
        })
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // If we found some meaningful text, return it
    if (extractedText && extractedText.length > 50) {
      return `[Išgautas tekstas iš .doc failo] ${extractedText}`;
    }

    // If no meaningful text found, provide helpful instructions
    return `[.doc failas aptiktas] 
    
Nepavyko automatiškai išgauti teksto iš šio .doc failo. 

Rekomenduojami sprendimai:
1. Konvertuokite failą į .docx formatą naudodami Microsoft Word
2. Atidarykite failą Word programoje ir išsaugokite kaip .docx
3. Arba nukopijuokite tekstą ir įklijuokite į .txt failą

Palaikomi formatai: .docx (rekomenduojama), .doc (ribotas palaikymas), .txt

Failo dydis: ${Math.round(stats.size / 1024)}KB`;
  } catch (extractError) {
    console.error('Alternative extraction failed:', extractError);
    throw new Error(
      `Nepavyko apdoroti Word dokumento: ${extractError.message}`
    );
  }
}

async function extractFromDocx(filePath) {
  return await extractFromWord(filePath);
}

async function extractFromText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8').trim();
  } catch (error) {
    console.error('Error extracting from text file:', error);
    throw new Error('Nepavyko perskaityti teksto failo');
  }
}

function createSuggestions(extractedTexts) {
  const combinedText = extractedTexts
    .map((item) => item.content)
    .join('\n\n')
    .toLowerCase();

  const suggestions = {
    title: '',
    country: '',
    cities: '',
    duration: '',
    price: '',
    extractedText: extractedTexts[0]?.content || '',
    dayamount: 0,
    travelDays: [],
    shortDescription: '',
    includedinprice: [],
    excludedinprice: [],
  };

  // More comprehensive keyword extraction
  const lines = combinedText.split('\n').filter((line) => line.trim());

  // Title extraction - look for meaningful first lines or lines with "kelionė"
  for (const line of lines.slice(0, 10)) {
    const cleanLine = line.trim();
    if (cleanLine.length > 15 && cleanLine.length < 150) {
      // Look for lines that might be titles
      if (
        cleanLine.includes('kelion') ||
        cleanLine.includes('zakopin') ||
        cleanLine.includes('lenkij') ||
        cleanLine.includes('krakuv')
      ) {
        suggestions.title = capitalizeFirst(cleanLine);
        break;
      }
      // Fallback to first meaningful line
      if (!suggestions.title && cleanLine.length > 20) {
        suggestions.title = capitalizeFirst(cleanLine);
      }
    }
  }

  // Enhanced country detection
  const countryKeywords = {
    lenkij: 'Lenkija',
    poland: 'Lenkija',
    zakopin: 'Lenkija',
    krakuv: 'Lenkija',
    vokietij: 'Vokietija',
    germany: 'Vokietija',
    berlin: 'Vokietija',
    prancūzij: 'Prancūzija',
    france: 'Prancūzija',
    paris: 'Prancūzija',
    italij: 'Italija',
    italy: 'Italija',
    roma: 'Italija',
    milan: 'Italija',
    ispanij: 'Ispanija',
    spain: 'Ispanija',
    madrid: 'Ispanija',
    austrij: 'Austrija',
    austria: 'Austrija',
    wien: 'Austrija',
    čekij: 'Čekija',
    czech: 'Čekija',
    praha: 'Čekija',
  };

  for (const [keyword, country] of Object.entries(countryKeywords)) {
    if (combinedText.includes(keyword)) {
      suggestions.country = country;
      break;
    }
  }

  // Enhanced duration detection
  const durationPatterns = [
    /(\d+)\s*(?:dienų|dienos|dienomis|d\.|days?)/g,
    /(\d+)\s*(?:day|days)/g,
    /kelionės?\s+trukmė[:\s]*(\d+)\s*(?:dienų|dienos)/g,
  ];

  for (const pattern of durationPatterns) {
    const match = combinedText.match(pattern);
    if (match) {
      const days = parseInt(match[1]);
      if (days >= 1 && days <= 30) {
        suggestions.duration = `${days} ${
          days === 1 ? 'diena' : days < 10 ? 'dienos' : 'dienų'
        }`;
        break;
      }
    }
  }

  // Enhanced price detection
  const pricePatterns = [
    /(\d+(?:[.,]\d+)?)\s*(?:€|eur|euro)/g,
    /kaina[:\s]*(\d+(?:[.,]\d+)?)\s*(?:€|eur)/g,
    /(\d+)\s*€/g,
  ];

  for (const pattern of pricePatterns) {
    const match = combinedText.match(pattern);
    if (match) {
      let price = match[1].replace(',', '.');
      const numPrice = parseFloat(price);
      if (numPrice >= 50 && numPrice <= 10000) {
        // Reasonable price range
        suggestions.price = Math.round(numPrice).toString();
        break;
      }
    }
  }

  // Enhanced city detection
  const knownCities = [
    'zakopanė',
    'zakopin',
    'krakuvas',
    'krakow',
    'kraków',
    'varšuva',
    'warszawa',
    'berlynas',
    'berlin',
    'miunchenas',
    'munich',
    'frankfurtas',
    'frankfurt',
    'paryžius',
    'paris',
    'londonas',
    'london',
    'roma',
    'rome',
    'milanas',
    'milan',
    'vienna',
    'viena',
    'praha',
    'prague',
    'budapeštas',
    'budapest',
  ];

  const foundCities = [];
  for (const city of knownCities) {
    if (combinedText.includes(city.toLowerCase())) {
      foundCities.push(capitalizeFirst(city));
    }
  }

  if (foundCities.length > 0) {
    suggestions.cities = [...new Set(foundCities)].slice(0, 3).join(', ');
  }

  // Extract daily travel program
  extractDailyTravelProgram(combinedText, suggestions);

  // Extract included/excluded services
  extractServicesInfo(combinedText, suggestions);

  // Extract short description from first few sentences
  extractShortDescription(extractedTexts[0]?.content || '', suggestions);

  return suggestions;
}

function extractDailyTravelProgram(text, suggestions) {
  // Look for daily travel program patterns
  const dayPatterns = [
    /(\d+)\s*(?:-a|dieną|diena|day)\s*:?\s*([^\n\r]{10,200})/gi,
    /(\d+)\s*(?:dieną|diena)\s*[-–]\s*([^\n\r]{10,200})/gi,
    /kelionės?\s*dienos?\s*programa[:\s]*\n*([\s\S]*?)(?:\n\s*\n|$)/gi,
    /programa[:\s]*\n*([\s\S]*?)(?:\n\s*\n|kaina|dėmesio|pastaba|$)/gi,
  ];

  const foundDays = [];
  let maxDay = 0;

  // Try to find day-by-day descriptions
  for (const pattern of dayPatterns) {
    const matches = [...text.matchAll(pattern)];
    for (const match of matches) {
      if (match[1] && match[2]) {
        const dayNum = parseInt(match[1]);
        const dayDesc = match[2].trim();

        if (dayNum >= 1 && dayNum <= 14 && dayDesc.length > 15) {
          foundDays.push({
            day: dayNum,
            title: `${dayNum}-a diena: ${capitalizeFirst(
              dayDesc.substring(0, 50)
            )}${dayDesc.length > 50 ? '...' : ''}`,
            description: capitalizeFirst(dayDesc),
          });
          maxDay = Math.max(maxDay, dayNum);
        }
      }
    }
  }

  // If we found specific days, use them
  if (foundDays.length > 0) {
    suggestions.dayamount = maxDay;
    suggestions.travelDays = foundDays.sort((a, b) => a.day - b.day);
  } else {
    // Try to extract from duration and create basic template
    const durationMatch = text.match(/(\d+)\s*(?:dienų|dienos|dienomis)/);
    if (durationMatch) {
      const days = parseInt(durationMatch[1]);
      if (days >= 1 && days <= 14) {
        suggestions.dayamount = days;
        // Create basic template for days
        const sampleDays = [];
        for (let i = 1; i <= days; i++) {
          sampleDays.push({
            day: i,
            title: `${i}-a diena: Kelionės diena`,
            description: `${i}-osios dienos programa bus pateikta vėliau.`,
          });
        }
        suggestions.travelDays = sampleDays;
      }
    }
  }
}

function extractServicesInfo(text, suggestions) {
  // Look for included services patterns
  const includedPatterns = [
    /kainoje?\s*įskaičiuota[:\s]*([^\n\r]*(?:\n[^\n\r]*)*?)(?:\n\s*\n|kainoje?\s*neįskaičiuota|pastaba|dėmesio|$)/gi,
    /įtraukta[:\s]*([^\n\r]*(?:\n[^\n\r]*)*?)(?:\n\s*\n|neįtraukta|pastaba|dėmesio|$)/gi,
    /kaina\s*apima[:\s]*([^\n\r]*(?:\n[^\n\r]*)*?)(?:\n\s*\n|kaina\s*neapima|pastaba|dėmesio|$)/gi,
  ];

  // Look for excluded services patterns
  const excludedPatterns = [
    /kainoje?\s*neįskaičiuota[:\s]*([^\n\r]*(?:\n[^\n\r]*)*?)(?:\n\s*\n|pastaba|dėmesio|$)/gi,
    /neįtraukta[:\s]*([^\n\r]*(?:\n[^\n\r]*)*?)(?:\n\s*\n|pastaba|dėmesio|$)/gi,
    /kaina\s*neapima[:\s]*([^\n\r]*(?:\n[^\n\r]*)*?)(?:\n\s*\n|pastaba|dėmesio|$)/gi,
    /papildomai\s*mokama[:\s]*([^\n\r]*(?:\n[^\n\r]*)*?)(?:\n\s*\n|pastaba|dėmesio|$)/gi,
  ];

  // Extract included services
  for (const pattern of includedPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const services = match[1]
        .split(/[;\n•-]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5 && s.length < 100)
        .map((s) => capitalizeFirst(s.replace(/^[-•]\s*/, '')));

      if (services.length > 0) {
        suggestions.includedinprice = services.slice(0, 8); // Limit to 8 items
        break;
      }
    }
  }

  // Extract excluded services
  for (const pattern of excludedPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const services = match[1]
        .split(/[;\n•-]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 5 && s.length < 100)
        .map((s) => capitalizeFirst(s.replace(/^[-•]\s*/, '')));

      if (services.length > 0) {
        suggestions.excludedinprice = services.slice(0, 8); // Limit to 8 items
        break;
      }
    }
  }
}

function extractShortDescription(text, suggestions) {
  if (!text) return;

  // Find first few sentences that could be a description
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20 && s.length < 200);

  if (sentences.length > 0) {
    // Take first meaningful sentence and truncate if needed
    let desc = sentences[0];
    if (desc.length > 150) {
      desc = desc.substring(0, 147) + '...';
    }
    suggestions.shortDescription = capitalizeFirst(desc);
  }
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
