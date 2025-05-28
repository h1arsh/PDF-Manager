const { PDFDocument, degrees } = require('pdf-lib');
const { exec } = require('child_process');
const util = require('util');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const execPromise = util.promisify(exec);

const encryptPdf = async (req, res) => {
    let tempInputPath = null;
    let tempOutputPath = null;

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No PDF file uploaded' });
        }

        if (!req.body.password) {
            return res.status(400).json({ error: 'No password provided' });
        }

        const password = req.body.password;

        const strongPasswordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
        if (!strongPasswordRegex.test(password)) {
            return res.status(400).json({
                error: 'Password must contain at least 8 characters including uppercase, lowercase, and numbers'
            });
        }

        const originalName = path.parse(req.file.originalname).name;
        const timestamp = Date.now();
        tempInputPath = path.join(__dirname, '..', 'temp', `${originalName}_${timestamp}_input.pdf`);
        const outputFilename = `${originalName}_protected_${timestamp}.pdf`;
        tempOutputPath = path.join(__dirname, '..', 'temp', outputFilename);

        const pdfBytes = fs.readFileSync(req.file.path);
        const pdfDoc = await PDFDocument.load(pdfBytes);

        const pages = pdfDoc.getPages();
        pages.forEach(page => {
            const { width, height } = page.getSize();
            page.drawText('CONFIDENTIAL', {
                x: width / 2 - 100,
                y: height / 2,
                size: 50,
                opacity: 0.1,
                rotate: degrees(45),
            });
        });

        const modifiedPdfBytes = await pdfDoc.save();
        fs.writeFileSync(tempInputPath, modifiedPdfBytes);

        const ownerPassword = password + uuidv4();

        const qpdfCommand = `qpdf --encrypt "${password}" "${ownerPassword}" 256 ` +
            `--print=none --modify=none --extract=n --annotate=n -- ` +
            `"${tempInputPath}" "${tempOutputPath}"`;

        await execPromise(qpdfCommand);

        // Instead of checking for "encrypted" in stdout, just try to run check with password
        try {
            await execPromise(`qpdf --password="${password}" --check "${tempOutputPath}"`);
        } catch (verifyError) {
            throw new Error('Password verification failed. The encrypted file might be corrupted.');
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${outputFilename}"`);

        const fileStream = fs.createReadStream(tempOutputPath);
        fileStream.pipe(res);

        fileStream.on('close', async () => {
            try {
                await fs.promises.unlink(req.file.path);
                await fs.promises.unlink(tempInputPath);
                await fs.promises.unlink(tempOutputPath);
                console.log(`PDF processed and encrypted successfully for ${req.ip}`);
            } catch (cleanupError) {
                console.error('Cleanup error:', cleanupError);
            }
        });

    } catch (error) {
        console.error('Processing error:', error);

        const cleanupFiles = async (filePath) => {
            if (filePath && fs.existsSync(filePath)) {
                try {
                    await fs.promises.unlink(filePath);
                } catch (err) {
                    if (err.code === 'EBUSY') {
                        await new Promise(resolve => setTimeout(resolve, 200));
                        await cleanupFiles(filePath);
                    }
                }
            }
        };

        await Promise.all([
            cleanupFiles(req.file?.path),
            cleanupFiles(tempInputPath),
            cleanupFiles(tempOutputPath)
        ]);

        res.status(500).json({
            error: 'PDF processing failed',
            details: process.env.NODE_ENV === 'development' ? error.message : null
        });
    }
};

module.exports = { encryptPdf };
