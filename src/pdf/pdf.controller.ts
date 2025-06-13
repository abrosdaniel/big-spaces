import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
  Res,
  Get,
} from '@nestjs/common';
import { Response } from 'express';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('download')
  async generatePdf(
    @Body() data: any,
    @Res() res: Response,
    @Headers('origin') origin: string,
  ) {
    if (origin !== process.env.SITE) {
      throw new UnauthorizedException();
    }
    const pdfBuffer = await this.pdfService.generatePdf(data);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=bigspaces.pdf');
    res.send(pdfBuffer);
  }

  @Get('data')
  async getData(@Res() res: Response, @Headers('origin') origin: string) {
    if (origin !== process.env.SITE) {
      throw new UnauthorizedException();
    }
    const data = await this.pdfService.getData();
    res.send(data);
  }
}
