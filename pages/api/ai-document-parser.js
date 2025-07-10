import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth'; // For Word documents
import pdf2pic from 'pdf2pic'; // For PDF files
import Tesseract from 'tesseract.js'; // For OCR on images
import OpenAI from 'openai';

// Disable body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const form = formidable({
      uploadDir: './tmp',
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

          case '.pdf':
            text = await extractFromPDF(filePath);
            break;

          case '.txt':
            text = await extractFromText(filePath);
            break;

          case '.jpg':
          case '.jpeg':
          case '.png':
          case '.webp':
            text = await extractFromImage(filePath);
            break;

          default:
            console.log(`Unsupported file type: ${extension}`);
            continue;
        }

        if (text) {
          extractedTexts.push({
            fileName,
            content: text,
          });
        }
      } catch (error) {
        console.error(`Error processing ${fileName}:`, error);
      } finally {
        // Clean up temporary file
        try {
          fs.unlinkSync(filePath);
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      }
    }

    if (extractedTexts.length === 0) {
      return res
        .status(400)
        .json({ error: 'No text could be extracted from the uploaded files' });
    }

    // Use AI to structure the extracted text into travel data
    const structuredData = await processWithAI(extractedTexts);

    res.status(200).json(structuredData);
  } catch (error) {
    console.error('Error processing files:', error);
    res.status(500).json({ error: 'Error processing files' });
  }
}

async function extractFromWord(filePath) {
  try {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  } catch (error) {
    console.error('Error extracting from Word:', error);
    
    // If mammoth fails (e.g., for .doc files), try to read as text
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return fileContent;
    } catch (textError) {
      console.error('Could not extract text from Word document:', textError);
      return `[Nepavyko išgauti teksto iš Word dokumento. Prašome konvertuoti į .docx formatą arba nukopijuoti tekstą rankiniu būdu.]`;
    }
  }
}

async function extractFromPDF(filePath) {
  try {
    // Convert PDF to images and then use OCR
    const convert = pdf2pic.fromPath(filePath, {
      density: 100,
      saveFilename: 'untitled',
      savePath: './tmp',
      format: 'png',
      width: 600,
      height: 600,
    });

    const results = await convert.bulk(-1);
    let text = '';

    for (const result of results) {
      const ocrResult = await Tesseract.recognize(result.path, 'lit+eng');
      text += ocrResult.data.text + '\n';

      // Clean up temporary image
      try {
        fs.unlinkSync(result.path);
      } catch (e) {}
    }

    return text;
  } catch (error) {
    console.error('Error extracting from PDF:', error);
    return '';
  }
}

async function extractFromText(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (error) {
    console.error('Error extracting from text file:', error);
    return '';
  }
}

async function extractFromImage(filePath) {
  try {
    const result = await Tesseract.recognize(filePath, 'lit+eng');
    return result.data.text;
  } catch (error) {
    console.error('Error extracting from image:', error);
    return '';
  }
}

