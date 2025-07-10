import multiparty from 'multiparty';
import cloudinary from 'cloudinary';
import fs from 'fs';

// Disable default body parser
export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handle(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      console.error('Missing Cloudinary configuration');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const form = new multiparty.Form({
      maxFilesSize: 10 * 1024 * 1024, // 10MB limit
      maxFields: 10,
      maxFieldsSize: 2 * 1024 * 1024, // 2MB for fields
    });

    const { fields, files } = await new Promise((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('Upload timeout'));
      }, 30000); // 30 second timeout

      form.parse(req, (err, fields, files) => {
        clearTimeout(timeoutId);
        if (err) {
          console.error('Multiparty parse error:', err);
          reject(err);
        }
        resolve({ fields, files });
      });
    });

    if (!files.file) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const fileArray = Array.isArray(files.file) ? files.file : [files.file];
    const links = [];

    // Process files sequentially to avoid overwhelming Cloudinary
    for (const file of fileArray) {
      try {
        // Validate file
        if (!file || !file.path || !fs.existsSync(file.path)) {
          console.error('Invalid file or file path:', file);
          continue;
        }

        // Check file size (additional check)
        const stats = fs.statSync(file.path);
        if (stats.size > 10 * 1024 * 1024) {
          console.error('File too large:', stats.size);
          continue;
        }

        // Upload to Cloudinary with retry logic
        let uploadResult;
        let retryCount = 0;
        const maxRetries = 3;

        while (retryCount < maxRetries) {
          try {
            uploadResult = await cloudinary.v2.uploader.upload(file.path, {
              folder: 'ecommerce-app',
              public_id: `file_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              resource_type: 'auto',
              timeout: 20000, // 20 second timeout
              transformation: [
                { quality: 'auto:good' },
                { fetch_format: 'auto' },
              ],
            });
            break; // Success, exit retry loop
          } catch (uploadError) {
            retryCount++;
            console.error(`Upload attempt ${retryCount} failed:`, uploadError);

            if (retryCount >= maxRetries) {
              throw uploadError;
            }

            // Wait before retry
            await new Promise((resolve) =>
              setTimeout(resolve, 1000 * retryCount)
            );
          }
        }

        if (uploadResult && uploadResult.secure_url) {
          links.push(uploadResult.secure_url);
        }

        // Clean up temporary file
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (cleanupError) {
          console.error('Error cleaning up file:', cleanupError);
        }
      } catch (fileError) {
        console.error('Error processing file:', fileError);
        // Continue with other files instead of failing completely
      }
    }

    if (links.length === 0) {
      return res
        .status(400)
        .json({ error: 'No files were successfully uploaded' });
    }

    return res.json({
      links,
      message: `Successfully uploaded ${links.length} file(s)`,
    });
  } catch (error) {
    console.error('Upload error:', error);

    // More specific error messages
    if (error.message === 'Upload timeout') {
      return res
        .status(408)
        .json({ error: 'Upload timeout - please try again' });
    }

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res
        .status(413)
        .json({ error: 'File too large - maximum 10MB allowed' });
    }

    if (error.message.includes('Invalid image file')) {
      return res.status(400).json({ error: 'Invalid image file format' });
    }

    return res.status(500).json({
      error: 'Failed to upload files',
      details:
        process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
