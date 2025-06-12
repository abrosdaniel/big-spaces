import {
  Controller,
  Post,
  Body,
  Headers,
  UnauthorizedException,
} from '@nestjs/common';
import { PdfService } from './pdf.service';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Post('download')
  async generatePdf(@Body() data: any, @Headers('origin') origin: string) {
    if (origin !== process.env.SITE) {
      throw new UnauthorizedException('Unauthorized domain');
    }

    return this.pdfService.generatePdf(data);
  }
}