async function processWithAI(extractedTexts) {
  const combinedText = extractedTexts
    .map((item) => `=== ${item.fileName} ===\n${item.content}`)
    .join('\n\n');
    
  try {
    const prompt = `
Analizuok šį kelionės dokumentą ir išgauk struktūrizuotą informaciją JSON formatu.
Sugrąžink duomenis šiuo formatu:

{
  "title": "Kelionės pavadinimas",
  "country": "Šalis",
  "cities": "Miestai (atskirti kableliais)",
  "duration": "Trukmė (pvz., '7 dienos')",
  "travelType": "Kelionės tipas",
  "price": "Kaina skaičiumi (be simbolių)",
  "shortDescription": "Trumpas aprašymas",
  "description": "Pilnas aprašymas",
  "details": "Papildomos detalės",
  "includedinprice": ["sąrašas", "kas", "įskaičiuota"],
  "excludedinprice": ["sąrašas", "kas", "neįskaičiuota"],
  "rating": "Įvertinimas (jei yra)",
  "reviewCount": "Atsiliepimų skaičius (jei yra)",
  "dayamount": "Dienų skaičius skaičiumi",
  "travelDays": [
    {
      "day": 1,
      "title": "1-a diena: Pavadinimas",
      "description": "Dienos aprašymas"
    }
  ]
}

Jei kokios informacijos nėra dokumente, palik tuščią string'ą arba tuščią masyvą.
Atsakyk tik JSON formatu, be papildomo teksto.

Dokumentas:
${combinedText}
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.1,
    });

    const result = completion.choices[0].message.content;

    // Try to parse the JSON response
    try {
      const parsedData = JSON.parse(result);
      return parsedData;
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.log('AI Response:', result);

      // Return a fallback structure with the raw text
      return {
        title: extractedTexts[0]?.fileName || 'Nauja kelionė',
        country: '',
        cities: '',
        duration: '',
        travelType: '',
        price: '',
        shortDescription: '',
        description: combinedText.substring(0, 500) + '...',
        details: '',
        includedinprice: [],
        excludedinprice: [],
        rating: '',
        reviewCount: '',
        dayamount: 1,
        travelDays: [],
      };
    }
  } catch (error) {
    console.error('Error processing with AI:', error);

    // Provide intelligent fallback if OpenAI fails
    const fallbackData = createIntelligentFallback(combinedText);
    console.log('Using intelligent fallback due to AI error');
    return fallbackData;
  }
}

function createIntelligentFallback(combinedText) {
  // Simple text analysis to extract likely travel information
  const text = combinedText.toLowerCase();

  // Try to extract title (usually first line or contains keywords)
  const lines = combinedText.split('\n').filter((line) => line.trim());
  let title = lines[0]?.trim() || 'Nauja kelionė';

  // Look for common travel keywords to improve title
  const travelKeywords = [
    'kelionė',
    'turas',
    'ekskursija',
    'atostogos',
    'travel',
    'trip',
    'tour',
  ];
  for (const line of lines.slice(0, 5)) {
    if (
      travelKeywords.some((keyword) => line.toLowerCase().includes(keyword))
    ) {
      title = line.trim();
      break;
    }
  }

  // Extract country information
  const countries = [
    'lietuva',
    'latvija',
    'estija',
    'lenkija',
    'vokietija',
    'prancūzija',
    'italija',
    'ispanija',
    'graikija',
    'turkija',
  ];
  let country = '';
  for (const countryName of countries) {
    if (text.includes(countryName)) {
      country = countryName.charAt(0).toUpperCase() + countryName.slice(1);
      break;
    }
  }

  // Extract cities (look for capital letters followed by lowercase)
  const cityMatches = combinedText.match(/[A-ZĄČĘĖĮŠŲŪŽ][a-ząčęėįšųūž]{2,}/g);
  const cities = cityMatches ? cityMatches.slice(0, 3).join(', ') : '';

  // Extract duration (look for numbers followed by day-related words)
  const durationMatch = text.match(/(\d+)\s*(dienų|dienos|dienomis|days?)/);
  const duration = durationMatch ? `${durationMatch[1]} dienos` : '';
  const dayamount = durationMatch ? parseInt(durationMatch[1]) : 1;

  // Extract price (look for numbers with euro signs or price-related words)
  const priceMatch = text.match(/(\d+)\s*[€eur]/i);
  const price = priceMatch ? priceMatch[1] : '';

  return {
    title: title.length > 100 ? title.substring(0, 100) + '...' : title,
    country,
    cities,
    duration,
    travelType: 'Kelionė',
    price,
    shortDescription: combinedText.substring(0, 200).trim() + '...',
    description:
      combinedText.substring(0, 1000).trim() +
      (combinedText.length > 1000 ? '...' : ''),
    details: 'Papildoma informacija bus pridėta redagavimo metu.',
    includedinprice: ['Transportas', 'Apgyvendinimas'],
    excludedinprice: ['Maistas', 'Ekskursijos'],
    rating: '',
    reviewCount: '',
    dayamount: Math.max(1, dayamount),
    travelDays: Array.from({ length: Math.max(1, dayamount) }, (_, i) => ({
      day: i + 1,
      title: `${i + 1}-a diena: `,
      description: '',
    })),
  };
}
