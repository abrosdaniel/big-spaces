import { Injectable } from '@nestjs/common';
import * as puppeteer from 'puppeteer';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PdfService {
  async generatePdf(data: any) {
    let browser;
    let tempHtmlPath;
    
    try {
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const page = await browser.newPage();

      // Читаем HTML шаблон из файла
      const templatePath = path.join(__dirname, 'template', 'index.html');
      let html = fs.readFileSync(templatePath, 'utf8');

      // Подставляем данные в шаблон
      html = html.replace(/\${data\.parameters\.length}/g, data.parameters.length);
      html = html.replace(/\${data\.parameters\.width}/g, data.parameters.width);
      html = html.replace(/\${data\.parameters\.height}/g, data.parameters.height);
      html = html.replace(/\${data\.parameters\.floors}/g, data.parameters.floors);
      html = html.replace(/\${data\.project}/g, data.project);
      html = html.replace(/\${data\.foundation\.depth}/g, data.foundation.depth);
      html = html.replace(/\${data\.foundation\.volume}/g, data.foundation.volume);
      html = html.replace(/\${data\.foundation\.sum}/g, data.foundation.sum);
      html = html.replace(/\${data\.metal\.volume}/g, data.metal.volume);
      html = html.replace(/\${data\.metal\.sum}/g, data.metal.sum);
      html = html.replace(/\${data\.wall\.depth}/g, data.wall.depth);
      html = html.replace(/\${data\.wall\.area}/g, data.wall.area);
      html = html.replace(/\${data\.wall\.sum}/g, data.wall.sum);
      html = html.replace(/\${data\.roof\.depth}/g, data.roof.depth);
      html = html.replace(/\${data\.roof\.area}/g, data.roof.area);
      html = html.replace(/\${data\.roof\.sum}/g, data.roof.sum);
      html = html.replace(/\${data\.gate\.size}/g, data.gate.size);
      html = html.replace(/\${data\.gate\.count}/g, data.gate.count);
      html = html.replace(/\${data\.gate\.sum}/g, data.gate.sum);
      html = html.replace(/\${data\.window\.size}/g, data.window.size);
      html = html.replace(/\${data\.window\.count}/g, data.window.count);
      html = html.replace(/\${data\.window\.sum}/g, data.window.sum);
      html = html.replace(/\${data\.sum}/g, data.sum);
      html = html.replace(/\${new Date\(\)\.toLocaleDateString\('ru-RU'\)}/g, new Date().toLocaleDateString('ru-RU'));

      tempHtmlPath = path.join(__dirname, 'template', 'temp.html');
      fs.writeFileSync(tempHtmlPath, html);

      const fileUrl = `file://${tempHtmlPath}`;
      await page.goto(fileUrl, { waitUntil: 'networkidle0' });

      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
      });

      await browser.close();

      // Удаляем временный файл
      if (tempHtmlPath && fs.existsSync(tempHtmlPath)) {
        fs.unlinkSync(tempHtmlPath);
      }

      const timestamp = Date.now();
      const filename = `bigspaces_${timestamp}.pdf`;
      const filePath = `download/noco/bigspaces/attachment/${filename}`;

      const fileForm = new FormData();
      fileForm.append('file', pdf, {
        filename,
        contentType: 'application/pdf',
      });
      fileForm.append('mimetype', 'application/pdf');
      fileForm.append('title', filename);
      fileForm.append('path', filePath);

      const uploadRes = await axios.post(
        `${process.env.NOCO_URL}/api/v2/storage/upload`,
        fileForm,
        {
          headers: {
            ...fileForm.getHeaders(),
            'xc-token': process.env.NOCO_TOKEN!,
          },
        },
      );

      console.log('NocoDB uploadRes.data:', uploadRes.data);

      const uploadDataArr = Array.isArray(uploadRes.data)
        ? uploadRes.data
        : [uploadRes.data];
      const uploadData = uploadDataArr[0];
      const fileField = [
        {
          path: uploadData.path,
          title: uploadData.title,
          mimetype: uploadData.mimetype,
          size: uploadData.size,
        },
      ];

      console.log('NocoDB fileField:', JSON.stringify(fileField, null, 2));

      const payload = {
        name: data.person.name,
        phone: data.person.phone,
        mail: data.person.mail,
        file: fileField,
      };

      console.log('NocoDB payload:', JSON.stringify(payload, null, 2));

      await axios.post(
        `${process.env.NOCO_URL}/api/v2/tables/mzioudu6v07b4on/records`,
        [payload],
        {
          headers: {
            'Content-Type': 'application/json',
            'xc-token': process.env.NOCO_TOKEN!,
          },
        },
      );

      return pdf;
    } catch (error) {
      console.error('Ошибка при генерации PDF:', error);
      
      // Закрываем браузер если он был открыт
      if (browser) {
        await browser.close();
      }
      
      // Удаляем временный файл если он был создан
      if (tempHtmlPath && fs.existsSync(tempHtmlPath)) {
        fs.unlinkSync(tempHtmlPath);
      }
      
      throw error;
    }
  }

  async getData() {
    try {
      const response = await axios.get(
        `${process.env.NOCO_URL}/api/v2/tables/mgi2ijypvo7j4zl/records`,
        {
          headers: {
            'xc-token': process.env.NOCO_TOKEN!,
          },
        },
      );
      return response.data;
    } catch (e) {
      // Можно залогировать ошибку, если нужно
      return null;
    }
  }
}
